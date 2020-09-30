from channels.routing import ProtocolTypeRouter
from django.urls import re_path
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from rockpaperscissors import consumers


application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter([
                re_path(r'testws/$', consumers.EchoConsumer),
            ]
        )
    ),
})
