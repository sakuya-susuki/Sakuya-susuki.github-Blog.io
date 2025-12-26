/* global supabase */

const CONFIG = {
    URL: 'https://nnreiespcmxtiakhggoc.supabase.co',
    KEY: 'sb_publishable_VWMyF_BRLx5cnAhYjdZXCA__0_S4wr3',
    TABLE: 'visitor_logs',
    // 【调试开关】
    // true: 每次刷新都写入数据库 (用于测试)
    // false: 开启防抖，每小时仅记录一次 (用于正式上线)
    DEBUG_MODE: true, 
    LOG_EXPIRY: 3600 * 1000 
};

/**
 * 核心：原生 Canvas 指纹采集
 */
const generateCanvasFingerprint = () => {
    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillText("V-Audit", 2, 15);
        const b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
        return 'CV-' + b64.slice(-32);
    } catch (e) {
        return 'CV-FAILED';
    }
};

const initSupabase = () => {
    if (window.supabaseClient) return window.supabaseClient;
    if (typeof supabase === 'undefined') return null;
    window.supabaseClient = supabase.createClient(CONFIG.URL, CONFIG.KEY);
    return window.supabaseClient;
};

async function getVisitorProfile() {
    const profile = {
        ip: '0.0.0.0',
        page_path: window.location.pathname,
        user_agent: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        device_id: ''
    };

    try {
        const [ipRes, fpRes] = await Promise.allSettled([
            fetch('https://api.ipify.org?format=json').then(r => r.json()),
            (typeof window.FingerprintJS !== 'undefined') ? window.FingerprintJS.load().then(fp => fp.get()) : Promise.reject()
        ]);

        if (ipRes.status === 'fulfilled') profile.ip = ipRes.value.ip;

        // 优先使用外部库，失败则使用 Canvas 穿透指纹
        if (fpRes.status === 'fulfilled' && fpRes.value) {
            profile.device_id = fpRes.value.visitorId;
        } else {
            const rawId = generateCanvasFingerprint() + navigator.hardwareConcurrency;
            profile.device_id = 'CV-' + btoa(rawId).substring(0, 32);
        }
    } catch (e) {
        profile.device_id = 'ERR-' + Date.now();
    }
    return profile;
}

async function runVisitorLog() {
    const client = initSupabase();
    if (!client) return;

    const storageKey = `supa_vlog_${window.location.pathname}`;
    const lastLog = sessionStorage.getItem(storageKey);
    const now = Date.now();

    // --- 防抖开关逻辑 ---
    if (!CONFIG.DEBUG_MODE) {
        if (lastLog && (now - parseInt(lastLog) < CONFIG.LOG_EXPIRY)) {
            console.log('ℹ️ 防抖模式：页面近期已记录');
            return;
        }
    } else {
        console.log('🧪 测试模式：已跳过防抖限制');
    }

    try {
        const payload = await getVisitorProfile();
        const { error } = await client.from(CONFIG.TABLE).insert([payload]);
        if (error) throw error;

        sessionStorage.setItem(storageKey, now.toString());
        console.log('✅ 同步成功 | ID:', payload.device_id, '| Mode:', CONFIG.DEBUG_MODE ? 'DEBUG' : 'PROD');
    } catch (err) {
        console.error('❌ 同步失败:', err.message);
    }
}

if (document.readyState === 'complete') {
    runVisitorLog();
} else {
    window.addEventListener('load', runVisitorLog);
}