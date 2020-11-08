import pytest
from rockpaperscissors.views import CreatePlayerView, SendPlayerDataView, PlayerStats
from rockpaperscissors.models import PlayerStatus
from rest_framework.test import APIRequestFactory
from django.urls import reverse
import json 

@pytest.mark.django_db
def create_users(num):
    request = APIRequestFactory().post(
        '/create/' 
    )
    view = CreatePlayerView.as_view()
    for i in range(num):
        view(request)

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
    assert player2.name == 'guest-2'
    assert player.cookie != player2.cookie
    assert response.data['cookie'] == player.cookie
    assert response.data['name'] == 'guest-1'

@pytest.mark.django_db
def test_send_player_data_view():
    create_users(5)
    player = PlayerStatus.objects.all()

    request = APIRequestFactory().get(
        '/ranks/?page=1'
    )
    view = SendPlayerDataView.as_view()
    response = view(request)
    assert (200 <= response.status_code <= 299) 





