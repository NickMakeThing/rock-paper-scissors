from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework.generics import CreateAPIView, UpdateAPIView
from .serializers import MatchMakingSerializer
from .models import PlayerStatus, Match, PlayerMatch
from time import sleep

class Test(TemplateView):
    template_name='index.html'

class FindOpponent(UpdateAPIView):
    serializer_class = MatchMakingSerializer
    def get_queryset(self):
        self.queryset = PlayerStatus.objects.filter(user=self.kwargs['pk'])
        return PlayerStatus.objects.filter(user=self.kwargs['pk'])

    def patch(self, request, *args, **kwargs):
        self.partial_update(request, *args, **kwargs)    
        match = PlayerMatch.objects.filter(user=kwargs['pk'])


        waiting_players = PlayerStatus.objects.filter(looking_for_opponent=True).order_by('score')
        print('\n\n')
        for i in waiting_players:
            print(i,list(waiting_players).index(i))
        print('\n\n')
    
        #wait for worker to find a match every second
        #once a match is found, respond with the url to the match
        while not match:
            match= PlayerMatch.objects.filter(user=kwargs['pk'])
            sleep(2)
            break
        print('match:', match_found)
        






#goes into different app called game?
class GameAction(CreateAPIView):
    pass
