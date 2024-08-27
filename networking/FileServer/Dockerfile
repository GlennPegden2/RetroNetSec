FROM ubuntu
LABEL name="RetroNetSec_FS" 


RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y openssh-server vde2 iproute2 samba vsftpd  isc-dhcp-client

RUN mkdir -p /root/.ssh 
RUN --mount=type=secret,id=user_ssh_key cp /run/secrets/user_ssh_key /root/.ssh/id_rsa
RUN --mount=type=secret,id=user_ssh_pubkey cat /run/secrets/user_ssh_pubkey >> /root/.ssh/authorized_keys
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host vde-switch\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config
RUN echo "PermitRootLogin yes" >> /etc/ssh/sshd_config

COPY start.sh /root
COPY smb.conf /etc/samba

RUN service smbd start

RUN mkdir /root/files

RUN service ssh start

EXPOSE 22

ENTRYPOINT /root/start.sh
