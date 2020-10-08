from rest_framework import serializers
from .models import PlayerStatus

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:    
        model=PlayerStatus
        fields = ('name','cookie')

