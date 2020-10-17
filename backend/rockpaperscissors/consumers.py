import json
from channels.generic.websocket import WebsocketConsumer
from .models import PlayerStatus, PlayerMatch, Match
from asgiref.sync import async_to_sync
from time import sleep
from .forms import MoveForm
import threading

def look_for_match(player, self_instance):
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
            waiting_for_opponent = threading.Thread(target=look_for_match, args=(player,self))
            waiting_for_opponent.start()
            #when client gets matchnumber, he disconnect and connects with match in the url.

    def disconnect(self, close_code):
        self.connected = False
        if self.status_changed:
            #match being made just afterwards (needs more detail for this to work):
            #   if some condition, delete match if it exists.
            self.player.looking_for_opponent = False
            self.player.save()

class GameUpdateConsumer(WebsocketConsumer):
    def connect(self):
        match = self.scope['path'].split('/')[3]
        self.match_object = Match.objects.get(name=match)
        contestants = PlayerMatch.objects.filter(match=self.match_object)
        name=[*self.scope['cookies']][0]#change because error will happen when other cookies are present.
        self.cookie = self.scope['cookies'][name]
        self.player = PlayerStatus.objects.get(name=name) #too many queries.
        if contestants.exists() and self.player.cookie == self.cookie:
            async_to_sync(self.channel_layer.group_add)(
                match,
                self.channel_name
            )
            self.accept() 
            print('match found')
        else: 
            print('no match found')

    def receive(self, text_data):
        data=json.loads(text_data)
        print(data)
        player_match = PlayerMatch.objects.get(player=self.player)# do this with less queries  
        if player_match.match == self.match_object:    
            form = MoveForm({'move':data['move']})
            print('match name validated')
            if form.is_valid():
                print('message validated')
                player_match.move = data['move']
                player_match.save()
                
        #use cookie to validate
        #get user and move
        #add users move to database
        #
        
    
    def game_update(self, update):
        self.send(text_data=json.dumps(update))
