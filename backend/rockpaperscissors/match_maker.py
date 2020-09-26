from time import sleep 
from .models import PlayerStatus
import match_maker_utils as utils

while(True):
    sleep(2)
    waiting = PlayerStatus.objects.filter(looking_for_opponent=True)
    waiting = list(waiting.order_by('score'))
    if len(waiting)>1:
        closest_scores = utils.map_player_to_player_of_closest_score(waiting)
        matches = utils.match_players_if_they_map_to_eachother(closest_scores)
        utils.create_matches(matches)
