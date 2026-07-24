// ponytail: no i18n library. Both languages sit in the DOM as .es / .en spans and
// CSS hides the inactive one (see css/boda.css). Revisit only if a 3rd language appears.
(function () {
	'use strict';

	function setLang(lang) {
		document.documentElement.lang = lang;
		try { localStorage.setItem('lang', lang); } catch (e) { /* private mode */ }

		// RSVP buttons point at a different Google Form per language
		var links = document.querySelectorAll('.rsvp-link');
		for (var i = 0; i < links.length; i++) {
			links[i].href = links[i].getAttribute('data-form-' + lang);
		}
		var sw = document.querySelectorAll('.lang-switch a');
		for (var j = 0; j < sw.length; j++) {
			sw[j].className = sw[j].getAttribute('data-lang') === lang ? 'active' : '';
		}
		// alt text can't hold two languages the way visible spans can
		var imgs = document.querySelectorAll('img[data-alt-es]');
		for (var k = 0; k < imgs.length; k++) {
			imgs[k].alt = imgs[k].getAttribute('data-alt-' + lang);
		}
	}

	var stored = null;
	try { stored = localStorage.getItem('lang'); } catch (e) {}
	// runs in <head>, before first paint, so the wrong language never flashes
	setLang(stored || ((navigator.language || 'es').slice(0, 2) === 'en' ? 'en' : 'es'));

	// The wedding: 26 Dec 2026, 16:00. Costa Rica is UTC-6 year round — no DST, no tz library.
	var target = new Date('2026-12-26T16:00:00-06:00');

	function tick() {
		var box = document.getElementById('countdown');
		if (!box) return;
		var left = Math.max(0, target - new Date());
		var s = Math.floor(left / 1000);
		var parts = { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
		var cells = box.querySelectorAll('[data-count]');
		for (var i = 0; i < cells.length; i++) {
			var v = parts[cells[i].getAttribute('data-count')];
			cells[i].textContent = v < 10 ? '0' + v : String(v);
		}
	}

	document.addEventListener('DOMContentLoaded', function () {
		setLang(document.documentElement.lang); // re-apply now that the buttons exist
		document.addEventListener('click', function (e) {
			var a = e.target.closest ? e.target.closest('.lang-switch a') : null;
			if (!a) return;
			e.preventDefault();
			setLang(a.getAttribute('data-lang'));
		});
		tick();
		setInterval(tick, 1000);
		lightbox();
		confetti();
	});

	// ponytail: native <dialog> instead of a lightbox plugin — Esc and focus trapping come free.
	function lightbox() {
		var dlg = document.getElementById('lightbox');
		if (!dlg || !dlg.showModal) return; // no <dialog>: links still open the full image
		var img = dlg.querySelector('img');
		var shots = [].slice.call(document.querySelectorAll('a[data-full]'));
		var at = 0;

		function show(i) {
			at = (i + shots.length) % shots.length;
			img.src = shots[at].getAttribute('data-full');
			img.alt = shots[at].querySelector('img').alt;
			dlg.querySelector('.lb-prev').hidden = dlg.querySelector('.lb-next').hidden = shots.length < 2;
		}

		shots.forEach(function (a, i) {
			a.addEventListener('click', function (e) { e.preventDefault(); show(i); dlg.showModal(); });
		});
		dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
		dlg.querySelector('.lb-prev').addEventListener('click', function () { show(at - 1); });
		dlg.querySelector('.lb-next').addEventListener('click', function () { show(at + 1); });
		dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); }); // click backdrop
		document.addEventListener('keydown', function (e) {
			if (!dlg.open) return;
			if (e.key === 'ArrowRight') show(at + 1);
			if (e.key === 'ArrowLeft') show(at - 1);
		});
	}

	// ponytail: floating confetti on page load. Canvas-based, no plugin. Cleans up after 5s.
	function confetti() {
		try {
			var canvas = document.createElement('canvas');
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			canvas.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:999999;';
			document.body.appendChild(canvas);

			var ctx = canvas.getContext('2d');
			if (!ctx) return;

			var pieces = [];
			var colors = ['#4A372A', '#3F6B4A', '#7A5C3E', '#9A8975', '#FDF9F0'];
			var duration = 5000;
			var startTime = new Date().getTime();

			for (var i = 0; i < 80; i++) {
				pieces.push({
					x: Math.random() * canvas.width,
					y: -10,
					w: Math.random() * 8 + 4,
					h: Math.random() * 8 + 4,
					vx: (Math.random() - 0.5) * 2,
					vy: Math.random() * 2 + 1.5,
					rotation: Math.random() * 6.28,
					rotationSpeed: (Math.random() - 0.5) * 0.08,
					color: colors[Math.floor(Math.random() * colors.length)]
				});
			}

			function draw() {
				var now = new Date().getTime();
				var elapsed = now - startTime;
				var progress = Math.min(1, elapsed / duration);

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				for (var i = 0; i < pieces.length; i++) {
					var p = pieces[i];
					p.y += p.vy;
					p.x += p.vx;
					p.rotation += p.rotationSpeed;

					var opacity = 1 - progress;
					ctx.save();
					ctx.globalAlpha = opacity;
					ctx.translate(p.x, p.y);
					ctx.rotate(p.rotation);
					ctx.fillStyle = p.color;
					ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
					ctx.restore();
				}

				if (elapsed < duration) {
					requestAnimationFrame(draw);
				} else {
					canvas.parentNode.removeChild(canvas);
				}
			}

			draw();
		} catch (e) {
			console.log('confetti failed:', e);
		}
	}
})();
