// const socket = new WebSocket("ws://localhost:8080");
// let notificationsContainer = document.getElementById('notifications-container');
// const chat = document.getElementById('chat');
// const notification = document.getElementById('notification');

// socket.onopen = () => {
//     console.log("Connected");
// };

// socket.onclose = (event) => {
//     if (event.wasClean) {
//         console.log('Closed by the client');
//     } else {
//         console.log('Closed by the server');
//     }
// };

// socket.onerror = (error) => {
//     console.error(error);
// };

// // Escuchar mensajes recibidos
// socket.onmessage = (event) => {
//     let data = JSON.parse(event.data);
//     console.log(data);

//     if (data.type === 'newConnection') {
//         createUserNotification();
//     }

//     if (data.type === 'chat') {
//         // Lógica para manejar un mensaje de chat
//         let text = document.createElement('div');
//         text.classList.add('other');
//         text.innerText = data.message;
//         document.getElementById('messages').appendChild(text);
//         scrollToBottom();
//         if (chat.style.display !== 'block') {
//             notification.style.display = 'block';
//         }
//     }

//     if (data.type === 'disconnection') {
//         // Lógica para manejar una desconexión
//         usuarioAbandono();
//     }
    
//     if (data.type === 'history') {
//         // Recibe el historial de uniones anteriores y muestra las notificaciones
//         data.history.forEach(notification => {
//             createNotification(notification.message);
//         });
//     }
// };

// function createUserNotification() {
//     const connectionDiv = document.createElement('div');
//     connectionDiv.classList.add('user-notification');
//     connectionDiv.innerHTML = `
//         <span class="notification-text">👋  se ha unido al chat</span>
//         <button class="close-notification">×</button>
//     `;
//     connectionDiv.querySelector('.close-notification').addEventListener('click', () => {
//         connectionDiv.classList.add('fade-out');
//         setTimeout(() => connectionDiv.remove(), 300);
//     });
//     notificationsContainer.appendChild(connectionDiv);
// }

// function usuarioAbandono() {
//     const connectionDiv = document.createElement('div');
//     connectionDiv.classList.add('user-notification');
//     connectionDiv.innerHTML = `
//         <span class="notification-text">Un usuario ha abandonado el chat</span>
//         <button class="close-notification">×</button>
//     `;
//     connectionDiv.querySelector('.close-notification').addEventListener('click', () => {
//         connectionDiv.classList.add('fade-out');
//         setTimeout(() => connectionDiv.remove(), 300);
//     });
//     notificationsContainer.appendChild(connectionDiv);
// }

// function createNotification(message) {
//     const connectionDiv = document.createElement('div');
//     connectionDiv.classList.add('user-notification');
//     connectionDiv.innerHTML = `
//         <span class="notification-text">${message}</span>
//         <button class="close-notification">×</button>
//     `;
//     connectionDiv.querySelector('.close-notification').addEventListener('click', () => {
//         connectionDiv.classList.add('fade-out');
//         setTimeout(() => connectionDiv.remove(), 300);
//     });
//     notificationsContainer.appendChild(connectionDiv);
// }

// document.getElementById('send').addEventListener('click', () => {
//     let message = document.getElementById('message').value.trim();
//     document.getElementById('message').value = '';

//     if (message !== '') {
//         let text = document.createElement('div');
//         text.classList.add('me');
//         text.innerText = message;

//         document.getElementById('messages').appendChild(text);

//         // Enviar mensaje al servidor
//         socket.send(JSON.stringify({ message }));

//         // Desplazar al último mensaje enviado
//         scrollToBottom();
//     }
// });
// function scrollToBottom() {
//     const messages = document.getElementById('messages');
//     setTimeout(() => {
//         messages.scrollTop = messages.scrollHeight;
//     }, 0);
// }


const socket = new WebSocket("ws://localhost:8080");
let notificationsContainer = document.getElementById('notifications-container');
const chat = document.getElementById('chat');
const notification = document.getElementById('notification');

// Botón de finalizar chat
const endChatButton = document.createElement('button');
endChatButton.innerText = "Finalizar Chat";
endChatButton.style.display = "none";
endChatButton.addEventListener('click', () => {
    socket.send(JSON.stringify({ type: 'endChat' }));
});
document.body.appendChild(endChatButton);

socket.onopen = () => {
    console.log("Connected");
    let userName = prompt("Por favor, ingresa tu nombre:");
    if (userName) {
        socket.send(JSON.stringify({ type: 'setUserName', userName: userName }));
    }
};

socket.onmessage = (event) => {
    let data = JSON.parse(event.data);
    console.log(data);

    if (data.type === 'host') {
        endChatButton.style.display = "block"; // Mostrar botón de finalizar para el host
    }

    if (data.type === 'chatEnded') {
        alert("El chat ha finalizado.");
        window.location.href = "../juego/espacial/cartas/juegoPixel/index.html";
        socket.close();
    }

    if (data.type === 'newConnection') {
        createUserNotification(data.message);
    }

    if (data.type === 'chat') {
        let text = document.createElement('div');
        text.classList.add('other');
        text.innerText = data.message;
        document.getElementById('messages').appendChild(text);
        scrollToBottom();
        if (chat.style.display !== 'block') {
            notification.style.display = 'block';
        }
    }

    if (data.type === 'disconnection') {
        usuarioAbandono(data.message);
    }

    if (data.type === 'history') {
        data.history.forEach(notification => {
            createNotification(notification.message);
        });
    }
};


    // if (data.type === 'requestName') {
    //     // Si el servidor solicita el nombre
    //     let userName = prompt("Por favor, ingresa tu nombre:");
    //     if (userName) {
    //         socket.send(JSON.stringify({ type: 'setUserName', userName: userName }));
    //     }
    // }


function createUserNotification(message) {
    const connectionDiv = document.createElement('div');
    connectionDiv.classList.add('user-notification');
    connectionDiv.innerHTML = `
        <span class="notification-text">${message}</span>
        <button class="close-notification">×</button>
    `;
    connectionDiv.querySelector('.close-notification').addEventListener('click', () => {
        connectionDiv.classList.add('fade-out');
        setTimeout(() => connectionDiv.remove(), 300);
    });
    notificationsContainer.appendChild(connectionDiv);
}

function usuarioAbandono(message) {
    const connectionDiv = document.createElement('div');
    connectionDiv.classList.add('user-notification');
    connectionDiv.innerHTML = `
        <span class="notification-text">${message}</span>
        <button class="close-notification">×</button>
    `;
    connectionDiv.querySelector('.close-notification').addEventListener('click', () => {
        connectionDiv.classList.add('fade-out');
        setTimeout(() => connectionDiv.remove(), 300);
    });
    notificationsContainer.appendChild(connectionDiv);
}

function createNotification(message) {
    const connectionDiv = document.createElement('div');
    connectionDiv.classList.add('user-notification');
    connectionDiv.innerHTML = `
        <span class="notification-text">${message}</span>
        <button class="close-notification">×</button>
    `;
    connectionDiv.querySelector('.close-notification').addEventListener('click', () => {
        connectionDiv.classList.add('fade-out');
        setTimeout(() => connectionDiv.remove(), 300);
    });
    notificationsContainer.appendChild(connectionDiv);
}

document.getElementById('send').addEventListener('click', () => {
    let message = document.getElementById('message').value.trim();
    document.getElementById('message').value = '';

    if (message !== '') {
        let text = document.createElement('div');
        text.classList.add('me');
        text.innerText = message;

        document.getElementById('messages').appendChild(text);

        // Enviar mensaje al servidor solo si la conexión está abierta
        if (socketOpen) {
            socket.send(JSON.stringify({ message }));
        } else {
            console.log("Conexión no abierta aún. Esperando...");
        }

        // Desplazar al último mensaje enviado
        scrollToBottom();
    }
});

function scrollToBottom() {
    const messages = document.getElementById('messages');
    setTimeout(() => {
        messages.scrollTop = messages.scrollHeight;
    }, 0);
}
