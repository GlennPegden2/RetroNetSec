#!/bin/sh
# This dirty hack exists because vde_plug doesn't parse the args properly when run directly over ssh, so instead this is run 
# as the user ssh (executed via ssh) and the parameters passed manually.
echo "using fake_plug"
/usr/bin/vde_plug /tmp/sw1