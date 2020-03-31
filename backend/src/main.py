# coding=utf-8
import math
from flask_cors import CORS
from flask import Flask, jsonify, request

from .entities.entity import Session, engine, Base
from .entities.blog import Post, PostSchema
from .entities.food import Food, FoodSchema
from .entities.business import Business, BusinessSchema
from .entities.user import User, UserSchema

# creating the Flask application
app = Flask(__name__)
CORS(app)

# if needed, generate database schema
Base.metadata.create_all(engine)


#AJAX CALLS FOR GETTING POSTS FROM THE DATABASE & POSTING TO THE DATABASE --> ,GET_ALL, BYid, POST

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



@app.route('/feed/<id>')
def get_postsbyID(id):
    # fetching from the database
    session = Session()
    post_object = session.query(Post).get(id)

    # transforming into JSON-serializable objects
    schema = PostSchema()
    post = schema.dump(post_object)

    # serializing as JSON
    session.close()
    return jsonify(post)


@app.route('/feed/business/<business>')
def get_postsbyBusiness(business):
      # fetching from the database
      session = Session()
      post_object = session.query(Post).filter(Post.business== business).all()

      # transforming into JSON-serializable objects
      schema = PostSchema(many=True)
      post = schema.dump(post_object)

      # serializing as JSON
      session.close()
      return jsonify(post)





@app.route('/feed', methods=['POST'])
def add_post():
    # mount post object
    posted_post = PostSchema(only=('title', 'description', 'picture', 'business', 'business_address', 'business_name', 'ingredients', 'carbon_footprint', 'portion', 'price', 'collection_time'))\
        .load(request.get_json())

    post = Post(**posted_post, created_by="HTTP post request" )

    # persist post
    session = Session()
    session.add(post)
    session.commit()

    # return created post
    new_post = PostSchema().dump(post)
    session.close()
    return jsonify(new_post), 201





#AJAX CALLS FOR GETTING FOODS FROM THE DATABASE & POSTING TO THE DATABASE --> ,GET_ALL, POST

@app.route('/food')
def get_foods():
    # fetching from the database
    session = Session()
    food_objects = session.query(Food).all()

    # transforming into JSON-serializable objects
    schema = FoodSchema(many=True)
    foods = schema.dump(food_objects)

    # serializing as JSON
    session.close()
    return jsonify(foods)


@app.route('/food/<food_group>')
def get_foodbygroup(food_group):
      # fetching from the database
      session = Session()
      food_object = session.query(Food).filter(Food.food_group== food_group)

      # transforming into JSON-serializable objects
      schema = FoodSchema(many=True)
      food = schema.dump(food_object)

      # serializing as JSON
      session.close()
      return jsonify(food)


@app.route('/food/name/<food_name>')
def get_foodbyname(food_name):
      # fetching from the database
      session = Session()
      food_object = session.query(Food).filter(Food.food_name== food_name)

      # transforming into JSON-serializable objects
      schema = FoodSchema(many=True)
      food = schema.dump(food_object)

      # serializing as JSON
      session.close()
      return jsonify(food)



@app.route('/food', methods=['POST'])
def add_food():
    # mount post object
    posted_food = FoodSchema(only=('food_name', 'food_cf', 'food_group','updated_by'))\
        .load(request.get_json())

    food = Food(**posted_food, created_by="HTTP post request")

    # persist post
    session = Session()
    session.add(food)
    session.commit()

    # return created post
    new_food = FoodSchema().dump(food)
    session.close()
    return jsonify(new_food), 201




#AJAX CALLS FOR GETTING BUSINESSES FROM THE DATABASE & POSTING TO THE DATABASE --> ,GET_ALL, GET_B_BUSINESS_ID, POST

@app.route('/businesses')
def get_businesses():
        # fetching from the database
        session = Session()
        business_objects = session.query(Business).all()

        # transforming into JSON-serializable objects
        schema = BusinessSchema(many=True)
        businesses = schema.dump(business_objects)

        # serializing as JSON
        session.close()
        return jsonify(businesses)







@app.route('/businesses/<business_id>')
def get_businessbyBusinessID(business_id):
      # fetching from the database
      session = Session()
      business_object = session.query(Business).filter(Business.business_id== business_id).first()

      # transforming into JSON-serializable objects
      schema = BusinessSchema()
      business = schema.dump(business_object)

      # serializing as JSON
      session.close()
      return jsonify(business)


@app.route('/businesses/name/<business_name>')
def get_businessbyBusinessName(business_name):
      # fetching from the database
      session = Session()
      business_object = session.query(Business).filter(Business.business_name== business_name).first()

      # transforming into JSON-serializable objects
      schema = BusinessSchema()
      business = schema.dump(business_object)

      # serializing as JSON
      session.close()
      return jsonify(business)


@app.route('/businesses', methods=['POST'])
def add_business():
        # mount post object
        posted_business = BusinessSchema(only=('business_id', 'business_name', 'business_type', 'business_address', 'business_coordinates', 'business_description', 'business_footprint','business_level','business_county','business_town'))\
            .load(request.get_json())

        business = Business(**posted_business, created_by="HTTP post request")

        # persist post
        session = Session()
        session.add(business)
        session.commit()

        # return created post
        new_business = BusinessSchema().dump(business)
        session.close()
        return jsonify(new_business), 201




#AJAX CALLS FOR GETTING USERS FROM THE DATABASE & POSTING TO THE DATABASE --> ,GET_ALL, POST

@app.route('/users')
def get_users():
        # fetching from the database
        session = Session()
        user_objects = session.query(User).all()

        # transforming into JSON-serializable objects
        schema = UserSchema(many=True)
        users = schema.dump(user_objects)

        # serializing as JSON
        session.close()
        return jsonify(users)


@app.route('/users/<user_id>')
def get_userbyUserID(user_id):
      # fetching from the database
      session = Session()
      user_object = session.query(User).filter(User.user_id== user_id).first()

      # transforming into JSON-serializable objects
      schema = UserSchema()
      user = schema.dump(user_object)

      # serializing as JSON
      session.close()
      return jsonify(user)




@app.route('/users', methods=['POST'])
def add_user():
        # mount post object
        posted_user = UserSchema(only=('user_id', 'user_email', 'user_name', 'user_address', 'user_coordinates', 'user_footprint','user_level'))\
            .load(request.get_json())

        user = User(**posted_user, created_by="HTTP post request")

        # persist post
        session = Session()
        session.add(user)
        session.commit()

        # return created post
        new_user = UserSchema().dump(user)
        session.close()
        return jsonify(new_user), 201





@app.route('/edit/<user_id>/<user_footprint>')
def updateUser(user_id,user_footprint):
        session = Session()
        GetUserData = session.query(User).filter(User.user_id==user_id).first()
        print (GetUserData )
        OldUserfootprint = GetUserData.user_footprint
        NewFootPrint = float(OldUserfootprint) + float(user_footprint)

        print (float(NewFootPrint))

        dataToUpdate = {User.user_footprint: NewFootPrint,User.user_level:  math.floor(NewFootPrint/100)  +1 }

        UserData = session.query(User).filter(User.user_id==user_id)
        UserData.update(dataToUpdate)
        session.commit()

        new_user = UserSchema().dump(UserData)
        session.close()
        return jsonify(new_user), 201


@app.route('/editbusiness/<business_id>/<business_footprint>')
def updateBusiness(business_id,business_footprint):
        session = Session()
        GetBusinessData = session.query(Business).filter(Business.business_id==business_id).first()
        print (GetBusinessData )
        OldBusinessfootprint = GetBusinessData.business_footprint
        NewFootPrint = float(OldBusinessfootprint) + float(business_footprint)

        print (float(NewFootPrint))

        dataToUpdate = {Business.business_footprint: NewFootPrint,Business.business_level:  math.floor(NewFootPrint/100)  +1 }

        BusinessData = session.query(Business).filter(Business.business_id==business_id)
        BusinessData.update(dataToUpdate)
        session.commit()

        new_business = BusinessSchema().dump(BusinessData)
        session.close()
        return jsonify(new_business), 201


@app.route('/editpost/<post_id>')
def updatePost(post_id,):
        session = Session()
        GetPostData = session.query(Post).filter(Post.id==post_id).first()
        print (GetPostData)
        OldPostPortion = GetPostData.portion
        NewPortion = OldPostPortion - 1

        print (NewPortion)

        dataToUpdate = {Post.portion: NewPortion}

        PostData = session.query(Post).filter(Post.id==post_id)
        PostData.update(dataToUpdate)
        session.commit()

        new_post = PostSchema().dump(PostData)
        session.close()
        return jsonify(new_post), 201
