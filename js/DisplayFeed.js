// DisplayFeed.js
import { createCommentSection } from './DisplayComs.js';

document.addEventListener("DOMContentLoaded", () => {
    // Charger le JSON du flux
    fetch('../data/json/feed.json')
        .then(response => response.json())
        .then(data => {
            const feedContainer = document.querySelector('.feed');
            data.posts.forEach(post => {
                const postElement = createPostElement(post);
                feedContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Erreur lors du chargement du flux :', error));
});

// Fonction pour créer un élément de post
function createPostElement(post) {
    const postElement = document.createElement('article');
    postElement.classList.add('post');

    const postUserInfo = document.createElement('div');
    postUserInfo.classList.add('post__userinfo');
    
    const postUserImage = document.createElement('img');
    postUserImage.classList.add('user-image');
    postUserInfo.appendChild(postUserImage);
    postUserImage.src = post.user.profileImage;
    postUserImage.alt = "Photo de profil";

    const postUserName = document.createElement('div');
    postUserName.classList.add('post__username');
    postUserName.textContent= `${post.user.firstname} ${post.user.lastname}`;
    postUserInfo.appendChild(postUserName);
    
    const postContent = document.createElement('div');
    postContent.classList.add('post__content');
    postElement.appendChild(postContent);
    postContent.appendChild(postUserInfo);
    
    // Ajouter l'image du post si elle existe
    if (post.image) {
        const postImageContainer = document.createElement('div');
        postImageContainer.classList.add('post__imagecontainer');
        postContent.appendChild(postImageContainer);
        const postImage = document.createElement('img');
        postImage.src = post.image;
        postImage.alt = "Image du post";
        postImage.classList.add('post__image');
        postImageContainer.appendChild(postImage);
    }

    // Ajouter le texte du post
    const postText = document.createElement('p');
    postText.classList.add('post__text');
    postText.textContent = post.content;
    postContent.appendChild(postText);

    // Ajouter la section des commentaires au post
    const postComments = createCommentSection(post);
    postElement.appendChild(postComments);
    
    return postElement;
}
