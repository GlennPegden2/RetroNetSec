#Create a "local" SDN switch
vde_switch -d -s /tmp/sw1 

echo "Waiting for VDE switch to come up"
while ! test -d /tmp/sw1; do
    echo -n "."
    sleep 5
done

#Connect the "local" switch to the central switch
dpipe vde_plug /tmp/sw1 = ssh -o "StrictHostKeyChecking=no" vde@$vdehost vde_plug &

#Start the emulator
qemu-system-x86_64 -m 16 -cpu 486 -net none  -device ne2k_isa,netdev=lan,irq=10,iobase=0x320,mac=52:54:00:AB:$(printf "%02X" $((RANDOM % 256))):$(printf "%02X" $((RANDOM % 256)))  -netdev vde,id=lan,sock=/tmp/sw1 -hda /root/v7x86.img -parallel none -vnc :0 
