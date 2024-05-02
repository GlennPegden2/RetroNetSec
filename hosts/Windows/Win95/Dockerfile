FROM alpine
LABEL name="RetroNetSec_Win95Plus" 
COPY win95plus.img /root
COPY start.sh /root
EXPOSE 5900
RUN apk add wolfssl
RUN apk add qemu go x11vnc qemu-img qemu-system-x86_64 vde2 openssh-client ca-certificates bash

ENV GOROOT /usr/lib/go
ENV GOPATH /go
ENV PATH /go/bin:$PATH
RUN mkdir -p ${GOPATH}/src ${GOPATH}/bin

RUN mkdir -p /root/.ssh 
RUN --mount=type=secret,id=user_ssh_key cp /run/secrets/user_ssh_key /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host vde-switch\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

WORKDIR $GOPATH

ENTRYPOINT /root/start.sh