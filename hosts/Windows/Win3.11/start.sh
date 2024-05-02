vde_switch -d -s /tmp/sw1 
sleep 10 # wait for remote VDE switch to come up
dpipe vde_plug /tmp/sw1 = ssh -o "StrictHostKeyChecking=no" vde@$vdehost vde_plug &

#qemu-system-x86_64 -m 16 -cpu 486 -net none  -device ne2k_isa,irq=3,iobase=0x300,netdev=lan,mac=52:54:00:AB:$(printf "%02X" $((RANDOM % 256))):$(printf "%02X" $((RANDOM % 256))) -hda /root/ms-dos-6-22-tcpip.img   -netdev vde,id=lan,sock=/tmp/sw1 -parallel none -vnc :0 

qemu-system-x86_64 -m 16 -cpu 486 -net none  -device ne2k_isa,netdev=lan,irq=3,iobase=0x300,mac=52:54:00:AB:$(printf "%02X" $((RANDOM % 256))):$(printf "%02X" $((RANDOM % 256)))  -netdev vde,id=lan,sock=/tmp/sw1 -hda /root/win31.img -parallel none -vnc :0 