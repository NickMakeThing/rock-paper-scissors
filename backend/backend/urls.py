from django.urls import path, include
from rest_framework import routers
from rockpaperscissors import views

urlpatterns = [
    path('', views.Index.as_view()),
    path('create/',views.CreatePlayerView.as_view(), name='create')
]
