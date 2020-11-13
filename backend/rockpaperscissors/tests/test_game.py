import pytest
import channels.layers as layers
import rockpaperscissors.game as game
from rockpaperscissors.models import Match, PlayerMatch, PlayerStatus
from channels.testing import WebsocketCommunicator
from rockpaperscissors.consumers import GameUpdateConsumer
from asgiref.sync import sync_to_async, async_to_sync
from channels.db import database_sync_to_async as db_async
from time import sleep

def make_data(name1,name2,match='dsfgfdgfd'):
    match = Match.objects.create(name=match)    
    player1 = PlayerStatus.objects.create(name=name1)
    player2 = PlayerStatus.objects.create(name=name2)
    player1 = PlayerMatch.objects.create(player=player1, match=match)
    player2 = PlayerMatch.objects.create(player=player2, match=match)
    return {'player1':player1,'player2':player2,'match':match}

@pytest.mark.django_db
def test_decide_winner():
    data = make_data('bob','greg')
    bob = data['player1']
    greg = data['player2']
    bob.move = 'r'; greg.move = 's'
    assert game.decide_winner(bob,greg) == game.decide_winner(greg,bob) == bob
    bob.move = 'p'; greg.move = 's'
    assert game.decide_winner(bob,greg) == game.decide_winner(greg,bob) == greg
    bob.move = 'p'; greg.move = 'r'
    assert game.decide_winner(bob,greg) == game.decide_winner(greg,bob) == bob
    for i in ['r','p','s']:
        bob.move = i
        greg.move = i
        assert game.decide_winner(bob,greg) == None

@pytest.mark.django_db
def test_get_score_change():
    assert game.get_score_change(1000,100) < game.get_score_change(100,1000)
    assert game.get_score_change(110,100) < game.get_score_change(100,100) < game.get_score_change(100,110)
    assert game.get_score_change(0,300) == 40 == game.get_score_change(-300,300)
    assert game.get_score_change(300,0) == 2 == game.get_score_change(300,-300)

@pytest.mark.django_db    
def test_complete_round():
    data = make_data('bob','greg')
    bob = data['player1']
    greg = data['player2'] 
    bob.move = 'r'; bob.save()
    greg.move = 's'; greg.save()
    bob = PlayerMatch.objects.get(player=bob.player)
    greg = PlayerMatch.objects.get(player=greg.player)
    assert bob.move == 'r' and greg.move == 's'
    game.complete_round(bob,greg)
    bob = PlayerMatch.objects.get(player=bob.player)
    greg = PlayerMatch.objects.get(player=greg.player)
    assert bob.game_score == 1 and greg.game_score == 0
    assert bob.move == greg.move == None   

@pytest.mark.django_db
def test_timer():
    data = make_data('bob','greg')
    timer = game.Timer(data['match'])
    sleep(1)
    timer.add_time()
    assert timer.round_time > 1 and timer.round_time < 1.1
    assert timer.timeout_time > 1 and timer.timeout_time < 1.1
    timer.reset()
    assert timer.round_time == timer.timeout_time == 0
    assert timer.game_finished == False
    timer.missed_round = 2
    timer.start_time -= 60
    timer.add_time()
    assert timer.round_time < 1
    assert timer.timeout_time > 60
    timer.stop()
    assert timer.game_finished == True

@pytest.mark.django_db
def test_complete_game():
    data = make_data('bob','greg')
    bob_match = data['player1']
    greg_match = data['player2']
    timer = game.Timer(data['match'])
    bob = bob_match.player
    greg = greg_match.player
    assert timer.game_finished == False
    assert greg.wins == greg.losses == bob.wins == bob.losses == 0
    assert bob.score == greg.score == 100
    game.complete_game(bob_match,greg_match,timer)
    bob = PlayerStatus.objects.get(name=bob.name)
    greg = PlayerStatus.objects.get(name=greg.name)
    assert timer.game_finished == True
    assert bob.wins == 1 and bob.losses == 0
    assert greg.wins == 0 and greg.losses == 1
    assert greg.score == 90
    assert bob.score == 110

@pytest.mark.django_db
def test_game_round():
    data = make_data('bob','greg')
    bob = data['player1']
    greg = data['player2']
    match = data['match']
    timer = game.Timer(match)
    assert bob.game_score == 0
    assert Match.objects.filter(name=match.name).exists() == True
    sleep(1)
    game.game_round(bob,greg,timer)
    assert timer.round_time > 1 and timer.timeout_time > 1
    for i in range(3):
        bob.move = 'r'; bob.save()
        greg.move = 's'; greg.save()
        game.game_round(bob,greg,timer)
        bob = PlayerMatch.objects.filter(player=bob.player)
        if i == 0:
            bob = bob.first()
            assert bob.game_score == 1
            assert bob.move == None
        if i == 1:
            bob = bob.first()
            assert bob.game_score == 2
        if i == 2:
            assert bob.exists() == False
            assert PlayerStatus.objects.get(name='bob').wins == 1
            assert Match.objects.filter(name=match.name).exists() == False
    PlayerStatus.objects.all().delete()
    timer = game.Timer('match')
    data = make_data('bob','greg')
    bob = data['player1']
    greg = data['player2']
    match = data['match']
    timer = game.Timer(match)
    timer.round_time = 31
    bob.move = 'r'; bob.save()
    game.game_round(bob,greg,timer)
    assert bob.game_score == 1
    assert timer.round_time < timer.timeout_time
    timer.timeout_time = 91
    game.game_round(bob,greg,timer)
    assert Match.objects.filter(name=match.name).exists() == False

@pytest.mark.django_db
def test_send_to_channel_layer(): #may need to redo to call function directly
    data = make_data('bob','greg')
    bob = data['player1']
    greg = data['player2']
    match = data['match']
    timer=game.Timer(match)
    channel_layer = layers.get_channel_layer()
    async_to_sync(channel_layer.flush)()
    async_to_sync(channel_layer.group_add)(
        match.name,
        'test_channel'
    )
    for i in range(3):
        bob = PlayerMatch.objects.get(player=bob.player)
        bob.move = 'r'; bob.save()
        greg.move = 's'; greg.save()
        game.game_round(bob,greg,timer)
        response = async_to_sync(channel_layer.receive)('test_channel')
        if 'time' in response['message']:
            response = async_to_sync(channel_layer.receive)('test_channel')
        message = response['message']
        if i == 0:
            assert message['winner']['name'] == 'bob'
            assert message['winner']['game_score'] == 1
            assert message['loser']['name'] == 'greg'
            assert message['loser']['game_score'] == 0
            assert message['game_finished'] == None
        if i == 2:
            assert message['winner']['name'] == 'bob'
            assert message['winner']['game_score'] == 3
            assert message['loser']['name'] == 'greg'
            assert message['loser']['game_score'] == 0
            assert message['game_finished'] == 10

@pytest.mark.django_db           
def test_run_game():
    player_matches = [
        ['bob','greg','1'],
        ['joe','sam','2'],
        ['alex','mister','3'],
        ['jack','jill','4'],
        ['rufus','rover','5'],
    ]
    for player1,player2,match in player_matches:
        data = make_data(player1,player2,match)
        player1 = data['player1']
        player2 = data['player2']
        player1.move = 'r'; player1.save()
        player2.move = 's'; player2.save()
    players = list(PlayerMatch.objects.all().order_by('match'))
    timers = {}
    game.run_game(players,timers)
    assert len(timers) == 5
    players = list(PlayerMatch.objects.all().order_by('match'))
    for i in players:
        if players.index(i)%2 == 0:
            assert i.game_score == 1
            i.move = 'r'
        else:
            assert i.game_score == 0
            i.move = 's'
    game.run_game(players,timers)
    players = list(PlayerMatch.objects.all().order_by('match'))
    for i in players:
        if players.index(i)%2 == 0:
            i.move = 'r'
        else:
            i.move = 's'
    game.run_game(players,timers)
    assert len(timers) == 0
    # PlayerStatus.objects.all().delete()
    # Match.objects.all().delete()
    # data = make_data('bob','greg')
    # match = Match.objects.create(name='wrong_match')
    # player1 = data['player1']
    # player2 = data['player2']
    # player1.match = match; player1.save()
    # game.run_game([player1,player2],timers)


    

