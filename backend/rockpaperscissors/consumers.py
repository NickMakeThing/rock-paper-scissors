import json
from channels.generic.websocket import WebsocketConsumer
from .models import PlayerStatus, PlayerMatch, Match
from asgiref.sync import async_to_sync
from time import sleep
from .forms import MoveForm
import threading
import time

def getq():
        from django.db import connection
        a = connection.queries
        print(len(a))
        for i in a:
            print('\n\n',i)

class MatchFindingConsumer(WebsocketConsumer): #revisit
    def connect(self):
        self.accept()
        self.status_changed = False
        self.connected = True
        
    def receive(self, text_data): 
        name = text_data 
        cookie = self.scope['cookies'][name]
        player = PlayerStatus.objects.get(name=name)
        if player.cookie == cookie:
            player.looking_for_opponent = True
            player.save()
            self.status_changed = True
            self.player = player
            waiting_for_opponent = threading.Thread(target=self.look_for_match, args=(player,self))
            waiting_for_opponent.start()

    def disconnect(self, close_code):
        self.connected = False
        if self.status_changed:
            self.player.looking_for_opponent = False
            self.player.save()

    def look_for_match(self, player, self_instance):
        while(player.looking_for_opponent and self_instance.connected):
            print('still running: ',player.name)
            player_match = PlayerMatch.objects.filter(player=player).select_related('match')
            if player_match.exists():
                player.looking_for_opponent = False
                match = player_match.first().match
                opponent = PlayerMatch.objects.filter(match=match).exclude(player=player).select_related('player').first() #could give 'opponent' field in playermatch
                opponent = opponent.player.name
                self_instance.send(text_data=json.dumps({
                    "match_name": match.name,
                    "opponent": opponent
                }))
            sleep(2)
            

class GameUpdateConsumer(WebsocketConsumer):
    def connect(self):
        match = self.scope['path'].split('/')[3]
        name=self.scope['cookies']['name']
        self.cookie = self.scope['cookies'][name]
        self.contestants = PlayerMatch.objects.filter(match__name=match).select_related('player','match')
        self.player_playermatch = self.contestants.get(player__name=name)
        self.opponent_playermatch = self.contestants.exclude(id=self.player_playermatch.id).first()
        
        if self.contestants.exists() and self.player_playermatch.player.cookie == self.cookie:
            async_to_sync(self.channel_layer.group_add)(
                match,
                self.channel_name
            )
            self.accept() 
            print('match found')
            self.send_game_state()
        else: 
            print('no match found')

    def receive(self, text_data):
        data=json.loads(text_data)
        form = MoveForm({'move':data['move']})
        player_match = PlayerMatch.objects.get(player=self.player_playermatch.player)
        if form.is_valid():
            player_match.move = data['move']
            player_match.save()

    def game_update(self, update):
        self.send(text_data=json.dumps(update))

    def refresh_timer(self,update):
        self.time = update['message']['time']
        self.send(text_data=json.dumps(update))

    def send_game_state(self):
        player_score = self.player_playermatch.game_score
        opponent_score = self.opponent_playermatch.game_score
        round_start_time = self.get_round_start_time()
        game_state={
            'type':'connect',
            'message':{
                'player_score': player_score,
                'opponent_score': opponent_score,
                'time': round_start_time
                }
        }
        self.send(text_data=json.dumps(game_state))
    
    def disconnect(self, message):
        self.send(text_data=json.dumps(message))
        self.close()
    
    def websocket_disconnect(self,message):
        if hasattr(self,'time'):
            player_match = PlayerMatch.objects.filter(id=self.player_playermatch.id)
            player_match.update(round_start_time=self.time)
        super().websocket_disconnect(message)
        
    def get_round_start_time(self):
        if self.player_playermatch.round_start_time:
            round_start_time = self.player_playermatch.round_start_time
            if time.time() - round_start_time > 30:
                round_start_time +=30
            if time.time() - round_start_time > 60:
                round_start_time +=60
            return round_start_time
        else:
            return None
