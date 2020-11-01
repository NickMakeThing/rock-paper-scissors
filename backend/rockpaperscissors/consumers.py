import json
from channels.generic.websocket import WebsocketConsumer
from .models import PlayerStatus, PlayerMatch, Match
from asgiref.sync import async_to_sync
from time import sleep
from .forms import MoveForm
import threading

class MatchFindingConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.status_changed = False
        self.connected = True
        
    def receive(self, text_data): #data
        name = text_data 
        cookie = self.scope['cookies'][name]
        print(self.scope['cookies'],cookie)
        player = PlayerStatus.objects.get(name=name)
        if player.cookie == cookie:
            player.looking_for_opponent = True
            player.save()
            self.status_changed = True
            self.player = player
            waiting_for_opponent = threading.Thread(target=self.look_for_match, args=(player,self))
            waiting_for_opponent.start()
            #when client gets matchnumber, he disconnect and connects with match in the url.

    def disconnect(self, close_code):
        self.connected = False
        if self.status_changed:
            #match being made just afterwards (needs more detail for this to work):
            #   if some condition, delete match if it exists.
            self.player.looking_for_opponent = False
            self.player.save()

    def look_for_match(self, player, self_instance):
        while(player.looking_for_opponent and self_instance.connected):
            print('still running: ',player.name)
            player_match = PlayerMatch.objects.filter(player=player.id)
            if player_match.exists():
                player.looking_for_opponent = False
                match = player_match.first().match
                opponent = PlayerMatch.objects.filter(match=match).exclude(player=player).first() #could give 'opponent' field in playermatch
                opponent = opponent.player.name # way too many queries
                self_instance.send(text_data=json.dumps({
                    "match_name": match.name,
                    "opponent": opponent
                }))
            sleep(2)

class GameUpdateConsumer(WebsocketConsumer):
    def connect(self):
        match = self.scope['path'].split('/')[3]
        name=[*self.scope['cookies']][0]#change because error will happen when other cookies are present.
        self.cookie = self.scope['cookies'][name]

        contestants = PlayerMatch.objects.filter(match__name=match).select_related('match','player')
        self.player = contestants.get(player__name=name).player
        self.match_object = contestants.get(player__name=name).match
        self.player_playermatch = contestants.get(player=self.player)
        self.opponent_playermatch = contestants.exclude(player=self.player).first()

        if contestants.exists() and self.player.cookie == self.cookie:
            async_to_sync(self.channel_layer.group_add)(
                match,
                self.channel_name
            )
            self.accept() 
            print('match found')
            self.send_game_state(contestants)
        else: 
            print('no match found')

    def receive(self, text_data):
        data=json.loads(text_data)
        print(data)
        form = MoveForm({'move':data['move']})
        print('match name validated')
        #using this makes it work: player_match = PlayerMatch.objects.get(player=self.player) 
        if form.is_valid():
            print('message validated')
            self.player_playermatch.move = data['move']
            self.player_playermatch.save()
 
    def game_update(self, update):
        self.send(text_data=json.dumps(update))

    def send_game_state(self,contestants):
        opponent_score = self.player_playermatch.game_score
        player_score = self.player_playermatch.game_score
        game_state={
            'game_state':{
                'player_score': player_score,
                'opponent_score': opponent_score
                }
        }
        self.send(text_data=json.dumps(game_state))

