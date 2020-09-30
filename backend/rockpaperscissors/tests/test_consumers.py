import pytest
from channels.testing import WebsocketCommunicator
from rockpaperscissors.consumers import EchoConsumer
from backend.routing import application

@pytest.mark.asyncio
async def test_consumer():
    communicator = WebsocketCommunicator(EchoConsumer, "/testws/")
    #communicator = WebsocketCommunicator(application, '/testws/')
    connected = await communicator.connect()
    assert connected
    await communicator.send_to(text_data="hello")
    response = await communicator.receive_from()
    print('\nRESPONSE: ',response)
    #await communicator.disconnect()
