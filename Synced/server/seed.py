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


    def create_fake_data(num_users=10, num_tracks=20, num_saved_tracks=50, num_communities=100):
        try:
            # Create fake users
            # for _ in range(num_users):
            #     user = User(username=fake.user_name(), password=PasswordType.hash(fake.password()))
            #     session.add(user)
            
            # Create fake tracks
            # for _ in range(num_tracks):
            #     track = Track(title=fake.sentence(), genre=fake.word(), photo=fake.image_url(), url=fake.url())
            #     session.add(track)
            
            # Create fake saved tracks
            # for _ in range(num_saved_tracks):
            #     user = session.query(User).order_by(func.random()).first() # Get a random user
            #     track = session.query(Track).order_by(func.random()).first() # Get a random track
            #     saved_track = SavedTrack(user_id=user.user_id, track_id=track.track_id)
            #     session.add(saved_track)
            save_track = SavedTrack(user_id=10, track_id=10)
            session.add(save_track)
            
            # Create fake communities
            for _ in range(num_communities):
                user = session.query(User).order_by(func.random()).first() # Get a random user
                track = session.query(Track).order_by(func.random()).first() # Get a random track
                community = Community(user_id=user.user_id, track_id=track.track_id, comments=fake.text())
                session.add(community)
            
            # Commit the changes to the database
            session.commit()
            print("Fake data created successfully.")
        except Exception as e:
            session.rollback()
            print(f"Error creating fake data: {e}")

if __name__ == "__main__":
    create_fake_data()
