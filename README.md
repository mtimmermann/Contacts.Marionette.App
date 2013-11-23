Contacts.Marionette.App
=======================

A very simple (and primitive) NodeJS application, to serve responses from
the [Contacts.Marionette.UI](https://github.com/mtimmermann/Contacts.Marionette.UI) website


## Prerequisites ##
[Node.js](http://nodejs.org/) must be installed in order to build this and run this app.

[MongoDB](http://www.mongodb.org/)

I am also using NGINX to serve up the static content the of the [Contacts.Marionette.UI](https://github.com/mtimmermann/Contacts.Marionette.UI) site, and handle proxy passes to this app (see the configuration and setup notes below).


## Configuration ##

Below is the basic configuration I'm using...

The nginx.conf file used for this project:
```
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;
    proxy_http_version 1.1;
    proxy_next_upstream error;

    upstream contactsmarionette-services {
      server 127.0.0.1:8000;
      #server 127.0.0.1:8001;
      #server 127.0.0.1:8002;
    }

    server {
       listen       80;
       server_name  contacts.marionette.dev;
       root         /opt/mark/www/contactsmarionetteui;

       location / {
           index               index.html;
       }

       location /pics/ {
           alias     /opt/mark/www/contactsmarionettepics/;
       }

       location /services/v1/ {
           proxy_pass          http://contactsmarionette-services/;
           proxy_pass_header   Server;
           proxy_set_header    Host $http_host;
           proxy_redirect      off;
           proxy_set_header    X-Real-IP $remote_addr;
           proxy_set_header    X-Scheme $scheme;
       }
    }
}
```

If installing NGINX, I've created a bash script to retrieve and build NGINX(v.1.5.6) located at /config/  run at your own risk (and always investigate a script, program, etc... before running).


/etc/hosts
```
127.0.0.1   contacts.marionette.dev
```

Symlinks in /opt/mark/www/ :
```
contactsmarionettepics -> /home/mark/Projects/Contacts.Marionette.App/pics/
contactsmarionetteui -> /home/mark/Projects/Contacts.Marionette.UI/deploy/
```


## Setup ##
After NodeJS, MongoDB, and NGINX (or other) are installed...

Install the project dependencies:
**npm install**

Initialize the Mongo DB, from the root of the project directory run:
**node config/initialize_db.js**

Run the app
**node app.js**

