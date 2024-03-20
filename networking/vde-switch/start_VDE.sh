

echo "Starting sshd" 
/usr/sbin/sshd


echo "Creating tun device"
mkdir -p /dev/net
mknod /dev/net/tun c 10 200
chmod 600 /dev/net/tun

/root/start_VDE2.sh &

echo "Starting VDE (foreground)"
vde_switch  -s /tmp/sw1 -group vdeusers  -mod 770 --tap tap0  

