// DisplayFeed.js
import { createCommentSection } from './DisplayComs.js';

// Chargement des posts depuis un fichier JSON une fois que le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
    fetch('../data/json/feed.json')
        .then(response => response.json())
        .then(data => {
            // Sélection de l'élément conteneur du flux
            const feedContainer = document.querySelector('.feed');
            // Parcours des posts et création de l'élément HTML pour chaque post
            data.posts.forEach(post => {
                const postElement = createPostElement(post);
                // Ajout de chaque post au conteneur du flux
                feedContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Erreur lors du chargement du flux :', error));
});


function createPostElement(post) {
    // Création de l'élément principal pour le post
    const postElement = document.createElement('article');
    postElement.classList.add('post');

    // Création de la section des informations de l'utilisateur
    const postUserInfo = document.createElement('div');
    postUserInfo.classList.add('post__userinfo');
    
    // Ajout de l'image de profil de l'utilisateur
    const postUserImage = document.createElement('img');
    postUserImage.classList.add('user-image');
    postUserInfo.appendChild(postUserImage);
    postUserImage.src = post.user.profileImage;
    postUserImage.alt = "Photo de profil";

    // Ajout du nom de l'utilisateur
    const postUserName = document.createElement('div');
    postUserName.classList.add('post__username');
    postUserName.textContent = `${post.user.firstname} ${post.user.lastname}`;
    postUserInfo.appendChild(postUserName);
    
    // Création du conteneur principal pour le contenu du post
    const postContent = document.createElement('div');
    postContent.classList.add('post__content');
    postElement.appendChild(postContent);
    postContent.appendChild(postUserInfo);
    
    // Vérification et ajout de l'image du post si elle est présente
    if (post.image) {
        const postImageContainer = document.createElement('div');
        postImageContainer.classList.add('post__imagecontainer');
        postContent.appendChild(postImageContainer);
        
        const postImage = document.createElement('img');
        postImage.src = post.image;
        postImage.alt = "Image du post";
        postImage.classList.add('post__image');

        // Ajout de l'image dans le conteneur du post
        postImageContainer.appendChild(postImage);
    }

    // Création de l'élément pour le texte du post
    const postText = document.createElement('p');
    postText.classList.add('post__text');
    postText.textContent = post.content;
    postContent.appendChild(postText);

    // Création et ajout de la section de commentaires en utilisant la fonction importée
    const postComments = createCommentSection(post);
    postElement.appendChild(postComments);
    
    return postElement;
}
