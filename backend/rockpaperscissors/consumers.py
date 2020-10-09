import json
from channels.generic.websocket import WebsocketConsumer
from .models import PlayerStatus, PlayerMatch, Match
from asgiref.sync import async_to_sync
from time import sleep
from .forms import MoveForm
import threading

def look_for_match(player, self_instance):
    while(player.looking_for_opponent and self_instance.connected):
        print('still running')
        player_match = PlayerMatch.objects.filter(player=player.id)
        if player_match.exists():
            player.looking_for_opponent = False
            player_match = player_match.first()
            self_instance.send(text_data=json.dumps({
                "match_name": player_match.match.name #make it so this doesnt do 2 queries
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
        self.match = self.scope['path'][10:]# [10:-1] if leading /, also can split by / get last.
        if Match.objects.filter(name=self.match).exists():
            #check if playermatch has match
            #check cookie?
            async_to_sync(self.channel_layer.group_add)(
                self.match,
                self.channel_name
            )
            self.accept()
            print('match found')
        else: 
            print('no match found')

    def receive(self, text_data):
        data = json.loads(text_data)
        player = PlayerStatus.objects.get(name='greg')# can be redundant if client sends their user id number instaed
        player_match = PlayerMatch.objects.get(player=player)# do this with less queries
        
        if player.cookie == data['cookie'] and player_match.match.name == self.match: #too many queries     
            form = MoveForm({'move':data['move']})
            if form.is_valid():
                player_match.move = data['move']
                player_match.save()
                
        #use cookie to validate
        #get user and move
        #add users move to database
        #
        pass
    
    def game_update(self, update):
        self.send(text_data=json.dumps(update))
