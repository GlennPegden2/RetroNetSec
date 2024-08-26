""" Helper Functions """
import docker as og_docker
from python_on_whales import docker


def is_docker_up():
    """ Check is docker is running """    
    try:
        client = og_docker.DockerClient()
        client.ping()
    except og_docker.errors.DockerException:
        return False
    return True

def stop_container(sname):
    """ Compose_down a latest version of an image"""
    try:
        docker.compose.down(sname)
    except og_docker.errors.DockerException as e:
        print("Compose down failed")
        return f"Failed to stop {sname} - Error was {e}"

    print("Compose Done")
    return "Started {sname}"


def start_container(sname):
    """ Compose_Up a latest version of an image"""
    container = f"retronetsec/{sname}:latest"
    print(f"Starting {sname}")
    print("Checking if image already exists")
    outp = docker.image.list(container)
    if outp:
        print("Image Exists, lets run it")
    else:
        print("Image doesn't exists, docker will try and pull then build it")
        print("This may take some time")

    try:
        docker.compose.up(sname, detach=True)
    except og_docker.errors.DockerException as e:
        print("Compose failed")
        return f"Failed to start {sname} - Error was {e}"

    print("Compose Done")
    return "Started {sname}"

def get_con_url(port,host_port):
    """ Given the public and private porrts, it guesses the protocol & retuns protocol and URI"""

    match port:
        case "5900/tcp":
            return ["vnc", f"com.realvnc.vncviewer.connect://localhost:{host_port}" ]
        case "80/tcp":
            return ["http" f"http://localhost:{host_port}" ]
        case "443/tcp":
            return ["https",f"https://localhost:{host_port}" ]
        case "22/tcp":
            return ["ssh", f"ssh://localhost:{host_port}" ]
        case _:
            return [port,""]
