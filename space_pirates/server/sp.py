#!/usr/bin/env python

import asyncio
import json
import logging
import websockets

from player import Player
from state import StateManager
from state import StateConst as STATE

logging.basicConfig()

# consts - move to a better file
m_arrPlayers = []
m_stateMan = StateManager()

def new_player(user_id):
    return json.dumps({"login": True, "user_id": user_id})

def get_player(user_id):
    for player in m_arrPlayers:
        if player.GetIdx() == user_id:
            return player
    return None

async def register(websocket):
    global m_arrPlayers
    user_id = len(m_arrPlayers)
    m_arrPlayers.append(Player(user_id, websocket))
    await websocket.send(new_player(user_id))

async def unregister(websocket):
    pass
    # USERS.remove(websocket)
    # await notify_users()

async def consumer_handler(websocket, path):
    async for message in websocket:
        await consumer(message, websocket)

async def consumer(message, websocket):
    global m_arrPlayers
    user_key = None
    cPlayer = None
    data = json.loads(message)
    if "login" in data:
        await register(websocket)
    else: # do not make any other requests with a login request
        objResponse = {}
        if "private_key" in data:
            user_key = data["private_key"]
            cPlayer = get_player(user_key)
            objResponse["iKey"] = user_key

        if cPlayer != None:
            cPlayer.ParseSocket(data, objResponse, m_stateMan)

        await websocket.send(json.dumps(objResponse))

async def house(websocket, path):
    await consumer_handler(websocket, path)

main_loop = asyncio.new_event_loop()
asyncio.set_event_loop(main_loop)
start_server = websockets.serve(house, "127.0.0.1", 5678)
main_loop.run_until_complete(start_server)
print("Server started...")
main_loop.run_forever()