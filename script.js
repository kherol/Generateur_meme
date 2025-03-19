// Récupérer les éléments nécessaires
const uploadImage = document.getElementById('uploadImage');
const topText = document.getElementById('topText');
const bottomText = document.getElementById('bottomText');
const fontSelector = document.getElementById('fontSelector');
const fontSize = document.getElementById('fontSize');
const textColor = document.getElementById('textColor');
const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const downloadButton = document.getElementById('downloadMeme');
const shareButton = document.getElementById('shareMeme');

const CANVAS_WIDTH = 350;
const CANVAS_HEIGHT = 350;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

let image = new Image();
let imageLoaded = false;

// Vérifier si une image est chargée
function checkImageLoaded() {
    if (!imageLoaded) {
        alert("❌ Veuillez sélectionner une image avant de continuer.");
        return false;
    }
    return true;
}

// Récupérer un fichier local et le convertir en texte
uploadImage.addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (!file) {
        alert("❌ Aucun fichier sélectionné. Veuillez choisir une image.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        image.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// Charger l'image dans le canvas
image.onload = function() {
    imageLoaded = true;
    drawMeme();
};

// Fonction pour dessiner le mème
function drawMeme() {
    if (!imageLoaded) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Paramètres du texte
    const font = fontSelector.value;
    const size = fontSize.value + 'px';
    ctx.font = `bold ${size} ${font}`;
    ctx.fillStyle = textColor.value;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';

    // Texte en haut
    ctx.fillText(topText.value.toUpperCase(), CANVAS_WIDTH / 2, parseInt(fontSize.value));
    ctx.strokeText(topText.value.toUpperCase(), CANVAS_WIDTH / 2, parseInt(fontSize.value));

    // Texte en bas
    ctx.fillText(bottomText.value.toUpperCase(), CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
    ctx.strokeText(bottomText.value.toUpperCase(), CANVAS_WIDTH / 2, CANVAS_HEIGHT - 20);
}

// Mise à jour du texte en temps réel
topText.addEventListener('input', drawMeme);
bottomText.addEventListener('input', drawMeme);
fontSelector.addEventListener('change', drawMeme);
fontSize.addEventListener('input', drawMeme);
textColor.addEventListener('input', drawMeme);

// Télécharger le mème
downloadButton.addEventListener('click', function() {
    if (!checkImageLoaded()) return;

    const memeURL = canvas.toDataURL();
    const fileName = prompt('Entrez le nom de votre mème :', 'meme');
    if (!fileName) return;

    const link = document.createElement('a');
    link.download = fileName + '.png';
    link.href = memeURL;
    link.click();
});

// Partager le mème
shareButton.addEventListener('click', function() {
    if (!checkImageLoaded()) return;

    const memeURL = canvas.toDataURL();
    const blob = dataURLtoBlob(memeURL);
    const file = new File([blob], 'meme.png', { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
            files: [file],
            title: 'Regarde mon mème !',
            text: 'Regarde mon mème'
        }).catch(err => console.log('⚠️ Échec du partage : ', err));
    } else {
        alert('❌ Votre appareil ne supporte pas le partage direct.');
    }
});

// Fonction pour convertir DataURL en Blob
function dataURLtoBlob(dataURL) {
    let arr = dataURL.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}
