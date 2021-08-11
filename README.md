<img src="./Desktop-Client/favicon.ico" width="100" height="100" alt="Application Logo" align="right">

# Realtime Code Sharing

This project is a collaborative coding and document editing environment. Programmers can use a standard web browser or the desktop app to connect to an application server that hosts their projects. This project uses Web Sockets to support collaboration between multiple simultaneous editors. Any number of programmers can open the same file simultaneously, and their concurrent changes are shared in near real-time to enable smooth collaboration whether they are working together remotely or at the same desk. To provide rich code editing environment, this project uses Monaco Editor which provides IntelliSense, Validation and Syntax Colorization. On the server side, this project uses Node.js, Express.js and Socket.io to implement a Web Socket server to make a persistent connection between clients and the server using Sockets in order to track the changes made by different users.

> [Project Demo 🔗](https://codesharing.netlify.app)

> [Download the desktop app for windows 🔗](https://github.com/AbdulMoizAli/Realtime-Code-Sharing/releases/download/v1.0.0/release-builds.zip)

# Get Started 🔰

## Clone this repo

```
$ git clone git@github.com:AbdulMoizAli/Realtime-Code-Sharing.git
```

## Install Dependencies

### 1. Server

```
$ cd .\Realtime-Code-Sharing\Server\

$ npm install
```

### 2. Web Client

```
$ cd .\Realtime-Code-Sharing\Web-Client\

$ npm install
```

```
$ cd .\Realtime-Code-Sharing\Web-Client\public\packages

$ npm install
```

### 3. Desktop Client

```
$ cd .\Realtime-Code-Sharing\Desktop-Client\

$ npm install
```

# Run Project 💨

## 1. Server

```
$ cd .\Realtime-Code-Sharing\Server\

$ npm run server
```

## 2. Web Client

```
$ cd .\Realtime-Code-Sharing\Web-Client\

$ npm run web-client
```

## 3. Desktop Client

```
$ cd .\Realtime-Code-Sharing\Desktop-Client\

$ npm run desktop-client
```
