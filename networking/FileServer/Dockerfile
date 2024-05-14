FROM ubuntu
LABEL name="RetroNetSec_FS" 


RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y openssh-server vde2 iproute2 samba vsftpd

RUN mkdir -p /root/.ssh 
RUN --mount=type=secret,id=user_ssh_key cp /run/secrets/user_ssh_key /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host vde-switch\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

COPY start.sh /root
COPY smb.conf /etc/samba

RUN service smbd start

RUN mkdir /root/files

ENTRYPOINT /root/start.sh
