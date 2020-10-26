import channels.layers
from asgiref.sync import async_to_sync
from .models import Match, PlayerMatch
from django.db import transaction

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
    
def game_round(player1, player2):
    if player1.move and player2.move:
        winner = decide_winner(player1,player2)       
        if winner:
            loser = [x for x in [winner,player1,player2] if x != winner][0] 
            
            if winner.game_score < 2:
                complete_round(winner,loser)  
            else:
                complete_game(winner,loser)
        else:
            handle_draw(player1,player2)
            
def run_game(players):
    if len(players) >= 2 and len(players) % 2 == 0:
        with transaction.atomic():
            for i in range(0,len(players),2):
                player1 = players[i]
                player2 = players[i+1]
                if player1.match == player2.match:
                    game_round(player1,player2)
                else:
                    assert('player mismatch')
                    print('\n\n\nbad match\n\n')

