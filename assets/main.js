/* Beautifulist Clinic – animations */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Animated gold background (hero + page heads) ---------- */
  function goldCanvas(host) {
    var c = document.createElement('canvas');
    c.className = 'fx-canvas';
    host.insertBefore(c, host.firstChild);
    var ctx = c.getContext('2d'), w, h, dpr = Math.min(window.devicePixelRatio || 1, 2), t = 0, parts = [];

    function size() {
      w = host.offsetWidth; h = host.offsetHeight;
      c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(90, w / 14));
      parts = [];
      for (var i = 0; i < n; i++) parts.push({
        x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.8 + .4,
        vy: -(Math.random() * .35 + .08), vx: (Math.random() - .5) * .15,
        a: Math.random() * .6 + .2, p: Math.random() * Math.PI * 2
      });
    }

    function wave(off, amp, freq, speed, alpha, width, yBase) {
      var g = ctx.createLinearGradient(0, 0, w, 0);
      g.addColorStop(0, 'rgba(220,188,110,0)');
      g.addColorStop(.3, 'rgba(220,188,110,' + alpha + ')');
      g.addColorStop(.7, 'rgba(240,215,150,' + alpha + ')');
      g.addColorStop(1, 'rgba(220,188,110,0)');
      ctx.strokeStyle = g; ctx.lineWidth = width; ctx.beginPath();
      for (var x = 0; x <= w; x += 8) {
        var y = yBase + Math.sin(x * freq + t * speed + off) * amp + Math.sin(x * freq * .5 + t * speed * .6 + off * 2) * amp * .6;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      // flowing silk lines (inspired by the logo swirl)
      for (var i = 0; i < 7; i++) {
        wave(i * .7, h * .07 + i * 4, .0042 - i * .0002, .012 + i * .002, .16 + (i % 3) * .07, i % 2 ? 1.2 : 2, h * .62 + i * 10);
      }
      for (var j = 0; j < 4; j++) {
        wave(3 + j, h * .05, .005, .009 + j * .002, .06, 1, h * .25 + j * 12);
      }
      // floating gold dust
      for (var k = 0; k < parts.length; k++) {
        var p = parts[k];
        p.x += p.vx; p.y += p.vy; p.p += .03;
        if (p.y < -5) { p.y = h + 5; p.x = Math.random() * w; }
        var a = p.a * (.55 + .45 * Math.sin(p.p));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232,200,120,' + a + ')';
        ctx.shadowColor = 'rgba(232,200,120,.8)'; ctx.shadowBlur = 6;
        ctx.fill(); ctx.shadowBlur = 0;
      }
      t++;
      if (running) requestAnimationFrame(frame);
    }

    var running = false;
    size(); window.addEventListener('resize', size);
    if (reduce) { frame(); return; }
    // only animate while visible
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !running) { running = true; requestAnimationFrame(frame); }
        else if (!e.isIntersecting) running = false;
      });
    }).observe(host);
  }
  /* canvas background disabled – soft CSS orbs used instead */

  /* ---------- 2. Scroll reveal ---------- */
  var sel = '.head, .card, .shot, details, .tl-item, .cta-band, .article, .table-wrap, .trust .container > div';
  var els = document.querySelectorAll(sel);
  els.forEach(function (el) {
    el.classList.add('reveal');
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (s) { return s.matches(sel); });
    el.style.transitionDelay = (Math.min(sibs.indexOf(el), 6) * 90) + 'ms';
  });
  if (reduce || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. Header shadow on scroll ---------- */
  var hd = document.querySelector('header.site');
  window.addEventListener('scroll', function () { hd && hd.classList.toggle('scrolled', window.scrollY > 20); }, { passive: true });

  /* ---------- 4. Hero card tilt (desktop) ---------- */
  var card = document.querySelector('.hero-card');
  if (card && !reduce && window.matchMedia('(pointer:fine)').matches) {
    var hero = document.querySelector('.hero');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = 'perspective(900px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg)';
    });
    hero.addEventListener('mouseleave', function () { card.style.transform = ''; });
  }
})();
