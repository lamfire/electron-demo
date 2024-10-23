document.getElementById('run-command').addEventListener('click', () => {
    sendCommand();
});

document.getElementById('command').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendCommand();
    }
});

window.electron.onCommandOutput((event,output) => {
    console.log(output);
    document.getElementById('output').innerText += output + '\n';
});

function clearOutput() {
    document.getElementById('output').innerText = '';
}

function sendCommand() {
    const command = document.getElementById('command').value;
    window.electron.sendCommand(command);
}
