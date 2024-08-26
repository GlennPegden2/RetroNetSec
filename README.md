# RetroNetSec
A fully-fledged network of yester-year to teach long forgotten security techniques (or it will be eventually)

NOT a CTF - A learning platform, play with ancient vulns for ancient systems

The idea is to build a containerised collection of systems, capable of communitcation (over all types of ethernet protocols, not just TCP/IP but IPX, LanMan, DecNET, AppleTalk etc) between them. Ideally supporting interoperability with real vintage hardware too. With all the software elements containerised, so people can just spin-up the bits they want to explore.

<img width="1885" alt="image" src="https://github.com/user-attachments/assets/6bb38449-0f2b-4552-8abb-63a6a009f50e">

NOTE: 
   The clients subfolder should contain disk images. I'm not pushing these to github for size and copyright reasons. I'll think about a way to distribute them or build them from resources that already exist on the internet.
   Each folder should contain a txt explaining how we built the image
   Where possible we've standardised on using an NE2000 ISA network card on irq=10 with an iobase=0x320 and a random mac address that starts 52:54:00:AB

## REQUIREMENTS

python3
docker

## INSTALL

pip install -r requirements.txt

Populate the clients folder. The image file names should be the same as the foldername with an extension of .img

Populate secrets/ssh by doing ssh-keygen -t rsa -b 4096 -f ./secrets/ssh/id_rsa_shared

## RUNNING

Start the web ui using

python retronetsec.py

Then point your web browser at http://127.0.0.1:8000

Or just use docker compose to start/stop container as needed.

## Network:

So, by design, docker "networks" only support TCP/IP, so I've implemnted a VDE based virtual switching system. It involves shovelling ethernet over ssh, has a dubious security model, doubly so when you consider a little hack I had to implement to get that working, but it DOES work although compromising the switch and therefore the entire container network wouldn't be hard. the vde-switch container is a virtual switch which also provides DHCP and quemu already supports networking over VDE. 

## Accessing hosts:

At the moment, all hosts run insides containerised versions of qemu and are available using vnc against the local host. Which hosts are on which ports can be found in docker-compose.yml. There are occasional exceptions listed in the hosts .txt files (such as Kali, which can be access via docker itself)

## Building your own images:

Get the your image working in qemu OUTSIDE of docker first (remember change in running docker containers only persist whilst the container is running). DoomIPX.txt contains a walk-though of how we built that image. Then add it do docker-compose.yml

# WHILST THIS IS VERY MUCH PRE-ALPHA QUAILTY, PEOPLE ARE WELCOME TO PLAY WITH IT AND CONTRIBUTE

More Info - https://github.com/GlennPegden2/RetroNetSec/wiki 





