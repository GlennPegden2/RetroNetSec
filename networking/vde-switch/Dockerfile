FROM ubuntu
LABEL name="RetroNetSec_VDE" 
EXPOSE 22

COPY start_VDE.sh /root
RUN apt-get update
RUN apt-get install -y vde2
RUN useradd -s /usr/bin/vde_plug -d /tmp -m vde 
RUN mkdir /tmp/mysw2

ENTRYPOINT /root/start_VDE.sh