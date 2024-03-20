
while ! test -d /tmp/sw1; do
    echo "Waiting for VDE switch to come up"
    sleep 5
done

echo "VDE Switch is up"
echo "Configuring tap device"

ip addr add 10.0.2.10/24 dev tap0
ip link set tap0 up
ip route add 10.0.0.0/8 via 10.0.2.10 dev tap0

echo "Start dummy DHCP Server"

slirpvde -dhcp  -s /tmp/sw1

#This should never get here


