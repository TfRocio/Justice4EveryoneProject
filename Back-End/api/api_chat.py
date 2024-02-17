from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model.chatbot import first_response
from model.chatbot import response_chat_history
from model.chatbot_app import create_chatbot_response,clear_history
import json


app = FastAPI()

# Allowing all middleware is optional, but good practice for dev purposes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

#Creating endpoint
@app.get("/response")
def response(input: str):
    #TODO: poner el codigo para pasarle los parametros al modelo
    return dict(api_response = f"esta es la respuesta a tu pregunta: {input}")

#Another endpoint
@app.get("/responseByTemplate")
def responseByTemplate(user_input: str):
    return dict(user_input= user_input,
                answer = first_response(user_input))


# Endpoint to respond by history (with separate query parameters)
@app.get("/responseByHistory")
def response_by_history(user_input: str, chat_history_frontend: str):

    chat_history_dict = json.loads(chat_history_frontend)

    return {
        "user_input": user_input,
        "answer": response_chat_history(user_input, chat_history_dict)
    }


#Endpoint for the VERSION 2 chatbot
@app.get("/responseChatbot")
def response_chatbot(user_input: str):
    return {
        "user_input": user_input,
        "answer": create_chatbot_response(user_input)
    }


#clear History
@app.get("/clearHistory")
def clear_history_messages(count:int):
    return{
        "messages":clear_history(count)
    }


#For testing only
@app.get("/")
def root():
    return dict(greeting = "Hello")
