"""added models

Revision ID: 8134219a4282
Revises: 
Create Date: 2024-03-18 13:27:24.734663

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8134219a4282'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tracks',
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('track_id', sa.Integer(), nullable=False),
    sa.Column('genre', sa.String(), nullable=True),
    sa.Column('photo', sa.String(), nullable=True),
    sa.Column('url', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('track_id')
    )
    op.create_table('users',
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('user_id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('community',
    sa.Column('comments', sa.String(), nullable=True),
    sa.Column('community_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('track_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['track_id'], ['tracks.track_id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('community_id')
    )
    op.create_table('saved_tracks',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('track_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['track_id'], ['tracks.track_id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], ),
    sa.PrimaryKeyConstraint('user_id', 'track_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('saved_tracks')
    op.drop_table('community')
    op.drop_table('users')
    op.drop_table('tracks')
    # ### end Alembic commands ###