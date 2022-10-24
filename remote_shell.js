const terminal = document.getElementById('terminal');
const input = document.getElementById('input');
const status = document.getElementById('status');
const connect = document.getElementById('connect');
const disconnect = document.getElementById('disconnect');
const pid = document.getElementById('project-id');
const did = document.getElementById('device-id');
const key = document.getElementById('api-key');

term = createTerminal(terminal);
socket = null;

input.addEventListener('keyup', ({key}) => {
    if (key == 'Enter') {
        if (!input.value) {
            input.value = '\r';
        }
        line = input.value;
        sendLineToDevice(line);
        input.value = '';
    }
});

connect.addEventListener('click', () => {
    openWebsocket();
});

disconnect.addEventListener('click', () => {
    if (socket) {
        socket.close();
    }
});

disconnect.disabled = true;
input.focus();

function setStatus(msg) {
    console.log(msg);
    status.innerHTML = msg;
}

function openWebsocket() {
    const server = 'api.golioth.io';
    const uri=`wss://${server}/v1/ws/projects/${pid.value}/devices/${did.value}/stream?x-api-key=${key.value}`;

    socket = new WebSocket(uri);

    socket.onopen = (e) => {
        setStatus("[open] Connection established");
        connect.disabled = true;
        disconnect.disabled = false;
    };

    socket.onmessage = (e) => {
        handleStreamMsg(e.data);
    };

    socket.onclose = (e) => {
        if (e.wasClean) {
            setStatus("[close] Connection closed cleanly");
        } else {
            setStatus("[close] Connection closed unexpectedly");
        }
        connect.disabled = false;
        disconnect.disabled = true;
    };

    socket.onerror = (e) => {
        setStatus(`[error] code: ${e.code}, reason: ${e.reason}`);
    };
}

function createTerminal(element, options = {}) {
    var term = new Terminal(options);
    var fitAddon = new FitAddon.FitAddon();
    term.loadAddon(fitAddon);
    term.open(element);
    fitAddon.fit();
    window.onresize = () => {
        fitAddon.fit();
    };
    return term;
}

function handleStreamMsg(msg) {
    const obj = JSON.parse(msg);

    if ('shell' in obj.result.data.data) {
        deviceLogs = obj.result.data.data.shell.s;
        // console.log(deviceLogs);
        term.write(deviceLogs);
    }
}

function sendLineToDevice(line) {
    const uri = `https://api.golioth.io/v1/projects/${pid.value}/devices/${did.value}/rpc`;
    const response = new XMLHttpRequest();
    const json = JSON.stringify({
        method: "line_input",
        params: [line]
    });

    response.open("POST", uri);
    response.setRequestHeader('Content-Type', 'application/json');
    response.setRequestHeader('x-api-key', key.value);
    response.send(json);
    response.onload = (e) => {
        console.log(e);
    };
}
