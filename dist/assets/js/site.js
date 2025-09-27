(function(){
  // Set current year in footer
  var y = document.querySelectorAll('[data-year]');
  var yr = new Date().getFullYear();
  for (var i=0;i<y.length;i++){ y[i].textContent = yr; }
})();

// Cross-device hamburger menu
document.addEventListener('DOMContentLoaded', function(){
  var buttons = document.querySelectorAll('.nav-toggle');
  buttons.forEach(function(btn){
    var header = btn.closest('header') || document.querySelector('header');
    var nav = header ? header.querySelector('nav') : null;
    if(!nav) return;
    function toggle(open){
      var willOpen = (typeof open === 'boolean') ? open : !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    }
    btn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); toggle(); }, {passive:false});
    nav.addEventListener('click', function(e){
      var a = e.target.closest('a');
      if(a){ toggle(false); }
    });
    document.addEventListener('click', function(e){
      if(!nav.classList.contains('is-open')) return;
      if(!header.contains(e.target)) toggle(false);
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') toggle(false);
    });
  });
});
