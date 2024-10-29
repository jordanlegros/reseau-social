// Données des amis
const friendsData = [
    { id: 1, name: "Alice Dupont", image: "data/images/alice.jpg" },
    { id: 2, name: "Paul Martin", image: "data/images/paul.jpg" },
    { id: 3, name: "Clara Lemoine", image: "data/images/clara.jpg" }
];

// Références aux éléments du DOM
const friendsList = document.getElementById('friends-list');

// Fonction pour générer la liste d'amis dans le DOM
function generateFriendsList() {
    friendsData.forEach(friend => {
        const friendDiv = document.createElement('div');
        friendDiv.classList.add('friend');
        friendDiv.setAttribute('draggable', 'true');
        friendDiv.setAttribute('data-userid', friend.id);

        friendDiv.innerHTML = `
            <img src="${friend.image}" alt="${friend.name}" />
            <span>${friend.name}</span>
        `;

        friendsList.appendChild(friendDiv);

        // Ajouter les événements de drag and drop
        friendDiv.addEventListener('dragstart', dragStart);
        friendDiv.addEventListener('dragover', dragOver);
        friendDiv.addEventListener('drop', drop);
    });
}

// Variable pour stocker l'élément actuellement en cours de déplacement
let draggedElement = null;

// Fonction pour gérer le début du drag
function dragStart(e) {
    draggedElement = e.currentTarget; // Stocker l'élément en cours de glissement
    e.dataTransfer.effectAllowed = "move";
}

// Fonction pour permettre le drop
function dragOver(e) {
    e.preventDefault(); // Nécessaire pour autoriser le drop
}

// Fonction pour gérer le drop
function drop(e) {
    e.preventDefault();
    if (draggedElement !== e.currentTarget) {
        // Insérer l'élément déplacé avant l'élément ciblé
        friendsList.insertBefore(draggedElement, e.currentTarget);
    }
}

// Générer la liste d'amis au chargement de la page
document.addEventListener("DOMContentLoaded", generateFriendsList);
