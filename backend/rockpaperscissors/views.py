from django.shortcuts import render
from .models import PlayerStatus
from django.db import transaction
from django.views.generic import TemplateView
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView
from .serializers import PlayerSerializer, PlayerDataSerializer
from .match_maker import create_random_string, create_match_name as create_cookie
from django.http import JsonResponse

class Index(TemplateView):
    template_name='index.html'

class CreatePlayerView(CreateAPIView):
    serializer_class = PlayerSerializer
    
    def create(self, request, *args, **kwargs):
        guest_number = PlayerStatus.objects.all().last().id + 1
        name = 'guest-'+str(guest_number) #maybe do guest_ instead
        random_string = create_random_string()
        cookie = create_cookie(name + random_string)
        request.data['cookie']=cookie
        request.data['name']=name
        response = super().create(request)
        response.set_cookie(
            request.data['name'], cookie,
            max_age=31536000000, httponly=True
        )
        response.set_cookie(name,cookie,max_age=31536000000)
        return response


class SendPlayerDataView(ListAPIView): #change name (leaderboarddata?)
    serializer_class = PlayerDataSerializer
    queryset = PlayerStatus.objects.all().exclude(wins=0,losses=0).order_by('-score')

class PlayerStats(RetrieveAPIView): #change name 
    serializer_class = PlayerDataSerializer
    queryset = PlayerStatus.objects.all()
    lookup_field='name'