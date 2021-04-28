#!/usr/bin/env python

import asyncio
import json
import logging
import websockets

from const import FloorNum as FLR
from level import Level
from pawn import Pawn

logging.basicConfig()

# consts - move to a better file
USERS = set()
BOARD_LENGTH = 20
FLOOR_NUM = 2

m_level = None
m_arrPlayers = []
m_iCurrentPlayer = 0
m_cameras = []

def new_player():
    return json.dumps({"login": True, "user_id": len(USERS)})

async def register(websocket):
    global m_arrPlayers
    USERS.add(websocket)
    m_arrPlayers.append(Pawn(0)) # start them off at tile #0 for now
    await websocket.send(new_player())

async def unregister(websocket):
    USERS.remove(websocket)
    await notify_users()

async def consumer_handler(websocket, path):
    async for message in websocket:
        await consumer(message, websocket)

async def consumer(message, websocket):
    global m_level
    global m_arrPlayers
    data = json.loads(message)
    if "login" in data:
        await register(websocket)
    else: # do not make any other requests with a login request
        objResponse = {}
        if "private_key" in data:
            objResponse["iKey"] = data["private_key"]

        if "level_init" in data:
            if (m_level is None):
                m_level = Level(FLOOR_NUM, FLR.GROUND)
            objResponse["level_init"] = True

        if "level_update" in data:
            objResponse["arrTiles"] = m_level.get_tiles()

        if "player_update" in data:
            arrPlayers = []
            for cPlayer in m_arrPlayers:
                arrPlayers.append(cPlayer.get_json())
            objResponse["arrPlayers"] = arrPlayers
            objResponse["iCurrentPlayer"] = m_iCurrentPlayer

        if "move_pawn" in data:
            arrPlayers = []
            bLevelUpdated = move_pawn(data)
            for cPlayer in m_arrPlayers:
                arrPlayers.append(cPlayer.get_json())
            objResponse["arrPlayers"] = arrPlayers
            if bLevelUpdated is True:
                objResponse["arrTiles"] = m_level.get_tiles()
                cPlayer = m_arrPlayers[int(data["move_pawn"])]
                objResponse["iTileUpdate"] = cPlayer.iTileIdx

        if "draw" in data:
            objResponse["draw"] = True

        await websocket.send(json.dumps(objResponse))

# consumer sub-functions
def move_pawn(data):
    global m_level
    global m_arrPlayers
    if "direction" not in data:
        return
    cPlayer = m_arrPlayers[int(data["move_pawn"])]
    cFloor = m_level.get_floor(-1) # get the current floor for now
    return cFloor.move_pawn(cPlayer, int(data["direction"]))

async def house(websocket, path):
    # await register(websocket)
    await consumer_handler(websocket, path)


start_server = websockets.serve(house, "127.0.0.1", 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
