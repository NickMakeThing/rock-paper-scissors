import json
from channels.generic.websocket import WebsocketConsumer
from .models import PlayerStatus, PlayerMatch
from time import sleep
class MatchFindingConsumer(WebsocketConsumer):
    
    def connect(self):   
        print('CONNECT')
        self.accept()
        #print(self.scope)

    def receive(self, data):
        player = PlayerStatus.objects.get(name=data['name'])
        if player.cookie == data['cookie']:
            player.looking_for_opponent = True
            player.save()
            while(player.looking_for_opponent):
                sleep(2)
                player_match = PlayerMatch.objects.filter(player=player)
                #will not work because the player instance in the database will have looking_for changed to false, making the object not the same
                #can make it so matchmaker doesnt change the looking_for field and so this block of code does
                if player_match.exists(): 
                    player.looking_for_opponent = False
                    self.send(text_data=json.dumps({
                        "match_name": player_match.match.name
                    }))
                    
        #player sends details with cookie
        #check if name in table has cookie
        #update looking for to true
        #while loop: if playermatch exist, send match number
        #when client gets matchnumber, he disconnect and connects with match in the url.

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.match,
            self.channel_name
        )

class GameUpdateConsumer(WebsocketConsumer):

    def connect(self):
        self.match = self.scope['path'][9:-1]# needs test
        async_to_sync(self.channel_layer.group_add)(
            self.match,
            self.channel_name
        )
        self.accept()

    def receive(self, data):
        player = PlayerStatus.objects.get(name=data['name'])
            if player.cookie == data['cookie']:
                player_match = PlayerMatch.objects.get(player=player)
                player_match.move = data['move']
                player_match.save()
                
        #use cookie to validate
        #get user and move
        #add users move to database
        #
        pass

    def disconnect(self, close_code):
        pass
    
    def game_update(self, update):
        print('GROUP: ', update)
        self.send(text_data=json.dumps(update))
