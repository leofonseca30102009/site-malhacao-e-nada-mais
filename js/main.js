// Comportamento da página: menu, aberto/fechado agora e planos.
(function () {
  // menu
  var nav = document.querySelector('.nav');
  var navToggle = document.querySelector('.nav__toggle');
  function closeMenu() {
    nav.classList.remove('nav--open');
    navToggle.setAttribute('aria-expanded', false);
    navToggle.setAttribute('aria-label', 'Abrir menu');
  }
  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('nav--open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  document.querySelectorAll('.nav__links a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  // menu com fundo depois que a página rola
  function updateNav() { nav.classList.toggle('is-scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // aberto ou fechado agora (horário de Brasília)
  (function () {
    var status = document.querySelector('[data-status]');
    if (!status) return;
    var hours = { 1: [330, 1260], 2: [330, 1260], 3: [330, 1260], 4: [330, 1260], 5: [330, 1260], 6: [480, 720] };
    var names = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    function fmt(min) {
      var h = Math.floor(min / 60), m = min % 60;
      return h + 'h' + (m ? String(m).padStart(2, '0') : '');
    }
    var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    var day = now.getDay();
    var min = now.getHours() * 60 + now.getMinutes();
    var today = hours[day];
    var text;
    if (today && min >= today[0] && min < today[1]) {
      status.classList.add('is-open');
      text = 'Aberto agora · fecha às ' + fmt(today[1]);
    } else {
      for (var i = 0; i < 8; i++) {
        var d = (day + i) % 7, h = hours[d];
        if (!h || (i === 0 && min >= h[0])) continue;
        var when = i === 0 ? 'hoje' : i === 1 ? 'amanhã' : names[d];
        text = 'Fechado agora · abre ' + when + ' às ' + fmt(h[0]);
        break;
      }
    }
    status.querySelector('[data-status-text]').textContent = text;
    status.hidden = false;
    document.querySelectorAll('.visit__hours [data-days]').forEach(function (row) {
      if (row.dataset.days.split(',').indexOf(String(day)) > -1) row.classList.add('is-today');
    });
  })();

  // planos: mensal ou anual
  var toggle = document.querySelector('.plans__toggle');
  var pill = toggle.querySelector('.plans__pill');
  var periodBtns = toggle.querySelectorAll('button');
  function placePill() {
    var active = toggle.querySelector('button.is-active');
    if (!active) return;
    pill.style.width = active.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + active.offsetLeft + 'px)';
  }
  function showPeriod(period) {
    periodBtns.forEach(function (b) {
      var on = b.dataset.period === period;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on);
    });
    document.querySelectorAll('.plan__price').forEach(function (p) {
      var v = (p.dataset[period] || '').trim();
      if (!v || v.toLowerCase() === 'a definir') {
        p.classList.add('is-tbd');
        p.textContent = 'A definir';
      } else {
        p.classList.remove('is-tbd');
        p.innerHTML = v + '<span>/' + (period === 'monthly' ? 'mês' : 'ano') + '</span>';
      }
    });
    placePill();
  }
  periodBtns.forEach(function (b) {
    b.addEventListener('click', function () { showPeriod(b.dataset.period); });
  });
  toggle.classList.add('has-pill');
  showPeriod('monthly');
  window.addEventListener('resize', placePill);
  window.addEventListener('load', placePill);
  if (document.fonts) document.fonts.ready.then(placePill);
})();
