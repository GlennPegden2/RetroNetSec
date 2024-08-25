""" Helper Functions """
import docker

def isDockerUp():
    """ Check is docker is running """    
    try:
        client = docker.DockerClient()
        client.ping()
    except docker.errors.DockerException:
        return False
    return True
