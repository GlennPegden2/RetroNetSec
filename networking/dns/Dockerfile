FROM strm/dnsmasq
LABEL name="dns" 

RUN apk add qemu go x11vnc qemu-img qemu-system-x86_64 vde2 vde2-libs dhclient openssh

#Set up SSH secrets so it can ssh data to the VDE
RUN mkdir -p /root/.ssh 
RUN --mount=type=secret,id=user_ssh_key cp /run/secrets/user_ssh_key /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host vde-switch\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

COPY dnsmasq.conf /etc
COPY start.sh /root
RUN chmod +rx /root/start.sh

ENTRYPOINT  /root/start.sh