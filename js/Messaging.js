let currentConversation; // Déclaration globale

document.addEventListener("DOMContentLoaded", () => {
    // Charger le JSON des messages
    fetch('../data/json/messages.json') // Ajuster le chemin si nécessaire
        .then(response => {
            if (!response.ok) {
                throw new Error('La réponse du réseau n\'était pas correcte');
            }
            return response.json();
        })
        .then(messagesData => {
            displayConversations(messagesData); // Passer les données de messages chargées à la fonction d'affichage
            // Ouvrir la première conversation par défaut
            if (messagesData.conversations.length > 0) {
                openConversation(messagesData.conversations[0]); // Ouvrir la première conversation
            }
        })
        .catch(error => console.error('Erreur lors du chargement des données des messages :', error));
});

// Afficher la liste des conversations
function displayConversations(messagesData) {
    const conversationsList = document.getElementById('conversations-list');
    messagesData.conversations.forEach(conv => {
        const convElement = document.createElement('div');
        convElement.classList.add('conversation');
        convElement.textContent = `${conv.participants.map(p => p.firstname).join(', ')} - ${conv.messages[conv.messages.length - 1].content}`;
        convElement.onclick = () => openConversation(conv); // Ouvrir la conversation au clic
        conversationsList.appendChild(convElement);
    });
}

// Ouvrir une conversation et afficher les messages
function openConversation(conv) {
    const chatWindow = document.getElementById('chat-window');
    const messagesDiv = document.getElementById('messages');
    currentConversation = conv; // Utilisation de la variable globale
    chatWindow.style.display = 'block'; // Afficher la fenêtre de chat
    messagesDiv.innerHTML = ''; // Réinitialiser le contenu des messages
    
    conv.messages.forEach(msg => {
        const msgElement = document.createElement('div');
        msgElement.classList.add(msg.senderId === conv.participants[0].userId ? 'message-sent' : 'message-received'); // Déterminer si le message est envoyé ou reçu
        msgElement.innerHTML = `<strong>${conv.participants.find(p => p.userId === msg.senderId).firstname}:</strong> ${msg.content} <small>${new Date(msg.timestamp).toLocaleString()}</small>`;
        messagesDiv.appendChild(msgElement); // Ajouter le message à l'affichage
    });
}

// Envoyer un nouveau message
const sendMessageButton = document.getElementById('send-message');
const newMessageInput = document.getElementById('new-message');

// Fonction pour gérer l'envoi d'un nouveau message
function sendNewMessage() {
    const newMessageContent = newMessageInput.value; // Contenu du nouveau message
    if (newMessageContent && currentConversation) { // Vérifier si le contenu n'est pas vide et si une conversation est ouverte
        const newMessage = {
            id: Date.now(), // ID basé sur le timestamp
            senderId: currentConversation.participants[0].userId, // ID de l'expéditeur
            content: newMessageContent, // Contenu du message
            timestamp: new Date().toISOString() // Timestamp du message
        };
        
        // Simuler l'envoi du message vers le JSON (simulation locale)
        currentConversation.messages.push(newMessage); // Ajouter le message à la conversation actuelle
        
        // Mettre à jour l'interface
        const messagesDiv = document.getElementById('messages');
        const msgElement = document.createElement('div');
        msgElement.classList.add('message-sent'); // Classe pour les messages envoyés
        msgElement.innerHTML = `<strong>${currentConversation.participants[0].firstname}:</strong> ${newMessageContent} <small>${new Date(newMessage.timestamp).toLocaleString()}</small>`;
        messagesDiv.appendChild(msgElement); // Ajouter le message à l'affichage
        
        // Effacer le champ de saisie
        newMessageInput.value = '';
    }
}

// Ajouter un écouteur d'événement au bouton d'envoi
sendMessageButton.onclick = sendNewMessage; // Appeler la fonction pour envoyer un message
