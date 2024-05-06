FROM kalilinux/kali-rolling
LABEL name="Kali" 

RUN apt-get update
RUN apt-get -y install vde2 iproute2 zlib1g-dev libpcap-dev procps 

RUN mkdir -p /root/.ssh 
RUN --mount=type=secret,id=user_ssh_key cp /run/secrets/user_ssh_key /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host vde-switch\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config


COPY start.sh /root
RUN chmod +rx /root/start.sh

CMD  /root/start.sh