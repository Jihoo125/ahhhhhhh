const themeToggle = document.getElementById('themeToggle');
const storageKey = 'noteflow-theme';
const waitlistForm = document.getElementById('waitlistForm');
const formStatus = document.getElementById('formStatus');
const config = window.NOTEFLOW_CONFIG || {};

const applyTheme = (theme) => {
  document.body.classList.toggle('light', theme === 'light');
  themeToggle.textContent = theme === 'light' ? '다크 모드 전환' : '라이트 모드 전환';
};

const setStatus = (message, type = '') => {
  if (!formStatus) return;
  formStatus.textContent = message;
  formStatus.className = `form-status${type ? ` ${type}` : ''}`;
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

waitlistForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!config.apiBaseUrl) {
    setStatus('aws-config.example.js를 복사해 apiBaseUrl을 설정하면 API Gateway로 바로 연결됩니다.', 'error');
    return;
  }

  const formData = new FormData(waitlistForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    setStatus('문의 내용을 AWS API로 전송 중입니다...');

    const response = await fetch(`${config.apiBaseUrl.replace(/\/$/, '')}/waitlist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey ? { 'x-api-key': config.apiKey } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    waitlistForm.reset();
    setStatus('문의가 정상적으로 접수되었습니다. Lambda / DynamoDB 저장 흐름이 연결되었습니다.', 'success');
  } catch (error) {
    setStatus(`전송에 실패했습니다: ${error.message}. API Gateway CORS/Lambda 설정을 확인하세요.`, 'error');
  }
});
