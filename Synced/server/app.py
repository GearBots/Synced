import os
import bcrypt
from flask import Flask, jsonify, request, session, abort, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource
from flask_cors import CORS
from flask_migrate import Migrate
from models import Community, Track, db, User, SavedTrack
from dotenv import load_dotenv
from downloadYT import download_yt
from pytube.exceptions import RegexMatchError, PytubeError
import logging 

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///database.db')
db.init_app(app) 
migrate = Migrate(app, db) 
api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})
logging.basicConfig(level=logging.INFO)
# download_location = os.getenv('DOWNLOAD_LOCATION', '/downloads')
# if not os.path.exists(download_location):
#     os.makedirs(download_location)
# app.config['DOWNLOAD_LOCATION'] = os.path.abspath(download_location)

class CheckSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.filter_by(user_id=user_id).first()
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
        if user and bcrypt.checkpw(data.get('password').encode('utf-8'), user.password):
            session['user_id'] = user.user_id
            return ({'message': 'Login Successful', 'user': user.username}), 201
        else:
            app.logger.info(f"Login attempt failed for {data.get('username')}")
            return {'error': 'Login Failed'}, 401
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
            return {'error': 'User already exists'}, 400
        password = data['password'].encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password, salt)
        new_user = User(username=data['username'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User created'}, 201


api.add_resource(Register, '/register')

class DoubleTrouble(Resource):
    def post(self):
        data = request.get_json()
        video_url = data.get('video_url')
        download_audio = data.get('download_type', 'audio')

        if video_url:
            try:
                file_path = download_yt(video_url, download_audio=download_audio)
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
            return send_from_directory(filename, as_attachment=True)
        except FileNotFoundError:
            return jsonify({'error': 'File not found'}), 404
api.add_resource(DownloadFile, '/download/<filename>')

def track_to_dict(track):
    return {
        'track_id': track.track_id,
        'title': track.title,
        'artist': track.artist,
        'genre': track.genre,
        'url': track.url
    }

class Tracks(Resource):
    def post(self):
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        # existing_track = Track.query.filter_by(track_id=data['track_id']).first()
        # if existing_track:
        #     return jsonify({'error': 'Track already exists'}), 400
        new_track = Track(
            title=data['title'],
            artist=data['artist'],
            genre=data['genre'],
            url=data.get('url', None),
        )
        db.session.add(new_track)
        db.session.commit()
        print(new_track.to_dict())
        return new_track.to_dict(), 201
api.add_resource(Tracks, '/tracks')

class CreatePost(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get("user_id")
        print(user_id)
        track_id = data.get("track_id")
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        if user_id:
            user = User.query.filter_by(user_id=user_id).first()
            if user:
                comments = data.get('comment')
                photo = data.get('photo', None)
                print(comments)
                new_post = Community( 
                    comments=comments,
                    # photo=photo,
                    user_id=user_id,
                    track_id=track_id,
                )
                print(new_post.to_dict())
                db.session.add(new_post)
                db.session.commit()
                return new_post.to_dict(), 201
api.add_resource(CreatePost, '/create_post')

class GetPosts(Resource):
    def get(self):
        posts = Community.query.all()
        posts_data = []
        for post in posts:

            user = User.query.filter_by(user_id=post.user_id).first()
            username = user.username

            track = Track.query.filter_by(track_id=post.track_id).first()
            print(post.to_dict())
            print(post.track_id)
            print(track)
            artist = track.artist if track else None
            title = track.title if track else None

            post_dict = post.to_dict()
            post_dict['username'] = username
            post_dict['artist'] = artist
            post_dict['title'] = title

            # Append the updated post dictionary to posts_data
            posts_data.append(post_dict)

        return posts_data, 200


api.add_resource(GetPosts, '/get_posts')

class SavedTracks(Resource):
    def post(self):
        data = request.get_json()
        user_id = data.get("user_id")
        track_id = data.get("track_id")
        print(track_id)
        if user_id:
            user = User.query.filter_by(user_id=user_id).first()
            print(user)
            if user:
                saved_tracks = SavedTrack(user_id=user_id, track_id =track_id)
                db.session.add(saved_tracks)
                db.session.commit()
                return {'message': 'Track saved successfully'}, 201
            else:
                return {'error': 'User not found'}, 404
        else:
            return {'error': 'User not logged in'}, 401
api.add_resource(SavedTracks, '/saved_tracks')

class GetSavedTracks(Resource):
    def get(self):
        user_id = session.get('user_id')

        if user_id:
            user = User.query.filter_by(user_id=user_id).first()
            if user:
                saved_tracks_entries = SavedTrack.query.filter_by(user_id=user_id).all()
                saved_tracks_data = []
                for entry in saved_tracks_entries:
                    track = Track.query.filter_by(track_id=entry.track_id).first()
                    if track:
                        saved_tracks_data.append(track_to_dict(track))
                return {'saved_tracks': saved_tracks_data}, 200
            else:
                return {'error': 'User not found'}, 404
        else:
            return {'error': 'User not logged in'}, 401


api.add_resource(GetSavedTracks, '/get_saved_tracks')

class DeletePost(Resource):
    def delete(self, post_id):
        post = Community.query.filter_by(community_id=post_id).first()
        if post:
            db.session.delete(post)
            db.session.commit()
            return {'message': 'Post deleted successfully'}, 200
        else:
            return {'error': 'Post not found'}, 404
api.add_resource(DeletePost, '/delete_post/<int:post_id>')


class UpdateComment(Resource):
    def patch(self, post_id):
        data = request.get_json()
        post = Community.query.filter_by(community_id=post_id).first()
        if post:
            post.comments = data['comment']
            db.session.commit()
            return {'message': 'Comment updated successfully'}, 200
        else:
            return {'error': 'Post not found'}, 404
api.add_resource(UpdateComment, '/update_comment/<int:post_id>')


class gather(Resource):
    def post(self, index):
        post = self.head
        trail = self.head
        post = post.next
        if trail < 0 or self.length < index:
            return None
        else:
            for _ in range(index):
                post = post.next 
                trail = post
            return trail.next
        




if __name__ == '__main__':
    app.run(debug=True)
