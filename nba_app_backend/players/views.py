from django.shortcuts import render

# Create your views here.

import nba_api
import json
from django.http import JsonResponse
from requests.exceptions import ReadTimeout

from nba_api.stats.endpoints import playercareerstats, playergamelog, playergamelogs, teamgamelogs, teamyearbyyearstats, commonplayerinfo, teamdetails, playerawards
from nba_api.stats.static import players, teams

game_stat_headers = [
    "SEASON_YEAR",
    "PLAYER_ID",
    "PLAYER_NAME",
    "NICKNAME",
    "TEAM_ID",
    "TEAM_ABBREVIATION",
    "TEAM_NAME",
    "GAME_ID",
    "GAME_DATE",
    "MATCHUP",
    "WL",
    "MIN",
    "FGM",
    "FGA",
    "FG_PCT",
    "FG3M",
    "FG3A",
    "FG3_PCT",
    "FTM",
    "FTA",
    "FT_PCT",
    "OREB",
    "DREB",
    "REB",
    "AST",
    "TOV",
    "STL",
    "BLK",
    "BLKA",
    "PF",
    "PFD",
    "PTS",
    "PLUS_MINUS",
    "NBA_FANTASY_PTS",
    "DD2",
    "TD3",
    "WNBA_FANTASY_PTS",
    "GP_RANK",
    "W_RANK",
    "L_RANK",
    "W_PCT_RANK",
    "MIN_RANK",
    "FGM_RANK",
    "FGA_RANK",
    "FG_PCT_RANK",
    "FG3M_RANK",
    "FG3A_RANK",
    "FG3_PCT_RANK",
    "FTM_RANK",
    "FTA_RANK",
    "FT_PCT_RANK",
    "OREB_RANK",
    "DREB_RANK",
    "REB_RANK",
    "AST_RANK",
    "TOV_RANK",
    "STL_RANK",
    "BLK_RANK",
    "BLKA_RANK",
    "PF_RANK",
    "PFD_RANK",
    "PTS_RANK",
    "PLUS_MINUS_RANK",
    "NBA_FANTASY_PTS_RANK",
    "DD2_RANK",
    "TD3_RANK",
    "WNBA_FANTASY_PTS_RANK",
    "AVAILABLE_FLAG",
]


def get_player_id(request):
    if request.method == "GET":
        player_name = request.GET.get("player_name", "")
        print(player_name)
        print(players.find_players_by_first_name(player_name))
        print(players.find_players_by_full_name(player_name))
        if len(players.find_players_by_first_name(player_name)) == 1:
            player_info = players.find_players_by_first_name(player_name)
        elif len(players.find_players_by_full_name(player_name)) == 1:
            player_info = players.find_players_by_full_name(player_name)
        else:
            return JsonResponse({"error": f"Player does not exist"}, status=500)

        print(player_info)
        # assert that only one player returned?
        try:
            player_id = player_info[0]["id"]
            return JsonResponse({"player_id": player_id})
        except Exception as e:
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )


def get_player_search_results(request):
    if request.method == "GET":
        player_name = request.GET.get("player_name", "")
        if len(player_name) < 3:
            player_info = {}
        else:
            player_info = players.find_players_by_full_name(player_name)

        print(player_info)
        # assert that only one player returned?
        try:
            return JsonResponse({"player_info": player_info})
        except Exception as e:
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )

    # [player_name]


def get_player_info_from_id(request):
    if request.method == "GET":
        player_id = request.GET.get("player_id")
        print(player_id)
        print(type(player_id))
        player_info = players.find_player_by_id(int(player_id))
        first_season, last_season = get_first_and_last_season(player_id)
        player_info['first_season'] = first_season
        player_info['last_season'] = last_season
        print(player_info)
        # assert that only one player returned?
        try:
            return JsonResponse({"player_info": player_info})
        except ReadTimeout as e:
            print("API DOWN")
            return JsonResponse(
                {"error": f"The NBA API is under maintenance at the moment. Please try again later"}, status=500
            )
        except Exception as e:
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )
            
def get_player_advanced_info_from_id(request):
    if request.method == "GET":
        player_id = request.GET.get("player_id")
        print(player_id)
        print(type(player_id))
        player_info = commonplayerinfo.CommonPlayerInfo(int(player_id)).get_dict()
        birthdate = player_info['resultSets'][0]['rowSet'][0][7].split('T')[0]
        country = player_info['resultSets'][0]['rowSet'][0][9]
        height = player_info['resultSets'][0]['rowSet'][0][11]
        weight = player_info['resultSets'][0]['rowSet'][0][12]
        height_val = (int(height.split('-')[0])*12 + int(height.split('-')[1]))
        height_cm = int(height_val * 2.54)
        weight_kg = int(int(weight) * 0.453592)
        jersey = player_info['resultSets'][0]['rowSet'][0][14]
        position = player_info['resultSets'][0]['rowSet'][0][15]
        print(player_info['resultSets'][0]['rowSet'][0])
        player_common_info = {'birthdate': birthdate, 'country': country, 'height': height, 'weight': weight, 'height_cm': height_cm, 'weight_kg': weight_kg, 'position': position}
        # assert that only one player returned?
        try:
            return JsonResponse({"player_common_info": player_common_info})
        except ReadTimeout as e:
            print("API DOWN")
            return JsonResponse(
                {"error": f"The NBA API is under maintenance at the moment. Please try again later"}, status=500
            )
        except Exception as e:
            print(e)
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )
            
def get_team_advanced_info_from_id(request):
    from .constants import nba_teams
    if request.method == "GET":
        team_id = request.GET.get("team_id")
        print(team_id)
        print(type(team_id))
        team_info = teams.find_team_name_by_id(int(team_id))
        team_advanced_info = teamdetails.TeamDetails(int(team_id)).get_dict()
        
        year_founded = team_advanced_info['resultSets'][0]['rowSet'][0][3]
        print(team_advanced_info['resultSets'][0]['rowSet'][0])
        first_season, last_season = get_first_and_last_season_teams(team_id)
        
        championships = len(team_advanced_info['resultSets'][3]['rowSet'])
        print(nba_teams[team_info['full_name'].lower()])
        conference = nba_teams[team_info['full_name'].lower()]['conference']
        division = nba_teams[team_info['full_name'].lower()]['division'].capitalize()
        city = team_info['city']
        state = team_info['state']
        abb = team_info['abbreviation']
        team_common_info = {'championships': championships, 'first_season': first_season, 'conference': conference, 'division': division, 'city':city , 'state': state, 'abb': abb}
        # assert that only one team returned?
        try:
            return JsonResponse({"team_common_info": team_common_info})
        except ReadTimeout as e:
            print("API DOWN")
            return JsonResponse(
                {"error": f"The NBA API is under maintenance at the moment. Please try again later"}, status=500
            )
        except Exception as e:
            print(e)
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )


def get_team_id(request):
    if request.method == "GET":
        team_name = request.GET.get("team_name", "")
        print(team_name)
        if len(teams.find_teams_by_full_name(team_name)) == 1:
            team_info = teams.find_teams_by_full_name(team_name)
        else:
            return JsonResponse({"error": f"Team does not exist"}, status=500)

        print(team_info)
        # assert that only one player returned?
        try:
            team_id = team_info[0]["id"]
            return JsonResponse({"team_id": team_id})
        except Exception as e:
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )
    
def get_team_search_results(request):
    if request.method == "GET":
        team_name = request.GET.get("team_name", "")
        if len(team_name) < 1:
            team_info = {}
        else:
            team_info = teams.find_teams_by_full_name(team_name)

        print(team_info)
        # assert that only one team returned?
        try:
            return JsonResponse({"team_info": team_info})
        except Exception as e:
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )

    # [player_name]


def get_team_info_from_id(request):
    if request.method == "GET":
        team_id = request.GET.get("team_id")
        print(team_id)
        print(type(team_id))
        team_info = teams.find_team_name_by_id(int(team_id))
        first_season, last_season = get_first_and_last_season_teams(team_id)
        team_info['first_season'] = first_season
        team_info['last_season'] = last_season
        print(team_info)
        # assert that only one team returned?
        try:
            return JsonResponse({"team_info": team_info})
        except ReadTimeout as e:
            print("API DOWN")
            return JsonResponse(
                {"error": f"The NBA API is under maintenance at the moment. Please try again later"}, status=500
            )
        except Exception as e:
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )


def get_all_player_game_stats(request):
    if request.method == "GET":
        try:
            player_id = request.GET.get("player_id")
            season = request.GET.get("season")
            season = int(season)
            first_season, last_season = get_first_and_last_season(player_id)
            print(first_season, last_season)
            start_year = int(first_season.split("-")[0])
            end_year = int(last_season.split("-")[0])
            if season < start_year or season > end_year + 1:
                print(season)
                return JsonResponse(
                    {"error": f"Invalid year: {season}"}, status=500
                )
            player_game_stats = {"headers": game_stat_headers, "headers_playoffs": game_stat_headers, "game_stats": [], "game_stats_playoffs": []}
            # print(game_stat_headers)
            # print("START GET")
            # for year in range(start_year, start_year + 1):
            year = season
            year_query = str(year) + "-" + ('0' if (year + 1) % 100 < 10 else '') + str((year + 1) % 100)
            print(year_query + ", ", end="")

            stats = playergamelogs.PlayerGameLogs(
                player_id_nullable=player_id,
                season_nullable=year_query,
                season_type_nullable="Regular Season",
            )
            playoff_stats = playergamelogs.PlayerGameLogs(
                player_id_nullable=player_id,
                season_nullable=year_query,
                season_type_nullable="Playoffs",
            )
            # print("HELP", type(stats.get_dict()['resultSets'][0]['rowSet']))
            player_game_stats['game_stats_playoffs'].extend(playoff_stats.get_dict()['resultSets'][0]['rowSet'])
            player_game_stats['game_stats'].extend(stats.get_dict()['resultSets'][0]['rowSet'])
            
            player_game_stats['headers'] = stats.get_dict()['resultSets'][0]['headers']
            player_game_stats['headers_playoffs'] = playoff_stats.get_dict()['resultSets'][0]['headers']
            
            print(playoff_stats.get_dict()['resultSets'][0]['headers'])
            
            if len(stats.get_dict()['resultSets'][0]['rowSet']) == 0:
                print("Player played no games this season?")
            else:
                print("Compare: ", len(playoff_stats.get_dict()['resultSets'][0]['headers']), len(stats.get_dict()['resultSets'][0]['rowSet'][0]))
                
            print("RETURN DETAILS")
            return JsonResponse({"player_game_stats": player_game_stats})
        except ReadTimeout as e:
            print("API DOWN")
            return JsonResponse(
                {"error": f"We couldn't process the request. Please reload or try again later"}, status=500
            )
        except Exception as e:
            # print("ERROR HERE", e)
            # print(e)
            import traceback
            print("ERROR HERE:", repr(e))
            traceback.print_exc()
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )
            
def get_all_team_game_stats(request):
    if request.method == "GET":
        try:
            team_id = request.GET.get("team_id")
            season = request.GET.get("season")
            season = int(season)
            first_season, last_season = get_first_and_last_season_teams(team_id)
            print(first_season, last_season)
            start_year = int(first_season.split("-")[0])
            end_year = int(last_season.split("-")[0])
            if season < start_year or season > end_year + 1:
                print(season)
                return JsonResponse(
                    {"error": f"Invalid year: {season}"}, status=500
                )
            team_game_stats = {"headers": game_stat_headers, "headers_playoffs": game_stat_headers, "game_stats": [], "game_stats_playoffs": []}
            # print(game_stat_headers)
            # print("START GET")
            # for year in range(start_year, start_year + 1):
            year = season
            year_query = str(year) + "-" + ('0' if (year + 1) % 100 < 10 else '') + str((year + 1) % 100)
            print(year_query + ", ", end="")

            stats = teamgamelogs.TeamGameLogs(
                team_id_nullable=team_id,
                season_nullable=year_query,
                season_type_nullable="Regular Season",
            )
            playoff_stats = teamgamelogs.TeamGameLogs(
                team_id_nullable=team_id,
                season_nullable=year_query,
                season_type_nullable="Playoffs",
            )
            # print("HELP", type(stats.get_dict()['resultSets'][0]['rowSet']))
            team_game_stats['game_stats_playoffs'].extend(playoff_stats.get_dict()['resultSets'][0]['rowSet'])
            team_game_stats['game_stats'].extend(stats.get_dict()['resultSets'][0]['rowSet'])
            
            team_game_stats['headers'] = stats.get_dict()['resultSets'][0]['headers']
            team_game_stats['headers_playoffs'] = playoff_stats.get_dict()['resultSets'][0]['headers']
            
            print("TEAM GAME STATS HEADERS", playoff_stats.get_dict()['resultSets'][0]['headers'])
            
            if len(stats.get_dict()['resultSets'][0]['rowSet']) == 0:
                print("Team played no games this season?")
            else:
                print("Compare: ", len(playoff_stats.get_dict()['resultSets'][0]['headers']), len(stats.get_dict()['resultSets'][0]['rowSet'][0]))
                
            print("RETURN DETAILS")
            return JsonResponse({"team_game_stats": team_game_stats})
        except ReadTimeout as e:
            print("API DOWN")
            return JsonResponse(
                {"error": f"We couldn't process the request. Please reload or try again later"}, status=500
            )
        except Exception as e:
            # print("ERROR HERE", e)
            # print(e)
            import traceback
            print("ERROR HERE:", repr(e))
            traceback.print_exc()
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )


def get_first_and_last_season(player_id):
    career = playercareerstats.PlayerCareerStats(player_id=player_id)
    # player = players.find_player_by_id(player_id=id)

    all_data = career.get_dict()
    seasons = [row[1] for row in all_data["resultSets"][0]["rowSet"]]
    # seasons = json.loads(all_data)["resultSets"][0]["rowSet"]
    # print("seasons:", seasons)
    return (seasons[0], seasons[-1])

def get_first_and_last_season_teams(team_id):
    history = teamyearbyyearstats.TeamYearByYearStats(team_id=team_id, per_mode_simple='PerGame')
    # player = players.find_player_by_id(player_id=id)

    all_data = history.get_dict()
    seasons = [row[3] for row in all_data["resultSets"][0]["rowSet"]]
    # seasons = json.loads(all_data)["resultSets"][0]["rowSet"]
    # print("seasons:", seasons)
    return (seasons[0], seasons[-1])


def get_player_career_averages(request):
    if request.method == "GET":
        try:
            player_id = request.GET.get("player_id")
            player_career_stats = {"headers": game_stat_headers, "headers_playoffs": game_stat_headers, "career_stats": [], "career_stats_playoffs": []}

            career = playercareerstats.PlayerCareerStats(player_id=player_id, per_mode36='PerGame')
            regular_season_career = career.get_dict()['resultSets'][0]
            playoff_career = career.get_dict()['resultSets'][0]
            
            player_career_stats['headers'] = regular_season_career['headers']
            player_career_stats['headers_playoffs'] = playoff_career['headers']
            player_career_stats['career_stats'] = regular_season_career['rowSet']
            player_career_stats['career_stats_playoffs'] = playoff_career['rowSet']
            
            print("RETURN DETAILS")
            print(regular_season_career['headers'])
            return JsonResponse({"player_career_stats": player_career_stats})
        except ReadTimeout as e:
            print("API DOWN")
            return JsonResponse(
                {"error": f"We couldn't process the request. Please reload or try again later"}, status=500
            )
        except Exception as e:
            # print("ERROR HERE", e)
            # print(e)
            import traceback
            print("ERROR HERE:", repr(e))
            traceback.print_exc()
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )
            
def get_team_career_averages(request):
    if request.method == "GET":
        try:
            team_id = request.GET.get("team_id")
            team_career_stats = {"headers": game_stat_headers, "headers_playoffs": game_stat_headers, "career_stats": [], "career_stats_playoffs": []}

            career = teamyearbyyearstats.TeamYearByYearStats(team_id=team_id, per_mode_simple='PerGame')
            regular_season_career = career.get_dict()['resultSets'][0]
            playoff_career = career.get_dict()['resultSets'][0]
            
            team_career_stats['headers'] = regular_season_career['headers']
            team_career_stats['headers_playoffs'] = playoff_career['headers']
            team_career_stats['career_stats'] = regular_season_career['rowSet']
            team_career_stats['career_stats_playoffs'] = playoff_career['rowSet']
            
            print("RETURN DETAILS")
            print("TEAM CAREER HEADERS", regular_season_career['headers'])
            return JsonResponse({"team_career_stats": team_career_stats})
        except ReadTimeout as e:
            print("API DOWN")
            return JsonResponse(
                {"error": f"We couldn't process the request. Please reload or try again later"}, status=500
            )
        except Exception as e:
            # print("ERROR HERE", e)
            # print(e)
            import traceback
            print("ERROR HERE:", repr(e))
            traceback.print_exc()
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )
            
def get_player_awards(request):
    if request.method == "GET":
        try:
            player_id = request.GET.get("player_id")
            
            player_awards = playerawards.PlayerAwards(player_id=player_id).get_dict()['resultSets'][0]
            award_set = {'All-Defensive Team': [],
                'All-NBA': [],
                'All-Rookie Team': [],
                'Hall of Fame Inductee': [],
                'IBM Award': [],
                'NBA All-Star Most Valuable Player': [],
                'NBA Defensive Player of the Year': [],
                'NBA Finals Most Valuable Player': [],
                'NBA Most Valuable Player': [],
                'NBA Player of the Month': [],
                'NBA Player of the Week': [],
                'NBA Rookie of the Month': [],
                'NBA Rookie of the Year': [],
                'NBA Sporting News Most Valuable Player of the Year': [],
                'NBA Sporting News Rookie of the Year': [],
                'Olympic Gold Medal': []}

            for row in player_awards['rowSet']:
                
                if row[4] in award_set:
                    award_set[row[4]].append(row[6])
            
            print("AWARDS: ", award_set)
            # print("AWARDS: ", player_awards['rowSet'][0])
            return JsonResponse({"award_set": award_set})
        except ReadTimeout as e:
            print("API DOWN")
            return JsonResponse(
                {"error": f"We couldn't process the request. Please reload or try again later"}, status=500
            )
        except Exception as e:
            import traceback
            print("ERROR HERE:", repr(e))
            traceback.print_exc()
            return JsonResponse(
                {"error": f"Failed to fetch search results: {e}"}, status=500
            )