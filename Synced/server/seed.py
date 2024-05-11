from faker import Faker
from sqlalchemy.orm import sessionmaker
from models import db, User, Track, SavedTrack, Community # Adjust the import path as necessary
from sqlalchemy_utils import PasswordType
from app import app
from sqlalchemy import func
# Create a fake data generator
fake = Faker()

# Create a session to interact with the database
with app.app_context():
    # Create a session to interact with the database
    Session = sessionmaker(bind=db.engine)
    session = Session()

def seed_data():
    # Initialize Faker
    fake = Faker()

    # Create users
    for _ in range(10): # Generate 10 users
        user = User(username=fake.user_name(), password=fake.password())
        db.session.add(user)

    # Create tracks
    for _ in range(10): # Generate 20 tracks
        track = Track(title=fake.sentence(), artist=fake.name(), genre=fake.word(), url=fake.url())
        db.session.add(track)

    # Create saved tracks
    users = User.query.all()
    tracks = Track.query.all()
    for user in users:
        for track in tracks:
            if fake.boolean(chance_of_getting_true=50): # 50% chance to save a track
                saved_track = SavedTrack(user_id=user.user_id, track_id=track.track_id)
                db.session.add(saved_track)

    # Create communities
    for _ in range(10): # Generate 30 community entries
        user = fake.random_element(elements=users)
        track = fake.random_element(elements=tracks)
        community = Community(comments=fake.sentence(), user_id=user.user_id, track_id=track.track_id, photo=fake.image_url())
        db.session.add(community)

    # Commit the changes
    db.session.commit()
