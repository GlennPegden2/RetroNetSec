set -x

rm -f /tmp/mysw

#vde_plug -d null switch:///tmp/mysw 
vde_switch -d -s /tmp/mysw 
sleep 3
slirpvde -dhcp -s /tmp/mysw 


