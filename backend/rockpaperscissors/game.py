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
        'r_r': 'draw',
        'p_p': 'draw',
        's_s': 'draw',
    }
    return CASES[player1.move+'_'+player2.move]

def change_rating(winner_rating, loser_rating):
    return round((loser_rating/winner_rating)*10)

def send_to_channel_layer(winner,loser,result=None):
    match = winner.match
    channel_layer = channels.layers.get_channel_layer()
    async_to_sync(channel_layer.send)(match.name, {
        'type': 'game.update',{
            'winner':{
                'name': winner.name,
                'score': winner.score,
            },
            'loser':{
                'name': loser.name,
                'score': loser.score
            },
            'game_finished': result
        }
    })
    
def complete_round(winner,loser):
    loser.move = None
    loser.save()
    winner.move = None
    winner.game_score += 1
    winner.save()
    send_to_channel_layer(winner,loser)

def complete_game(winner,loser):
    player_status_winner = winner.player
    player_status_loser = loser.player
    rating_change_value = get_rating_change(
        player_status_winner.rating,
        player_status_loser.rating
    )
    player_status_winner.wins += 1
    player_status_winner.rating += rating_change_value
    player_status_winner.save()

    player_status_loser.losses += 1
    player_status_loser.rating -= rating_change_value
    player_status_loser.save()
    
    result = rating_change_value
    send_to_channel_layer(winner,loser,result)

def game_round(player1, player2):
    if player1.move and player2.move and player1.match == player2.match:
        winner = decide_winner(player1,player2)
        loser = [x for x in [winner,player1,player2] if x != winner][0] 

        if winner.game_score < 2:
            complete_round(winner,loser)  
        else:
            complete_game(winner,loser)

        """
        if winner == player1:
            loser = player2
        else:
            loser = player1"""
            
def run_game(players):
    if len(players) > 2 && len(players) % 2 == 0:
        with transaction.atomic():
            for i in range(0,len(players),2):
                game_round(players[i],players[i+1])
                

