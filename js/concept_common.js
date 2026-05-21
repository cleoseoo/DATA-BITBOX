/* =========================================================
   [데이터 비트박스] 개념 탐구 공통 스크립트 (concept_common.js)
   - 퀴즈 타이머, 채점, 드래그 앤 드롭, 리포트 출력, 노트 저장
========================================================= */

// ✅ 진행 점 업데이트 (동적 처리로 개선)
function updateDots(stepIndex) {
    // 최대 10단계까지 넉넉하게 돌면서, 화면에 있는 점(dot)만 찾아서 색칠합니다.
    for (var i = 0; i < 10; i++) {
        var dot = document.getElementById('dot' + i);
        if (!dot) continue; // 점이 없으면(예: 3단계 페이지) 알아서 무시함
        
        if (i < stepIndex) dot.className = 'prog-dot done';
        else if (i === stepIndex) dot.className = 'prog-dot cur';
        else dot.className = 'prog-dot';
    }
}

function setStatus(status) {
    document.body.className = ''; 
    if(status === 'help') document.body.classList.add('status-help');
    if(status === 'done') document.body.classList.add('status-done');
    try {
        if(status === 'normal') localStorage.removeItem('status_step' + (typeof THIS_STEP !== 'undefined' ? THIS_STEP : ''));
        else localStorage.setItem('status_step' + (typeof THIS_STEP !== 'undefined' ? THIS_STEP : ''), status);
    } catch(e) {}
}

function showCustomAlert(title, message) {
    document.getElementById('alertTitle').innerText = title;
    document.getElementById('alertMessage').innerHTML = message;
    document.getElementById('customAlertModal').style.display = 'flex';
}
function closeCustomAlert() {
    document.getElementById('customAlertModal').style.display = 'none';
}

function revealInline(btn, text, color = 'var(--teal-main)') {
    const span = document.createElement('span');
    span.className = 'pop-anim revealed-text'; 
    span.style.color = color;
    span.style.fontWeight = '900';
    span.style.backgroundColor = 'white';
    span.style.padding = '4px 10px';
    span.style.borderRadius = '12px';
    span.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    span.innerText = text;
    btn.parentNode.replaceChild(span, btn);
}

// ✅ 화면 전환 및 진행 점 연동
function goToStep(currentId, nextId) {
    const currentStep = document.getElementById(currentId);
    const nextStep = document.getElementById(nextId);
    if (!currentStep || !nextStep) return;
    
    const isNext = typeof stepDotMap !== 'undefined' && stepDotMap[nextId] > stepDotMap[currentId];
    
    currentStep.style.opacity = '0';
    currentStep.style.transform = isNext ? 'translateX(-20px)' : 'translateX(20px)';
    
    setTimeout(() => {
        currentStep.style.display = 'none';
        nextStep.style.display = 'flex';
        if(nextId.includes('quiz')) nextStep.style.display = 'block'; 
        
        nextStep.style.opacity = '0';
        nextStep.style.transform = isNext ? 'translateX(20px)' : 'translateX(-20px)';
        
        void nextStep.offsetWidth; 
        
        setTimeout(() => {
            nextStep.style.opacity = '1';
            nextStep.style.transform = 'translateX(0)';
        }, 50);

        if(typeof stepDotMap !== 'undefined') updateDots(stepDotMap[nextId]);
    }, 400); 
}

// ✅ 퀴즈 시스템
let timerInterval;
let elapsedSeconds = 0;
let isQuizStarted = false;
let score = 0;
let correctAnswers = 0; 
const scored = new Set();

function markStepDone(finalScore) {
    const pass = typeof PASS_SCORE !== 'undefined' ? PASS_SCORE : 70;
    if (finalScore < pass) return;
    try {
        const done = JSON.parse(localStorage.getItem('completedSteps') || '[]');
        if (typeof THIS_STEP !== 'undefined' && !done.includes(THIS_STEP)) {
            done.push(THIS_STEP);
            localStorage.setItem('completedSteps', JSON.stringify(done));
        }
        localStorage.setItem('score_step' + THIS_STEP, finalScore);
        localStorage.setItem('score_step' + THIS_STEP + '_date', new Date().toLocaleDateString('ko-KR'));
    } catch(e) { console.warn('저장 실패:', e); }
}

function startQuizTimer() {
    isQuizStarted = true;
    const btn = document.getElementById('startQuizBtn');
    if(btn) btn.style.display = 'none';
    document.getElementById('submitQuizBtnWrap').style.display = 'block';
    document.getElementById('wordBank').style.opacity = '1';
    document.getElementById('wordBank').style.pointerEvents = 'auto';
    document.getElementById('quizForm').classList.add('quiz-active');
    document.querySelectorAll('.blank').forEach(el => {
        if(!el.classList.contains('correct')) el.disabled = false;
    });
    timerInterval = setInterval(() => {
        elapsedSeconds++;
        const m = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
        const s = String(elapsedSeconds % 60).padStart(2, '0');
        document.getElementById('quizTimer').innerText = `⏱️ ${m}:${s}`;
    }, 1000);
}

function resetQuiz() {
    clearInterval(timerInterval);
    elapsedSeconds = 0;
    document.getElementById('quizTimer').innerText = '⏱️ 00:00';
    isQuizStarted = false;
    score = 0;
    correctAnswers = 0;
    scored.clear();
    document.querySelectorAll('.blank').forEach(el => {
        el.value = '';
        el.classList.remove('correct');
        el.disabled = true;
    });
    const btn = document.getElementById('startQuizBtn');
    if(btn) btn.style.display = 'inline-block';
    document.getElementById('submitQuizBtnWrap').style.display = 'none';
    document.getElementById('wordBank').style.opacity = '0.4';
    document.getElementById('wordBank').style.pointerEvents = 'none';
    document.getElementById('quizForm').classList.remove('quiz-active');
}

function check(el) {
    if (!isQuizStarted) return; 
    if (el.value.trim() === el.getAttribute('data-answer') && !scored.has(el)) {
        el.classList.add('correct'); 
        el.disabled = true;
        scored.add(el); 
        score += parseInt(el.getAttribute('data-score') || '10');
        correctAnswers++;
    }
}

function submitQuiz() {
    if(!isQuizStarted) return;
    clearInterval(timerInterval); 
    showSuccess();
}

function allowDrop(ev) { if(isQuizStarted) ev.preventDefault(); }
function drag(ev) { if(isQuizStarted) ev.dataTransfer.setData("text", ev.target.innerText); }
function drop(ev) {
    if(!isQuizStarted) return;
    ev.preventDefault();
    ev.target.value = ev.dataTransfer.getData("text");
    check(ev.target);
}

// ✅ 모달 팝업
function openTipPopup() {
    const content = document.getElementById('modalContent');
    content.className = 'modal-content';
    content.innerHTML = `
        <h3 style="color:var(--teal-main);">💡 미션 가이드</h3>
        <p style="line-height:1.8; text-align:left; padding:0 20px; font-size:1.05rem; word-break:keep-all;">
            - <b>[▶️ 퀴즈 시작]</b> 버튼을 누르면 타이머가 켜지고 입력이 가능해집니다.<br>
            - 보기 단어를 마우스로 <b>끌어서</b> 빈칸에 넣거나 <b>직접 입력</b>해 보세요.<br>
            - 모든 문제를 푼 뒤 화면 하단의 <b>[✅ 미션 완료 및 채점하기]</b> 버튼을 누르면 점수와 시간이 나옵니다.
        </p>
        <button onclick="closeModal()" style="width:100%; padding:14px; background:var(--teal-main); color:white; border:none; border-radius:12px; font-weight:700; font-size:1.1rem; cursor:pointer; margin-top:10px;">확인</button>
    `;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function showSuccess() {
    const m = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
    const s = String(elapsedSeconds % 60).padStart(2, '0');
    const finalScore = score; 
    markStepDone(finalScore);
    
    const content = document.getElementById('modalContent');
    content.className = 'modal-content';
    
    // HTML에서 설정한 단원명 불러오기 (예: "1. 디지털 데이터의 가치" -> "디지털 데이터의 가치")
    let titleText = typeof STEP_TITLE !== 'undefined' ? STEP_TITLE.replace(/^[0-9]+\.\s*/, '') : '탐구';

    content.innerHTML = `
        <div style="font-size:3rem; margin-bottom:15px;">🕵️‍♂️✨</div>
        <h2 style="color:var(--teal-main); margin-bottom:15px;">${titleText} 완료!</h2>
        <div style="background:#f0fdfa; border: 1px solid rgba(20, 184, 166, 0.2); padding:15px; border-radius:12px; margin-bottom:20px;">
            <p style="margin:5px 0; font-size:1.1rem; font-weight:800;">최종 점수: <span style="color:var(--apple-red); font-size:1.3rem;">${finalScore}점</span></p>
            <p style="margin:5px 0; font-size:1.1rem; font-weight:800;">풀이 시간: <span style="color:var(--teal-main); font-size:1.3rem;">${m}분 ${s}초</span></p>
        </div>
        <p style="font-size:0.95rem; color:#555; margin-bottom:20px;">${titleText}을(를) 마스터했습니다!!<br>창을 닫고 우측 하단의 버튼을 눌러 리포트를 저장하세요.</p>
        <button onclick="closeModal()" style="width:100%; padding:14px; background:var(--teal-main); color:white; border:none; border-radius:12px; font-weight:700; font-size:1.1rem; cursor:pointer;">확인 및 닫기</button>
    `;
    document.getElementById('modalOverlay').style.display = 'flex';
    
   const pass = typeof PASS_SCORE !== 'undefined' ? PASS_SCORE : 70;
    if(finalScore >= pass) {
        // 현재 페이지의 마지막 점 번호를 자동으로 찾아냅니다!
        let maxIndex = 2; 
        if (typeof stepDotMap !== 'undefined') {
            maxIndex = Math.max(...Object.values(stepDotMap));
        }
        let lastDot = document.getElementById('dot' + maxIndex);
        if(lastDot) lastDot.className = 'prog-dot done';
        
        setStatus('done'); 
    }
}

function closeModal() { document.getElementById('modalOverlay').style.display = 'none'; }

// ✅ 리포트 다운로드 (TXT / PNG)
function downloadReportTXT() {
    const finalScore = score;
    const memo = document.getElementById('memoInput') ? document.getElementById('memoInput').value : '';
    const reflection = document.getElementById('reflectionInput') ? document.getElementById('reflectionInput').value : '';
    const dateStr = new Date().toLocaleString('ko-KR');
    const m = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
    const s = String(elapsedSeconds % 60).padStart(2, '0');
    const timeStr = isQuizStarted ? `${m}분 ${s}초` : "측정 불가";
    
    let reportTitle = typeof STEP_TITLE !== 'undefined' ? STEP_TITLE : "학습 결과";
    let fileName = typeof FILE_NAME_PREFIX !== 'undefined' ? FILE_NAME_PREFIX : "학습결과";

    const txtContent = 
`==================================================
        [데이터 비트박스] 학습 결과 리포트
==================================================

▶ 단원명 : ${reportTitle}
▶ 일  시 : ${dateStr}
▶ 점  수 : ${finalScore} 점
▶ 시  간 : ${timeStr}

--------------------------------------------------
[📌 배움 노트]
${memo || "작성된 내용이 없습니다."}

--------------------------------------------------
[🌿 배움 활동 소감]
${reflection || "작성된 내용이 없습니다."}

==================================================
* 본 리포트는 '데이터 비트박스' 시스템에서 자동 생성되었습니다.
==================================================`;

    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}_학습결과.txt`;
    link.click();
}

function downloadReportImageOffline() {
    const finalScore = score;
    const memo = document.getElementById('memoInput') ? document.getElementById('memoInput').value : '';
    const reflection = document.getElementById('reflectionInput') ? document.getElementById('reflectionInput').value : '';
    const dateStr = new Date().toLocaleString('ko-KR');
    const m = String(Math.floor(elapsedSeconds / 60)).padStart(2, '0');
    const s = String(elapsedSeconds % 60).padStart(2, '0');
    const timeStr = isQuizStarted ? `${m}분 ${s}초` : "측정 불가";
    
    let reportTitle = typeof STEP_TITLE !== 'undefined' ? STEP_TITLE : "학습 결과";
    let fileName = typeof FILE_NAME_PREFIX !== 'undefined' ? FILE_NAME_PREFIX : "학습결과";

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    function getLines(text, maxWidth) {
        ctx.font = "18px sans-serif";
        const lines = [];
        const paragraphs = text.split('\\n');
        paragraphs.forEach(p => {
            let currentLine = '';
            for(let i=0; i<p.length; i++) {
                const char = p[i];
                const testLine = currentLine + char;
                if(ctx.measureText(testLine).width > maxWidth && i > 0) { lines.push(currentLine); currentLine = char; }
                else currentLine = testLine;
            }
            lines.push(currentLine);
        });
        return lines;
    }
    const memoLines = getLines(memo || "작성된 내용이 없습니다.", 620);
    const reflectionLines = getLines(reflection || "작성된 내용이 없습니다.", 620);
    const totalHeight = 500 + (memoLines.length * 28) + (reflectionLines.length * 28) + 100;
    
    canvas.height = totalHeight;
    ctx.fillStyle = '#f0fdfa'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#14b8a6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(40, 40, 720, totalHeight - 80, 24); ctx.fill(); ctx.stroke();
    
    ctx.fillStyle = '#0f766e'; ctx.font = "bold 32px sans-serif"; ctx.textAlign = 'center';
    ctx.fillText("[데이터 비트박스] 학습 결과 리포트", 400, 100);
    ctx.strokeStyle = '#14b8a6'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(230, 120); ctx.lineTo(570, 120); ctx.stroke();
    
    ctx.fillStyle = '#f8fafc'; ctx.beginPath(); ctx.roundRect(70, 150, 660, 150, 16); ctx.fill();
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign = 'left'; ctx.font = "bold 20px sans-serif"; ctx.fillStyle = '#1d1d1f';
    ctx.fillText("▶ 단원명: " + reportTitle, 100, 195);
    ctx.fillText("▶ 일시: " + dateStr, 100, 235);
    ctx.fillStyle = '#ef4444'; ctx.fillText("▶ 퀴즈 점수: " + finalScore + " 점", 100, 275);
    ctx.fillStyle = '#0f766e'; ctx.fillText("▶ 풀이 시간: " + timeStr, 400, 275);
    
    let currentY = 350;
    ctx.fillStyle = '#047857'; ctx.font = "bold 24px sans-serif"; ctx.fillText("📌 배움 노트", 70, currentY); currentY += 25;
    ctx.fillStyle = '#f0fdfa'; const memoBoxHeight = (memoLines.length * 28) + 40;
    ctx.beginPath(); ctx.roundRect(70, currentY, 660, memoBoxHeight, 12); ctx.fill();
    ctx.strokeStyle = '#ccfbf1'; ctx.stroke();
    ctx.fillStyle = '#334155'; ctx.font = "18px sans-serif"; currentY += 35;
    memoLines.forEach(line => { ctx.fillText(line, 90, currentY); currentY += 28; });
    currentY += 40;
    
    ctx.fillStyle = '#047857'; ctx.font = "bold 24px sans-serif"; ctx.fillText("🌿 배움 활동 소감", 70, currentY); currentY += 25;
    ctx.fillStyle = '#f0fdfa'; const refBoxHeight = (reflectionLines.length * 28) + 40;
    ctx.beginPath(); ctx.roundRect(70, currentY, 660, refBoxHeight, 12); ctx.fill();
    ctx.strokeStyle = '#ccfbf1'; ctx.stroke();
    ctx.fillStyle = '#334155'; ctx.font = "18px sans-serif"; currentY += 35;
    reflectionLines.forEach(line => { ctx.fillText(line, 90, currentY); currentY += 28; });
    currentY += 70;
    
    ctx.fillStyle = '#94a3b8'; ctx.font = "bold 16px sans-serif"; ctx.textAlign = 'center';
    ctx.fillText("본 리포트는 '데이터 비트박스' 시스템에서 자동 생성되었습니다.", 400, currentY);
    
    const link = document.createElement('a');
    link.download = `${fileName}_리포트.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// ✅ 페이지 로드 시 저장된 데이터 복원
window.onload = function() {
    try {
        const savedStatus = localStorage.getItem('status_step' + (typeof THIS_STEP !== 'undefined' ? THIS_STEP : ''));
        if(savedStatus) document.body.classList.add('status-' + savedStatus);
        const done = JSON.parse(localStorage.getItem('completedSteps') || '[]');
        if(typeof THIS_STEP !== 'undefined' && done.includes(THIS_STEP)) {
            const activeMenu = document.querySelector('.menu-link.active');
            if(activeMenu && !activeMenu.textContent.includes('✓')) activeMenu.textContent += ' ✓';
        }
    } catch(e) {}

    const wordBank = document.querySelector('.word-bank');
    if(wordBank) {
        for (let i = wordBank.children.length; i >= 0; i--) {
            wordBank.appendChild(wordBank.children[Math.random() * i | 0]);
        }
    }

    const memoInput = document.getElementById('memoInput');
    const reflectionInput = document.getElementById('reflectionInput');
    if(memoInput && reflectionInput) {
        let mKey = typeof MEMO_KEY !== 'undefined' ? MEMO_KEY : 'memo';
        let rKey = typeof REF_KEY !== 'undefined' ? REF_KEY : 'ref';
        
        if(localStorage.getItem(mKey)) memoInput.value = localStorage.getItem(mKey);
        if(localStorage.getItem(rKey)) reflectionInput.value = localStorage.getItem(rKey);
        
        memoInput.addEventListener('input', function() { localStorage.setItem(mKey, this.value); });
        reflectionInput.addEventListener('input', function() { localStorage.setItem(rKey, this.value); });
    }
};

// ✅ 단원 기록 지우기
function eraseStepContent() {
    const content = document.getElementById('modalContent');
    content.className = 'modal-content-small';
    content.innerHTML = `
        <div style="font-size:2.2rem; margin-bottom:10px;">🗑️</div>
        <h3 style="color:#ef4444; margin-bottom:10px; font-size:1.2rem; font-weight:900;">이 단원 학습 내용 지우기</h3>
        <p style="font-size:0.9rem; color:#555; line-height:1.9; margin-bottom:22px; text-align:left; padding:0 4px; word-break:keep-all;">
            아래 내용이 모두 삭제됩니다.<br>
            <span style="color:#ef4444;">• 퀴즈 점수 및 완료 기록<br>• 배움 노트 내용<br>• 배움 활동 소감 내용<br>• SOS·미션 완료 테두리 상태</span>
        </p>
        <div style="display:flex; gap:10px;">
            <button onclick="closeModal()" style="flex:1; padding:11px; background:#f1f5f9; color:#64748b; border:none; border-radius:12px; font-weight:700; font-size:0.95rem; cursor:pointer;">취소</button>
            <button onclick="doEraseContent()" style="flex:1; padding:11px; background:#ef4444; color:white; border:none; border-radius:12px; font-weight:700; font-size:0.95rem; cursor:pointer;">지우기</button>
        </div>
    `;
    document.getElementById('modalOverlay').style.display = 'flex';
}

function doEraseContent() {
    try {
        if (typeof THIS_STEP !== 'undefined') {
            localStorage.removeItem('score_step' + THIS_STEP);
            localStorage.removeItem('score_step' + THIS_STEP + '_date');
            const done = JSON.parse(localStorage.getItem('completedSteps') || '[]');
            localStorage.setItem('completedSteps', JSON.stringify(done.filter(s => s !== THIS_STEP)));
            localStorage.removeItem('status_step' + THIS_STEP);
        }
        
        let mKey = typeof MEMO_KEY !== 'undefined' ? MEMO_KEY : 'memo';
        let rKey = typeof REF_KEY !== 'undefined' ? REF_KEY : 'ref';
        localStorage.removeItem(mKey);
        localStorage.removeItem(rKey);
        
        if(document.getElementById('memoInput')) document.getElementById('memoInput').value = '';
        if(document.getElementById('reflectionInput')) document.getElementById('reflectionInput').value = '';
        
        resetQuiz();
        setStatus('normal');
        updateDots(0);
        
        const activeMenu = document.querySelector('.menu-link.active');
        if (activeMenu && activeMenu.textContent.endsWith(' ✓')) {
            activeMenu.textContent = activeMenu.textContent.replace(' ✓', '');
        }
    } catch(e) {}
    
    document.getElementById('modalContent').className = 'modal-content-small';
    document.getElementById('modalContent').innerHTML = `
        <div style="font-size:2.2rem; margin-bottom:10px;">✅</div>
        <h3 style="margin-bottom:10px; font-size:1.2rem; font-weight:900;">삭제 완료!</h3>
        <p style="font-size:0.9rem; color:#555; margin-bottom:18px;">이 단원의 학습 내용이 모두 삭제되었습니다.</p>
        <button onclick="closeModal()" style="width:100%; padding:11px; color:white; border:none; border-radius:12px; font-weight:700; font-size:0.95rem; cursor:pointer; background:#10b981;">확인</button>
    `;
}

window.addEventListener('keydown', function(e) {
    const alertOverlay = document.getElementById('customAlertModal') || document.getElementById('customAlertOverlay');
    if (alertOverlay && alertOverlay.style.display === 'flex') {
        if (e.key === 'Enter') { e.preventDefault(); closeCustomAlert(); }
    }
});