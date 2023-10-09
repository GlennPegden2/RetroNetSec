# RetroNetSec
A fully fledged network of yester-year to teach long forgotten security techniques

NOT a CTF - A learning platform, play with ancient vulns for ancient systems

Ideally all "open" (or automated to snaffle the less open bits off archive.org) and containerised as much as possible so anyone can contribute and anyone can just spin up the bits they are interested in.
Interoperatibility with  real hardware?

Not just TCP/IP based networking (IPX, LanMan, DecNET, AppleTalk etc) 

NOTE: This is not yet in a working state !!!!!!
NOTE: There should be a media folder with OS images in it. I'm not pushing these to github for copyright reasons.



ToDo List (or "ideas to investigate")

Client Subnet

  Dos/Win Based

    Dos 6.22 (based on my Docker+qemu++vnc stack used in the ctf puzzle). 
      Add a TCP/IP stack (Beame & Whiteside ?)
      Full BBS client (and server) 
      
    Win 3.11 (poss on top of the 6.22 build) 
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


BEFORE USE:

Populate the clients folder. Most of this is disk images, which whilst ancient are still copyrighted, so can't be included. At some point I'll include info on how to build them from scratch
Populate secrets/ssh by doing ssh-keygen -t rsa -b 4096 -f ./secrets/ssh/id_rsa_shared