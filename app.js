const photos = Array.from({ length: 14 }, (_, i) => `foto${i + 1}.jpeg`);
let currentPhoto = 0;
let musicStarted = false;
const mainPhoto = document.getElementById('mainPhoto');
const stage = document.getElementById('stage');
const thumbs = document.getElementById('thumbs');
const player = document.getElementById('player');
const heroMusic = document.getElementById('heroMusic');
const music = document.getElementById('music');
const playerButton = document.getElementById('playerButton');
const musicStatus = document.getElementById('musicStatus');
const MUSIC_START = 63;

function createHearts() {
  const wrap = document.getElementById('ambient');
  for (let i = 0; i < 20; i++) {
    const h = document.createElement('span');
    h.className = 'float-heart';
    h.textContent = i % 3 === 0 ? '♡' : '♥';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.fontSize = 12 + Math.random() * 24 + 'px';
    h.style.animationDuration = 10 + Math.random() * 14 + 's';
    h.style.animationDelay = -Math.random() * 18 + 's';
    wrap.appendChild(h);
  }
}

function buildThumbs() {
  photos.forEach((src, index) => {
    const button = document.createElement('button');
    button.className = 'thumb' + (index === 0 ? ' active' : '');
    button.setAttribute('aria-label', `Abrir foto ${index + 1}`);
    button.innerHTML = `<img src="${src}" alt="Miniatura ${index + 1}" loading="lazy">`;
    button.addEventListener('click', () => showPhoto(index));
    thumbs.appendChild(button);
  });
}

function showPhoto(index) {
  currentPhoto = (index + photos.length) % photos.length;
  mainPhoto.classList.add('changing');
  setTimeout(() => {
    const src = photos[currentPhoto];
    mainPhoto.src = src;
    mainPhoto.alt = `Nossa foto ${currentPhoto + 1}`;
    stage.style.setProperty('--stage-bg', `url("${src}")`);
    document.getElementById('photoCount').textContent = `${currentPhoto + 1} / ${photos.length}`;
    [...thumbs.children].forEach((el, i) => el.classList.toggle('active', i === currentPhoto));
    thumbs.children[currentPhoto]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    mainPhoto.classList.remove('changing');
  }, 180);
}

function changePhoto(step) { showPhoto(currentPhoto + step); }
function scrollToGallery() { document.getElementById('memorias').scrollIntoView({ behavior: 'smooth' }); }

mainPhoto.addEventListener('click', () => {
  document.getElementById('lightboxImg').src = photos[currentPhoto];
  document.getElementById('lightbox').classList.add('show');
  document.body.classList.add('locked');
});

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
  document.body.classList.remove('locked');
}
function closeLightboxBackdrop(e) { if (e.target.id === 'lightbox') closeLightbox(); }

function openLetter() {
  document.getElementById('letterModal').classList.add('show');
  document.body.classList.add('locked');
}
function closeLetter() {
  document.getElementById('letterModal').classList.remove('show');
  document.body.classList.remove('locked');
}
function closeLetterBackdrop(e) { if (e.target.id === 'letterModal') closeLetter(); }

function syncMusicUI() {
  const playing = !music.paused;
  player.classList.add('show');
  playerButton.textContent = playing ? '⏸' : '▶';
  heroMusic.textContent = playing ? '⏸️ Pausar música' : '🎵 Tocar nossa música';
  musicStatus.textContent = playing ? 'tocando a partir de 1:03' : 'a partir de 1:03';
}

async function playMusic() {
  if (!musicStarted || music.currentTime < MUSIC_START - 1) {
    music.currentTime = MUSIC_START;
    musicStarted = true;
  }
  try {
    await music.play();
  } catch (e) {
    musicStatus.textContent = 'toque no botão para iniciar';
  }
  syncMusicUI();
}

function pauseMusic() {
  music.pause();
  syncMusicUI();
}

async function toggleMusic() {
  if (music.paused) await playMusic();
  else pauseMusic();
}

async function startExperience() {
  document.getElementById('intro').classList.add('hidden');
  document.body.classList.remove('locked');
  await playMusic();
}

music.addEventListener('play', syncMusicUI);
music.addEventListener('pause', syncMusicUI);
music.addEventListener('ended', async () => {
  music.currentTime = MUSIC_START;
  try { await music.play(); } catch (e) {}
});
music.addEventListener('error', () => {
  player.classList.add('show');
  musicStatus.textContent = 'arquivo de áudio não encontrado';
  heroMusic.textContent = '🎵 Tocar nossa música';
  playerButton.textContent = '▶';
});

function updateLiveLine() {
  const now = new Date();
  const start = new Date('2024-08-12T19:30:00-03:00');
  const diff = Math.max(0, now - start);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  document.getElementById('liveLine').textContent = `Desde 12/08/2024 às 19:30 · ${days} dias, ${hours}h ${minutes}m ${seconds}s de história`;
}

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) entry.target.classList.add('visible');
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.getElementById('openSite').addEventListener('click', startExperience);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeLetter();
    closeLightbox();
  }
  if (e.key === 'ArrowRight') changePhoto(1);
  if (e.key === 'ArrowLeft') changePhoto(-1);
});

createHearts();
buildThumbs();
showPhoto(0);
updateLiveLine();
setInterval(updateLiveLine, 1000);
