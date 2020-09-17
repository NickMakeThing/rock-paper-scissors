from rest_framework import serializers
from .models import PlayerStatus

class MatchMakingSerializer(serializers.ModelSerializer):
    class Meta:    
        model=PlayerStatus
        fields = ('user', 'looking_for_opponent')
