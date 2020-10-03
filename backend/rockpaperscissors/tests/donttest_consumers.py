import pytest
from channels.testing import WebsocketCommunicator
from rockpaperscissors.consumers import EchoConsumer
from backend.routing import application
import channels.layers
from asgiref.sync import async_to_sync
from time import sleep
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
    
    """
