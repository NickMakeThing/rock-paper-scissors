from .models import Match, PlayerMatch
from random import randint
import hashlib
#rename ...utils

def create_random_string():
    r_string=''
    for i in range(10):
        r_string+=chr(randInt(97,122))
    return r_string

def create_match_name(string):
    arg=bytes(string, 'utf-8')
    return hashlib.md5(arg).hexdigest()
    
def create_matches(matches):
    random_string = create_random_string()
    match_entries = []
    player_match_entries = []

    for i in matches:
        player1 = i[0].user; player2 = i[1].user
        hash_input = random_string + player1.username + player2.username
        match_name = create_match_name(hash_input)

        match_object = Match(name=match_name)
        match_entries.append(match_object)

        player_match_entries.append(PlayerMatch(user=player1,match=match_object))
        player_match_entries.append(PlayerMatch(user=player2,match=match_object))

    Match.objects.bulk_create(match_entries)
    PlayerMatch.objects.bulk_create(player_match_entries)
        
def match_players_if_they_map_to_eachother(closest_scores):
    matches=[]
    for i in closest_scores:
        if closest_scores.get(closest_scorest.get(i)) == i:
            matches.append([i,closest_scores.get(i)])
    return matches
           
def map_player_to_player_of_closest_score(waiting):
    closest_scores = []
    for i in waiting:
        index = waiting.index(i)
        previous = waiting[index-1]
        next = waiting[index+1]
        if index != 0:
            previous_score = abs(previous.score - i.score)
        else:
            closest_scores.append({i:next})
            continue
        if index != len(waiting)-1:
            next_score = abs(next.score - i.score)
        else:
            closest_scores.append({i:previous})
            continue
        if previous_score<next_score:
            closest_scores.append({i:previous})
        else:
            closest_scores.append({i:next})
    return closest_scores
