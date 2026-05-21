// ── number_concept.js ─────────────────────────────────────────────
// [3단원: 숫자의 디지털 표현] 전용 스크립트

// 🌟 [설정] 3단원 고유 정보
const THIS_STEP = 3;
const STEP_TITLE = "3. 숫자의 디지털 표현";
const FILE_NAME_PREFIX = "숫자_개념";
const PASS_SCORE = 70;
const MEMO_KEY = "number_concept_memo";
const REF_KEY = "number_concept_reflection";

// ✅ 진행 점 매핑
const stepDotMap = {
    'step1-visual':  0,
    'step2-concept': 1,
    'step3-tip':     2,
    'step4-tip2':    3,
    'step5-quiz':    4
};

// 🌟 [개별 기능] 1. 전구 스위치 및 이진수 계산기
let bulbStates = Array(16).fill(0);

function toggleBulb(idx) {
    bulbStates[idx] = 1 - bulbStates[idx];
    const bulb = document.getElementById('bulb-' + idx);
    const wrap = document.getElementById('bw-' + idx);
    
    if (bulbStates[idx]) {
        bulb.innerText = '1';
        bulb.classList.add('on');
        wrap.classList.add('on');
    } else {
        bulb.innerText = '0';
        bulb.classList.remove('on');
        wrap.classList.remove('on');
    }
    updateNumberResult();
}

function updateNumberResult() {
    let leftBin = bulbStates.slice(8, 16).reverse().join('');
    let rightBin = bulbStates.slice(0, 8).reverse().join('');
    document.getElementById('binary-text').innerText = leftBin + ' ' + rightBin;

    let decValue = 0;
    for (let i = 0; i < 16; i++) {
        if (bulbStates[i] === 1) decValue += Math.pow(2, i);
    }
    document.getElementById('decimal-text').innerText = decValue;

    const val2 = bulbStates[1];
    const val1 = bulbStates[0];
    document.querySelectorAll('.postit').forEach(el => el.classList.remove('active'));
    if (val2 === 0 && val1 === 0) document.getElementById('postit-00').classList.add('active');
    if (val2 === 0 && val1 === 1) document.getElementById('postit-01').classList.add('active');
    if (val2 === 1 && val1 === 0) document.getElementById('postit-10').classList.add('active');
    if (val2 === 1 && val1 === 1) document.getElementById('postit-11').classList.add('active');
}

function setMode(mode) {
    document.getElementById('btn-bin').classList.remove('active');
    document.getElementById('btn-dec').classList.remove('active');
    const desc = document.getElementById('mode-desc');
    
    if (mode === 'bin') {
        document.getElementById('btn-bin').classList.add('active');
        desc.innerHTML = '각 자리는 오른쪽→왼쪽으로 <b>2배</b>씩 커집니다 &nbsp;|&nbsp; 이진수는 <b>0(꺼짐)</b>과 <b>1(켜짐)</b> 두 가지로만 표현해요';
        document.getElementById('postit-bin').style.display = 'block';
        document.getElementById('postit-dec').style.display = 'none';
    } else {
        document.getElementById('btn-dec').classList.add('active');
        desc.innerHTML = '각 자리는 오른쪽→왼쪽으로 <b>10배</b>씩 커집니다 &nbsp;|&nbsp; 십진수는 <b>0~9</b>까지 열 가지 숫자로 표현해요';
        document.getElementById('postit-bin').style.display = 'none';
        document.getElementById('postit-dec').style.display = 'flex';
    }
}

// 🌟 [개별 기능] 2. 나눗셈 빈칸 채우기 정답 확인
function checkDiv(el) {
    if (el.value === el.getAttribute('data-ans')) {
        el.style.backgroundColor = '#d1fae5';
        el.style.borderColor = '#10b981';
        el.style.color = '#047857';
        el.disabled = true;
    }
    const allInputs = document.querySelectorAll('#step3-tip .val-box');
    let allCorrect = true;
    allInputs.forEach(input => {
        if (input.value !== input.getAttribute('data-ans')) allCorrect = false;
    });
    if (allCorrect) {
        document.getElementById('final-bin').innerText = "1 1 0 1";
        document.getElementById('resultBox').style.backgroundColor = '#d1fae5';
        document.getElementById('resultBox').style.borderColor = '#10b981';
    }
}

function checkBinToDec(el) {
    if (el.value === el.getAttribute('data-ans')) {
        el.style.backgroundColor = '#d1fae5';
        el.style.borderColor = '#10b981';
        el.style.color = '#047857';
        el.disabled = true;
    }
}

function checkBinToDecFinal(el) {
    if (el.value === el.getAttribute('data-ans')) {
        el.style.backgroundColor = '#d1fae5';
        el.style.borderColor = '#10b981';
        el.style.color = '#047857';
        el.disabled = true;
        document.getElementById('resultBox2').style.backgroundColor = '#d1fae5';
        document.getElementById('resultBox2').style.borderColor = '#10b981';
    }
}

// 🌟 [개별 기능] 3. 힌트 버튼 토글
function toggleHint(btn, text) {
    const display = btn.nextElementSibling;
    if (display.style.display === 'none' || display.style.display === '') {
        display.innerText = text; display.style.display = 'inline-block';
    } else { display.style.display = 'none'; }
}