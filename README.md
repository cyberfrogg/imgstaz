# IMGSTAZ - Image Storage Backend with S3 Bucket

This is small service-project for easy communication with S3 via simple REST Api.

Project is in really early development. At the beginning first time it was just small image-hosting service for another project. 


## Examples:

While developing this service I wrote some simple JQuery form examples in /test/usage_example.html. Works locally. You can change url manually if you want.


## Api endpoints:

- **/api/v1/image/upload** - uploads image. Receives multipart/form-data POST request with "uploadfile" as file and "projecttoken" as string

- **/api/v1/project/tokenCreate** - creates project token with service key, that defined in .env file.



## Setup:

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
    pointerdata json,
    width int,
    height int,
    mime varchar(5),
    create_time timestamp
);

```

### Setup .env file

Rename `.env.template` file to `.env`. Then replace all credentials you need.