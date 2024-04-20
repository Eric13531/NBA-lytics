from django.urls import path
from . import views

urlpatterns = [
    path('get_player_id/', views.get_player_id, name='get_player_id'),
    path('get_player_info_from_id/', views.get_player_info_from_id, name='get_player_info_from_id'),
    path('get_player_search_results/', views.get_player_search_results, name='get_player_search_results'),
    path('get_all_player_game_stats/', views.get_all_player_game_stats, name='get_all_player_game_stats'),
    path('get_player_career_averages/', views.get_player_career_averages, name='get_player_career_averages'),
    path('get_team_search_results/', views.get_team_search_results, name='get_team_search_results'),
    path('get_team_id/', views.get_team_id, name='get_team_id'),
    path('get_team_info_from_id/', views.get_team_info_from_id, name='get_team_info_from_id'),
    path('get_all_team_game_stats/', views.get_all_team_game_stats, name='get_all_team_game_stats'),
    path('get_team_career_averages/', views.get_team_career_averages, name='get_team_career_averages'),
    path('get_player_advanced_info_from_id/', views.get_player_advanced_info_from_id, name='get_player_advanced_info_from_id'),
    path('get_team_advanced_info_from_id/', views.get_team_advanced_info_from_id, name='get_team_advanced_info_from_id'),
]