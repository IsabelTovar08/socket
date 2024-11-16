function mostrarChat() {
    const boton = document.querySelector('.botonChat');
    
    if (chat.style.display === 'block') {
        chat.style.display = 'none';
        boton.style.display = 'block';

    } else {
        chat.style.display = 'block';
        notification.style.display =    'none'; 
        boton.style.display = 'none';
    }
}

const messageInput = document.getElementById('message');
const sendButton = document.getElementById('send');

messageInput.addEventListener('input', () => {
    const message = messageInput.value.trim();
    sendButton.disabled = message === '';
});

// ensaje
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();

    if (message == '') {
        sendButton.disabled = true; // Deshabilitar el botón después de enviar el mensaje
    }
});