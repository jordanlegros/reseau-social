import { sanitize } from './Sanitize.js';

let currentConversation; 

document.addEventListener("DOMContentLoaded", () => {
    // Charger le JSON des messages
    fetch('../data/json/messages.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('La réponse du réseau n\'était pas correcte');
            }
            return response.json();
        })
        .then(messagesData => {
            displayConversations(messagesData); // Passer les données de messages chargées à la fonction d'affichage
            
            // Ouvrir la conversation depuis l'argument URL
            const urlParams = new URLSearchParams(window.location.search);
            const userId = urlParams.get('userId'); // Récupérer l'ID de l'utilisateur depuis l'URL
            
            if (userId) {
                const conversationToOpen = messagesData.conversations.find(conv => 
                    conv.participants.some(p => p.userId == userId) // Vérifier si l'utilisateur est dans la conversation
                );
                if (conversationToOpen) {
                    openConversation(conversationToOpen); // Ouvrir la conversation spécifique si elle existe
                } else {
                    console.error('Aucune conversation trouvée pour l\'ID utilisateur:', userId);
                }
            } else if (messagesData.conversations.length > 0) {
                openConversation(messagesData.conversations[0]); // Ouvrir la première conversation par défaut
            }
        })
        .catch(error => console.error('Erreur lors du chargement des données des messages :', error));
});

// Afficher la liste des conversations
function displayConversations(messagesData) {
    const conversationsList = document.querySelector('.messaging-section__conversations-list');
    messagesData.conversations.forEach(conv => {
        const convElement = document.createElement('div');
        convElement.classList.add('messaging-section__conversation');

        // Créer une div pour les participants
        const participantsDiv = document.createElement('div');
        participantsDiv.classList.add('messaging-section__participants');

        // Ajouter les photos de profil
        conv.participants.forEach(participant => {
            const imgElement = document.createElement('img');
            imgElement.src = participant.profileImage; // Chemin de l'image
            imgElement.alt = `${participant.firstname} ${participant.lastname}`; // Texte alternatif
            imgElement.classList.add('user-image'); // Classe pour styliser les images
            participantsDiv.appendChild(imgElement); // Ajouter l'image à la div des participants
        });

        // Ajouter le texte de la conversation
        const lastMessageContent = `${conv.messages[conv.messages.length - 1].content}`;
        const conversationText = document.createElement('span');
        conversationText.textContent = `${conv.participants.map(p => p.firstname).join(', ')} - ${lastMessageContent}`;

        // Ajouter les éléments à la conversation
        convElement.appendChild(participantsDiv); // Ajouter la div des participants
        convElement.appendChild(conversationText); // Ajouter le texte de la conversation
        
        // Ajouter un écouteur d'événement pour ouvrir la conversation
        convElement.onclick = () => openConversation(conv);
        conversationsList.appendChild(convElement); // Ajouter l'élément de conversation à la liste
    });
}

// Ouvrir une conversation et afficher les messages
function openConversation(conv) {
    const chatWindow = document.querySelector('.messaging-section__chat-window');
    const messagesDiv = document.querySelector('.messaging-section__messages');
    currentConversation = conv; 
    chatWindow.style.display = 'flex'; // Afficher la fenêtre de chat
    messagesDiv.innerHTML = ''; // Réinitialiser le contenu des messages
    
    conv.messages.forEach(msg => {
        const msgElement = document.createElement('div');
        const isSentMessage = msg.senderId === conv.participants[0].userId; // Vérifie si le message est envoyé
    
        // Déterminer la classe du message (envoyé ou reçu)
        msgElement.classList.add(isSentMessage ? 'messaging-section__message--sent' : 'messaging-section__message--received');
    
        // Récupérer le participant qui a envoyé le message
        const sender = conv.participants.find(p => p.userId === msg.senderId);
    
        // Créer une image pour le profil
        const profileImage = document.createElement('img');
        profileImage.src = sender.profileImage; // Chemin de l'image
        profileImage.alt = `${sender.firstname} ${sender.lastname}`; // Texte alternatif
        profileImage.classList.add('messaging-section__participant-image'); // Classe pour styliser l'image
    
        // Ajouter l'image et le contenu du message
        msgElement.appendChild(profileImage); // Ajouter l'image au message
        msgElement.innerHTML += `<strong>${sender.firstname}:</strong> ${msg.content} <small>${new Date(msg.timestamp).toLocaleString()}</small>`; // Ajouter le texte du message
    
        messagesDiv.appendChild(msgElement); // Ajouter le message à l'affichage
    });
    
}

// Envoyer un nouveau message
const sendMessageButton = document.querySelector('.messaging-section__send-message');
const newMessageInput = document.querySelector('.messaging-section__new-message');

// Fonction pour gérer l'envoi d'un nouveau message
function sendNewMessage() {
    const newMessageContent = sanitize(newMessageInput.value); // Contenu du nouveau message
    if (newMessageContent && currentConversation) { // Vérifier si le contenu n'est pas vide et si une conversation est ouverte
        const sender = currentConversation.participants[0]; // Expéditeur du message (premier participant)

        const newMessage = {
            id: Date.now(), // ID basé sur le timestamp
            senderId: sender.userId, // ID de l'expéditeur
            content: newMessageContent, // Contenu du message
            timestamp: new Date().toISOString() // Timestamp du message
        };
        
        // Simuler l'envoi du message vers le JSON (simulation locale)
        currentConversation.messages.push(newMessage); // Ajouter le message à la conversation actuelle
        
        // Mettre à jour l'interface
        const messagesDiv = document.querySelector('.messaging-section__messages');
        const msgElement = document.createElement('div');
        msgElement.classList.add('messaging-section__message--sent'); // Classe pour les messages envoyés

        // Créer une image pour le profil de l'expéditeur
        const profileImage = document.createElement('img');
        profileImage.src = sender.profileImage; // Chemin de l'image
        profileImage.alt = `${sender.firstname} ${sender.lastname}`; // Texte alternatif
        profileImage.classList.add('messaging-section__participant-image'); // Classe pour styliser l'image

        // Ajouter l'image, le contenu du message et le nom de l'expéditeur
        msgElement.appendChild(profileImage); // Ajouter l'image au message
        msgElement.innerHTML += `<strong>${sender.firstname}:</strong> ${newMessageContent} <small>${new Date(newMessage.timestamp).toLocaleString()}</small>`; // Ajouter le texte du message

        messagesDiv.appendChild(msgElement); // Ajouter le message à l'affichage
        
        // Effacer le champ de saisie
        newMessageInput.value = '';

        // Faire défiler vers le bas pour voir le dernier message
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}

// Ajouter un écouteur d'événement au bouton d'envoi
sendMessageButton.onclick = sendNewMessage; // Appeler la fonction pour envoyer un message

// Ajouter un écouteur d'événement sur le champ de saisie pour détecter "Entrée"
newMessageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') { 
        event.preventDefault(); // Empêche le saut de ligne dans le champ de texte
        sendNewMessage(); // Envoie le message
    }
});