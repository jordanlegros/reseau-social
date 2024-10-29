import { sanitize } from './Sanitize.js';
import { currentUser } from './User.js';

// Fonction pour créer la section des commentaires pour un post
export function createCommentSection(post) {
    const postComments = document.createElement('div');
    postComments.classList.add('post__comments');

    const commentsTitle = document.createElement('h3');
    commentsTitle.classList.add('post__comments-title');
    commentsTitle.textContent = "Commentaires";
    postComments.appendChild(commentsTitle);

    const commentsList = document.createElement('ul');
    commentsList.classList.add('post__comments-list');
    post.comments.forEach(comment => {
        const commentElement = createCommentElement(comment, post);
        commentsList.appendChild(commentElement);
    });
    postComments.appendChild(commentsList);

    // Champ de saisie pour le commentaire
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.classList.add('post__comment-input');
    commentInput.placeholder = "Ajouter un commentaire...";
    postComments.appendChild(commentInput);

    // Bouton pour ajouter le commentaire
    const commentBtn = document.createElement('button');
    commentBtn.classList.add('post__comment-btn');
    commentBtn.textContent = "Commenter";
    commentBtn.addEventListener('click', () => addComment(post, commentInput.value));
    commentInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') addComment(post, commentInput.value);
    });
    postComments.appendChild(commentBtn);

    return postComments;
}

// Fonction pour créer un élément de commentaire
function createCommentElement(comment, post) {
    const commentItem = document.createElement('li');
    commentItem.classList.add('post__comment-item');

    const commentText = document.createElement('p');
    commentText.classList.add('post__comment-text');
    commentText.textContent = `${comment.user.firstname} ${comment.user.lastname} : ${comment.content}`;
    commentItem.appendChild(commentText);

    // Créer une liste pour les sous-commentaires
    const subCommentsList = document.createElement('ul');
    subCommentsList.classList.add('post__sub-comments-list');
    commentItem.appendChild(subCommentsList); // Placez la liste ici pour tous les commentaires

    if (comment.comments && comment.comments.length > 0) {
        comment.comments.forEach(subComment => {
            const subCommentElement = createSubCommentElement(subComment, post);
            subCommentsList.appendChild(subCommentElement);
        });
    }

    // Ajoutez le champ de réponse uniquement pour les commentaires de niveau 1
    const replyInput = document.createElement('input');
    replyInput.type = 'text';
    replyInput.classList.add('post__reply-input');
    replyInput.placeholder = "Répondre au commentaire...";
    commentItem.appendChild(replyInput);

    const replyBtn = document.createElement('button');
    replyBtn.classList.add('post__reply-btn');
    replyBtn.textContent = "Répondre";
    replyBtn.addEventListener('click', () => addReply(post, comment, replyInput.value, replyInput, commentItem)); // Passer commentItem ici
    replyInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') addReply(post, comment, replyInput.value, replyInput, commentItem); // Passer commentItem ici
    });
    commentItem.appendChild(replyBtn);

    return commentItem;
}

// Fonction pour créer un élément de sous-commentaire
function createSubCommentElement(subComment, post) {
    const subCommentItem = document.createElement('li');
    subCommentItem.classList.add('post__sub-comment-item');

    const subCommentText = document.createElement('p');
    subCommentText.classList.add('post__sub-comment-text');
    subCommentText.textContent = `${subComment.user.firstname} ${subComment.user.lastname} : ${subComment.content}`;
    subCommentItem.appendChild(subCommentText);

    // Les sous-commentaires n'ont pas de champ de réponse
    return subCommentItem;
}

async function addComment(post, commentContent) {
    if (commentContent.trim() === "") return;
    const sanitizedContent = sanitize(commentContent);

    const newComment = {
        user: {
            firstname: currentUser.firstName,
            lastname: currentUser.lastName
        },
        content: sanitizedContent,
        comments: [] // Pas de sous-commentaire pour un nouveau commentaire
    };

    post.comments.push(newComment); // Ajoutez le nouveau commentaire à la liste des commentaires

    const commentsList = document.querySelector('.post__comments-list');
    const commentElement = createCommentElement(newComment, post);
    commentsList.appendChild(commentElement); // Affichez le nouveau commentaire

    document.querySelector('.post__comment-input').value = ''; // Réinitialiser le champ de saisie

    await sendCommentToServer(post.id, newComment);
}

async function addReply(post, comment, replyContent, replyInput, commentItem) {
    if (replyContent.trim() === "") return;
    const sanitizedContent = sanitize(replyContent);

    const newReply = {
        user: {
            firstname: currentUser.firstName,
            lastname: currentUser.lastName
        },
        content: sanitizedContent,
        comments: [] // Pas de sous-commentaire pour une réponse
    };

    comment.comments.push(newReply); // Ajoutez la réponse au commentaire parent

    // Récupérer ou créer la liste des sous-commentaires
    const subCommentsList = commentItem.querySelector('.post__sub-comments-list');
    const replyElement = createSubCommentElement(newReply, post);
    subCommentsList.appendChild(replyElement); // Affichez la réponse sous le commentaire

    replyInput.value = ''; // Réinitialiser le champ de réponse

    await sendCommentToServer(post.id, newReply);
}

// Fonction fictive pour gérer l'envoi de commentaires vers le serveur
async function sendCommentToServer(postId, comment) {
    // Logique de l'appel au serveur (placeholder)
    console.log(`Comment sent to server: Post ID: ${postId}, Comment:`, comment);
}
