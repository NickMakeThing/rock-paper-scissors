# Generated by Django 3.1.1 on 2020-11-12 12:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rockpaperscissors', '0013_playermatch_round_start_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='playermatch',
            name='round_start_time',
        ),
        migrations.AddField(
            model_name='match',
            name='round_start_time',
            field=models.IntegerField(null=True),
        ),
    ]