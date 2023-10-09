set -x

#rm -f /tmp/mysw

#Start sshd
echo "Starting sshd" 
/usr/sbin/sshd

vde_switch -d -s /tmp/sw1

chgrp -hRv vdeusers /tmp/sw1
chmod -R g+rwx /tmp/sw1

sleep 3
slirpvde -dhcp -s /tmp/sw1


