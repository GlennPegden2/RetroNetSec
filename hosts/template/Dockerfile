FROM alpine
LABEL name="Template" 

RUN apk add qemu go x11vnc qemu-img qemu-system-x86_64 vde2 vde2-libs

RUN mkdir -p /root/.ssh 
RUN --mount=type=secret,id=user_ssh_key cp /run/secrets/user_ssh_key /root/.ssh/id_rsa
RUN chmod 700 /root/.ssh/id_rsa
RUN echo "Host vde-switch\n\tStrictHostKeyChecking no\n" >> /root/.ssh/config

COPY Template.img /root
COPY start.sh /root
RUN chmod +rx /root/start.sh
EXPOSE 5900

ENTRYPOINT  /root/start.sh