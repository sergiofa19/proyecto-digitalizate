// Menú de navegación móvil
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Música de fondo: intenta autoplay; si el navegador lo bloquea,
// arranca en el primer gesto del usuario. Siempre disponible un botón de pausa.
const audio = document.getElementById('bg-audio');
const musicToggle = document.getElementById('music-toggle');
const musicLabel = musicToggle.querySelector('.music-label');

audio.volume = 0.4;

function setPlayingUI(isPlaying) {
  musicToggle.classList.toggle('paused', !isPlaying);
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
  musicToggle.setAttribute('aria-label', isPlaying ? 'Pausar música de fondo' : 'Reproducir música de fondo');
  musicLabel.textContent = isPlaying ? 'Sonido' : 'Pausado';
}

function tryAutoplay() {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => setPlayingUI(true))
      .catch(() => {
        // Autoplay bloqueado por el navegador: esperamos un gesto del usuario.
        setPlayingUI(false);
        const resumeOnGesture = () => {
          audio.play().then(() => setPlayingUI(true)).catch(() => {});
          document.removeEventListener('click', resumeOnGesture);
          document.removeEventListener('keydown', resumeOnGesture);
        };
        document.addEventListener('click', resumeOnGesture, { once: true });
        document.addEventListener('keydown', resumeOnGesture, { once: true });
      });
  }
}

musicToggle.addEventListener('click', () => {
  if (audio.paused) {
    audio.play().then(() => setPlayingUI(true)).catch(() => {});
  } else {
    audio.pause();
    setPlayingUI(false);
  }
});

window.addEventListener('DOMContentLoaded', tryAutoplay);
