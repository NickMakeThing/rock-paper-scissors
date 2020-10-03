from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework.generics import CreateAPIView, UpdateAPIView
from .serializers import PlayerSerializer
from .match_maker import create_random_string, create_match_name as create_cookie

class Test(TemplateView):
    template_name='index.html'

class CreatePlayerView(CreateAPIView):
    serializer_class = PlayerSerializer
    
    def create(self, request, *args, **kwargs):
        random_string = create_random_string()
        cookie = create_cookie(request.data['name'] + random_string)
        request.data['cookie']=cookie
        response = super().create(request)
        response.set_cookie(
            'names',
            {request.data['name']:cookie},
            max_age=31536000000
        )
        
        return response
