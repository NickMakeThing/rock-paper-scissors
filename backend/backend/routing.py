from django.urls import re_path
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from rockpaperscissors import consumers


application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter([
            re_path(r'ws/find_match/$', consumers.MatchFindingConsumer),
            re_path(r'ws/match/(?P<match>\w+)/$', consumers.GameUpdateConsumer),
        ])
    ),
})
