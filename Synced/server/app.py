import os
import bcrypt
from flask import Flask, jsonify, request, session
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User # Import db and User from models.py

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///database.db')
db.init_app(app) # Initialize db with the app
migrate = Migrate(app, db) # Initialize migrate with the app and db
CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:5000"}})
api = Api(app)

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter_by(User.id == user_id).first()
            return user.to_dict()
        return {}, 401

api.add_resource(CheckSession, '/check_session')

class Users(Resource):
    def get(self):
        user_list = [user.username for user in User.query.all()]
        return user_list, 200
api.add_resource(Users, '/users')

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()
        if user and bcrypt.check_password_hash(user.password, data.get('password')):
            return jsonify({'message': 'Login Successful', 'user': user.username})
        else:
            return jsonify({'error': 'Login Failed'}), 401
api.add_resource(Login, '/login') 

class Logout(Resource):
    def delete(self):
        session['user_id'] = None
        return {}, 204
api.add_resource(Logout, '/logout')

class Register(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if user:
            return jsonify({'error': 'User already exists'}), 400
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        new_user = User(username=data['username'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created'}), 201
api.add_resource(Register, '/register')

if __name__ == '__main__':
    app.run(debug=True)
