# server-sent-events

HTML5 and Node.js demo of server-sent-events for a group buying application.

## Overview

- `server.js` contains an Express application which is provided by the SPDY library for HTTP/2 support.
- `deals.js` is the in-memory database of deal and product data.
- The `static` folder contains the front-end of the application.

## Pre-requisites

As unencrypted HTTP/2 connections are not supported by browsers, a private key and certificate are required to create a HTTPS server.

To generate the certificate and key, openssl is required. Once installed, run:

```bash
openssl req -x509 -newkey rsa:2048 -nodes -sha256 -subj '/CN=localhost' -keyout localhost-privkey.pem -out localhost-cert.pem
```

Ensure that the certificate and key are in the root directory of this project.

## Installation

Use the package manager npm to install dependencies.

```bash
npm install
```

## Running the app

Once pre-requisites are met and packages installed, the app can be started using:

```bash
npm run start
```

The app is then available at `https://localhost:8080`
