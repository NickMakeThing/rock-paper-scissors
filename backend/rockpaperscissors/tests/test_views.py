import pytest
from rockpaperscissors.views import CreatePlayerView, SendPlayerDataView, PlayerStats
from rockpaperscissors.models import PlayerStatus
from rest_framework.test import APIRequestFactory
from django.urls import reverse
import json 

@pytest.mark.django_db
def test_create_player():
    request = APIRequestFactory().post(
        '/create/' 
    )
    view = CreatePlayerView.as_view()
    response = view(request)
    view(request)
    player = PlayerStatus.objects.first()
    player2 = PlayerStatus.objects.last()
    assert (200 <= response.status_code <= 299) 
    assert player.name == 'guest-1'
    assert player2.name == 'guest-'+str(player.id+1)
    assert player.cookie != player2.cookie
    assert response.data['cookie'] == player.cookie
    assert response.data['name'] == 'guest-1'

@pytest.mark.django_db
def test_send_player_data_view():
    def get_request(url):
        request = APIRequestFactory().get(url)
        view = SendPlayerDataView.as_view()
        response = view(request)
        return response
    
    def test_full_page(response,player_stats):
        assert (200 <= response.status_code <= 299) 
        assert len(player_stats) == 20
        score_of_last_player = 9999999
        for i in player_stats:
            assert i['score'] < score_of_last_player
            assert i['wins'] > 0 or i['losses'] > 0
            score_of_last_player = i['score']
        return response

    players = []
    score=100
    for i in range(100):
        if i%2 == 1:
            players.append(PlayerStatus(name=i))
            continue
        players.append(PlayerStatus(name=i,wins=1,score=score+i))
    PlayerStatus.objects.bulk_create(players)

    response = get_request('/ranks/?page=1')
    player_stats = dict(response.data)['results']
    player_stats = [dict(i) for i in player_stats]
    test_full_page(response,player_stats)
    first_page = player_stats

    response = get_request('/ranks/?page=2')
    player_stats = dict(response.data)['results']
    player_stats = [dict(i) for i in player_stats]
    test_full_page(response,player_stats)
    assert player_stats != first_page

    response = get_request('/ranks/?page=3')
    player_stats = dict(response.data)['results']
    player_stats = [dict(i) for i in player_stats]
    assert len(player_stats) == 10

@pytest.mark.django_db
def test_player_stats():
    PlayerStatus.objects.create(name='bob',score=110,wins=12,losses=5)
    PlayerStatus.objects.bulk_create([PlayerStatus(name=i) for i in range(25)])
    request = APIRequestFactory().get('/player/bob')
    view = SendPlayerDataView.as_view()
    response = view(request)
    assert (200 <= response.status_code <= 299) 
    player = dict(response.data)['results'][0]
    player = dict(player)
    assert player['name'] == 'bob'
    assert player['score'] == 110
    assert player['wins'] == 12
    assert player['losses'] == 5
