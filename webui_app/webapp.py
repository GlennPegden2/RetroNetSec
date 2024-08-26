""" Entrypoint for app"""

from . import app    # For application discovery by the 'flask' command.
#from . import views  # For import side-effects of setting up routes.

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
