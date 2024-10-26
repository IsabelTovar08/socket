// Cambia esta URL por la dirección de tu servidor WebSocket en línea
const socket = new WebSocket("ws://socket-production-8f96.up.railway.app");

socket.onopen = () => {
    console.log("Connected");
};

socket.onclose = (event) => {
    if (event.wasClean) {
        console.log('Closed by the client');
    } else {
        console.log('Closed by the server');
    }
};

socket.onerror = (error) => {
    console.error(error);
};

socket.onmessage = (event) => {
    let data = JSON.parse(event.data);
    
    let text = document.createElement('div');
    text.classList.add('other');
    text.innerText = data.message;

    document.getElementById('messages').appendChild(text);
};

document.getElementById('send').addEventListener('click', () => {
    let message = document.getElementById('message').value;
    document.getElementById('message').value = '';

    let text = document.createElement('div');
    text.classList.add('me');
    text.innerText = message;

    document.getElementById('messages').appendChild(text);

    socket.send(JSON.stringify({
        message
    }));
});
