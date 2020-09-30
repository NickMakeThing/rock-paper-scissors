from django.db import models
from django.contrib.auth.models import User

class PlayerStatus(models.Model):
    user = models.OneToOneField(User, unique=True,on_delete=models.CASCADE)
    score = models.IntegerField(default=100)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    looking_for_opponent = models.BooleanField(default=False)
    
    def __str__(self):
        return '%s' % (self.user)

class Match(models.Model): #can merge with PlayerMatch
    name = models.CharField(max_length=25)
    #name is hash using both usernames and salt
    #used in url sent to both players
    #also 

class PlayerMatch(models.Model):
    MOVE_CHOICES = [
        ('r','rock'),
        ('p','paper'),
        ('s','scissors')    
    ] 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    move = models.CharField(max_length=1,choices=MOVE_CHOICES ,null=True)
    game_score = models.IntegerField(default=0)




