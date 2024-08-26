""" Entrypoint for app"""
# For a debgug server on 5000 instead do
#   python -m flask --app webui_app.webapp run

import webui_app

if __name__ == '__main__':
    webui_app.app.run(host='0.0.0.0', port=8000, debug=False)
