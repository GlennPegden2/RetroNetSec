# RetroNetSec
A fully fledged network of yester-year to teach long forgotten security techniques (or it will be eventually)

NOT a CTF - A learning platform, play with ancient vulns for ancient systems

The idea is to build a containerised collection of systems, capable of communitcation (over all types of ethernet protocols, not just TCP/IP but IPX, LanMan, DecNET, AppleTalk etc) between them. Ideally supporting interoperability with real vintage hardware too. With all the software elements containerised, so people can just spin-up the bits they want to explore.

NOTE: The clients subfolder should contain disk images. I'm not pushing these to github for copyright reasons. I'll think about a way to distribute them or build them from resources that already exist on the internet.

BEFORE USE:

Populate the clients folder. Most of this is disk images, which whilst ancient are still copyrighted, so can't be included. At some point I'll include info on how to build them from scratch
Populate secrets/ssh by doing ssh-keygen -t rsa -b 4096 -f ./secrets/ssh/id_rsa_shared

Network:

So, by design, docker "networks" only support TCP/IP, so I've implemnted a VDE based virtual switching system. It involves shovelling ethernet over ssh, has a dubeos security model, doubly so when you consider a little hack I had to implement to get that working, but it DOES work. the vde-switch container is a virtual switch which also provides DHCP and quemu already supports networking over VDE. 

Accessing hosts:

At the moment, all hosts run insides containerised versions of qemu and are available using vnc against the local host. Which hosts are on which ports can be found in docker-compose.yml


ToDo List (or "ideas to investigate"):

Client Subnet

  Dos/Win Based

    Dos 6.22 (based on my Docker+qemu++vnc stack used in the ctf puzzle) - DONE 
      Add a TCP/IP stack (Beame & Whiteside ?) - DONE (but opted for the MS stack. I may add another host running B&W later).
      Full BBS client (and server) 
      
    Win 3.11 (poss on top of the 6.22 build) - DONE
    OS2 Warp


Server Subnet

  Windows NT4
        
  Unix

    Early linux distros (slack, ygrassil etc)
    BSD
    Minix

  Other

    Netware
    OpenVMS
    Pr1meOS

Comms
  Some kind of asterisk stack? PBX ? Drive the BBS?
    
CDN

  (My) RetroNAS
  Simtel
  Original TUCOWS archive ?
  Lancs PD mirror ?
  
  
    
Intended Vuln Show & Tells  

Stok & Leadbetter's ANSI poisoning
Ping Of Death


