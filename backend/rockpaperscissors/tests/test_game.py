import pytest
import rockpaperscissors.game as game
from rockpaperscissors.models import Match, PlayerMatch, PlayerStatus

def make_data(name1,name2):
    match = Match.objects.create(name='dsfgfdgfd')    
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
        assert game.decide_winner(bob,greg) == 'draw'

@pytest.mark.django_db
def test_change_rating():
    assert game.get_score_change(1000,100) < game.get_score_change(100,1000)
    assert game.get_score_change(110,100) < game.get_score_change(100,100) < game.get_score_change(100,110)
    assert game.get_score_change(0,300) == 40 == game.get_score_change(-300,300)
    assert game.get_score_change(300,0) == 2 == game.get_score_change(300,-300)

@pytest.mark.django_db
def test_send_to_channel_layer():
    pass
    #check with complete round and complete game

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
def test_complete_game():
    data = make_data('bob','greg')
    bob_match = data['player1']
    greg_match = data['player2']
    bob = bob_match.player
    greg = greg_match.player
    assert greg.wins == greg.losses == bob.wins == bob.losses == 0
    assert bob.score == greg.score == 100
    game.complete_game(bob_match,greg_match)
    bob = PlayerStatus.objects.get(name=bob.name)
    greg = PlayerStatus.objects.get(name=greg.name)
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
    assert bob.game_score == 0
    assert Match.objects.filter(name=match.name).exists() == True
    for i in range(1,4):
        bob.move = 'r'; bob.save()
        greg.move = 's'; greg.save()
        game.game_round(bob,greg)
        bob = PlayerMatch.objects.filter(player=bob.player)
        if i == 1:
            bob = bob.first()
            assert bob.game_score == 1
            assert bob.move == None
        if i == 2:
            bob = bob.first()
            assert bob.game_score == 2
        if i == 3:
            assert bob.exists() == False
            assert PlayerStatus.objects.get(name='bob').wins == 1
            assert Match.objects.filter(name=match.name).exists() == False

          
@pytest.mark.django_db           
def test_run_game():
    pass   
                
