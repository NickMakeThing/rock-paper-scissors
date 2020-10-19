from django.shortcuts import render
from .models import PlayerStatus
from django.db import transaction
from django.views.generic import TemplateView
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView
from .serializers import PlayerSerializer, PlayerDataSerializer
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
        name = request.data['name']
        random_string = create_random_string()
        cookie = create_cookie(name + random_string)
        request.data['cookie']=cookie
        response = super().create(request)
        response.set_cookie(
            request.data['name'], cookie,
            max_age=31536000000, httponly=True
        )
        response.set_cookie(name,cookie,max_age=31536000000)
        return response

class SendPlayerDataView(ListAPIView): #change name 
    serializer_class = PlayerDataSerializer
    queryset = PlayerStatus.objects.all().order_by('-score')
    def list(self, request, *args, **kwargs):
        response = super().list(request)
        return response

class PlayerStats(RetrieveAPIView): #change name 
    serializer_class = PlayerDataSerializer
    queryset = PlayerStatus.objects.all()
    lookup_field='name'