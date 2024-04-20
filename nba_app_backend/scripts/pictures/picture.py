import os
import requests

# Get all player ids from players.txt
def get_ids():
    ids = []
    with open('scripts/pictures/players_list.txt', 'r') as file:
        
        for line in file:
            try:
                id = int(line.strip())
                ids.append(id)
            except ValueError:
                continue
            
    return ids

# Get player headshot from player id
# You must be inside the nba_app_backend directory
def get_picture_from_id(id, dir, fileName=None):
    if not fileName:
        fileName = f"{id}.png"
    
    url = f"https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/{id}.png"
    
    if not os.path.isdir(dir):
        os.mkdir(dir)
        
    resp = requests.get(url, allow_redirects=True)
    if resp.ok:
        open(f"{dir}/{fileName}", 'wb').write(resp.content)
    else:
        print(f"Error: {id} is not a valid player id")

# Get all player headshots from players.txt
def get_all_player_pictures(dir = '../nba_app_frontend/public/player_pictures'):
    ids = get_ids()
    for id in ids:
        get_picture_from_id(id, dir)

# Get all valid player ids from maximum value in players.txt to 
# custom upper limit
def get_player_ids():
    # Eg: set this to the id of most recently joined NBA player
    current_max = 1641713
    
    with open('scripts/pictures/players.txt', 'r') as file:
        from nba_api.stats.static import players
        numbers = [int(line.strip()) for line in file]
        count = 0
        last_number = max(numbers)
        for i in range(last_number + 1, current_max+1):
            count += 1
            if count % 500 == 0:
                print("sending requests...", i)
            if players.find_player_by_id(i) and i not in numbers:
                numbers.append(i)
        print("All sent")
        numbers.sort()
        with open('scripts/pictures/players_new.txt', 'a') as file:
            file.write('\n'.join(map(str, numbers)))

# Filter out incorrect player ids
# (Could tweak this to remove player ids without associated headshot)
def get_player_ids_real():
    # Set this to id of most recently joined NBA player
    current_max = 1641713
    
    with open('scripts/pictures/players_new.txt', 'r') as file:
        from nba_api.stats.static import players
        numbers = [int(line.strip()) for line in file]
        new_numbers = []
        count = 0
        for i in numbers:
            count += 1
            if count % 500 == 0:
                print("sending requests...", i)
            if players.find_player_by_id(i):
                new_numbers.append(i)
            else:
                print(i, " is fake")
        print("All sent")
        new_numbers.sort()
        with open('scripts/pictures/players_list.txt', 'a') as file:
            file.write('\n'.join(map(str, numbers)))