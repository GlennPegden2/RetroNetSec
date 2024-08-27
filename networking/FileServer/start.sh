
#Create the tunnel device needed to send VDE

mkdir -p /dev/net
mknod /dev/net/tun c 10 200
chmod 600 /dev/net/tun

#Set up the local switch with a tap device so it appears as a local interface (tap0)
vde_switch -d -s /tmp/sw1  --tap tap0  -f /root/

#Plus the switch into the remote central switch via ssh
dpipe vde_plug /tmp/sw1 = ssh -o "StrictHostKeyChecking=no" vde@$vdehost vde_plug &

#Configure the local tap0 interface, which should be on the same network as all the other VDE switches
#dhcpclient 
#TODO: replace with DHCP

dhclient -v

#ip addr add 10.0.2.11/24 dev tap0
#ip link set tap0 up
#ip route add 10.0.0.0/8 via 10.0.2.11 dev tap0

#Run sshd, so we can ssh into the host from the local network
/usr/sbin/sshd -D

sleep infinity