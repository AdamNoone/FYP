from marshmallow import Schema, fields

from sqlalchemy import Column, String, Integer, Float

from .entity import Entity, Base


class Business(Entity, Base):
    __tablename__ = 'businesses_table'

    business_id = Column(String)
    business_name = Column(String)
    business_type = Column(String)
    business_address = Column(String)
    business_coordinates = Column(String)
    business_description = Column(String)
    business_footprint = Column(String)
    business_level = Column(Integer)


    def __init__(self, business_id, business_name , business_type, business_address ,business_coordinates, business_description, business_footprint, business_level, created_by):
        Entity.__init__(self, created_by)
        self.business_id = business_id
        self.business_name= business_name
        self.business_type= business_type
        self.business_address= business_address
        self.business_coordinates= business_coordinates
        self.business_description=  business_description
        self.business_footprint=  business_footprint
        self.business_level=  business_level


class BusinessSchema(Schema):
      id= fields.Number()
      business_id= fields.Str()
      business_name= fields.Str()
      business_type= fields.Str()
      business_address= fields.Str()
      business_coordinates= fields.Str()
      business_description= fields.Str()
      business_footprint= fields.Str()
      business_level= fields.Number()
      created_at = fields.DateTime()
      updated_at = fields.DateTime()
