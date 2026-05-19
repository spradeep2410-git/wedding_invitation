/* =============================================
   WEDDING INVITATION — APP.JS
   ============================================= */

/* ── 1. FALLING PETALS (blue + white) ── */
(function() {
    const canvas = document.getElementById('petals');
    const ctx = canvas.getContext('2d');
    let petals = [];
    const COLORS = ['#42b6ce', '#74cde0', '#ffffff', '#a8dcea', '#c9a84c'];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createPetal() {
        return {
            x: Math.random() * canvas.width,
            y: -20,
            r: 4 + Math.random() * 7,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            speed: 0.5 + Math.random() * 1.1,
            drift: (Math.random() - 0.5) * 0.7,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.045,
            opacity: 0.30 + Math.random() * 0.45,
        };
    }

    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 1.65, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (petals.length < 38 && Math.random() < 0.28) petals.push(createPetal());
        petals = petals.filter(p => p.y < canvas.height + 40);
        petals.forEach(p => {
            p.y += p.speed;
            p.x += p.drift;
            p.rot += p.rotSpeed;
            drawPetal(p);
        });
        requestAnimationFrame(tick);
    }
    resize();
    window.addEventListener('resize', resize);
    tick();
})();


/* ── 2. CONFETTI BURST (used by scratch card) ── */
function confettiBurst() {
    const COLORS = ['#42b6ce', '#74cde0', '#c9a84c', '#ffffff', '#2a8fa5'];
    for (let i = 0; i < 55; i++) {
        const el = document.createElement('div');
        const tx = (Math.random() - 0.5) * 320;
        const ty = -(120 + Math.random() * 260);
        el.style.cssText = `
      position:fixed; top:42%; left:${38 + Math.random() * 24}%;
      width:${6 + Math.random() * 6}px; height:${6 + Math.random() * 6}px;
      background:${COLORS[Math.floor(Math.random() * COLORS.length)]};
      border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      z-index:9999; pointer-events:none;
      animation: cFly ${0.7 + Math.random() * 1.1}s ease-out forwards;
      --tx:${tx}px; --ty:${ty}px;
    `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2200);
    }
}
const cfStyle = document.createElement('style');
cfStyle.textContent = `
  @keyframes cFly {
    0%  { opacity:1; transform:translate(0,0) rotate(0deg) scale(1); }
    100%{ opacity:0; transform:translate(var(--tx),var(--ty)) rotate(540deg) scale(0.4); }
  }
`;
document.head.appendChild(cfStyle);


/* ── 3. COUNTDOWN — June 18 2026 08:30 IST ── */
(function() {
    const target = new Date('2026-06-18T08:30:00+05:30').getTime();

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        const diff = target - Date.now();
        if (diff <= 0) {
            ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].forEach(id => document.getElementById(id).textContent = '00');
            return;
        }
        document.getElementById('cd-days').textContent = pad(Math.floor(diff / 86400000));
        document.getElementById('cd-hours').textContent = pad(Math.floor((diff % 86400000) / 3600000));
        document.getElementById('cd-mins').textContent = pad(Math.floor((diff % 3600000) / 60000));
        document.getElementById('cd-secs').textContent = pad(Math.floor((diff % 60000) / 1000));
    }
    tick();
    setInterval(tick, 1000);
})();


/* ── 4. SCRATCH CARD ── */
let scratchCanvas, scratchCtx, isDrawing = false,
    totalPixels = 0,
    revealed = false;

function initScratch() {
    scratchCanvas = document.getElementById('scratch-canvas');
    scratchCtx = scratchCanvas.getContext('2d');
    const container = scratchCanvas.parentElement;
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    scratchCanvas.width = w;
    scratchCanvas.height = h;

    // Dusty-blue scratch surface
    const grad = scratchCtx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#2a8fa5');
    grad.addColorStop(0.5, '#42b6ce');
    grad.addColorStop(1, '#74cde0');
    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, w, h);

    // Gold sparkle dots
    for (let i = 0; i < 60; i++) {
        scratchCtx.beginPath();
        scratchCtx.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 0, Math.PI * 2);
        scratchCtx.fillStyle = `rgba(201,168,76,${0.20 + Math.random() * 0.35})`;
        scratchCtx.fill();
    }

    // Text label
    scratchCtx.fillStyle = 'rgba(255,255,255,0.70)';
    scratchCtx.font = 'bold 12px Lato, sans-serif';
    scratchCtx.textAlign = 'center';
    const lines = ['✦ SCRATCH TO REVEAL ✦', '', 'THE WEDDING DATE', '', '✦ ✦ ✦', '', '✦ SCRATCH TO REVEAL ✦', 'THE WEDDING DATE'];
    const lh = h / (lines.length + 2);
    lines.forEach((line, i) => scratchCtx.fillText(line, w / 2, lh * (i + 1.8)));

    // Border
    scratchCtx.strokeStyle = 'rgba(255,255,255,0.30)';
    scratchCtx.lineWidth = 2;
    scratchCtx.strokeRect(1, 1, w - 2, h - 2);

    totalPixels = w * h;
    revealed = false;
    const btn = document.getElementById('reset-btn');
    if (btn) btn.classList.remove('show');
}

function getPos(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    const sx = scratchCanvas.width / rect.width;
    const sy = scratchCanvas.height / rect.height;
    if (e.touches) {
        return { x: (e.touches[0].clientX - rect.left) * sx, y: (e.touches[0].clientY - rect.top) * sy };
    }
    return { x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy };
}

function scratch(x, y) {
    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 30, 0, Math.PI * 2);
    scratchCtx.fill();
    if (!revealed) checkReveal();
}

function checkReveal() {
    const data = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
    let cleared = 0;
    for (let i = 3; i < data.length; i += 4) { if (data[i] === 0) cleared++; }
    if (cleared / totalPixels > 0.55) {
        revealed = true;
        scratchCtx.clearRect(0, 0, scratchCanvas.width, scratchCanvas.height);
        const btn = document.getElementById('reset-btn');
        if (btn) btn.classList.add('show');
        confettiBurst();
    }
}

function resetScratch() { initScratch(); }

window.addEventListener('load', () => {
    initScratch();
    scratchCanvas.addEventListener('mousedown', e => {
        isDrawing = true;
        const p = getPos(e);
        scratch(p.x, p.y);
    });
    scratchCanvas.addEventListener('mousemove', e => {
        if (!isDrawing) return;
        const p = getPos(e);
        scratch(p.x, p.y);
    });
    scratchCanvas.addEventListener('mouseup', () => isDrawing = false);
    scratchCanvas.addEventListener('mouseleave', () => isDrawing = false);
    scratchCanvas.addEventListener('touchstart', e => {
        e.preventDefault();
        isDrawing = true;
        const p = getPos(e);
        scratch(p.x, p.y);
    }, { passive: false });
    scratchCanvas.addEventListener('touchmove', e => {
        e.preventDefault();
        if (!isDrawing) return;
        const p = getPos(e);
        scratch(p.x, p.y);
    }, { passive: false });
    scratchCanvas.addEventListener('touchend', () => isDrawing = false);
});


/* ── 5. VENUE SWITCHER ── */
const VENUES = {
    wedding: {
        name: 'SJR Convention Hall',
        addr: 'Anantapur, Andhra Pradesh',
        map: 'https://maps.google.com/maps?q=14.6583,77.5986&z=16&output=embed',
        link: 'https://maps.app.goo.gl/KPDPSbDJdaaRQCka9',
    },
    reception: {
        name: 'Olive and Orchard Banquet Halls',
        addr: 'Chennai, Tamil Nadu',
        map: 'https://maps.google.com/maps?q=Olive+and+Orchard+Banquet+Hall+Chennai&z=16&output=embed',
        link: 'https://maps.app.goo.gl/kacbHjkJuWzw1h3Z6',
    },
};

function switchVenue(key, btn) {
    const v = VENUES[key];
    document.getElementById('venue-name').textContent = v.name;
    document.getElementById('venue-addr').textContent = v.addr;
    document.getElementById('map-iframe').src = v.map;
    document.getElementById('directions-link').href = v.link;
    document.querySelectorAll('.vtab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
}

/* ── 6. SCROLL REVEAL ── */
(function() {
    const els = document.querySelectorAll('.reveal-on-scroll');
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 75);
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.10 });
    els.forEach(el => io.observe(el));
})();


/* ── 7. RSVP ── */
// function submitRSVP() {
//     const name = document.getElementById('rsvp-name') ? .value.trim();
//     const phone = document.getElementById('rsvp-phone') ? .value.trim();
//     if (!name || !phone) { alert('Please fill in your name and phone number 🙏'); return; }
//     const success = document.getElementById('rsvp-success');
//     const btn = document.querySelector('.rsvp-submit');
//     if (success) success.style.display = 'block';
//     if (btn) btn.style.display = 'none';
// }
function submitRSVP() {
    const name = document.getElementById('rsvp-name')?.value.trim();
    // const phone = document.getElementById('rsvp-phone')?.value.trim();
    const message = document.getElementById('rsvp-message')?.value.trim() || '';

    if (!name || !phone) {
        alert('Please fill in your name and phone number 🙏');
        return;
    }

    // Build WhatsApp message
    const text = `🌸 *Wedding RSVP — Pradeep & Nithya Sree*\n\n` +
        `👤 *Name:* ${name}\n` +
        // `📱 *Phone:* ${phone}\n` +
        `💬 *Message:* ${message || '—'}`;

    // Open WhatsApp
    const wa = document.createElement('a');
    wa.href = `https://wa.me/919791190025?text=${encodeURIComponent(text)}`;
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    document.body.appendChild(wa);
    wa.click();
    document.body.removeChild(wa);

    // Show success
    const success = document.getElementById('rsvp-success');
    const btn = document.querySelector('.rsvp-submit');
    if (success) success.style.display = 'block';
    if (btn) btn.style.display = 'none';
}