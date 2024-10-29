let currentConversation; // Déclaration globale

document.addEventListener("DOMContentLoaded", () => {
    // Load the messages JSON
    fetch('../data/json/messages.json') // Adjust the path as needed
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(messagesData => {
            displayConversations(messagesData); // Pass the loaded messages data to display function
        })
        .catch(error => console.error('Error loading messages data:', error));
});

// Display the list of conversations
function displayConversations(messagesData) {
    const conversationsList = document.getElementById('conversations-list');
    messagesData.conversations.forEach(conv => {
        const convElement = document.createElement('div');
        convElement.classList.add('conversation');
        convElement.textContent = `${conv.participants.map(p => p.firstname).join(', ')} - ${conv.messages[conv.messages.length - 1].content}`;
        convElement.onclick = () => openConversation(conv);
        conversationsList.appendChild(convElement);
    });
}

// Open a conversation and display messages
function openConversation(conv) {
    const chatWindow = document.getElementById('chat-window');
    const messagesDiv = document.getElementById('messages');
    currentConversation = conv; // Utilisation de la variable globale
    chatWindow.style.display = 'block';
    messagesDiv.innerHTML = '';
    
    conv.messages.forEach(msg => {
        const msgElement = document.createElement('div');
        msgElement.classList.add(msg.senderId === conv.participants[0].userId ? 'message-sent' : 'message-received');
        msgElement.innerHTML = `<strong>${conv.participants.find(p => p.userId === msg.senderId).firstname}:</strong> ${msg.content} <small>${new Date(msg.timestamp).toLocaleString()}</small>`;
        messagesDiv.appendChild(msgElement);
    });
}

// Send a new message
const sendMessageButton = document.getElementById('send-message');
const newMessageInput = document.getElementById('new-message');
sendMessageButton.onclick = () => {
    const newMessageContent = newMessageInput.value;
    if (newMessageContent && currentConversation) {
        const newMessage = {
            id: Date.now(), // ID based on the timestamp
            senderId: currentConversation.participants[0].userId,
            content: newMessageContent,
            timestamp: new Date().toISOString()
        };
        
        // Add the message to the current conversation (simulated here)
        currentConversation.messages.push(newMessage);
        
        // Update the interface
        const messagesDiv = document.getElementById('messages');
        const msgElement = document.createElement('div');
        msgElement.classList.add('message-sent');
        msgElement.innerHTML = `<strong>${currentConversation.participants[0].firstname}:</strong> ${newMessageContent} <small>${new Date(newMessage.timestamp).toLocaleString()}</small>`;
        messagesDiv.appendChild(msgElement);
        
        // Clear the input field
        newMessageInput.value = '';
    }
};
