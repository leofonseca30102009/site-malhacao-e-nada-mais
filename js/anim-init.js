// Prepara as animações antes da primeira pintura da página.
// Sem esta classe (movimento reduzido ou falha no JS) tudo aparece normalmente.
(function () {
  var root = document.documentElement;
  if (!window.matchMedia || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.classList.add('anim-ready');
  // segurança: se as animações não começarem, mostra o conteúdo mesmo assim
  setTimeout(function () {
    if (!root.classList.contains('anim-live')) root.classList.remove('anim-ready');
  }, 3000);
})();
