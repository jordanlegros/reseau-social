export const currentUser = {
    userId: 0,
    firstName: "Jordan",
    lastName: "Legros",
    profileImage: "data/images/profil.jpg"
};

// Fonction pour afficher les informations de l'utilisateur dans le header
export function displayUserInfo() {
    // Récupérer les éléments du DOM
    const profileImage = document.getElementById('profileImage');
    const userName = document.getElementById('userName');

    // Mettre à jour les éléments avec les informations de l'utilisateur
    if (profileImage && userName) {  // Vérifie que les éléments existent
        profileImage.src = currentUser.profileImage;
        userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    }
}

// Appeler la fonction pour afficher les informations de l'utilisateur
displayUserInfo();