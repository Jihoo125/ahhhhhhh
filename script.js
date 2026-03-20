const themeToggle = document.getElementById('themeToggle');
const storageKey = 'noteflow-theme';

const applyTheme = (theme) => {
  document.body.classList.toggle('light', theme === 'light');
  themeToggle.textContent = theme === 'light' ? '다크 모드 전환' : '라이트 모드 전환';
};

const savedTheme = localStorage.getItem(storageKey);
if (savedTheme) {
  applyTheme(savedTheme);
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light') ? 'dark' : 'light';
  localStorage.setItem(storageKey, nextTheme);
  applyTheme(nextTheme);
});
