""" Web UI for RetroNetSec """
import os
import json
from flask import render_template
from python_on_whales import docker
import yaml
from . import app
from . import helpers

@app.route('/')
def main():
    """ Main root page, shows known services and their statuses """

    if helpers.is_docker_up() is False:
        return "Docker doesn't seem to be running"

    container_info = docker.ps(all=True)

    with open('docker-compose.yml', 'r',  encoding='UTF-8') as f:
        compose_info = yaml.safe_load(f)

    jout = "{"
    for service in compose_info["services"].keys():

        has_built_imagee = "false"
        has_container = "false"
        run_state = "N/A "
        port_list = []
        img_desc = ""
        warn_text = ""

        service_image_name = f'{compose_info["services"][service]["image"].split(":")[0]}:latest'
        image_info = docker.image.list(service_image_name)

        if 'labels' in compose_info["services"][service]:
            for labels in (compose_info["services"][service]['labels']):
                if "retronetsec.needs_separate_img" in labels:
                    context_path = compose_info["services"][service]['build']['context']
                    img_fn = (compose_info["services"][service]
                               ['labels']['retronetsec.needs_separate_img'])
                    img_fpath = f"{context_path}/{img_fn}"
                    if os.path.isfile(img_fpath):
                        warn_text += f"User supplied IMG found at {img_fpath} "
                    else:
                        warn_text += ("Requires a IMG file not included in this distibution."
                                       f"Ensure {img_fpath} exists or building the image will fail")

                if "retronetsec.img_description" in labels:
                    img_desc = (compose_info["services"][service]
                                ['labels']['retronetsec.img_description'])

        if image_info:
            has_built_imagee = "true"
            for container in container_info:
                if image_info[0].id in container.image:
                    has_container = "true"
                    run_state = container.state.status

                    port_list = []
                    port_link_list = []
                    port_proto_list = []
                    for port in container.network_settings.ports:
                        if isinstance(container.network_settings.ports[port], list):
                            host_port = container.network_settings.ports[port][0]['HostPort']
                            [ port_proto , port_link] = helpers.get_con_url(port, host_port)
                            port_link_list.append(port_link)
                            port_proto_list.append(port_proto)
                            port_list.append(f"{host_port}|{port}")
                        else:
                            port_list.append(port)
                            port_link_list.append("")
                            port_proto_list.append("Unknown")

        if (service == "vde-switch") and (run_state.split(" ")[0] != "running"):
            warn_text += ("<p>vde-switch is NOT running, networking"
                          "will NOT work until it's enabled</p>")

#TODO: Why am I building this as json, only to convert it back to python objects later?
        jout += f'''
            "{service}" :
            {{ "service":"{service}",
                "image_name":"{service_image_name}",
                "has_image" : {has_built_imagee},
                "has_container" : {has_container},
                "run_state" : "{run_state}",
                "connect" : {json.dumps(port_list)},
                "description" : "{img_desc}",
                "notes" : "{warn_text}",
                "connect_uri" : {json.dumps(port_link_list)},
                "connect_proto" : {json.dumps(port_proto_list)}

            }},'''

    jout = jout[:-2]
    jout += "}}"


    user_data = json.loads(jout)

    return render_template(
        "home.html",
        users = user_data
    )


@app.route('/dstart/<sname>')
def start_service(sname):
    """ Start Containers"""
    helpers.start_container(sname)
    return f"Started {sname}"

@app.route('/dstop/<sname>')
def stop_service(sname):
    """ Stop Containers"""
    helpers.stop_container(sname)
    return f"Stop {sname}"
