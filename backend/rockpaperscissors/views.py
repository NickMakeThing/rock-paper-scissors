from django.shortcuts import render
from .models import PlayerStatus
from django.db import transaction
from django.views.generic import TemplateView
from rest_framework.generics import CreateAPIView, UpdateAPIView
from .serializers import PlayerSerializer
from .match_maker import create_random_string, create_match_name as create_cookie

class Index(TemplateView):
    template_name='index.html'
   
    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        response = self.render_to_response(context)
        return response

class CreatePlayerView(CreateAPIView):
    serializer_class = PlayerSerializer
    
    def create(self, request, *args, **kwargs):
        random_string = create_random_string()
        cookie = create_cookie(request.data['name'] + random_string)
        request.data['cookie']=cookie
        response = super().create(request)
        response.set_cookie(
            request.data['name'], cookie,
            max_age=31536000000, httponly=True
        )
        response.set_cookie('names',names,max_age=31536000000)
        return response
