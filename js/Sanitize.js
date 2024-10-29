// Fonction de sanitation des commentaires
export function sanitize(input) {
    // Créer un élément temporaire pour échapper le contenu
    const tempElement = document.createElement('div');
    tempElement.textContent = input; // Convertir le texte en texte brut pour éviter les balises HTML
    return tempElement.innerHTML; // Retourner le contenu échappé
}