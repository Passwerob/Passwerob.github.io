const body = document.body;
const languageButton = document.querySelector('.language-button');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

const setLanguage = (language) => {
  const english = language === 'en';
  body.classList.toggle('english', english);
  document.documentElement.lang = english ? 'en' : 'zh-CN';
  languageButton.textContent = english ? '中' : 'EN';
  localStorage.setItem('language', language);
};

setLanguage(localStorage.getItem('language') || 'zh');
languageButton.addEventListener('click', () => setLanguage(body.classList.contains('english') ? 'zh' : 'en'));

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const blogFilters = document.querySelectorAll('.blog-filter');
const blogEntries = document.querySelectorAll('.blog-entry[data-categories]');
const blogTimeline = document.querySelector('.blog-timeline');

if (blogTimeline) {
  [...blogEntries]
    .sort((a, b) => new Date(b.querySelector('time').dateTime) - new Date(a.querySelector('time').dateTime))
    .forEach((entry) => blogTimeline.appendChild(entry));
}

blogFilters.forEach((button) => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  blogFilters.forEach((item) => item.classList.toggle('active', item === button));
  blogEntries.forEach((entry) => {
    const categories = entry.dataset.categories.split(' ');
    entry.hidden = filter !== 'all' && !categories.includes(filter);
  });
}));
