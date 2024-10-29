// User.js
export const currentUser = {
    userId: 0,
    firstName: "Jordan",
    lastName: "Legros",
    profileImage: "data/images/profil.jpg"
};

// Fonction pour afficher les informations de l'utilisateur dans le header
function displayUserInfo() {
    // Récupérer les éléments du DOM
    const profileImage = document.getElementById('profileImage');
    const userName = document.getElementById('userName');

    // Mettre à jour les éléments avec les informations de l'utilisateur
    profileImage.src = currentUser.profileImage; // Met à jour l'image de profil
    userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`; // Met à jour le nom
}

// Exécutez la fonction pour afficher les informations de l'utilisateur lorsque le document est chargé
document.addEventListener('DOMContentLoaded', displayUserInfo);

