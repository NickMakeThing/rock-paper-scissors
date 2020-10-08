import json
from channels.generic.websocket import WebsocketConsumer
from .models import PlayerStatus, PlayerMatch, Match
from asgiref.sync import async_to_sync
from time import sleep
from .forms import MoveForm

class MatchFindingConsumer(WebsocketConsumer):
    def connect(self):
        self.status_changed = False
        self.connected = True
        self.accept()
        
    def receive(self, text_data): #data
        name = text_data 
        cookie = self.scope['cookies'][name]
        player = PlayerStatus.objects.get(name=name)
        if player.cookie == cookie:
            player.looking_for_opponent = True
            player.save()
            self.status_changed = True
            self.player = player
            while(player.looking_for_opponent and self.connected):
                player_match = PlayerMatch.objects.filter(player=player.id)
                if player_match.exists():
                    player.looking_for_opponent = False
                    player_match = player_match.first()
                    self.send(text_data=json.dumps({
                        "match_name": player_match.match.name #make it so this doesnt do 2 queries
                    }))#continues to run after 'disconnect'
                sleep(2)
                   
        #player sends details with cookie
        #check if name in table has cookie
        #update looking for to true
        #while loop: if playermatch exist, send match number
        #when client gets matchnumber, he disconnect and connects with match in the url.

    def disconnect(self, close_code):
        self.connected = False
        if self.status_changed:
            #if match, cancel match
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
