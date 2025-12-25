(() => {
  const today = new Date();
  if (today.getMonth() + 1 === 12 && today.getDate() === 25) {

    // --- 1. 原生雪花效果 ---
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9998;pointer-events:none;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let particles = [];
    const updateSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', updateSize);
    updateSize();
    for (let i = 0; i < 100; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 4 + 1, d: Math.random() * 1 });
    }
    function drawSnow() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      for (let p of particles) {
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      for (let p of particles) {
        p.y += Math.cos(p.d) + 1 + p.r / 2;
        p.x += Math.sin(p.d) * 2;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      }
      requestAnimationFrame(drawSnow);
    }
    drawSnow();

    // --- 2. 你的专属固定标题逻辑（保留） ---
    const fixedText = 'Merry Christmas 2025! 🎅❄️🎄';
    const forceSubtitle = () => {
      document.querySelectorAll('#subtitle, .subtitle').forEach(el => {
        if (el.innerHTML !== fixedText) {
          el.innerHTML = fixedText;
          el.style.color = '#c41e3a';
          el.style.fontSize = '1.2em';
          el.style.textAlign = 'center';
          el.style.marginTop = '10px';
        }
      });
    };
    const observer = new MutationObserver(forceSubtitle);
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('#subtitle, .subtitle').forEach(el => 
        observer.observe(el, { childList: true, subtree: true, characterData: true })
      );
      forceSubtitle();
    });
    window.addEventListener('load', forceSubtitle);
    setTimeout(forceSubtitle, 1000);

    // --- 3. 样式增强：补全所有链接、导航栏的红色设置 ---
    const style = document.createElement('style');
    style.innerHTML = `
      /* 强制全局文字链接、导航栏、站点名变为红色 */
      a, #site-name, .site-name, #nav a, #nav .site-name, .post-title a {
        color: #c41e3a !important;
      }
      /* 悬停时的颜色变化（森林绿） */
      a:hover, .post-title a:hover {
        color: #228b22 !important;
      }
      /* 站点名装饰 */
      #site-name::before, .site-name::before {
        content: "🎄 ";
        animation: swing 3s infinite ease-in-out;
        display: inline-block;
      }
      @keyframes swing { 0%,100%{transform:rotate(0deg);} 25%{transform:rotate(10deg);} 75%{transform:rotate(-10deg);} }
      
      /* 背景与内容框 */
      body, #web_bg { background-image:url("/img/christmas-bg.webp") !important; background-attachment:fixed !important; background-size:cover !important; }
      #content-inner, .layout, #page, #archive, #tag, #category { 
        background: rgba(255,255,255,0.88) !important; 
        backdrop-filter: blur(10px); 
        border-radius: 15px !important; 
        padding: 20px !important;
      }
      #aside-content .card-widget { background: rgba(255,255,255,0.92) !important; border-radius: 12px !important; }
    `;
    document.head.appendChild(style);

    // --- 4. 音乐播放器（自动停止 + 鼠标感应浮现） ---
    const tip = document.createElement('div');
    tip.innerHTML = '点击听圣诞音乐 🎄';
    tip.style.cssText = 'position:fixed;bottom:30px;right:30px;background:rgba(196,30,58,0.95);color:#fff;padding:12px 22px;border-radius:30px;z-index:9999;opacity:0;transition:0.5s;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.2);font-weight:bold;';
    document.body.appendChild(tip);

    const audio = new Audio('/js/christmas-song.mp3');
    audio.loop = false; 
    let isPlaying = false;

    tip.onclick = () => {
      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        tip.innerHTML = '已暂停 🎄';
      } else {
        audio.play().then(() => {
          isPlaying = true;
          tip.innerHTML = '正在播放《Slowly Flow, Hearthlight Glow》 🔇 点击暂停';
        });
      }
    };

    audio.onended = () => {
      isPlaying = false;
      tip.innerHTML = '播放完毕 🎄';
    };

    // 鼠标移动感应逻辑
    document.addEventListener('mousemove', (e) => {
      const xDist = window.innerWidth - e.clientX;
      const yDist = window.innerHeight - e.clientY;
      if (xDist < 150 && yDist < 150) {
        tip.style.opacity = '1';
      } else if (!isPlaying) {
        tip.style.opacity = '0';
      }
    });

    // 初始提示 8 秒后自动隐藏（如果没在播放）
    setTimeout(() => { tip.style.opacity = '1'; }, 2000);
    setTimeout(() => { if(!isPlaying) tip.style.opacity = '0'; }, 10000);
  }
})();