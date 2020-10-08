import pytest
import rockpaperscissors.match_maker as utils
from rockpaperscissors.models import Match, PlayerMatch, PlayerStatus
from django.contrib.auth.models import User

def _get_test_data():
    player_data = [
        ["Matt",100],
        ["Nick",111],
        ["Bob",120],
        ["Joe",135],
        ["Sally",140],
        ["Sam",150]
    ]

    for name, score in player_data:
        PlayerStatus.objects.create(name=name, score=score, looking_for_opponent=True)

    players = PlayerStatus.objects.all()
    players = list(players)

    mappings = {
            players[0]:players[1],
            players[1]:players[2],
            players[2]:players[1],
            players[3]:players[4],
            players[4]:players[3],
            players[5]:players[4]
        }

    matches = [
        [players[2],players[1]],
        [players[4],players[3]],
    ]
    
    player_matches = [
        {'name':'Bob','match':1,'score':0},
        {'name':'Nick','match':1,'score':0},
        {'name':'Sally','match':2,'score':0},
        {'name':'Joe','match':2,'score':0}
    ]

    return {
        'players': players,
        'mappings': mappings,
        'matches': matches,
        'player_matches': player_matches
    }

@pytest.mark.django_db
def test_map_player_to_player_of_closest_score():
    test_data = _get_test_data()
    arg = test_data['players']
    result = test_data['mappings']
    assert utils.map_player_to_player_of_closest_score(arg) == result

@pytest.mark.django_db
def test_match_players_if_they_map_to_eachother():
    test_data = _get_test_data()
    arg = test_data['mappings']
    result = test_data['matches']
    assert utils.match_players_if_they_map_to_eachother(arg) == result 

@pytest.mark.django_db
def test_create_matches():
    test_data = _get_test_data()
    arg = test_data['matches']
    result = test_data['player_matches']
    utils.create_matches(arg)
    player_matches = PlayerMatch.objects.all()
    matches = Match.objects.all()
    assert matches.count() == 2
    assert player_matches.count() == 4
    assert player_matches[0].match == player_matches[1].match
    assert player_matches[2].match == player_matches[3].match
    assert player_matches[1].match != player_matches[2].match
    assert matches[0].name != matches[1].name
    for row,testcase in zip(player_matches,result):
        assert row.player.name == testcase['name']
        assert row.match.id == testcase['match']
        assert row.game_score == testcase['score']

        
        

    

