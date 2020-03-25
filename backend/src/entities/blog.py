from marshmallow import Schema, fields

from sqlalchemy import Column, String, Integer, Float

from .entity import Entity, Base

from marshmallow.utils import INCLUDE, EXCLUDE, RAISE

class Post(Entity, Base):

    __tablename__ = 'posts'

    title = Column(String)
    description = Column(String)
    picture = Column(String)
    business = Column(String)
    ingredients = Column(String)
    carbon_footprint = Column(Float)
    portion = Column(Integer)
    price = Column(String)
    collection_time = Column(String)

    def __init__(self, title, description, picture , business, created_by, ingredients, carbon_footprint, portion, price, collection_time):
        Entity.__init__(self, created_by, )
        self.title = title
        self.description = description
        self.picture = picture
        self.business= business
        self.ingredients = ingredients
        self.carbon_footprint = carbon_footprint
        self.portion = portion
        self.price = price
        self.collection_time = collection_time


class PostSchema(Schema):
    id= fields.Number()
    title = fields.Str()
    description = fields.Str()
    picture = fields.Str()
    business = fields.Str()
    ingredients= fields.Str()
    carbon_footprint = fields.Number()
    portion = fields.Number()
    price= fields.Str()
    collection_time= fields.Str()
    created_at = fields.DateTime()
    updated_at = fields.DateTime()
    last_updated_by = fields.Str()
