mkdir -p /dev/net
mknod /dev/net/tun c 10 200
chmod 600 /dev/net/tun

modprobe tun

#Create a "local" SDN switch
vde_switch -d -s /tmp/sw1 --tap tap0 
#vde_switch  -s /tmp/sw1 -group vdeusers  -mod 770  --tap tap0  -f /root/


echo "Waiting for VDE switch to come up"
while ! test -d /tmp/sw1; do
    echo -n "."
    sleep 5
done

ip addr add 10.0.2.12/24 dev tap0
ip link set tap0 up
ip route add 10.0.0.0/8 via 10.0.2.12 dev tap0


#Connect the "local" switch to the central switch - Run in foreground as we don't need qemu, people can just ssh in
dpipe vde_plug /tmp/sw1 = ssh -o "StrictHostKeyChecking=no" vde@$vdehost vde_plug 

sleep infinity


