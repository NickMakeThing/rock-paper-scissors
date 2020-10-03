from time import sleep 
from .models import PlayerStatus, PlayerMatch
from match_maker_utils import make_matches
from game import run_game

while(True):
    sleep(2) #atomic transaction on waiting and active?
    waiting = PlayerStatus.objects.filter(looking_for_opponent=True)
    waiting = list(waiting.order_by('score'))
    active = list(PlayerMatch.objects.all().order_by('match'))
    make_matches(waiting)
    run_game(active)
