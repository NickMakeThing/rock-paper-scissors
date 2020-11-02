import os
from time import sleep 
from django import setup
from django.db import transaction
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
setup()

from rockpaperscissors.models import PlayerStatus, PlayerMatch
from rockpaperscissors.match_maker import make_matches
from rockpaperscissors.game import run_game

timers = {}

while(True):
    sleep(2)
    with transaction.atomic():
        waiting = PlayerStatus.objects.filter(looking_for_opponent=True)
        waiting = list(waiting.order_by('score'))
        active = list(PlayerMatch.objects.all().order_by('match').select_related('player','match'))
    make_matches(waiting)
    run_game(active,timers)

