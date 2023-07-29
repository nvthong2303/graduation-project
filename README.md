concurrently --names "Server,Client,Socket,Media" --prefix-colors "green,red,blue,white" --prefix "[{name}]" "cd server && npm run dev" "cd client && npm start" "cd socket-server && npm start" "cd media-server && npm start"


<h1 align="center"> Project Title </h1> <br>

<p align="center">
  Sample microservice description.
</p>


## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Testing](#testing)
- [API](#requirements)
- [Acknowledgements](#acknowledgements)




## Introduction

NVT-Teams: This is a graduation project, a system that allows users to message online, video call and interact with each other through articles.

## Features
NVT-Teams: Description of features

**Include a list of**
* Chat / delete message.
* Video call 1-1, 1-n, n-n.
* Create/Update/AddMembers/RemoveMembers room.
* Create/Update/Delete/Like/Comment post.
## Tính năng
T-teams

* Chat
* Gọi video
* Tạo, sửa, xóa, like, bình luận bài viết


## Yêu cầu
Hệ thống yêu cầu môi trường NodeJS, MongoDB.


### NODEJS
- Install [NVM](https://github.com/nvm-sh/nvm) to manage NodeJS versions
- Install [Node.js](https://nodejs.org/en/) version 14.0.0 to install module
- Install [Node.js](https://nodejs.org/en/) version 18.0.0 to run (recommend)
### NODEJS
A running instance of [EGO](https://github.com/overture-stack/ego/) is required to generate the Authorization tokens and to provide the verification key.

[EGO](https://github.com/overture-stack/ego/) can be cloned and run locally if no public server is available. 


### Local
* [Java 8 SDK](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* [Maven](https://maven.apache.org/download.cgi)


### Docker
* [Docker](https://www.docker.com/get-docker)


## Quick Start
Make sure the JWT Verification Key URL is configured, then you can run the server in a docker container or on your local machine.

### Configure JWT Verification Key
Update __application.yml__. Set `auth.jwt.publicKeyUrl` to the URL to fetch the JWT verification key. The application will not start if it can't set the verification key for the JWTConverter.

The default value in the __application.yml__ file is set to connect to EGO running locally on its default port `8081`.

### Run Local
```bash
$ mvn spring-boot:run
```

Application will run by default on port `1234`

Configure the port by changing `server.port` in __application.yml__


### Run Docker

First build the image:
```bash
$ docker-compose build
```

When ready, run it:
```bash
$ docker-compose up
```

Application will run by default on port `1234`

Configure the port by changing `services.api.ports` in __docker-compose.yml__. Port 1234 was used by default so the value is easy to identify and change in the configuration file.


## Testing
TODO: Additional instructions for testing the application.


## API
TODO: API Reference with examples, or a link to a wiki or other documentation source.

## Acknowledgements
TODO: Show folks some love.