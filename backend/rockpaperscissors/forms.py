from django import forms
from .models import MOVE_CHOICES

class MoveForm(forms.Form):
    move = forms.ChoiceField(choices=MOVE_CHOICES)
