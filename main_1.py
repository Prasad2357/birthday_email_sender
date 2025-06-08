# from typing import Union
# from fastapi import FastAPI
# from pydantic import BaseModel
# from enum import Enum

# # class ModelName(str,Enum):
# #     alexnext="alexnet"
# #     resnet="resnet"
# #     lenet="lenet"

# app = FastAPI()

# # class Item(BaseModel):
# #     name: str
# #     price: float
# #     is_offer: Union[bool,None] = None 

# class Item(BaseModel):
#     name: str
#     description: str | None = None
#     price : float
#     tax: float | None = None

# @app.get("/")
# def read_root():
#     return {"Hello": "World"}

# # @app.get("/models/{model_name}")
# # def get_model(model_name:ModelName):
# #     if model_name=="alexnet":
# #         return {"model_name":model_name, "message":"deep learning"}
# #     if model_name is ModelName.resnet:
# #         return {"model_name":model_name,"message":"have some residuals"}
# #     if model_name.value == "lenet":
# #         return {"model_name":model_name,"message":" LeCNN"}

# @app.post("/items")
# def create_item(item_id:int, item: Item, q:str | None = None):
#     # item_dict = item.model_dump()
#     # print(item_dict)

#     # if item.tax is not None:
#     #     price_with_tax = item.price + item.tax
#     #     item_dict.update({"price_with_tax":price_with_tax})
#     # return item_dict  
#     result = {"item_id": item_id, **item.model_dump()}
#     if q:
#         result.update({"q": q})
#     return result
     
# @app.get("/items/{item_id}")
# def read_item(item_id:int, q:Union[str, None]= None):
#     return {"item_id": item_id, "q": q}

# @app.put("/items/{item_id}")
# def update_item(item_id: int, item: Item):
#     return {"item_name": item.name}