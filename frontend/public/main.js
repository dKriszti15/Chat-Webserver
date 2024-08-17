const socket = io();

socket.on('clients-total', (data) => {
  console.log(`Clients online: ${data}`);
});

const messageForm = document.getElementById('messageSendingForm');
const messageInput = document.getElementById('messageInput');
const loggedUser = document.getElementById('loggedUserP').innerText;
const messages = document.getElementById('messageContainer');
const toUser = document.getElementById('toUser').value;

const messageSentSound = new Audio('/sentSound.mp3');
const messageRcvdSound = new Audio('/rcvdSound.mp3');

// Register the user
socket.emit('register', loggedUser);

messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  sendMessage();
});

function sendMessage(){
  if ( messageInput.value === '' ){ return }

  const toUsername = document.getElementById('toUser').value;

  let msg;

  if(toUsername){
    msg = {
    from: loggedUser,
    to: toUsername,
    message: messageInput.value,
    dateTime: new Date().toLocaleString()
    }
  } else {
    msg = {
    from: loggedUser,
    to: '',
    message: messageInput.value,
    dateTime: new Date().toLocaleString()
  }
  }

  if ( msg.to === '' ){
    socket.emit('message', msg);
  } else {
    socket.emit('privateMessage', msg);
  }
  
  messageInput.value = '';

  addMessageToUI(true, msg);
  
}

socket.on('chatMessage', ( msg ) => {
  addMessageToUI(false, msg);
})

socket.on('privateChatMessage', ( msg ) => {
addMessageToUI(false, msg);
})

function addMessageToUI(ownMessage, msg) {
  const newMessage = `
    <li class="${ownMessage ? 'messageRight' : 'messageLeft'}">
      <p class="message">
        <span>${msg.from}: ${msg.message}</span>
        <br>
        <span> ● ${(msg.dateTime)}</span>
      </p>
    </li>
  `;
  if (ownMessage) {
    messageSentSound.play();
  } else {
    messageRcvdSound.play();
  }
  messages.innerHTML += newMessage;
}
