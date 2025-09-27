// Menu toggle
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('.nav-menu');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

// Year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Fake contact submit
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    status.textContent = 'Thanks — your message has been received.';
    form.reset();
  });
}

// Stats counters
document.querySelectorAll('.stat span[data-count]').forEach((el) => {
  const target = +el.getAttribute('data-count');
  let n = 0;
  const inc = Math.max(1, Math.round(target / 60));
  const step = () => {
    n += inc;
    if (n >= target) { n = target; }
    el.textContent = n;
    if (n < target) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
});

// Projects loader
fetch('/assets/projects.json')
  .then(r => r.json())
  .then(projects => {
    const host = document.getElementById('project-cards');
    projects.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <h3>${p.title}</h3>
        <p>${p.summary}</p>
        <div class="meta">${p.role} · ${p.year}</div>
        <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
        ${p.link ? `<p><a class="btn ghost" href="${p.link}" target="_blank" rel="noopener">Open</a></p>` : ''}
      `;
      host.appendChild(card);
    });
  })
  .catch(() => {
    const host = document.getElementById('project-cards');
    if (host) {
      host.innerHTML = `<article class="card"><h3>Portfolio Starter</h3><p>Replace assets/projects.json to auto-populate projects.</p><div class="meta">Demo · ${new Date().getFullYear()}</div></article>`;
    }
  });

// v1.2.6+: auto-update copyright year
(function(){
  try {
    var y = (new Date()).getFullYear().toString();
    document.querySelectorAll('.copyright-year').forEach(function(n){
      if (!n.textContent || !/^[0-9]{4}$/.test(n.textContent)) n.textContent = y;
    });
  } catch(e) {}
})();


// v1.2.17: Append "+" after Apple years counter finishes
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.innerText);
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const interval = setInterval(() => {
      count += step;
      if (count >= target) {
        el.innerText = target;
        clearInterval(interval);
        if (el.dataset.label === "apple-years") {
          el.innerText = target + "+";
        }
      } else {
        el.innerText = count;
      }
    }, 30);
  });
});


