from flask import render_template
from flask import request
from flask import make_response         
        
from app.main import bp  # noqa
from app.models.job import Job 

import json

global player_dict
         
@bp.route('/')
def index():
    """Main page route."""
    button_text = "Add Job"
    return render_template('main.html', button_text=button_text)
         
         
@bp.route('/add_job')
def add_job():
    """Adds job4 to the database."""
    new_job = Job(name='job4')
    new_job.insert()                                                                                                                                                         
    return ('', 204)


@bp.route('/score_sheet', methods=['POST'])
def get_score_sheet():
    player_dict = request.get_data().decode('utf8').replace("'", '"')
    player_dict = json.loads(player_dict)
    print(player_dict)

    resp = make_response()
    resp.set_cookie("player_dict", json.dumps(player_dict))

    return resp


@bp.route('/score_sheet', methods=['GET'])
def score_sheet():
    player_dict = request.cookies.get("player_dict")
    print("In get route")
    print(player_dict)
    return render_template('scoresheet.html', player_dict=player_dict)


@bp.route('/refresh_players', methods=['GET'])
def refresh_players():
    resp = make_response()
    resp.set_cookie("player_dict", json.dumps({}))
    
    return resp


@bp.route('/update_game', methods=['POST'])
def update_game():
    scores = request.get_data().decode('utf8').replace("'", '"')
    scores = json.loads(scores)
    game_id = int(request.cookies.get("game_id"))

    with open('database/game_'+str(game_id)+'.txt', 'w') as outfile:
        json.dump(scores, outfile)

    # with open('database/config.json', 'w') as outfile:
    #     json.dump({"game_id": game_id}, outfile)

    return ('', 200)


@bp.route('/save_game', methods=['POST'])
def save_game():
    game_id = int(request.cookies.get("game_id"))

    with open('database/config.json', 'w') as outfile:
        json.dump({"game_id": game_id}, outfile)

    return ('', 200)


@bp.route('/create_game', methods=['POST'])
def create_game():
    data = ""
    
    resp = make_response()
    with open('database/config.json', 'r') as infile:
        data = json.load(infile)
    print(data['game_id']+1)
    resp.set_cookie("game_id", str(data["game_id"]+1))
    return resp