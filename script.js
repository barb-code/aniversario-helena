const videoCounter = document.getElementById('videoCounter');
const memeVideo = document.getElementById('memeVideo');
const photoInput = document.getElementById('photoInput');
const memeTextInput = document.getElementById('memeText');
const memeSubtextInput = document.getElementById('memeSubtext');
const canvas = document.getElementById('stickerCanvas');
const ctx = canvas.getContext('2d');

function formatCounter(value) {
  return `${(value / 1000).toFixed(1)}k`;
}

let counterValue = 1200;
if (videoCounter) {
  setInterval(() => {
    counterValue += Math.floor(Math.random() * 8) + 2;
    videoCounter.textContent = formatCounter(counterValue);
  }, 5000);
}

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

document.getElementById('watchVideoBtn')?.addEventListener('click', () => {
  scrollToSection('videoSection');
  memeVideo?.play().catch(() => {});
});

document.getElementById('stickerBtn')?.addEventListener('click', () => {
  scrollToSection('stickerSection');
  photoInput?.click();
});

document.getElementById('replayBtn')?.addEventListener('click', () => {
  memeVideo?.play();
});

function shareText(text) {
  const shareData = {
    title: 'Helena 15 anos',
    text,
    url: window.location.href,
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
    return;
  }

  navigator.clipboard?.writeText(window.location.href).then(() => {
    alert('Link copiado para a área de transferência!');
  }).catch(() => {
    alert('Compartilhe esse link: ' + window.location.href);
  });
}

document.getElementById('copyLinkBtn')?.addEventListener('click', () => {
  shareText('Venha curtir o aniversário da Helena!');
});

document.getElementById('shareEventBtn')?.addEventListener('click', () => {
  shareText('É que breve completarei 15 anos... mas está com cara de 61!');
});

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSticker(image) {
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#120f1b');
  bg.addColorStop(1, '#2a1636');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = 'rgba(255, 216, 77, 0.12)';
  for (let i = 0; i < 18; i += 1) {
    const x = (i * 67) % w;
    const y = (i * 113) % h;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
  }

  roundRect(ctx, 42, 42, w - 84, h - 84, 44);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fill();
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#ffd84d';
  ctx.stroke();

  const photoX = 104;
  const photoY = 128;
  const photoW = w - (photoX * 2);
  const photoH = h * 0.56;

  roundRect(ctx, photoX, photoY, photoW, photoH, 28);
  ctx.save();
  ctx.clip();
  ctx.drawImage(image, photoX, photoY, photoW, photoH);
  ctx.restore();

  ctx.strokeStyle = '#ff4fb3';
  ctx.lineWidth = 10;
  ctx.stroke();

  ctx.fillStyle = '#f5f7ff';
  ctx.textAlign = 'center';
  ctx.font = '700 54px "Baloo 2", sans-serif';
  ctx.fillText(memeTextInput.value.toUpperCase(), w / 2, photoY + photoH + 94);

  ctx.fillStyle = '#ff4fb3';
  ctx.font = '800 72px "Baloo 2", sans-serif';
  ctx.fillText(memeSubtextInput.value.toUpperCase(), w / 2, photoY + photoH + 182);

  ctx.fillStyle = '#ffd84d';
  ctx.font = '700 28px "Inter", sans-serif';
  ctx.fillText('#HEBE15', w / 2, h - 90);
}

function loadImageFromFile(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      drawSticker(img);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

photoInput?.addEventListener('change', (event) => {
  const file = event.target.files?.[0];
  if (file) {
    loadImageFromFile(file);
  }
});

document.getElementById('generateStickerBtn')?.addEventListener('click', () => {
  const file = photoInput?.files?.[0];
  if (!file) {
    alert('Selecione uma foto antes de gerar a figurinha.');
    return;
  }
  loadImageFromFile(file);
});

function downloadSticker(type) {
  const fileName = `figurinha-hebe.${type}`;
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, type === 'png' ? 'image/png' : 'image/webp', type === 'png' ? 1 : 0.92);
}

document.getElementById('downloadPngBtn')?.addEventListener('click', () => downloadSticker('png'));
document.getElementById('downloadWebpBtn')?.addEventListener('click', () => downloadSticker('webp'));

document.getElementById('shareStickerBtn')?.addEventListener('click', () => {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const file = new File([blob], 'figurinha-hebe.webp', { type: 'image/webp' });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({
        title: 'Helena 15 anos',
        text: 'Olha minha figurinha do aniversário da Helena!',
        files: [file],
      }).catch(() => {});
      return;
    }
    shareText('Olha minha figurinha do aniversário da Helena!');
  }, 'image/webp', 0.9);
});

const defaultImage = new Image();
defaultImage.onload = () => drawSticker(defaultImage);
defaultImage.src = 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80';

memeTextInput?.addEventListener('input', () => {
  if (defaultImage.complete) drawSticker(defaultImage);
});

memeSubtextInput?.addEventListener('input', () => {
  if (defaultImage.complete) drawSticker(defaultImage);
});
