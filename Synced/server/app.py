import os
import bcrypt
from flask import Flask, jsonify, request, session, abort, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_migrate import Migrate
from models import db, User 
from dotenv import load_dotenv
from downloadYT import download_yt
from pytube.exceptions import RegexMatchError, PytubeError

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///database.db')
db.init_app(app) 
migrate = Migrate(app, db) 
CORS(app, resources={r"/*": {"origins": "*"}})
api = Api(app)

download_location = os.getenv('DOWNLOAD_LOCATION', './downloads')
if not os.path.exists(download_location):
    os.makedirs(download_location)
app.config['DOWNLOAD_LOCATION'] = os.path.abspath(download_location)

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
            session['user_id'] = user.id
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

class DoubleTrouble(Resource):
    def post(self):
        data = request.get_json()
        video_url = data.get('video_url')
        download_audio = data.get('download_type', 'audio')

        if video_url:
            try:
                file_path = download_yt(video_url, app.config['DOWNLOAD_LOCATION'], download_audio=download_audio)
                filename = os.path.basename(file_path)
                return jsonify({'filename': filename}), 200
            except RegexMatchError:
                return jsonify({'error': 'Invalid YouTube URL'}), 400
            except PytubeError:
                return jsonify({'error': 'Invalid YouTube URL'}), 400
        return jsonify({'error': 'Invalid YouTube URL'}), 400
api.add_resource(DoubleTrouble, '/doubleTrouble')

class DownloadFile(Resource):
    def get(self, filename):
        try:
            return send_from_directory(app.config['DOWNLOAD_LOCATION'], filename, as_attachment=True)
        except FileNotFoundError:
            return jsonify({'error': 'File not found'}), 404
api.add_resource(DownloadFile, '/download/<filename>')

if __name__ == '__main__':
    app.run(debug=True)
