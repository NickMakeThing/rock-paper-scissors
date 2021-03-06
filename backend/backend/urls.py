from django.urls import path, include
from rest_framework import routers
from rockpaperscissors import views

urlpatterns = [
    path('', views.Index.as_view()),
    path('player/<str:name>/',views.PlayerStats.as_view(), name='player'),
    path('ranks/',views.RankDataView.as_view(), name='ranks'),
    path('create/',views.CreatePlayerView.as_view(), name='create')
]
