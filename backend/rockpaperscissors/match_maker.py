from time import sleep 
from .models import PlayerStatus
from match_maker_functions import * #make import as x

while(True):
    sleep(2)
    waiting = PlayerStatus.objects.filter(looking_for_opponent=True)
    waiting = list(waiting.order_by('score'))
    if len(waiting)>1:
        closest_scores = map_player_to_player_of_closest_score(waiting)
        matches = match_players_if_they_map_to_eachother(closest_scores)
        create_matches(matches)
