from .models import Match, PlayerMatch
from django.db import transaction
from random import randint
import hashlib

def create_random_string():
    r_string=''
    for i in range(10):
        r_string+=chr(randint(97,122))
    return r_string

def create_match_name(string):
    arg=bytes(string, 'utf-8')
    return hashlib.md5(arg).hexdigest()

def create_matches(matches):
    random_string = create_random_string()
    from django.db import connection
    with transaction.atomic():
        for i in matches:
            player1 = i[0]; player2 = i[1]
            hash_input = random_string + player1.name + player2.name
            match_name = create_match_name(hash_input)
            match_object = Match.objects.create(name=match_name)
            for j in [player1,player2]: #could make its own function
                PlayerMatch.objects.create(player=j,match=match_object)
                j.looking_for_opponent = False
                j.save()

def match_players_if_they_map_to_eachother(closest_scores):
    matches=[]
    closest_scores_copy=closest_scores.copy()
    for k,v in closest_scores.items():
        if v in closest_scores_copy and closest_scores_copy[v] == k:
            del closest_scores_copy[k]

    for k,v in closest_scores_copy.items():
        if closest_scores[v] == k:
            matches.append([k,v])
    return matches
           
def map_player_to_player_of_closest_score(waiting):
    closest_scores = {}
    for i in waiting:
        index = waiting.index(i)
        if index != 0:
            previous_score = abs(waiting[index-1].score - i.score)
        else:
            closest_scores[i] = waiting[index+1]
            continue
        if index != len(waiting)-1:
            next_score = abs(waiting[index+1].score - i.score)
        else:
            closest_scores[i] = waiting[index-1]
            continue
        if previous_score < next_score:
            closest_scores[i] = waiting[index-1]
        elif previous_score == next_score:
            random_pick = random.choice([waiting[index-1],waiting[index+1]])
            closest_scores[i] = random_pick
        else:
            closest_scores[i] = waiting[index+1]
    return closest_scores

def make_matches(players):
    if len(players)>1:
        closest_scores = map_player_to_player_of_closest_score(players)
        matches = match_players_if_they_map_to_eachother(closest_scores)
        create_matches(matches)
