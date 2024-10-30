// Fonction de sanitation des commentaires
export function sanitize(input) {
    const tempElement = document.createElement('div');
    tempElement.textContent = input; // Convertir le texte en texte brut pour éviter les balises HTML
    return tempElement.innerHTML; // Retourner le contenu
}