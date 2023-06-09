# IMGSTAZ - Image Storage Backend with S3 Bucket

This is small service-project for easy communication with S3 via simple REST Api.

Project is in really early development. At the beginning first time it was just small image-hosting service for another project. 


## Examples:

While developing this service I wrote some simple JQuery form examples in /test/usage_example.html. Works locally. You can change url manually if you want.


## Api endpoints:

- **/api/v1/image/upload** - uploads image. Receives multipart/form-data POST request with "uploadfile" as file and "projecttoken" as string

- **/api/v1/project/tokenCreate** - creates project token with service key, that defined in .env file.



## Setup:

### Docker/Podman
docker-compose.yml didn't work well. So its now better to just launch pods my yourself.

Exmaple of `run`:
```sh
podman run -d \
                         --name mysql \
                         -v /imgstazdeploy/mysql:/var/lib/mysql:Z \
                         -e MYSQL_ROOT_PASSWORD='root' \
                         -e MYSQL_USER=superadmin \
                         -e MYSQL_PASSWORD='superadmin' \
                         --pod=imgstaz \
                         mysql:8


podman run -d \
                         --name imgstaz_backend \
                         -v /imgstazdeploy/imgstaz:/home/node/app:Z \
                         -e NODE_ENV=production \
                         -e PORT=5001 \
                         -e WEBSITE_CORS_URL='*' \
                         -e MAX_FILE_SIZE=25 \
                         -e DB_ADDRESS=0.0.0.0 \
                         -e DB_PORT=3306 \
                         -e DB_NAME=imgstaz \
                         -e DB_USER=superadmin \
                         -e DB_PASS=xxx \
                         -e DB_IS_DEBUG=true \
                         -e DB_IS_TRACE=true \
                         -e S3_BUCKET_NAME=xxx \
                         -e S3_BASE_FOLDER=/imgstaz \
                         -e S3_BUCKET_ENDPOINT=xxx \
                         -e S3_ACCESS_KEY_ID=xxx \
                         -e S3_SECRET_KEY=xxx \
                         -e S3_SSL_ENABLED=1 \
                         -e S3_FORCE_PATH_STYLE=0 \
                         -e PROJECT_CREATE_TOKEN_SERVICE_TOKEN=xxx \
                         -e PROJECT_NAME_LEN_MIN=3 \
                         -e PROJECT_NAME_LEN_MAX=50 \
                         -e CONFIG_UUID_LENGTH=36 \
                         --entrypoint="/bin/bash" \
                         --pod=imgstaz \
                         node:18.15.0 \
                         -c '/home/node/app/run_prod.sh'

```

### SQL database tables:
```mysql

CREATE DATABASE imgstaz;

```

```mysql

CREATE TABLE projects (
    uuid varchar(36),
    name varchar(50)
);

CREATE TABLE projecttokens (
    uuid varchar(36),
    projectuuid varchar(36),
    token varchar(512),
    create_time timestamp
);

CREATE TABLE images (
    uuid varchar(36),
    projectuuid varchar(36),
    pointerdata json,
    width int,
    height int,
    mime varchar(5),
    create_time timestamp
);

```

### Setup .env file

Rename `.env.template` file to `.env`. Then replace all credentials you need.