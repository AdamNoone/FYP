from marshmallow import Schema, fields

from sqlalchemy import Column, String, Integer, Float

from .entity import Entity, Base


class Food(Entity, Base):
    __tablename__ = 'food_table'

    food_name = Column(String)
    food_cf = Column(Float)
    food_group = Column(String)
    updated_by = Column(String)



    def __init__(self, id, food_name, food_cf, food_group, created_by, updated_by):
        Entity.__init__(self, created_by)
        self.id = id
        self.food_name = food_name
        self.food_cf= food_cf
        self.food_group= food_group
        self.updated_by= updated_by



class FoodSchema(Schema):
      id= fields.Number()
      food_name= fields.Str()
      food_cf = fields.Number()
      food_group= fields.Str()
      created_at = fields.DateTime()
      updated_by = fields.Str()
      last_updated_by = fields.Str()
      updated_at = fields.DateTime()

