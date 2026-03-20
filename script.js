const themeToggle = document.getElementById('themeToggle');
const storageKey = 'noteflow-theme';

function applyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');

  if (themeToggle) {
    themeToggle.textContent =
      theme === 'light' ? '다크 모드 전환' : '라이트 모드 전환';
  }
}

const savedTheme = localStorage.getItem(storageKey);
if (savedTheme) {
  applyTheme(savedTheme);
}

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.classList.contains('light') ? 'dark' : 'light';
  localStorage.setItem(storageKey, nextTheme);
  applyTheme(nextTheme);
});

const form =
  document.querySelector('form') ||
  document.querySelector('.contact-form') ||
  document.getElementById('contactForm');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const payload = {
    name: String(formData.get('name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    interest: String(formData.get('interest') || '').trim()
  };

  if (!payload.name || !payload.email) {
    alert('이름과 이메일을 입력해주세요.');
    return;
  }

  try {
    const response = await fetch(`${window.NOTEFLOW_CONFIG.apiBaseUrl}/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    let data = {};
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.message || '요청 실패');
    }

    alert('문의가 등록되었습니다.');
    form.reset();
  } catch (error) {
    console.error('waitlist submit error:', error);
    alert('전송 중 오류가 발생했습니다.');
  }
});
