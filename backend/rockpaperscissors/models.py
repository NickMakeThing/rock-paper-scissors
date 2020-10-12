from django.db import models
from django.contrib.auth.models import User

MOVE_CHOICES = (
    ('r','rock'),
    ('p','paper'),
    ('s','scissors')    
)

class PlayerStatus(models.Model):
    name = models.CharField(unique=True, max_length=21)
    score = models.IntegerField(default=100)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    looking_for_opponent = models.BooleanField(default=False)
    cookie = models.CharField(max_length=32)
    
    def __str__(self):
        return '%s' % (self.name)

class Match(models.Model): 
    name = models.CharField(max_length=32)

class PlayerMatch(models.Model):
    player = models.ForeignKey(PlayerStatus, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    move = models.CharField(max_length=1,choices=MOVE_CHOICES ,null=True)
    game_score = models.IntegerField(default=0)




