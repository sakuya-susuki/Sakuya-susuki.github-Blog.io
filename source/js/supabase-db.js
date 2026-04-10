/* global supabase */

const CONFIG = {
  URL: 'https://nnreiespcmxtiakhggoc.supabase.co',
  KEY: 'sb_publishable_VWMyF_BRLx5cnAhYjdZXCA__0_S4wr3',
  TABLE: 'visitor_logs',

  // 更快：上线必须 false
  DEBUG_MODE: false,
  LOG_EXPIRY: 3600 * 1000,

  // 更快：关闭这些“慢源”
  ENABLE_PUBLIC_IP: false,         // 关闭 ipify
  ENABLE_FINGERPRINTJS: false,     // 关闭 FingerprintJS（你现在就别加载 fp.min.js）
};

function initSupabase() {
  if (window.supabaseClient) return window.supabaseClient;
  if (typeof supabase === 'undefined') return null;
  window.supabaseClient = supabase.createClient(CONFIG.URL, CONFIG.KEY);
  return window.supabaseClient;
}

// 超轻量 device_id：不等待、不算重的
function fastDeviceId() {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillText("V-Audit", 2, 15);
    const b64 = canvas.toDataURL().slice(-64); // 只取末尾减少字符串长度
    const raw = `${b64}|${navigator.userAgent}|${navigator.language}|${navigator.hardwareConcurrency || ''}`;
    return 'CV-' + btoa(unescape(encodeURIComponent(raw))).slice(0, 32);
  } catch {
    return 'CV-' + (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).slice(0, 32);
  }
}

function shouldSkipLog() {
  if (CONFIG.DEBUG_MODE) return false;

  const key = `supa_vlog_${window.location.pathname}`;
  const last = localStorage.getItem(key);
  const now = Date.now();
  return !!(last && (now - parseInt(last, 10) < CONFIG.LOG_EXPIRY));
}

function markLogged() {
  const key = `supa_vlog_${window.location.pathname}`;
  localStorage.setItem(key, Date.now().toString());
}

async function buildPayload() {
  return {
    ip: '0.0.0.0', // 更快：不取公网 IP
    page_path: window.location.pathname,
    user_agent: navigator.userAgent,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    platform: navigator.platform,
    device_id: fastDeviceId(),
  };
}

async function runVisitorLog() {
  if (shouldSkipLog()) return;

  const client = initSupabase();
  if (!client) return;

  try {
    const payload = await buildPayload();

    // 不要 console.log：也会拖一点点
    const { error } = await client.from(CONFIG.TABLE).insert([payload]);
    if (error) throw error;

    markLogged();
  } catch {
    // 静默失败（极限快：减少控制台 IO）
  }
}

// 关键：不抢首屏资源
function schedule() {
  const start = () => runVisitorLog();

  if ('requestIdleCallback' in window) {
    requestIdleCallback(start, { timeout: 2500 });
  } else {
    setTimeout(start, 800);
  }
}

// 不等 load，DOMReady 就排队（更早空闲就能写完）
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', schedule, { once: true });
} else {
  schedule();
}
