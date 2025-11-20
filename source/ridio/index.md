---
title: 屏保
date: 2025-11-01 00:00:00
type: screensaver
---

<!-- 1. 隐藏导航栏 + 个人信息 + 返回首页按钮 -->
<style>
  /* 隐藏顶部导航栏 */
  #page-header, #nav, .nav-fixed #nav {
    display: none !important;
  }

  /* 隐藏个人信息卡片 */
  #aside-content .card-widget.card-info,
  #aside-content .author-card,
  #aside-content .site-data,
  #aside-content .follow-button,
  #aside-content .announcement_content {
    display: none !important;
  }

  /* 返回首页按钮（右上角） */
  .back-to-home {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 9999;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }

  .back-to-home:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
  }

  .back-to-home i {
    color: white;
    font-size: 18px;
  }

  @media (max-width: 768px) {
    .back-to-home { top: 15px; right: 15px; width: 36px; height: 36px; }
    .back-to-home i { font-size: 16px; }
  }
</style>

<!-- 返回首页按钮 -->
<div class="back-to-home" onclick="window.location.href='/'">
  <i class="fas fa-home"></i>
</div>

<!-- 2. 全屏壁纸 + 时间 -->
<div id="screensaver-clock">
  <div id="time"></div>
  <div id="date"></div>
</div>

<!-- 3. 可选：右下角迷你播放器 -->
<div id="aplayer"></div>

<style>
  /* 壁纸全屏铺满（已使用你的图片） */
  #screensaver-clock {
    position: fixed;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    background: url('https://free.picui.cn/free/2025/10/25/68fba666aa4cb.jpg') center/cover no-repeat fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    font-family: 'Arial', sans-serif;
    text-shadow: 0 0 8px rgba(0,0,0,0.6);
    z-index: 1;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  /* 时间容器（半透明底） */
  #screensaver-clock > div {
    background: rgba(255, 255, 255, 0.12);
    padding: 1.5vw 3vw;
    border-radius: 16px;
  }

  /* 字体小 */
  #time { font-size: 4.5vw; font-weight: bold; }
  #date { font-size: 1.8vw; margin-top: 1vh; opacity: 0.9; }

  @media (max-width: 768px) {
    #time { font-size: 8vw; }
    #date { font-size: 3.5vw; }
  }

  /* 播放器 */
  #aplayer {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    z-index: 999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    border-radius: 12px;
  }
</style>

<script>
  // 实时时间
  function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const date = now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    document.getElementById('time').textContent = time;
    document.getElementById('date').textContent = date;
  }
  updateClock();
  setInterval(updateClock, 1000);

  // APlayer（可选）
  document.addEventListener('DOMContentLoaded', () => {
    const ap = new APlayer({
      container: document.getElementById('aplayer'),
      autoplay: true,
      loop: 'all',
      volume: 0.7,
      audio: [{
        name: 'BGM',
        artist: '未知',
        url: 'https://music.163.com/song/media/outer/url?id=123456.mp3',
        cover: 'https://example.com/cover.jpg'
      }]
    });
  });

</script>

<script src="/js/aplayer.min.js"></script>