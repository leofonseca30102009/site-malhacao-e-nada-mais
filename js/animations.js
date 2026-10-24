// Animações da página com Motion (motion.dev).
// Só rodam quando a pessoa não pediu para reduzir o movimento;
// nesse caso tudo já aparece no estado final.
(function () {
  var root = document.documentElement;
  if (!root.classList.contains('anim-ready') || !window.Motion) {
    root.classList.remove('anim-ready');
    return;
  }

  var animate = Motion.animate;
  var inView = Motion.inView;
  var scroll = Motion.scroll;
  var stagger = Motion.stagger;

  // durações e curva compartilhadas
  var EASE = [0.16, 1, 0.3, 1];
  var DUR = { rapida: 0.35, base: 0.7, lenta: 1 };

  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

  // devolve o transform ao CSS (hovers continuam funcionando)
  function release(els) {
    return function () {
      els.forEach(function (el) { el.style.transform = ''; el.style.opacity = '1'; });
    };
  }

  function rise(els, opts) {
    opts = opts || {};
    if (!els.length) return;
    animate(els, { opacity: [0, 1], y: [opts.distance || 24, 0] }, {
      duration: opts.duration || DUR.base,
      delay: stagger(opts.step || 0.08, { startDelay: opts.start || 0 }),
      ease: EASE
    }).finished.then(release(els));
  }

  function countUp(el, delay) {
    var target = parseInt(el.dataset.count, 10);
    animate(0, target, {
      duration: 1.1,
      delay: delay,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: function (v) { el.textContent = Math.round(v); }
    }).finished.then(function () { el.textContent = target; });
  }

  try {
    // 1. entrada do hero
    rise($$('.hero__content > *'), { distance: 18, step: 0.07, start: 0.1 });
    rise($$('.hero__model img'), { distance: 30, duration: DUR.lenta, start: 0.15 });
    rise($$('.hero__cards .card'), { distance: 20, step: 0.1, start: 0.45 });

    // 2. contagem nos cards
    $$('[data-count]').forEach(function (el, i) { countUp(el, 0.55 + i * 0.1); });

    // 3. parallax leve do fundo do hero (só em telas grandes)
    if (window.matchMedia('(min-width: 901px)').matches) {
      scroll(
        animate('.hero__stage', { y: [0, 160] }, { ease: 'linear' }),
        { target: document.querySelector('.hero'), offset: ['start start', 'end start'] }
      );
    }

    // 4. seções aparecendo ao rolar (uma vez cada)
    var groups = [
      ['.space__collage', '.space__img', { distance: 32, step: 0.12 }],
      ['.space__content', '.space__title, .space__features li'],
      ['#atividades .section-head', '#atividades .section-head'],
      ['.programs__grid', '.program', { step: 0.06 }],
      ['.programs__special', '.programs__special, .programs__ask'],
      ['#planos .section-head', '#planos .section-head, .plans__toggle'],
      ['.plans__grid', '.plan', { step: 0.1 }],
      ['.plans__extra', '.plans__extra, .plans__notes'],
      ['.reviews__inner', '.reviews__intro, .highlights li', { step: 0.1 }],
      ['.visit__inner', '.visit__info, .visit__map', { step: 0.12 }],
      ['.cta', '.cta', { distance: 32 }]
    ];
    groups.forEach(function (g) {
      var trigger = document.querySelector(g[0]);
      if (!trigger) return;
      inView(trigger, function () { rise($$(g[1]), g[2]); }, { amount: 0.2 });
    });

    // 5. troca de preço no Mensal / Anual
    $$('.plans__toggle button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var prices = $$('.plan__price');
        animate(prices, { opacity: [0, 1], y: [8, 0] }, {
          duration: DUR.rapida,
          delay: stagger(0.04),
          ease: EASE
        }).finished.then(release(prices));
      });
    });

    // 6. links do menu do celular entrando em cascata
    var nav = document.querySelector('.nav');
    document.querySelector('.nav__toggle').addEventListener('click', function () {
      if (!nav.classList.contains('nav--open')) return;
      var links = $$('.nav__links a');
      animate(links, { opacity: [0, 1], x: [-10, 0] }, {
        duration: DUR.rapida,
        delay: stagger(0.04, { startDelay: 0.05 }),
        ease: EASE
      }).finished.then(release(links));
    });

    root.classList.add('anim-live');
  } catch (err) {
    root.classList.remove('anim-ready');
  }
})();
