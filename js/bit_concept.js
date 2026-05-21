// ── bit_concept.js ─────────────────────────────────────────────
// [2단원: 비트란?] 전용 스크립트

// 🌟 [설정] 2단원 고유 정보
const THIS_STEP = 2;
const STEP_TITLE = "2. 비트란?";
const FILE_NAME_PREFIX = "비트_개념";
const PASS_SCORE = 70;
const MEMO_KEY = "value_bit_memo";
const REF_KEY = "value_bit_reflection";

// ✅ stepId → dotIndex 매핑
const stepDotMap = {
    'step1-visual': 0,
    'step2-concept': 1,
    'step3-quiz': 2
};

// 🌟 [개별 기능] 2단원 전용 스크립트 (전구 스위치 작동)
function toggleBit() {
    const parent = document.getElementById('switchParent');
    const sw = document.getElementById('bitSwitch');
    const knob = document.getElementById('knobText');
    const result = document.getElementById('resultBit');
    const offText = document.getElementById('offText');
    const onText = document.getElementById('onText');
    const bulbOff = document.getElementById('bulbOff');
    const bulbOn = document.getElementById('bulbOn');

    if (sw.classList.contains('on')) {
        sw.classList.remove('on');
        parent.classList.remove('on');
        knob.innerText = "0";
        result.innerText = "0";
        result.classList.remove('on');
        offText.classList.add('active');
        onText.classList.remove('active');
        bulbOff.style.display = "block";
        bulbOn.style.display = "none";
    } else {
        sw.classList.add('on');
        parent.classList.add('on');
        knob.innerText = "1";
        result.innerText = "1";
        result.classList.add('on');
        offText.classList.remove('active');
        onText.classList.add('active');
        bulbOff.style.display = "none";
        bulbOn.style.display = "block";
    }
}

// 🌟 [개별 기능] 2단원 전용 스크립트 (퀴즈 힌트 버튼)
function toggleHint(btn, text) {
    const display = btn.nextElementSibling;
    if (display.style.display === 'none' || display.style.display === '') {
        display.innerText = text; display.style.display = 'inline-block';
    } else { 
        display.style.display = 'none'; 
    }
}