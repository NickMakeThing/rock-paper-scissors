import pytest
from rockpaperscissors.views import CreatePlayerView
from rockpaperscissors.models import PlayerStatus
from rest_framework.test import APIRequestFactory
from django.urls import reverse
import json 

@pytest.mark.django_db
def test_create_player():
    path = reverse('create')
    request = APIRequestFactory().post(
        '/create/', 
        json.dumps({'name': 'bob'}), 
        content_type='application/json'
    )
    view = CreatePlayerView.as_view()
    response = view(request)
    player = PlayerStatus.objects.first()
    assert (200 <= response.status_code <= 299) 
    assert player.name == 'bob'
    print("\nCOOKIE: ",player.cookie)

