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
	});
})();
