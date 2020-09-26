import pytest
import rockpaperscissors.match_maker_utils as utils
from rockpaperscissors.models import Match, PlayerMatch, PlayerStatus

@pytest.mark.django_db
def test_map_player_to_player_of_closest_score():
    pass

@pytest.mark.django_db
def test_match_players_if_they_map_to_eachother():
    pass

@pytest.mark.django_db
def test_create_matches():
    pass

@pytest.mark.django_db
def test_data():
    test_data = [
        {"user": "Matt", "score":100,"looking_for_opponent": True},
        {"user": "Nick", "score":111,"looking_for_opponent": True},
        {"user": "Bob", "score":120,"looking_for_opponent": True},
        {"user": "Joe", "score":135,"looking_for_opponent": True},
        {"user": "Sally", "score":140,"looking_for_opponent": True},
        {"user": "Sam", "score":150,"looking_for_opponent": True},
    ]

    PlayerStatus.objects.bulk_create(test_data)

    data = PlayerStatus.objects.all()
    print(data)
