

async function sendMessage(id){
    console.log(id);
    const user = id.split('-')[0];
    const userTextboxId = user + 'textbox';
    console.log(user);
    const messageBox = document.getElementById(userTextboxId);
    const newMessage = document.createElement("li");
    newMessage.innerText = messageBox.value;
    messages = document.getElementById("messages");
    messages.appendChild(newMessage);
}


const sendbutton = document.getElementsByClassName("sendButton");
Array.from(sendbutton).forEach((button) => {
    button.addEventListener('click', () => sendMessage(button.id) );
})
