from django.core.management.base import BaseCommand, CommandParser
from nba_api.stats.endpoints import playercareerstats, playergamelog, playergamelogs

class Command(BaseCommand):
    
    def add_arguments(self, parser):
        parser.add_argument('player_id', help='player id argument')
        
    def handle(self, *args, **options):
        id = options['player_id']
        
        career = playercareerstats.PlayerCareerStats(player_id=id)
        print(career)