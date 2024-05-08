
mkdir -p /dev/net
mknod /dev/net/tun c 10 200
chmod 600 /dev/net/tun

vde_switch -d -s /tmp/sw1  --tap tap0  -f /root/
dpipe vde_plug /tmp/sw1 = ssh -o "StrictHostKeyChecking=no" vde@$vdehost vde_plug &

ip addr add 10.0.2.11/24 dev tap0
ip link set tap0 up
ip route add 10.0.0.0/8 via 10.0.2.11 dev tap0

sleep infinity