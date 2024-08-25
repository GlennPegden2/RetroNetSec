""" Web UI for RetroNetSec """
import os
from flask import Flask
from python_on_whales import docker
import yaml
from flask import render_template
from . import app
from . import helpers

#app = Flask(__name__)

@app.route('/')
def main():
    """ Main root page, shows known services and their statuses """

    if helpers.isDockerUp() is False:
        return "Docker doesn't seem to be running"

#		dockerImageList = docker.image.list(serviceImageName)
    containerInfo = docker.ps(all=True)

    with open('docker-compose.yml', 'r',  encoding='UTF-8') as f:
        composeInfo = yaml.safe_load(f)

    out = "<style>table, th, td { border: solid 1px #CCC; } table { width: 100%;} th, td { padding: 0; text-align: left;}</style><table>"
    out += "<tr style='text-align:left'><th>Service</th><th>Image Name</th><th>Has Image</th><th>Has Container</th><th>Run State</th><th>Connect</th><th>Description</th><th>Notes</th></tr>"
    for service in composeInfo["services"].keys():

        hasBuiltImage = "&#x274C;"
        hasContainer = "&#x274C;"
        runState = "N/A "
        portList = ""
        imgDesc = ""
        warnText = ""

        serviceImageName = f'{composeInfo["services"][service]["image"].split(":")[0]}:latest'	
        imageInfo = docker.image.list(serviceImageName)

#	This should be faster than repeatedly calling the docker API, but for some reason isn't
#  		hasBuiltImage = "No"
#		for image in dockerImageList:

#			if (serviceImageName in image.repo_tags):
#				hasBuiltImage = "Yes"
#				break

        if ('labels' in composeInfo["services"][service]):
            for labels in (composeInfo["services"][service]['labels']):
                if "retronetsec.needs_separate_img" in labels:
                    contextPath = composeInfo["services"][service]['build']['context']
                    imgFilename = composeInfo["services"][service]['labels']['retronetsec.needs_separate_img']
                    imgFullPath = f"{contextPath}/{imgFilename}"
                    if (os.path.isfile(imgFullPath)):
                        warnText += f"User supplied IMG found at {imgFullPath} "	
                    else:	
                        warnText += f"Requires a IMG file not included in this distibution. Ensure {imgFullPath} exists or building the image will fail"


                if ("retronetsec.img_description") in labels:
                    imgDesc = composeInfo["services"][service]['labels']['retronetsec.img_description'] 


        if (imageInfo):
            hasBuiltImage = "&check;"
            for container in containerInfo:
                if (imageInfo[0].id in container.image):
                    hasContainer = "&check;"
                    runState = container.state.status

                    portList = ""
                    for port in container.network_settings.ports:
                        hostPort = container.network_settings.ports[port][0]['HostPort']
                        port = getPortConnectionLink(port, hostPort)
                        portList += f"{hostPort} ({port})<br/>"	
                    break

        if runState == "running":
            runState += f" (<a href='/dstop/{service}'><br/>[Shut Down]</a>)"
        else:
            runState += f" (<a href='/dstart/{service}'><br/>[Start Up]</a>)"

        if (service == "vde-switch") and (runState.split(" ")[0] != "running"):
            warnText += "<p>vde-switch is NOT running, networking will NOT work until it's enabled</p>" 

        out += (f'<tr><td>{service}</td><td>{serviceImageName}</td><td>{hasBuiltImage}</td><td>{hasContainer}</td><td>{runState}</td><td>{portList}</td><td>{imgDesc}</td><td style="color:red">{warnText}</tr>') 

    

    out += "</table>"



    

    return out

@app.route('/dstart/<sname>')
def start_service(sname):
    container = f"retronetsec/{sname}:latest"
    print(f"Starting {sname}")
    print("Checking if image already exists")
    outp = docker.image.list(container)
    if (outp):
        print("Image Exists, lets run it")
    else:
        print("Image doesn't exists, docker will try and pull then build it, this may take some time")

    try:
        docker.compose.up(sname)
    except Exception as e:
        print("Compose failed")
        return f"Failed to start {sname} - Error was {e}"
        
    print("Compose Done")
    return f"Started {sname}"

def getPortConnectionLink(port,hostPort):

    match port:
        case "5900/tcp":
            return f"VNC <a href='com.realvnc.vncviewer.connect://localhost:{hostPort}'>[Connect]</a>"
        case "80/tcp":
            return f"http <a href='http://localhost:{hostPort}'>[Connect]</a>"
        case "443/tcp":
            return "https <a href='https://localhost:{hostPort}'>[Connect]</a>"
        case "22/tcp":
            return "ssh <a href='ssh://localhost:{hostPort}'>[Connect]</a>"
        case _:
            return port

#if __name__ == '__main__':
#    app.run(host='0.0.0.0', port=8000, debug=True)