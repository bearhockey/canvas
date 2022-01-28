#!/usr/bin/env python

import asyncio
import json
import logging
import websockets

from chain import Chain
from player import Player
from round import Round
from state import StateManager
from state import StateConst as STATE

logging.basicConfig()

# consts - move to a better file
USERS = set()

m_arrPlayers = []
m_iCurrentPlayer = 0
m_mapImages = {}

m_cRound = Round()

def new_player(user_id):
    return json.dumps({"login": True, "user_id": user_id})

def get_player(user_id):
    for player in m_arrPlayers:
        if player.GetIdx() == user_id:
            return player
    return None

async def register(websocket):
    global m_arrPlayers
    USERS.add(websocket)
    user_id = len(m_arrPlayers)
    m_arrPlayers.append(Player(user_id, websocket))
    await websocket.send(new_player(user_id))

async def unregister(websocket):
    USERS.remove(websocket)
    await notify_users()

async def consumer_handler(websocket, path):
    async for message in websocket:
        await consumer(message, websocket)

async def consumer(message, websocket):
    global USERS
    global m_arrPlayers
    global m_mapImages
    user_key = None
    cPlayer = None
    data = json.loads(message)
    if "login" in data:
        await register(websocket)
        for player in m_arrPlayers:
            await player.GetWebSocket().send(json.dumps({ 'player_count':len(m_arrPlayers) }) )
    elif "start_round" in data:
        m_cRound.StartRound(m_arrPlayers)
        objResponse = {'state':m_cRound.GetState() }
        objResponse['objPrompt'] = { 'type':'text', 'data':"Draw something!" }
        for player in m_arrPlayers:
            await player.GetWebSocket().send(json.dumps(objResponse))
    else: # do not make any other requests with a login request
        objResponse = {}
        if "private_key" in data:
            user_key = data["private_key"]
            cPlayer = get_player(user_key)
            objResponse["iKey"] = user_key

        if cPlayer != None:
            if "srcImage" in data:
                cPlayer.AddImageToChain(data['srcImage'])
                # objResponse['message'] = "Success: srcImage loaded: " + data['srcImage'] + "(" + str(user_key) + ")"
            elif "srcText" in data:
                cPlayer.AddCaptionToChain(data['srcText'])
                # objResponse['message'] = "Success: srcText loaded: " + data['srcText'] + "(" + str(user_key) + ")"
            if "submit" in data:
                cPlayer.SetWaiting(True)
                objResponse['submit'] = True

        await websocket.send(json.dumps(objResponse))

        iState = m_cRound.IsRoundOver()
        # send out big blast
        if iState >= 0:
            for player in m_arrPlayers:
                objResponse = { 'new_turn':True, 'iKey':player.GetIdx(), 'state':iState }
                objResponse['objPrompt'] = player.GetCurrentChain().GetLastObject()
                await player.GetWebSocket().send(json.dumps(objResponse))

async def house(websocket, path):
    # await register(websocket)
    await consumer_handler(websocket, path)


start_server = websockets.serve(house, "127.0.0.1", 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
