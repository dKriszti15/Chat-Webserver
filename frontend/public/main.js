const socket = io();

socket.on('clients-total', (data) => {
    console.log(`Clients online: ${data}`);
})

const messageForm = document.getElementById('messageSendingForm');
const messageInput = document.getElementById('messageInput');
const loggedUser = document.getElementById('loggedUserP');
const messages = document.getElementById('messageContainer');

const messageSentSound = new Audio('/sentSound.mp3');
const messageRcvdSound = new Audio('/rcvdSound.mp3');

messageForm.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage();
})


function sendMessage(){
    if ( messageInput.value === '' ){ return }
    const msg = {
        from: loggedUser.innerText,
        message: messageInput.value,
        dateTime: new Date()
    }
    
    let datePart = msg.dateTime.toString().split('T')[0];
    datePart = datePart.replace(/ /g,'/');
    datePart = datePart.split(':')[0] + ':' + datePart.split(':')[1];
    datePart = datePart.split('/')[1] + '/' + datePart.split('/')[2] + '/' + datePart.split('/')[3] + " | " + datePart.split('/')[4];

    msg.dateTime = datePart;

    socket.emit('message', msg);

    messageInput.value = '';

    addMessageToUI(true, msg);
    
}

socket.on('chatMessage', (msg) => {
    console.log(msg);
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
          `
    if(ownMessage){
        messageSentSound.play();
    }
    else{
        messageRcvdSound.play();
    }
    messages.innerHTML += newMessage;
  }