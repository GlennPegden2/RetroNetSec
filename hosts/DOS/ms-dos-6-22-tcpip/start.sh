#Create a "local" SDN switch
vde_switch -d -s /tmp/sw1 

echo "Waiting for VDE switch to come up"
while ! test -d /tmp/sw1; do
    echo -n "."
    sleep 5
done

#Connect the "local" switch to the central switch
dpipe vde_plug /tmp/sw1 = ssh -o "StrictHostKeyChecking=no" vde@$vdehost vde_plug &

#qemu-system-x86_64 -m 16 -cpu 486 -net none  -device ne2k_isa,netdev=lan,irq=10,iobase=0x320  -netdev vde,id=lan,sock=/tmp/sw1 -hda /root/DoomIPX.img -parallel none -vnc :0 
#qemu-system-x86_64 -m 16 -cpu 486 -net none  -device ne2k_isa,irq=3,iobase=0x300,netdev=lan,mac=52:54:00:AB:CA:FE -hda hosts/DOS/ms-dos-6-22-tcpip/ms-dos-6-22-tcpip.img   -netdev user,id=lan -parallel none

qemu-system-x86_64 -m 16 -cpu 486 -net none  -device ne2k_isa,irq=3,iobase=0x300,netdev=lan,mac=52:54:00:AB:$(printf "%02X" $((RANDOM % 256))):$(printf "%02X" $((RANDOM % 256))) -hda /root/ms-dos-6-22-tcpip.img   -netdev vde,id=lan,sock=/tmp/sw1 -parallel none -vnc :0 

