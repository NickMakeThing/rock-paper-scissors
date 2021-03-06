# Generated by Django 3.1.1 on 2020-10-03 18:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rockpaperscissors', '0006_playermatch_move'),
    ]

    operations = [
        migrations.AddField(
            model_name='playerstatus',
            name='cookie',
            field=models.CharField(default=0, max_length=32),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='playermatch',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rockpaperscissors.playerstatus'),
        ),
        migrations.AlterField(
            model_name='playerstatus',
            name='user',
            field=models.CharField(max_length=21, unique=True),
        ),
    ]
