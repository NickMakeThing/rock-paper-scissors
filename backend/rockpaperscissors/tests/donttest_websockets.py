import pytest
from channels.testing import WebsocketCommunicator
from rockpaperscissors.consumers import MatchFindingConsumer, GameUpdateConsumer
from backend.routing import application
import channels.layers
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async
from time import sleep
from rockpaperscissors.models import PlayerStatus, PlayerMatch, Match
import json
from rockpaperscissors.match_maker import make_matches

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_match_making_consumer():
    await sync_to_async(PlayerStatus.objects.create)(name='greg', cookie='123456')
    greg_communicator = WebsocketCommunicator(MatchFindingConsumer, "/ws/find_match/")
    greg_connected = await greg_communicator.connect()
    assert greg_connected 
    await greg_communicator.send_to(text_data=json.dumps({
        'name': 'greg',
        'cookie': '123456'
    }))
    await greg_communicator.receive_nothing()
    
    greg = await sync_to_async(PlayerStatus.objects.get)(name='greg')
    match = await sync_to_async(Match.objects.create)(name='matchname')
    greg_match = await sync_to_async(PlayerMatch.objects.create)(player=greg, match=match)
    assert greg.looking_for_opponent == True
    response = json.loads(await greg_communicator.receive_from(timeout=2))
    assert response['match_name'] == 'matchname'
    await greg_communicator.disconnect()
    #these tests require manual teardown
    await sync_to_async(Match.objects.all().delete)()
    await sync_to_async(PlayerStatus.objects.all().delete)()
    await sync_to_async(PlayerMatch.objects.all().delete)()

@pytest.mark.django_db
@pytest.mark.asyncio
async def test_game_update_consumer():
    match = await sync_to_async(Match.objects.create)(name='matchname')
    await sync_to_async(PlayerStatus.objects.create)(name='greg', cookie='123456')
    greg = await sync_to_async(PlayerStatus.objects.get)(name='greg')
    greg_match = await sync_to_async(PlayerMatch.objects.create)(player=greg, match=match)
    greg_communicator = WebsocketCommunicator(GameUpdateConsumer, "/ws/match/"+match.name)
    greg_connected = await greg_communicator.connect()
    assert greg_connected 
    await greg_communicator.send_to(text_data=json.dumps({
        'name': 'greg',
        'cookie': '123456',
        'move':'s'
    }))
    await greg_communicator.receive_nothing()
    sleep(1)
    greg_match = await sync_to_async(PlayerMatch.objects.get)(player=greg)
    assert greg_match.move == 's'
    await greg_communicator.send_to(text_data=json.dumps({
        'name': 'greg',
        'cookie': '123456',
        'move': 'nonvalidstring'
    }))
    await greg_communicator.receive_nothing()
    sleep(1)
    greg_match = await sync_to_async(PlayerMatch.objects.get)(player=greg)
    assert greg_match.move == 's'
    
    channel_layer = channels.layers.get_channel_layer()
    await channel_layer.group_send('matchname',({'type':'game_update','message':'game details'}))
    response = json.loads(await greg_communicator.receive_from(timeout=2))
    assert response == {'type':'game_update','message':'game details'} 
    await greg_communicator.disconnect()


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
