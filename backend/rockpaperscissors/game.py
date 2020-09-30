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

def get_rating_change(winner_rating, loser_rating):
    return round((loser_rating/winner_rating)*10)

def complete_round(winner,loser):
    loser.move = None
    loser.save()
    winner.move = None
    winner.game_score += 1
    winner.save()
    #send both win and loss to channel layer

def complete_game(winner,loser):
    player_status_winner = winner.user
    player_status_loser = loser.user
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
    
    winner.match.delete()    
    #send win and loss, rating changes and innergame win/loss to channel layer

def game_round(player1, player2):
    if player1.move and player2.move and player1.match == player2.match:
        winner = decide_winner(player1,player2)
        #could do something like #loser = [x for x in [winner,player1,player2] if x != winner][0] 
        if winner == player1:
            loser = player2
        else:
            loser = player1
        if winner.game_score < 2:
            complete_round(winner,loser)  
        else:
            complete_game(winner,loser)
            
def run_game(players):
    if len(players) > 2 && len(players) % 2 == 0:
        with transaction.atomic():
            for i in range(0,len(players),2):
                game_round(players[i],players[i+1])
                

