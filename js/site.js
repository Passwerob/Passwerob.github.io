const body = document.body;
const languageToggle = document.querySelector('#language-toggle');

const setLanguage = (language) => {
  const english = language === 'en';
  body.classList.toggle('english', english);
  document.documentElement.lang = english ? 'en' : 'zh-CN';
  if (languageToggle) {
    languageToggle.textContent = english ? '中' : 'EN';
    languageToggle.setAttribute('aria-label', english ? 'Switch to Chinese' : '切换中英文');
  }
  try {
    localStorage.setItem('language', language);
  } catch (error) {
    // Storage can be unavailable in private browsing.
  }
};

let savedLanguage = 'zh';
try {
  savedLanguage = localStorage.getItem('language') || 'zh';
} catch (error) {
  savedLanguage = 'zh';
}
setLanguage(savedLanguage);

languageToggle?.addEventListener('click', () => {
  setLanguage(body.classList.contains('english') ? 'zh' : 'en');
});

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const noteFilters = document.querySelectorAll('.note-filter');
const noteEntries = document.querySelectorAll('.note-entry[data-category]');
noteFilters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    noteFilters.forEach((item) => item.classList.toggle('active', item === button));
    noteEntries.forEach((entry) => {
      entry.hidden = filter !== 'all' && entry.dataset.category !== filter;
    });
  });
});
