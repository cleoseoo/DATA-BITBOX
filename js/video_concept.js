// ── video_concept.js ─────────────────────────────────────────────
// [7단원: 동영상의 디지털 표현] 전용 스크립트

// 🌟 [설정] 7단원 고유 정보
const THIS_STEP = 8; // (원본 인덱스 유지)
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

// 🌟 [개별 기능] 3단계: FPS 시뮬레이터 (우주선 야간 비행 테마)
const fCanvas = document.getElementById('fpsCanvas');
const fCtx = fCanvas ? fCanvas.getContext('2d') : null;
let currentFps = 60;
let lastFrameTime = 0;
let ufoX = -50;
let trailArray = []; 
let isSimRunning = false;

window.updateFPS = function() {
    currentFps = parseInt(document.getElementById('fpsSlider').value);
    document.getElementById('fpsValDisplay').innerText = currentFps + ' fps';
    trailArray = []; 
};

function drawUFO(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    let grad = ctx.createLinearGradient(0, 0, 0, 40);
    grad.addColorStop(0, 'rgba(0, 210, 211, 0.4)');
    grad.addColorStop(1, 'rgba(0, 210, 211, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-15, 10);
    ctx.lineTo(15, 10);
    ctx.lineTo(30, 50);
    ctx.lineTo(-30, 50);
    ctx.fill();
    ctx.fillStyle = '#81ecec';
    ctx.beginPath();
    ctx.arc(0, -5, 15, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#ff9f43';
    ctx.beginPath();
    ctx.ellipse(0, 5, 25, 10, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#2d3436';
    ctx.beginPath();
    ctx.arc(0, -8, 3, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
}

function drawSim(timestamp) {
    if (!isSimRunning || !fCtx) return;
    
    const timeSinceLastFrame = timestamp - lastFrameTime;
    if (timeSinceLastFrame >= 1000 / currentFps) {
        lastFrameTime = timestamp - (timeSinceLastFrame % (1000/currentFps)); 
        const baseSpeed = 4.5; 
        const moveStep = baseSpeed * (60 / currentFps); 
        ufoX += moveStep;
        if(ufoX > 550) { ufoX = -50; trailArray = []; }
        let waveY = 125 + Math.sin(ufoX * 0.03) * 40;
        trailArray.push({x: ufoX, y: waveY});
        if(trailArray.length > 80) trailArray.shift(); 
    }

    fCtx.fillStyle = '#1e272e';
    fCtx.fillRect(0, 0, 500, 250);
    fCtx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    fCtx.lineWidth = 1;
    for(let i=0; i<=500; i+=50) { fCtx.beginPath(); fCtx.moveTo(i, 0); fCtx.lineTo(i, 250); fCtx.stroke(); }
    for(let i=0; i<=250; i+=50) { fCtx.beginPath(); fCtx.moveTo(0, i); fCtx.lineTo(500, i); fCtx.stroke(); }
    
    for(let i=0; i<trailArray.length; i++) {
        let pt = trailArray[i];
        fCtx.fillStyle = '#00d2d3'; 
        fCtx.shadowBlur = 10;
        fCtx.shadowColor = '#00d2d3';
        fCtx.beginPath(); 
        fCtx.arc(pt.x, pt.y, 4, 0, Math.PI*2); 
        fCtx.fill();
    }
    fCtx.shadowBlur = 0; 
    if (trailArray.length > 0) {
        let lastPos = trailArray[trailArray.length - 1];
        drawUFO(fCtx, lastPos.x, lastPos.y);
    }
    requestAnimationFrame(drawSim);
}

window.startFPSAnimation = function() {
    if(!isSimRunning) {
        isSimRunning = true;
        requestAnimationFrame(drawSim);
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