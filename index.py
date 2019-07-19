""" index file for REST APIs using Flask """
import os
import sys
import requests
from flask import jsonify, request, make_response, send_from_directory

ROOT_PATH = os.path.dirname(os.path.realpath(__file__))
os.environ.update({'ROOT_PATH': ROOT_PATH})
sys.path.append(os.path.join(ROOT_PATH, 'modules'))

# import logger
from app import app

# Create a logger object to log the info and debug
# LOG = logger.get_root_logger(os.environ.get(
#     'ROOT_LOGGER', 'root'), filename=os.path.join(ROOT_PATH, 'output.log'))

# Port variable to run the server on.
PORT = 5000


@app.errorhandler(404)
def not_found(error):
    """ error handler """
    print(error)
    # return make_response(jsonify({'error': 'Not found'}), 404)
    return send_from_directory('dist', '404.html')


@app.route('/')
def index():
    """ static files serve """
    return send_from_directory('dist', 'index.html')


@app.route('/<path:path>')
def static_proxy(path):
    """ static folder serve """
    file_name = path.split('/')[-1]
    dir_name = os.path.join('dist', '/'.join(path.split('/')[:-1]))
    return send_from_directory(dir_name, file_name)


if __name__ == '__main__':
    print('running environment: %s', os.environ.get('ENV'))
    app.config['DEBUG'] = os.environ.get('ENV') == 'development' # Debug mode if development env
    app.run(host='0.0.0.0', port=int(PORT), debug=True) # Run the app