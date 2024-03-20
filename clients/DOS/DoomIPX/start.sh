vde_switch -d -s /tmp/sw1 
sleep 10 # wait for remote VDE switch to come up
dpipe vde_plug /tmp/sw1 = ssh -o "StrictHostKeyChecking=no" vde@$vdehost vde_plug &

qemu-system-x86_64 -m 16 -cpu 486 -net none  -device ne2k_isa,netdev=lan,irq=10,iobase=0x320  -netdev vde,id=lan,sock=/tmp/sw1 -hda /root/DoomIPX.img -parallel none -vnc :0 


sleep infinity
