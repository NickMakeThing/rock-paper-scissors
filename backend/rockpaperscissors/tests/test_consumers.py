import pytest
from channels.testing import WebsocketCommunicator
from rockpaperscissors.consumers import MatchFindingConsumer, GameUpdateConsumer
from backend.routing import application
import channels.layers
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from time import sleep
from rockpaperscissors.models import PlayerStatus, PlayerMatch
import json


@pytest.mark.django_db
@pytest.mark.asyncio
async def test_match_making_consumer():
    await sync_to_async(PlayerStatus.objects.create)(name='greg', cookie='123456')
    #await sync_to_async(PlayerStatus.objects.create)(name='jonny', cookie='2468')
    greg_communicator = WebsocketCommunicator(MatchFindingConsumer, "/ws/find_match/")
    #jonny_communicator = WebsocketCommunicator(MatchFindingConsumer, "ws/find_match/")
    greg_connected = await greg_communicator.connect()
    #jonny_connected = await jonny_communicator.connect()
    assert greg_connected #and jonny_connected
    #sleep(1)
    #await greg_communicator.send_to(bytes_data=b"hi\0")
    #await greg_communicator.send_json_to({"hello": "world"})
    #await greg_communicator.send_to(text_data="test")
    await greg_communicator.send_to(text_data=json.dumps({
        'name': 'greg',
        'cookie': '123456'
    }))
    #response = await greg_communicator.receive_from()
    #print(response)
    await greg_communicator.disconnect()
    player = await sync_to_async(PlayerStatus.objects.first)()
    print(player.looking_for_opponent)
    assert player.looking_for_opponent == True

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_game_update_consumer():
    pass






"""
@pytest.mark.asyncio
async def test_consumer():
    #communicator = WebsocketCommunicator(EchoConsumer, "ws/testws/A/")
    #communicator = WebsocketCommunicator(application, '/testws/')
    #connected = await communicator.connect()
    #assert connected
    #await communicator.send_to(text_data="hello")
    #response = await communicator.receive_from()
    #print('\nRESPONSE: ',response)
    #await communicator.disconnect()
    pass

@pytest.mark.asyncio
async def test_layer():
    communicator = WebsocketCommunicator(EchoConsumer, "ws/testws/A/")
    
    connected = await communicator.connect()
    assert connected
    channel_layer = channels.layers.get_channel_layer()
    await channel_layer.group_send('A',({'type':'group_m','message':'helloLAYER'}))
    response = await communicator.receive_from(timeout=5)
    #await channel_layer.group_send('A',({'type':'group_m','message':'helloLAYER'}))
    print("RECEIVED ON CLIENT SIDE: ",response)
    await communicator.disconnect()
    
    
    """
