# Remote shell web app

Minimal javascript app to connect to Golioth LightDB Stream
service via websocket and interact with a remote device via
a shell-like interface.

Can be used to monitor log output of a device, or send commands
to the device's shell (e.g. to reset the device remotely).

# Install dependencies

```
npm install
```

# Run

```
python -m http.server
```

# How to Use

Open the page in your browser, fill the first 3 text-boxes with:

* Project ID
* Device ID (found on console.golioth.io on Summary tab)
* API key (found on console.golioth.io, may need to create one if you don't
    already have it).

Then hit the Connect button, which will open a websocket.

If your device is running and has the remote shell feature enabled,
you should see logs start showing up in the pseudo-terminal in the
middle of the page.

The bottom textbox is for sending lines of text to the device.
Once you hit `Return`, the line will be sent to the device via RPC, and
you should see that reflected in the log output. Type `help` to show
a list of supported shell commands.
