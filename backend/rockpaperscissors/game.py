import channels.layers
from asgiref.sync import async_to_sync
from .models import Match, PlayerMatch
from django.db import transaction

class Timer():
    def __init__(self, matchname):
        self.matchname = matchname
        self.time = 0
    
    def reset(self):
        self.time = 0

    def add_time(self):
        self.time += 2 #might want to actually use time of server and update ever loop iteration

    def get_matchname(self):
        return self.matchname

def decide_winner(player1,player2):
    CASES = {
        'r_s': player1,
        'p_r': player1,
        's_p': player1,
        'r_p': player2,
        'p_s': player2,
        's_r': player2,
        'r_r': None,
        'p_p': None,
        's_s': None,
    }
    return CASES[player1.move+'_'+player2.move]

def get_score_change(winner_rating, loser_rating):
    difference = abs(winner_rating-loser_rating)
    change = 10
    if winner_rating<loser_rating: 
        multiplier = 1 + difference/100
        change = int(multiplier*change)
    if winner_rating>loser_rating:
        multiplier = 1 - difference/100
        change = round(multiplier*change)

    if change > 40:
        return 40
    if change < 2:
        return 2
    return change

def send_to_channel_layer(winner,loser,rating_change=None):
    match = winner.match
    channel_layer = channels.layers.get_channel_layer()
    #from channels.layers import channel_layers
    #print(channel_layers['test_channel'])
    async_to_sync(channel_layer.group_send)(match.name, {
        'type':'game.update',
        'message':{ #
            'winner':{
                'name': winner.player.name,
                'game_score': winner.game_score,
                'move': winner.move
            },
            'loser':{
                'name': loser.player.name, #queries?
                'game_score': loser.game_score,
                'move': loser.move
            },
            'game_finished': rating_change,
            'draw':False
        }
    })  

def handle_draw(player1,player2):
    match=player1.match
    channel_layer = channels.layers.get_channel_layer()
    async_to_sync(channel_layer.group_send)(match.name, {
        'type':'game.update',
        'message':{
            'draw':True,
            'move':player1.move
            }
    })  
    player1.move = None
    player1.save()
    player2.move = None
    player2.save()

def complete_round(winner,loser):
    winner.game_score += 1
    send_to_channel_layer(winner,loser)
    winner.move = None
    winner.save()
    loser.move = None
    loser.save()

def complete_game(winner,loser):
    player_status_winner = winner.player
    player_status_loser = loser.player
    score_change_value = get_score_change(
        player_status_winner.score,
        player_status_loser.score
    )
    winner.game_score += 1
    player_status_winner.wins += 1
    player_status_winner.score += score_change_value
    player_status_winner.save()
    
    player_status_loser.losses += 1
    player_status_loser.score -= score_change_value
    player_status_loser.save()
    
    result = score_change_value
    send_to_channel_layer(winner,loser,result)
    Match.objects.get(name=winner.match.name).delete()

def undecided_function_name(winner,loser): 
    if winner.game_score < 2:
        complete_round(winner,loser)  
    else:
        complete_game(winner,loser)

def decide_default_winner(player1,player2):
    if player1.move or player2.move:
        if player1.move:
            winner = player1
            loser = player2
        if player2.move:
            winner = player2
            loser = player1
        undecided_function_name(winner,loser)

def game_round(player1, player2, timer):
    if player1.move and player2.move:
        winner = decide_winner(player1,player2)
        if winner:
            loser = [x for x in [winner,player1,player2] if x != winner][0] 
            undecided_function_name(winner,loser)
        else:
            handle_draw(player1,player2)
        timer.add_time()
    else:
        if timer.time >= 30:
            decide_default_winner(player1,player2)
            timer.reset()
        else:
            timer.add_time()# will only have to put once at end of function if uses server time to calculate.

def run_game(players, timers):
    if len(players) >= 2 and len(players) % 2 == 0:
        with transaction.atomic():
            for i in range(0,len(players),2):
                player1 = players[i]
                player2 = players[i+1]
                if player1.match == player2.match:
                    if player1.match in timers:
                        timer = timers[player1.match]
                        game_round(player1,player2,timer)
                    else:
                        timer = Timer(player1.match)
                        timers[player1.match] = timer
                        game_round(player1,player2,timer)
                    
                else:
                    assert('player mismatch')
                    print('\n\n\nbad match\n\n')

