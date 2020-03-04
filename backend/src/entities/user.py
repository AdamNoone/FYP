from marshmallow import Schema, fields

from sqlalchemy import Column, String, Integer, Float

from .entity import Entity, Base


class User(Entity, Base):
    __tablename__ = 'users_table'

    user_id = Column(String)
    user_email = Column(String)
    user_name = Column(String)
    user_address = Column(String)
    user_coordinates = Column(String)
    user_footprint = Column(String)
    user_level = Column(Integer)




    def __init__(self, user_id, user_email, user_name, user_address ,user_coordinates, user_footprint, user_level, created_by):
        Entity.__init__(self, created_by)
        self.user_id = user_id
        self.user_email= user_email
        self.user_name= user_name
        self.user_address= user_address
        self.user_coordinates= user_coordinates
        self.user_footprint=  user_footprint
        self.user_level=  user_level



class UserSchema(Schema):
      id= fields.Number()
      user_id= fields.Str()
      user_email= fields.Str()
      user_name= fields.Str()
      user_address= fields.Str()
      user_coordinates= fields.Str()
      user_footprint= fields.Str()
      user_level= fields.Number()
      created_at = fields.DateTime()
      updated_at = fields.DateTime()
