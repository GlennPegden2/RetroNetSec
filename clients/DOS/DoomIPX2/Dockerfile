FROM archlinux
LABEL name="DoomIPX2" 
COPY DoomIPX.img /root
COPY start.sh /root
EXPOSE 5900

RUN mkdir -p /root/.ssh 
RUN --mount=type=secret,id=user_ssh_key cp /run/secrets/user_ssh_key /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host vde-switch\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config


RUN pacman -Sy --noconfirm qemu-base qemu-system-x86 go x11vnc vde2 openssh

ENV GOROOT /usr/lib/go
ENV GOPATH /go
ENV PATH /go/bin:$PATH
RUN mkdir -p ${GOPATH}/src ${GOPATH}/bin

WORKDIR $GOPATH

ENTRYPOINT  /root/start.sh