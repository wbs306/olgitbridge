# olgitbridge

Another Overleaf git bridge. This hack allows you to pull and push changes via git on an Overleaf Community Edition (CE) or Pro server, like shown in the [official Overleaf SaaS announcement](https://www.overleaf.com/blog/the-git-bridge-in-overleaf-v2-is-here). Just use `git clone http://your.server.invalid/<project-id>`, where your project ID can be seen from your Overleaf instance.

This gitbridge uses the web API of Overleaf to down- and upsync changes. This means it does not need to run on the same server as Overleaf. In fact it is recommended to run it on another so it can directly use https port 443. In Overleaf v5 frontend, you also need to expose port 3000 in the sharelatex container to allow access to the web api.

Note that contrary to the cloud version this bridge does not use realtime change operations, any files changed by git will result in a "this file has been changed externally" interruption in the online editor.

## Getting started

Start installing (likely on another server than the Overleaf server)

```
git clone https://gitlab.com/chazeon/olgitbridge.git
cd olgitbridge
npm install
```

Edit config.js in your favorite editor. You need to modify `config.apiUsername` and `config.apiPassword` values. These can be found in `/etc/container_environment` in sharelatex, corresponding to the `WEB_API_USER` and `WEB_API_PASSWORD` entries respectively.

If the bridge is running on port 80 and or 443 using authbind may be a good idea.

Start the server with (or without authbind)

```
authbind node src/server.js
```

Wrap it in your auto(re)starter/service of your choice.

## Docker container

There is a Dockerfile provided here, feel free to use it for your deployment. Make sure to edit the config before launching the service. It might make sense to mount the `/var/olgitbridge/...` folders, so the content persists a software update. I recommend configuring the basedir before building the container to `/var/olgitbridge/data`.

The container exposes port 5000 by default.

If you don't want to expose sharelatex's port 3000, you can instead run the container with `--network=NAME_OF_SHARELATEX_NETWORK` to connet it internally.

## Dependencies

In development node.js v16.11.0 was used.
