from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import datetime
import os

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

channels = {}

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("create_channel")
def create_channel(data):
    channel_name = data["name"]
    if channel_name not in channels:
        channels[channel_name] = []
        emit("channel_created", {
            "channel_name": channel_name
        }, broadcast=True)

@socketio.on("join")
def join(data):
    channel = data["channel"]
    join_room(channel)

@socketio.on("send_message")
def send_message(data):
    channel = data["channel"]
    message = {
        "user": data["user"],
        "message": data["message"],
        "timestamp": datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
    }
    if channel in channels:
        channels[channel].append(message)
        if len(channels[channel]) > 100:
            channels[channel] = channels[channel][-100:]
    emit("new_message",
         {
            "channel": channel,
            "message": message
         },
         room=channel
    )

@socketio.on("delete_message")
def delete_message(data):
    channel= data["channel"]
    timestamp = data["timestamp"]
    user= data["user"]

    if channel in channels:
        channels[channel]=[
            msg for msg in channels[channel]
                        if not (msg["timestamp"] == timestamp and msg["user"] == user)
        ]
        emit("message_deleted", {
            "channel": channel,
            "timestamp": timestamp,
            "user": user
        }, room=channel)

@app.route("/channels/<channel_name>/messages")
def get_channel_messages(channel_name): 
    return jsonify(channels.get(channel_name, []))

@app.route("/channels")
def get_channels():
    return jsonify(list(channels.keys()))

if __name__ == "__main__":
    socketio.run(app, debug=True)