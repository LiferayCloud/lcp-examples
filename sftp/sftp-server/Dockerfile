FROM atmoz/sftp
COPY ./users.conf /etc/sftp/users.conf
RUN /bin/mkdir -p /home/user/files
RUN /bin/chown -R 1001:100 /home/user
ENTRYPOINT ["/entrypoint"]