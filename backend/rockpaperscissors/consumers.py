import json
from channels.generic.websocket import WebsocketConsumer
from .models import PlayerStatus, PlayerMatch
from time import sleep

class MatchFindingConsumer(WebsocketConsumer):
    def connect(self):
        print("CONNECTED!!!!!!!!!!!!!!!!!")
        self.accept()

    def receive(self, text_data): #data

        print('fdsfdsf')
        data=json.loads(text_data)
        player = PlayerStatus.objects.get(name=data['name'])
        print(player.cookie)
        
        if player.cookie == data['cookie']:
            player.looking_for_opponent = True
            player.save()
        #self.send('this line is needed for tests to work') 
        """
        while(player.looking_for_opponent):
            sleep(2)
            player_match = PlayerMatch.objects.filter(player=player.id)
            if player_match.exists():
                player.looking_for_opponent = False
                self.send(text_data=json.dumps({
                    "match_name": player_match.match.name #make it so this doesnt do 2 queries
                }))"""
                   
        #player sends details with cookie
        #check if name in table has cookie
        #update looking for to true
        #while loop: if playermatch exist, send match number
        #when client gets matchnumber, he disconnect and connects with match in the url.

    def disconnect(self, close_code):
        pass

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
