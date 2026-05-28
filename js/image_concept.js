// ── video_concept.js ─────────────────────────────────────────────
// [7단원: 동영상의 디지털 표현] 전용 스크립트

// 🌟 [설정] 7단원 고유 정보
const THIS_STEP = 7; // (원본 인덱스 유지)
const STEP_TITLE = "7. 동영상의 디지털 표현";
const FILE_NAME_PREFIX = "동영상_개념";
const PASS_SCORE = 70;
const MEMO_KEY = "value_video_memo";
const REF_KEY = "value_video_reflection";

const stepDotMap = {
    'step1-visual':  0,
    'step2-concept': 1,
    'step3-advanced': 2,
    'step4-quiz':    3
};

// 🌟 [연결] 공통 파일과 기능 연동 (초기화 및 채점)
window.resetStatus = function() {
    if (typeof setStatus === 'function') setStatus('normal');
};

window.checkAns = function(el) {
    if (typeof check === 'function') {
        check(el);
        // 정답 시 CSS 클래스 변경 및 토스트 알림 표시
        if (el.classList.contains('correct')) {
            el.classList.add('blank-correct');
            const toast = document.getElementById('toast');
            if (toast) {
                toast.innerText = "정답입니다! 🎉";
                toast.style.opacity = 1;
                setTimeout(() => toast.style.opacity = 0, 1500);
            }
        } else if (el.value.trim() !== "" && el.value.trim() !== el.getAttribute('data-answer')) {
            el.classList.add('blank-error');
            setTimeout(()=> el.classList.remove('blank-error'), 400);
        }
    }
};

window.showCustomAlert = function(msg) {
    const overlay = document.getElementById('customAlertOverlay');
    const msgBox = document.getElementById('customAlertMsg');
    if (overlay && msgBox) {
        msgBox.innerHTML = msg;
        overlay.style.display = 'flex';
    } else if (typeof window.showCustomAlert === 'function') {
        window.showCustomAlert("알림", msg);
    }
};

window.closeCustomAlert = function() {
    const overlay = document.getElementById('customAlertOverlay');
    if (overlay) overlay.style.display = 'none';
};

// 🌟 [개별 기능] 커스텀 화면 이동 로직 (캔버스 초기화 포함)
window.goStep = function(id) {
    const current = document.querySelector('.step-container.active');
    const next = document.getElementById(id);
    if(current === next) return;

    current.style.opacity = '0'; 
    
    const currentNum = parseInt(current.id.match(/\d+/)[0]);
    const nextNum = parseInt(id.match(/\d+/)[0]);
    const isNext = nextNum > currentNum; 
    
    current.style.transform = isNext ? 'translateX(-20px)' : 'translateX(20px)';
    
    setTimeout(() => {
        current.classList.remove('active'); 
        current.style.display = ''; 
        
        next.classList.add('active');
        next.style.display = '';
        
        // 3단계 실습 캔버스(우주선) 초기화 및 시작
        if(id === 'step3-advanced') startFPSAnimation();
        
        next.style.opacity = '0';
        next.style.transform = isNext ? 'translateX(20px)' : 'translateX(-20px)';
        
        void next.offsetWidth; 
        
        setTimeout(() => { next.style.opacity = '1'; next.style.transform = 'translateX(0)'; }, 50);

        if (typeof updateDots === 'function') updateDots(stepDotMap[id]);
    }, 400); 
};

window.revealInline = function(btn, text, color) {
    const span = document.createElement('span');
    span.className = 'pop-anim revealed-text';
    span.style.color = color; 
    span.style.fontWeight = '900';
    span.innerText = text;
    btn.parentNode.replaceChild(span, btn);
};

// 🌟 [개별 기능] 1단계: 동영상 원리 시각화 (플립북 효과)
const vCanvas = document.getElementById('videoVisCanvas');
const vCtx = vCanvas ? vCanvas.getContext('2d') : null;
let vTick = 0;
let isDissected = false;

function drawBall(ctx, x, y, scaleX, scaleY) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scaleX, scaleY);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.beginPath();
    ctx.ellipse(0, 20, 25, 5, 0, 0, Math.PI*2);
    ctx.fill();
    let grad = ctx.createRadialGradient(-5, -10, 5, 0, 0, 25);
    grad.addColorStop(0, '#ffc048');
    grad.addColorStop(1, '#f39c12');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(-8, -8, 6, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
}

function drawVideoVisual() {
    if (!vCtx) return;
    vCtx.clearRect(0, 0, 600, 300);

    if (isDissected) {
        const frameData = [
            { y: 80, sx: 1.0, sy: 1.0 },   
            { y: 150, sx: 0.9, sy: 1.1 },  
            { y: 220, sx: 1.0, sy: 1.0 },  
            { y: 230, sx: 1.3, sy: 0.7 },  
            { y: 170, sx: 0.95, sy: 1.05 } 
        ];
        for(let i = 0; i < 5; i++) {
            let frameX = 20 + i * 115;
            vCtx.fillStyle = '#ffffff';
            vCtx.shadowColor = 'rgba(0,0,0,0.15)';
            vCtx.shadowBlur = 10;
            vCtx.shadowOffsetY = 5;
            vCtx.fillRect(frameX, 20, 100, 250);
            vCtx.shadowColor = 'transparent';
            vCtx.fillStyle = '#f1f2f6';
            vCtx.fillRect(frameX + 5, 25, 90, 210);
            let d = frameData[i];
            drawBall(vCtx, frameX + 50, d.y - 15, d.sx, d.sy);
            vCtx.fillStyle = '#2f3542';
            vCtx.font = '900 13px "Pretendard"';
            vCtx.textAlign = 'center';
            vCtx.fillText(`${i+1} 프레임`, frameX + 50, 260); 
        }
    } else {
        let time = (vTick % 60) / 60; 
        let bounceY, scaleX = 1, scaleY = 1;
        if (time < 0.45) {
            let t = time / 0.45;
            bounceY = 80 + (140 * t * t);
        } else if (time < 0.55) {
            bounceY = 220;
            let t = (time - 0.45) / 0.1; 
            let squish = Math.sin(t * Math.PI); 
            scaleX = 1 + (0.3 * squish);
            scaleY = 1 - (0.3 * squish);
            bounceY += (10 * squish); 
        } else {
            let t = (time - 0.55) / 0.45;
            bounceY = 220 - (140 * t * (2 - t)); 
        }
        vCtx.fillStyle = '#f1f2f6';
        vCtx.fillRect(0, 0, 600, 300);
        drawBall(vCtx, 300, bounceY, scaleX, scaleY);
        vCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        vCtx.font = '800 20px Pretendard';
        vCtx.textAlign = 'center';
        vCtx.fillText("연속으로 빠르게 재생하면 움직이는 것처럼 보입니다!", 300, 40);
    }
    vTick++;
    requestAnimationFrame(drawVideoVisual);
}
if (vCanvas) drawVideoVisual();

window.toggleFilmScan = function() {
    isDissected = !isDissected;
    const btn = document.getElementById('btnDissect');
    if(isDissected) {
        btn.innerText = "▶️ 연속 재생하기 (애니메이션 확인)";
        btn.style.background = "var(--soft-red)"; 
    } else {
        btn.innerText = "🎞️ 프레임 분해하기 (정지 이미지 확인)";
        btn.style.background = "var(--multi-navy)";
    }
};

// 🌟 [개별 기능] 3단계: FPS 시뮬레이터 (프레임 캡처 + 일시정지)
const fCanvas = document.getElementById('fpsCanvas');
const fCtx = fCanvas ? fCanvas.getContext('2d') : null;
let currentFps = 8;
let isPaused = false;
let isSimRunning = false;
let capturedFrames = [];
let playIdx = 0;
let playTimer = null;
let captureTimer = null;
let rafId = null;
let capShipX = 0;
let isCapturing = false;

const TW = 68, TH = 44; // 썸네일 크기

// fps 표준 라벨
function getFpsStandard(f) {
    if (f === 24) return '🎬 영화 표준';
    if (f === 30) return '📺 TV·방송 표준';
    if (f <= 5)  return '⚠️ 거의 정지 화면';
    if (f <= 10) return '⚠️ 뚝뚝 끊김';
    if (f <= 18) return '약간 끊김';
    return '';
}

function getCanvasW() { return fCanvas ? fCanvas.offsetWidth || 500 : 500; }
function getCanvasH() { return fCanvas ? fCanvas.offsetHeight || 220 : 220; }

// 우주선 그리기
function drawShip(ctx, W, H, sx) {
    ctx.save();
    ctx.fillStyle = '#eef2ff';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(108,92,231,0.08)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x += W/8) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y <= H; y += H/4) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }
    const sy = H/2 + Math.sin((sx/(W||1)) * Math.PI * 2.5) * H * 0.28;
    const s = Math.min(W, H) / 160;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(s, s);
    ctx.fillStyle = '#a29bfe'; ctx.beginPath(); ctx.ellipse(0,0,22,8,0,0,Math.PI*2); ctx.fill();
    ctx.fillStyle = '#6c5ce7'; ctx.beginPath(); ctx.ellipse(0,-5,10,6,0,0,Math.PI); ctx.fill();
    ctx.fillStyle = '#4527a0'; ctx.beginPath(); ctx.moveTo(-6,4); ctx.lineTo(-14,10); ctx.lineTo(-18,4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fdcb6e'; ctx.beginPath(); ctx.arc(-18,4,4,0,Math.PI*2); ctx.fill();
    ctx.restore();
    ctx.restore();
}

// 썸네일 캡처
function captureThumb(sx) {
    const off = document.createElement('canvas');
    off.width = TW * 2; off.height = TH * 2;
    const oc = off.getContext('2d');
    oc.scale(2, 2);
    const tx = (sx / (getCanvasW()||1)) * TW;
    drawShip(oc, TW, TH, tx);
    return off;
}

// 타임라인 빌드 (정적 썸네일)
function buildTimeline() {
    const strip = document.getElementById('fpsFrameStrip');
    const countEl = document.getElementById('fpsFrameCount');
    const stdEl = document.getElementById('fpsStandard');
    if (!strip) return;
    strip.innerHTML = '';
    if (countEl) countEl.textContent = currentFps + '프레임';
    if (stdEl) stdEl.textContent = getFpsStandard(currentFps);

    capturedFrames.forEach((thumb, i) => {
        const card = document.createElement('div');
        card.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:2px;';
        const c = document.createElement('canvas');
        c.width = TW * 2; c.height = TH * 2;
        c.style.cssText = `width:${TW}px;height:${TH}px;border-radius:5px;border:1.5px solid rgba(108,92,231,0.2);display:block;`;
        c.id = 'fc' + i;
        c.getContext('2d').drawImage(thumb, 0, 0);
        const lbl = document.createElement('div');
        lbl.style.cssText = 'font-size:10px;font-weight:800;color:#888;';
        lbl.textContent = (i+1) + 'f';
        card.appendChild(c); card.appendChild(lbl);
        strip.appendChild(card);
    });
}

// 현재 재생 프레임 하이라이트
function highlightFrame(idx) {
    document.querySelectorAll('[id^="fc"]').forEach((c, i) => {
        c.style.border = i === idx
            ? '2px solid #6c5ce7'
            : '1.5px solid rgba(108,92,231,0.2)';
    });
}

// 촬영 + 재생 시작
function startAll() {
    if (playTimer) clearInterval(playTimer);
    if (captureTimer) clearInterval(captureTimer);
    capturedFrames = [];
    playIdx = 0;
    isCapturing = true;
    isPaused = false;
    updatePauseBtn();

    const interval = 1000 / currentFps;
    let elapsed = 0;

    captureTimer = setInterval(() => {
        elapsed += interval;
        const sx = (elapsed / 1000) * getCanvasW();
        capturedFrames.push(captureThumb(sx));
        if (elapsed >= 1000 - interval * 0.5) {
            clearInterval(captureTimer);
            isCapturing = false;
            buildTimeline();
            // 재생
            playTimer = setInterval(() => {
                if (isPaused || !capturedFrames.length) return;
                const sx = (playIdx / (currentFps - 1 || 1)) * getCanvasW();
                if (fCtx) drawShip(fCtx, getCanvasW(), getCanvasH(), sx);
                highlightFrame(playIdx);
                playIdx = (playIdx + 1) % capturedFrames.length;
            }, interval);
        }
    }, interval);
}

// 촬영 중 캔버스 애니메이션
let rafTick = 0;
function rafLoop() {
    if (isCapturing && fCtx) {
        rafTick++;
        const sx = ((rafTick * 2.5) % (getCanvasW() + 60)) - 30;
        drawShip(fCtx, getCanvasW(), getCanvasH(), sx);
    }
    rafId = requestAnimationFrame(rafLoop);
}

function updatePauseBtn() {
    const btn = document.getElementById('fpsPauseBtn');
    if (!btn) return;
    btn.textContent = isPaused ? '▶ 재생' : '⏸ 일시정지';
    btn.style.background = isPaused ? 'var(--multi-navy)' : 'white';
    btn.style.color = isPaused ? 'white' : 'var(--multi-navy)';
}

window.toggleFPSPause = function() {
    isPaused = !isPaused;
    updatePauseBtn();
};

window.updateFPS = function() {
    currentFps = parseInt(document.getElementById('fpsSlider').value);
    const disp = document.getElementById('fpsValDisplay');
    if (disp) disp.innerText = currentFps + ' fps';
    setTimeout(startAll, 60);
};

window.startFPSAnimation = function() {
    if (!isSimRunning) {
        isSimRunning = true;
        requestAnimationFrame(rafLoop);
        startAll();
    }
};

window.checkMission = function() {
    const inputVal = document.getElementById('missionInput').value.trim();
    if (inputVal === "600") {
        document.getElementById('missionInput').style.backgroundColor = '#d4edda';
        document.getElementById('missionInput').style.borderColor = '#28a745';
        document.getElementById('missionInput').style.color = '#155724';
        const toast = document.getElementById('toast');
        if (toast) {
            toast.innerText = "수사 미션 성공! 🎉 다음 단계 퀴즈로 넘어가세요.";
            toast.style.opacity = 1;
            setTimeout(() => toast.style.opacity = 0, 2500);
        }
    } else {
        showCustomAlert("❌ 오답입니다!<br><br>힌트: (이미지 1장의 용량) × (1초당 프레임 수) × (시간 초)<br>수식을 떠올려 보세요.");
        document.getElementById('missionInput').value = '';
        document.getElementById('missionInput').focus();
    }
};