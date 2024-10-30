// Données des amis
const friendsData = [
    { id: 1, name: "Alice Dupont", image: "data/images/alice.jpg" },
    { id: 2, name: "Paul Martin", image: "data/images/paul.jpg" },
    { id: 3, name: "Clara Lemoine", image: "data/images/clara.jpg" }
];

// Références aux éléments du DOM
const searchInput = document.getElementById('search');
const friendsList = document.getElementById('friends-list');

// Fonction pour générer la liste d'amis dans le DOM
function generateFriendsList() {
    friendsList.innerHTML = ''; // Réinitialiser la liste
    friendsData.forEach(friend => {
        
        const friendDiv = document.createElement('div');
        friendDiv.classList.add('friend');
        friendDiv.setAttribute('draggable', 'true');
        friendDiv.setAttribute('data-userid', friend.id);

        friendDiv.innerHTML = `
            <img src="${friend.image}" alt="${friend.name}" class="user-image" />
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
        // Récupérer l'index des éléments dans la liste
        const draggedIndex = Array.from(friendsList.children).indexOf(draggedElement);
        const targetIndex = Array.from(friendsList.children).indexOf(e.currentTarget);

        // Si l'élément déplacé vient avant l'élément ciblé, insérez-le après
        if (draggedIndex < targetIndex) {
            e.currentTarget.insertAdjacentElement('afterend', draggedElement);
        } else {
            // Sinon, insérez-le avant
            friendsList.insertBefore(draggedElement, e.currentTarget);
        }
    }
}

// Fonction pour filtrer les amis par nom ou prénom
function filterFriends() {
    const searchTerm = searchInput.value.toLowerCase();
    const friends = Array.from(friendsList.children);

    friends.forEach(friend => {
        const name = friend.querySelector('span').textContent.toLowerCase();
        friend.style.display = name.includes(searchTerm) ? '' : 'none'; // Afficher ou masquer
    });
}

// Événement de recherche
searchInput.addEventListener('input', filterFriends);

// Générer la liste d'amis au chargement de la page
document.addEventListener("DOMContentLoaded", generateFriendsList);
