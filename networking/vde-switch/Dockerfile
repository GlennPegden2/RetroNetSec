FROM ubuntu
LABEL name="RetroNetSec_VDE" 

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y openssh-server vde2 

RUN groupadd vdeusers

RUN mkdir /home/vde
COPY start_VDE.sh /root
#RUN useradd -s /usr/bin/vde_plug -d /home/vde -m vde 
RUN useradd -s /home/vde/fake_plug.sh -d /home/vde -m vde 
COPY fake_plug.sh /home/vde

RUN usermod -a -G vdeusers root
RUN usermod -a -G vdeusers vde

RUN mkdir /var/run/sshd
RUN echo 'vde:vde' | chpasswd
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
#RUN echo "export VISIBLE=now" >> /etc/profile
RUN mkdir -p /home/vde/.ssh
RUN --mount=type=secret,id=user_ssh_pubkey cat /run/secrets/user_ssh_pubkey >> /home/vde/.ssh/authorized_keys


EXPOSE 22
ENTRYPOINT /root/start_VDE.sh