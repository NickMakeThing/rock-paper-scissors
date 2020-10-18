from rest_framework import serializers
from .models import PlayerStatus

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:    
        model=PlayerStatus
        fields = ('name','cookie')

class PlayerDataSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=21)
    score = serializers.IntegerField(default=100)
    wins = serializers.IntegerField(default=0)
    losses = serializers.IntegerField(default=0)