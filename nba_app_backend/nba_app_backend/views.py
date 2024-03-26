import nba_api
from django.http import JsonResponse

from nba_api.stats.endpoints import playercareerstats, playergamelog, playergamelogs


def get_person_info(request, player_id):

    career = playercareerstats.PlayerCareerStats(player_id='203999') 
