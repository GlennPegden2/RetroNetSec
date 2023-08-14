FROM alpine
LABEL name="RetroNetSec_6.22" 
COPY Dos6.22.img /root
EXPOSE 5900
RUN apk add qemu go x11vnc qemu-img qemu-system-x86_64

ENV GOROOT /usr/lib/go
ENV GOPATH /go
ENV PATH /go/bin:$PATH
RUN mkdir -p ${GOPATH}/src ${GOPATH}/bin

WORKDIR $GOPATH

ENTRYPOINT qemu-system-x86_64 -m 512 -nic user -drive file=/root/DosBSL.img,index=0,if=floppy,format=raw,readonly=on  -boot a -vnc :0 -s -no-fd-bootchk
