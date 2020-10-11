import os
from time import sleep 
from django import setup
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
setup()


from rockpaperscissors.models import PlayerStatus, PlayerMatch
from rockpaperscissors.match_maker import make_matches
from rockpaperscissors.game import run_game

while(True):
    sleep(2) #atomic transaction on waiting and active?
    waiting = PlayerStatus.objects.filter(looking_for_opponent=True)
    waiting = list(waiting.order_by('score'))
    active = list(PlayerMatch.objects.all().order_by('match'))
    make_matches(waiting)
    run_game(active)
