import os
from flask_cors import CORS
from flask_restful import Api
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    user_id = Column(Integer, primary_key=True)

    def to_dict(self):
        return {
            'username': self.username,
            'user_id': self.user_id
        }
    
    saved_tracks = relationship("SavedTrack", back_populates="user")
    community = relationship("Community", back_populates="user")

class Track(db.Model):
    __tablename__ = 'tracks'
    track_id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    artist = Column(String, nullable=False)
    genre = Column(String, nullable=False)
    url = Column(String, nullable=True)

    def to_dict(self):
        return {
            'track_id': self.track_id
        }
    
    saved_by = relationship("SavedTrack", back_populates="track")
    community = relationship("Community", back_populates="track")

class SavedTrack(db.Model):
    __tablename__ = 'saved_tracks'
    user_id = Column(Integer, ForeignKey('users.user_id'), primary_key=True)
    track_id = Column(Integer, ForeignKey('tracks.track_id'), primary_key=True)
    
    user = relationship("User", back_populates="saved_tracks")
    track = relationship("Track", back_populates="saved_by")

    def to_dict(self):
        return {
            'user_id': self.user_id,
            'track_id': self.track_id
        }

class Community(db.Model):
    __tablename__ = 'community'
    comments = Column(String)
    community_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    track_id = Column(Integer, ForeignKey('tracks.track_id'))
    photo = Column(String)
    
    user = relationship("User", back_populates="community")
    track = relationship("Track", back_populates="community")

    def to_dict(self):
        return {
            'comment': self.comments,
            'community_id': self.community_id,
            'user_id': self.user_id,
            'track_id': self.track_id,
            'photo': self.photo
        }


def init_app(app):
    db.init_app(app)
