FROM nginx:stable
EXPOSE 22
COPY ./sftp.conf /etc/nginx/sftp.conf
RUN printf "\n include /etc/nginx/sftp.conf;\n" >> /etc/nginx/nginx.conf
