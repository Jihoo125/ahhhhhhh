const themeToggle = document.getElementById('themeToggle');
const storageKey = 'noteflow-theme';

const applyTheme = (theme) => {
  document.body.classList.toggle('light', theme === 'light');
  if (themeToggle) {
    themeToggle.textContent = theme === 'light' ? '다크 모드 전환' : '라이트 모드 전환';
  }
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

const form = document.querySelector('form');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    interest: formData.get('interest')
  };

  try {
    const res = await fetch(`${window.NOTEFLOW_CONFIG.apiBaseUrl}/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(window.NOTEFLOW_CONFIG.apiKey
          ? { 'x-api-key': window.NOTEFLOW_CONFIG.apiKey }
          : {})
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || '요청 실패');
    }

    alert('문의가 등록되었습니다.');
    form.reset();
  } catch (err) {
    console.error(err);
    alert('전송 중 오류가 발생했습니다.');
  }
});
