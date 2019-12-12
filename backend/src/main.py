


# coding=utf-8
from flask_cors import CORS
from flask import Flask, jsonify, request

from .entities.entity import Session, engine, Base
from .entities.blog import Post, PostSchema

# creating the Flask application
app = Flask(__name__)
CORS(app)

# if needed, generate database schema
Base.metadata.create_all(engine)


@app.route('/feed')
def get_posts():
    # fetching from the database
    session = Session()
    post_objects = session.query(Post).all()

    # transforming into JSON-serializable objects
    schema = PostSchema(many=True)
    posts = schema.dump(post_objects)

    # serializing as JSON
    session.close()
    return jsonify(posts)


@app.route('/feed', methods=['POST'])
def add_post():
    # mount post object
    posted_post = PostSchema(only=('title', 'description'))\
        .load(request.get_json())

    post = Post(**posted_post, created_by="HTTP post request")

    # persist post
    session = Session()
    session.add(post)
    session.commit()

    # return created post
    new_post = PostSchema().dump(post)
    session.close()
    return jsonify(new_post), 201




