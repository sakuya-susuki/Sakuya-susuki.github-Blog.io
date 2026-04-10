(() => {
  const today = new Date();
  // 仅在 1 月 20 日启用
  if (!(today.getMonth() + 1 === 1 && today.getDate() === 21)) return;

  // =========================
  // 0) 配置区
  // =========================
  const SUBTITLE_TEXT = '今晚，整个夜空将为你闪耀';
  const BG_IMAGE = '/img/appplo.img';
  const AUDIO_SRC = '/js/christmas-song.mp3';

  // =========================
  // 1) 原生雪花效果（Canvas）
  // =========================
  const canvas = document.createElement('canvas');
  canvas.id = 'snow-canvas';
  canvas.style.cssText =
    'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;pointer-events:none;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const particles = [];
  const COUNT = 120;

  function updateSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', updateSize);
  updateSize();

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      vx: Math.random() * 0.6 - 0.3,
      vy: Math.random() * 1.2 + 0.6
    });
  }

  function drawSnow() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.beginPath();

    for (const p of particles) {
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

      p.x += p.vx;
      p.y += p.vy;

      // 轻微飘动
      p.vx += (Math.random() * 0.04 - 0.02);
      // 限制横向速度
      p.vx = Math.max(Math.min(p.vx, 0.8), -0.8);

      // 回收
      if (p.y > canvas.height + 10) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
        p.vy = Math.random() * 1.2 + 0.6;
      }
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.x < -10) p.x = canvas.width + 10;
    }

    ctx.fill();
    requestAnimationFrame(drawSnow);
  }
  requestAnimationFrame(drawSnow);

  // =========================
  // 2) 副标题稳态覆盖（防主题改回去）
  // =========================
  const SUBTITLE_SELECTOR = [
    '#subtitle',
    '.subtitle',
    '#page-header #subtitle',
    '#page-header .subtitle',
    '.site-subtitle',
    '.header-subtitle',
    '.blog-subtitle'
  ].join(',');

  let subtitleLock = false;
  function forceSubtitle() {
    if (subtitleLock) return;
    subtitleLock = true;

    setTimeout(() => {
      subtitleLock = false;

      const candidates = Array.from(document.querySelectorAll(SUBTITLE_SELECTOR));
      const el = candidates.find(x => x && x.offsetParent !== null) || candidates[0];
      if (!el) return;

      if ((el.textContent || '').trim() === SUBTITLE_TEXT) return;

      el.textContent = SUBTITLE_TEXT;
      el.style.textAlign = 'center';
      el.style.marginTop = '10px';
    }, 80);
  }

  // 主题重绘时抢回
  const subtitleObserver = new MutationObserver(forceSubtitle);
  subtitleObserver.observe(document.documentElement, { childList: true, subtree: true, characterData: true });

  document.addEventListener('DOMContentLoaded', forceSubtitle, { once: true });
  window.addEventListener('load', forceSubtitle, { once: true });
  setTimeout(forceSubtitle, 500);
  setTimeout(forceSubtitle, 1500);

  // =========================
  // 3) 样式增强（链接/导航红色 + 背景 + 卡片半透明）
  // =========================
  const style = document.createElement('style');
  style.id = 'christmas-enhance-style';
  style.textContent = `
    /* 链接、导航栏、站点名统一红色 */
    a, #site-name, .site-name, #nav a, #nav .site-name, .post-title a {
      color: #c41e3a !important;
    }
    a:hover, .post-title a:hover {
      color: #228b22 !important;
    }

    /* 站点名前缀（如不需要可删除） */
    #site-name::before, .site-name::before {
      content: "🎄 ";
      animation: swing 3s infinite ease-in-out;
      display: inline-block;
    }
    @keyframes swing {
      0%,100% { transform: rotate(0deg); }
      25% { transform: rotate(10deg); }
      75% { transform: rotate(-10deg); }
    }

    /* 背景：同时覆盖 html/body/#web_bg，防主题遮罩盖住 */
    html, body, #web_bg, .web_bg {
      background-image: url("${BG_IMAGE}") !important;
      background-attachment: fixed !important;
      background-size: cover !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
    }

    /* 常见遮罩伪元素禁掉背景（否则会把你的背景遮住） */
    body::before, body::after,
    #web_bg::before, #web_bg::after,
    #page-header::before, #page-header::after,
    .page-header::before, .page-header::after {
      background-image: none !important;
    }

    /* 内容卡片：半透明 + 模糊 */
    #content-inner, .layout, #page, #archive, #tag, #category {
      background: rgba(255,255,255,0.88) !important;
      backdrop-filter: blur(10px);
      border-radius: 15px !important;
      padding: 20px !important;
    }
    #aside-content .card-widget {
      background: rgba(255,255,255,0.92) !important;
      border-radius: 12px !important;
    }
  `.trim();
  document.head.appendChild(style);

  // =========================
  // 4) 音乐播放器（点击播放/暂停 + 鼠标靠近显示）
  // =========================
  const tip = document.createElement('div');
  tip.id = 'christmas-music-tip';
  tip.textContent = '点击听圣诞音乐 🎄';
  tip.style.cssText =
    'position:fixed;bottom:30px;right:30px;background:rgba(196,30,58,0.95);color:#fff;padding:12px 22px;' +
    'border-radius:30px;z-index:9999;opacity:0;transition:0.5s;cursor:pointer;' +
    'box-shadow:0 4px 15px rgba(0,0,0,0.2);font-weight:bold;user-select:none;';
  document.body.appendChild(tip);

  const audio = new Audio(AUDIO_SRC);
  audio.loop = false;

  let isPlaying = false;

  tip.onclick = () => {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      tip.textContent = '已暂停 🎄';
      return;
    }

    audio.play()
      .then(() => {
        isPlaying = true;
        tip.textContent = '正在播放 🔇 点击暂停';
      })
      .catch(() => {
        // 某些环境仍可能限制，给出可见反馈
        isPlaying = false;
        tip.textContent = '无法自动播放，请再点击一次 🎄';
      });
  };

  audio.onended = () => {
    isPlaying = false;
    tip.textContent = '播放完毕 🎄';
  };

  // 鼠标靠近右下角显示
  document.addEventListener('mousemove', (e) => {
    const xDist = window.innerWidth - e.clientX;
    const yDist = window.innerHeight - e.clientY;
    if (xDist < 150 && yDist < 150) {
      tip.style.opacity = '1';
    } else if (!isPlaying) {
      tip.style.opacity = '0';
    }
  });

  // 初始提示：短暂出现后隐藏（未播放则隐藏）
  setTimeout(() => { tip.style.opacity = '1'; }, 1500);
  setTimeout(() => { if (!isPlaying) tip.style.opacity = '0'; }, 9000);
})();
