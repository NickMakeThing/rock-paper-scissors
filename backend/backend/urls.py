from django.urls import path, include
from rest_framework import routers
from rockpaperscissors import views

urlpatterns = [
    path('', views.Test.as_view()),
    path('find/<int:pk>', views.FindOpponent.as_view())
   # path('^find/(?P<user>.+)', views.FindOpponent.as_view()) why this not work?
]
