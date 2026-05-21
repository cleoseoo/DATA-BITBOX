// ── image_concept.js ─────────────────────────────────────────────
// [5단원: 이미지의 디지털 표현] 전용 스크립트

// 🌟 [설정] 5단원 고유 정보
const THIS_STEP = 5;
const STEP_TITLE = "5. 이미지의 디지털 표현";
const FILE_NAME_PREFIX = "이미지_개념";
const PASS_SCORE = 70;
const MEMO_KEY = "value_image_memo";
const REF_KEY = "value_image_reflection";

// ✅ 화면 진행 점 매핑
const stepDotMap = {
    'step1-visual':  0,
    'step2-concept': 1,
    'step3-advanced': 2,
    'step4-bitmap':  3,
    'step5-vector':  4,
    'step6-quiz':    5
};

// 🌟 [개별 기능] 특수 인라인 버튼 (HTML <b> 태그 지원 덮어쓰기)
window.revealInline = function(btn, text, color = 'var(--teal-main)') {
    const span = document.createElement('span');
    span.className = 'pop-anim revealed-text'; 
    span.style.color = color;
    span.style.borderColor = color; 
    span.style.fontWeight = '900';
    span.innerHTML = text; 
    btn.parentNode.replaceChild(span, btn);
};

// 🌟 [개별 기능] 1단계: 자율주행 자동차 및 신호등 애니메이션
const sCanvas = document.getElementById('sourceCanvas');
const sCtx = sCanvas ? sCanvas.getContext('2d', {willReadFrequently: true}) : null;
const lCanvas = document.getElementById('loupeCanvas');
const lCtx = lCanvas ? lCanvas.getContext('2d') : null;
const wrapper = document.getElementById('canvasWrapper');
if(lCtx) lCtx.imageSmoothingEnabled = false;

let trafficLight = 'EW_GREEN'; 
let car1X = -60, car2X = 640; 
let bikeY = 420; 
let tick = 0;
let isMag = false, mX = 0, mY = 0;

if(wrapper) {
    wrapper.addEventListener('mousedown', () => {
        trafficLight = (trafficLight === 'EW_GREEN') ? 'NS_GREEN' : 'EW_GREEN';
    });

    wrapper.addEventListener('mousemove', (e) => {
        const r = wrapper.getBoundingClientRect(); mX = e.clientX - r.left; mY = e.clientY - r.top;
        if(mX<0 || mY<0 || mX>620 || mY>400) { isMag = false; lCanvas.style.display = 'none'; return; }
        isMag = true; lCanvas.style.display = 'block';
        lCanvas.style.left = (mX - 140) + 'px'; lCanvas.style.top = (mY - 140) + 'px';
    });
    wrapper.addEventListener('mouseleave', () => { isMag = false; lCanvas.style.display = 'none'; });
}

function drawCity() {
    if(!sCtx) return;
    sCtx.clearRect(0, 0, 620, 400);
    sCtx.fillStyle = "#81ecec"; sCtx.fillRect(0,0,620,400); 
    sCtx.fillStyle = "#b8e994"; sCtx.fillRect(0,80,620,320); 

    sCtx.fillStyle = "#ffffff";
    sCtx.beginPath(); sCtx.arc(80, 40, 20, 0, Math.PI*2); sCtx.arc(100, 40, 25, 0, Math.PI*2); sCtx.arc(120, 40, 20, 0, Math.PI*2); sCtx.fill();
    sCtx.beginPath(); sCtx.arc(500, 50, 25, 0, Math.PI*2); sCtx.arc(530, 50, 30, 0, Math.PI*2); sCtx.arc(560, 50, 25, 0, Math.PI*2); sCtx.fill();

    sCtx.fillStyle = "#dcdde1"; 
    sCtx.fillRect(30, 80, 200, 100); sCtx.fillRect(390, 80, 200, 100);
    sCtx.fillRect(30, 260, 200, 120); sCtx.fillRect(390, 260, 200, 120);

    sCtx.fillStyle = "#353b48"; 
    sCtx.fillRect(0, 180, 620, 80); 
    sCtx.fillRect(230, 80, 160, 320); 

    sCtx.fillStyle = "#fbc531";
    for(let i=0; i<620; i+=40) { if(i<230 || i>390) sCtx.fillRect(i, 218, 20, 4); }
    for(let i=80; i<400; i+=40) { if(i<180 || i>260) sCtx.fillRect(308, i, 4, 20); }
    
    sCtx.fillStyle = "#f5f6fa";
    for(let i=190; i<250; i+=12) { sCtx.fillRect(235, i, 15, 6); sCtx.fillRect(370, i, 15, 6); }
    for(let i=245; i<305; i+=12) { sCtx.fillRect(i-10, 185, 6, 15); sCtx.fillRect(i-10, 240, 6, 15); }

    function drawTree(x, y) {
        sCtx.fillStyle = "#8d6e63"; sCtx.fillRect(x-4, y, 8, 25); 
        sCtx.fillStyle = "#10ac84"; 
        sCtx.beginPath(); sCtx.arc(x-10, y-5, 15, 0, Math.PI*2); sCtx.fill();
        sCtx.beginPath(); sCtx.arc(x+10, y-5, 15, 0, Math.PI*2); sCtx.fill();
        sCtx.beginPath(); sCtx.arc(x, y-15, 18, 0, Math.PI*2); sCtx.fill();
    }
    drawTree(210, 160); drawTree(410, 160); drawTree(210, 280); drawTree(410, 280);

    function drawBldg(x, y, w, h, baseC, roofC, text) {
        sCtx.fillStyle = baseC; sCtx.fillRect(x, y, w, h);
        sCtx.fillStyle = roofC; sCtx.fillRect(x, y, w, 25);
        sCtx.fillStyle = "#ffffff"; sCtx.font = "bold 12px Pretendard"; sCtx.fillText(text, x+10, y+18);
        sCtx.fillStyle = "rgba(255,255,255,0.4)";
        for(let i=x+15; i<x+w-15; i+=25) {
            for(let j=y+35; j<y+h-15; j+=20) { sCtx.fillRect(i, j, 12, 12); }
        }
    }
    drawBldg(50, 90, 120, 90, "#e17055", "#0984e3", "HOSPITAL 🚨"); 
    drawBldg(440, 90, 120, 90, "#74b9ff", "#0984e3", "POLICE 🚨"); 
    drawBldg(50, 270, 120, 90, "#ffeaa7", "#fdcb6e", "SCHOOL 🏫");
    drawBldg(440, 270, 120, 90, "#81ecec", "#00cec9", "MART 🛒");

    function drawTrafficLight(x, y, type) {
        sCtx.fillStyle = "#000000"; 
        sCtx.fillRect(x, y, 14, 30); 
        let redOn = false, greenOn = false;
        if(type === 'EW') { redOn = trafficLight==='NS_GREEN'; greenOn = trafficLight==='EW_GREEN'; }
        if(type === 'NS') { redOn = trafficLight==='EW_GREEN'; greenOn = trafficLight==='NS_GREEN'; }
        sCtx.fillStyle = redOn ? "#ff4757" : "#574b90"; sCtx.beginPath(); sCtx.arc(x+7, y+8, 4, 0, Math.PI*2); sCtx.fill();
        sCtx.fillStyle = greenOn ? "#2ed573" : "#574b90"; sCtx.beginPath(); sCtx.arc(x+7, y+22, 4, 0, Math.PI*2); sCtx.fill();
    }
    drawTrafficLight(210, 140, 'EW'); drawTrafficLight(395, 265, 'EW'); 
    drawTrafficLight(395, 140, 'NS'); drawTrafficLight(210, 265, 'NS'); 

    let car1Stop = (trafficLight === 'NS_GREEN' && car1X > 150 && car1X < 180);
    if(!car1Stop) car1X += 1.5; if(car1X > 640) car1X = -60;
    
    let car2Stop = (trafficLight === 'NS_GREEN' && car2X < 470 && car2X > 440);
    if(!car2Stop) car2X -= 1.2; if(car2X < -60) car2X = 640;

    let bikeStop = (trafficLight === 'EW_GREEN' && bikeY < 280 && bikeY > 260);
    if(!bikeStop) bikeY -= 1; if(bikeY < 60) bikeY = 420;

    sCtx.fillStyle = "#0984e3"; sCtx.fillRect(car1X, 190, 45, 22); 
    sCtx.fillStyle = "rgba(255,255,255,0.7)"; sCtx.fillRect(car1X+30, 192, 10, 18); 
    
    sCtx.fillStyle = "#d63031"; sCtx.fillRect(car2X, 228, 50, 22); 
    sCtx.fillStyle = "rgba(255,255,255,0.7)"; sCtx.fillRect(car2X+10, 230, 12, 18);

    sCtx.fillStyle = "#2ed573"; sCtx.beginPath(); sCtx.arc(265, bikeY, 6, 0, Math.PI*2); sCtx.fill(); 
    sCtx.fillStyle = "#f368e0"; sCtx.fillRect(262, bikeY+6, 6, 12); 

    tick++;
    if(isMag) updateLoupe();
    requestAnimationFrame(drawCity);
}
if(sCanvas) drawCity();

function updateLoupe() {
    lCtx.clearRect(0, 0, 280, 280); lCtx.save();
    lCtx.beginPath(); lCtx.arc(140, 140, 136, 0, Math.PI * 2); lCtx.clip();

    const zoom = 15; const capSize = 280 / zoom; 
    lCtx.drawImage(sCanvas, mX - capSize/2, mY - capSize/2, capSize, capSize, 0, 0, 280, 280);

    lCtx.strokeStyle = 'rgba(0,0,0,0.15)'; lCtx.lineWidth = 1;
    for(let i=0; i<=280; i+=zoom) { lCtx.beginPath(); lCtx.moveTo(i,0); lCtx.lineTo(i,280); lCtx.stroke(); lCtx.beginPath(); lCtx.moveTo(0,i); lCtx.lineTo(280,i); lCtx.stroke(); }

    lCtx.strokeStyle = '#ff2d55'; lCtx.lineWidth = 4;
    lCtx.strokeRect(140 - (zoom/2), 140 - (zoom/2), zoom, zoom);

    const pixel = sCtx.getImageData(mX, mY, 1, 1).data;
    const r = pixel[0].toString(2).padStart(8, '0');
    const g = pixel[1].toString(2).padStart(8, '0');
    const b = pixel[2].toString(2).padStart(8, '0');

    lCtx.fillStyle = 'rgba(0, 0, 0, 0.85)'; lCtx.fillRect(0, 160, 280, 120);
    
    lCtx.font = 'bold 11px Inter'; lCtx.fillStyle = '#fbc531'; lCtx.textAlign = 'center';
    lCtx.fillText('24비트 트루 컬러 데이터', 140, 180);

    lCtx.font = 'bold 12px Inter'; lCtx.fillStyle = '#ffffff';
    lCtx.fillText(`RGB (${pixel[0]}, ${pixel[1]}, ${pixel[2]})`, 140, 202);
    
    lCtx.font = 'bold 14px monospace';
    lCtx.fillStyle = '#ff7675'; lCtx.fillText(`R: ${r}`, 140, 225);
    lCtx.fillStyle = '#55efc4'; lCtx.fillText(`G: ${g}`, 140, 245);
    lCtx.fillStyle = '#74b9ff'; lCtx.fillText(`B: ${b}`, 140, 265);
    lCtx.restore();
}

// 🌟 [개별 기능] 커스텀 화면 이동 로직
window.goStep = function(id) {
    const current = document.querySelector('.step-container.active');
    const next = document.getElementById(id);
    if(current === next) return;

    current.style.opacity = '0'; 
    
    const currentNum = parseInt(current.id.match(/\d+/)[0]);
    const nextNum = parseInt(id.match(/\d+/)[0]);
    
    current.style.transform = (nextNum > currentNum) ? 'translateX(-20px)' : 'translateX(20px)';
    
    setTimeout(() => {
        current.classList.remove('active'); next.classList.add('active');
        
        if(id === 'step3-advanced' && currentMode === 'custom') {
            makeGrid(); 
        } else if(id === 'step3-advanced' && currentMode === 'hd') {
            drawAppleOnLeft();
            updateResultCanvas();
        } else if(id === 'step4-bitmap') {
            setBitDepth(currentBitDepth); 
        } else if(id === 'step5-vector') {
            updateVector(); 
        }

        setTimeout(() => { next.style.opacity = '1'; next.style.transform = 'translateX(0)'; }, 50);
        
        if (typeof updateDots === 'function') {
            updateDots(stepDotMap[id]);
        }
    }, 400); 
};

// 🌟 [개별 기능] 실습 패널 (비트맵 해상도 조절)
let gridData = []; 
let currentW = 16, currentH = 16;
let currentMode = 'custom'; 
let isInitialLoad = true;

window.switchMode = function(mode) {
    currentMode = mode;
    document.querySelectorAll('#modeCustom, #modeHD').forEach(b => b.classList.remove('active'));
    
    const descText = document.getElementById('modeDescText');

    if(mode === 'custom') {
        document.getElementById('modeCustom').classList.add('active');
        descText.innerHTML = "'내가 그린 픽셀 아트' 모드를 선택했습니다. 캔버스에 직접 그림을 그리고 우측 슬라이더로 해상도를 조절해 보세요.";
        
        document.getElementById('customSettings').style.display = 'flex';
        document.getElementById('hdSettings').style.display = 'none';
        document.getElementById('customUI').style.display = 'block';
        document.getElementById('hdUI').style.display = 'none';
        
        document.getElementById('resSlider').max = Math.max(currentW, currentH);
        document.getElementById('resSlider').value = Math.max(currentW, currentH);
        makeGrid();
    } else {
        document.getElementById('modeHD').classList.add('active');
        descText.innerHTML = "'고해상도 비트맵 원본' 모드입니다. 원본은 고해상도 <b>비트맵</b>으로 저장된 이미지입니다. 우측 슬라이더로 해상도(픽셀 수)를 줄여가며 <b>계단 현상</b>이 나타나는 과정을 관찰하세요.";
        
        document.getElementById('customSettings').style.display = 'none';
        document.getElementById('hdSettings').style.display = 'block';
        document.getElementById('customUI').style.display = 'none';
        document.getElementById('hdUI').style.display = 'flex';
        
        document.getElementById('resSlider').max = 300;
        document.getElementById('resSlider').value = 300;
        
        drawAppleOnLeft(); 
        updateResultCanvas();
    }
};

window.drawBeautifulApple = function(ctx, x, y, scale) {
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
    ctx.lineWidth = 14; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#8b4513"; ctx.beginPath(); ctx.moveTo(0, -70); ctx.bezierCurveTo(-5, -100, 15, -100, 10, -70); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#34c759"; ctx.beginPath(); ctx.moveTo(5, -80); ctx.bezierCurveTo(30, -105, 55, -95, 60, -75); ctx.bezierCurveTo(50, -60, 25, -65, 5, -80); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#ff2d55"; ctx.beginPath(); ctx.moveTo(0, -65); ctx.bezierCurveTo(40, -75, 85, -50, 85, 0); ctx.bezierCurveTo(85, 60, 40, 95, 0, 95); ctx.bezierCurveTo(-40, 95, -85, 60, -85, 0); ctx.bezierCurveTo(-85, -50, -40, -75, 0, -65); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.restore();
};

window.drawAppleOnLeft = function() {
    const c = document.getElementById('leftHdCanvas');
    const ctx = c.getContext('2d');
    ctx.clearRect(0,0,300,300);
    drawBeautifulApple(ctx, 150, 150, 1.3); 
};

window.updateColorBin = function() {
    const hex = document.getElementById('colorPicker').value;
    const r = parseInt(hex.substr(1,2), 16).toString(2).padStart(8, '0');
    const g = parseInt(hex.substr(3,2), 16).toString(2).padStart(8, '0');
    const b = parseInt(hex.substr(5,2), 16).toString(2).padStart(8, '0');
    document.getElementById('binDisplay').innerHTML = `<span style="color:#ff7675">R:<br>${r}</span><br><span style="color:#55efc4">G:<br>${g}</span><br><span style="color:#74b9ff">B:<br>${b}</span>`;
};

window.makeGrid = function() {
    currentW = parseInt(document.getElementById('cWidth').value) || 16;
    currentH = parseInt(document.getElementById('cHeight').value) || 16;
    if(currentW > 50) { currentW = 50; document.getElementById('cWidth').value = 50; }
    if(currentH > 50) { currentH = 50; document.getElementById('cHeight').value = 50; }
    if(currentW < 4) { currentW = 4; document.getElementById('cWidth').value = 4; }
    if(currentH < 4) { currentH = 4; document.getElementById('cHeight').value = 4; }
    
    const grid = document.getElementById('drawGrid');
    grid.style.gridTemplateColumns = `repeat(${currentW}, 1fr)`;
    grid.innerHTML = ''; 
    
    if(isInitialLoad && currentW === 16 && currentH === 16) {
        const layout = [
            "WWWWWWWWWWWWWWWW", "WWWWWWWWWWWWWWWW", "WWWWKKWWWWKKWWWW", "WWWKRRKWWKRRKWWW",
            "WWKRRRRKKRRRRKWW", "WKRRPRRRRRRRRRKW", "WKRRPRRRRRRRRRKW", "WKRRRRRRRRRRRRKW",
            "WKRRRRRRRRRRRRKW", "WWKRRRRRRRRRRKWW", "WWWKRRRRRRRRKWWW", "WWWWKRRRRRRKWWWW",
            "WWWWWKRRRRKWWWWW", "WWWWWWKRRKWWWWWW", "WWWWWWWKKWWWWWWW", "WWWWWWWWWWWWWWWW"
        ];
        const cMap = {'W':'#ffffff', 'K':'#000000', 'R':'#ff2d55', 'P':'#ffb6c1'};
        gridData = [];
        for(let y=0; y<16; y++) {
            for(let x=0; x<16; x++) { gridData.push(cMap[layout[y][x]]); }
        }
        isInitialLoad = false;
    } else {
        gridData = Array(currentW * currentH).fill('#ffffff');
    }

    for(let i=0; i<currentW * currentH; i++) {
        let cell = document.createElement('div');
        cell.className = 'draw-cell'; cell.dataset.index = i;
        cell.style.background = gridData[i];
        const paint = () => { const hex = document.getElementById('colorPicker').value; cell.style.background = hex; gridData[i] = hex; updateResultCanvas(); };
        cell.onmousedown = paint;
        cell.onmouseenter = (e) => { if(e.buttons === 1) paint(); };
        grid.appendChild(cell);
    }
    
    document.getElementById('resSlider').max = Math.max(currentW, currentH);
    document.getElementById('resSlider').value = Math.max(currentW, currentH);
    
    updateResultCanvas();
};

window.updateResultCanvas = function() {
    const resCanvas = document.getElementById('resultCanvas');
    const rCtx = resCanvas.getContext('2d');
    rCtx.imageSmoothingEnabled = false; 

    const sliderVal = parseInt(document.getElementById('resSlider').value);
    const modeLabel = currentMode === 'hd'
        ? `비트맵 해상도: ${sliderVal} x ${sliderVal}px\n(원본 300x300에서 다운샘플링)`
        : `현재 디스플레이 해상도: ${sliderVal} x ${sliderVal} 픽셀`;
    document.getElementById('resValueDisplay').innerHTML = modeLabel.replace(/\n/g, '<br>');

    rCtx.clearRect(0, 0, 300, 300); 

    const downCanvas = document.createElement('canvas');
    downCanvas.width = sliderVal; downCanvas.height = sliderVal;
    const dCtx = downCanvas.getContext('2d');
    dCtx.imageSmoothingEnabled = false;

    if(currentMode === 'custom') {
        const offCanvas = document.createElement('canvas'); offCanvas.width = currentW; offCanvas.height = currentH;
        const oCtx = offCanvas.getContext('2d');
        for(let y=0; y<currentH; y++) {
            for(let x=0; x<currentW; x++) { oCtx.fillStyle = gridData[y * currentW + x]; oCtx.fillRect(x, y, 1, 1); }
        }
        dCtx.drawImage(offCanvas, 0, 0, currentW, currentH, 0, 0, sliderVal, sliderVal);
    } else {
        const vectorCanvas = document.createElement('canvas'); vectorCanvas.width = 300; vectorCanvas.height = 300;
        const vCtx = vectorCanvas.getContext('2d');
        vCtx.fillStyle = '#ffffff'; vCtx.fillRect(0,0,300,300);
        drawBeautifulApple(vCtx, 150, 150, 1.3); 
        dCtx.drawImage(vectorCanvas, 0, 0, 300, 300, 0, 0, sliderVal, sliderVal);
    }

    rCtx.drawImage(downCanvas, 0, 0, sliderVal, sliderVal, 0, 0, 300, 300);

    if (sliderVal <= 30) { 
        rCtx.strokeStyle = 'rgba(0, 0, 0, 0.15)'; rCtx.lineWidth = 1;
        const cellSize = 300 / sliderVal;
        for(let i=0; i<=300; i+=cellSize) {
            rCtx.beginPath(); rCtx.moveTo(i, 0); rCtx.lineTo(i, 300); rCtx.stroke();
            rCtx.beginPath(); rCtx.moveTo(0, i); rCtx.lineTo(300, i); rCtx.stroke();
        }
    }
};

// 🌟 [개별 기능] 비트맵 암호 해독기
let currentBitDepth = 1;
let decoderPalette = {};

window.setBitDepth = function(bits) {
    currentBitDepth = bits;
    document.getElementById('btn1bit').classList.remove('active');
    document.getElementById('btn2bit').classList.remove('active');
    document.getElementById('btn8bit').classList.remove('active');
    document.getElementById(`btn${bits}bit`).classList.add('active');

    document.getElementById('bitInfoArea').style.display = 'none';
    document.getElementById('decoderMainArea').style.display = 'flex';

    const paletteArea = document.getElementById('paletteArea');
    paletteArea.innerHTML = '<div style="font-size: 0.95rem; font-weight: 800; color: var(--multi-violet); margin-bottom: 5px;">🎨 팔레트 (규칙 설정)</div>';
    
    decoderPalette = {};
    let inputExample = "";

    if (bits === 1) {
        decoderPalette['0'] = '#ffffff';
        decoderPalette['1'] = '#ff2d55';
        paletteArea.innerHTML += `
            <div class="palette-row">0: <input type="color" id="pal0" value="${decoderPalette['0']}" onchange="updateDecoderPalette()"></div>
            <div class="palette-row">1: <input type="color" id="pal1" value="${decoderPalette['1']}" onchange="updateDecoderPalette()"></div>
        `;
        inputExample = "0011001100\n0111111110\n1111111111\n1111111111\n0111111110\n0011111100\n0001111000\n0000110000\n0000000000\n0000000000";
    } else {
        decoderPalette['00'] = '#ffffff';
        decoderPalette['01'] = '#fdcb6e'; 
        decoderPalette['10'] = '#2d3436'; 
        decoderPalette['11'] = '#ff7675'; 
        paletteArea.innerHTML += `
            <div class="palette-row">00: <input type="color" id="pal00" value="${decoderPalette['00']}" onchange="updateDecoderPalette()"></div>
            <div class="palette-row">01: <input type="color" id="pal01" value="${decoderPalette['01']}" onchange="updateDecoderPalette()"></div>
            <div class="palette-row">10: <input type="color" id="pal10" value="${decoderPalette['10']}" onchange="updateDecoderPalette()"></div>
            <div class="palette-row">11: <input type="color" id="pal11" value="${decoderPalette['11']}" onchange="updateDecoderPalette()"></div>
        `;
        inputExample = "00000000000000000000\n00010100000000010100\n01010101010101010101\n01010101010101010101\n01011001010101100101\n01010101101001010101\n01010101010101010101\n00011101010101110100\n00000101010101010000\n00000000000000000000";
    }

    document.getElementById('codeInput').value = inputExample;
    renderDecoder();
};

window.showBitInfo = function() {
    document.getElementById('btn1bit').classList.remove('active');
    document.getElementById('btn2bit').classList.remove('active');
    document.getElementById('btn8bit').classList.add('active');

    document.getElementById('decoderMainArea').style.display = 'none';
    document.getElementById('bitInfoArea').style.display = 'block';
};

window.updateDecoderPalette = function() {
    if (currentBitDepth === 1) {
        decoderPalette['0'] = document.getElementById('pal0').value;
        decoderPalette['1'] = document.getElementById('pal1').value;
    } else {
        decoderPalette['00'] = document.getElementById('pal00').value;
        decoderPalette['01'] = document.getElementById('pal01').value;
        decoderPalette['10'] = document.getElementById('pal10').value;
        decoderPalette['11'] = document.getElementById('pal11').value;
    }
    renderDecoder();
};

window.renderDecoder = function() {
    const canvas = document.getElementById('decoderCanvas');
    const ctx = canvas.getContext('2d');
    const GRID = 10;        
    const CELL = 39;        
    const W = GRID * CELL;  

    ctx.clearRect(0, 0, W, W);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, W);

    const codeText = document.getElementById('codeInput').value.replace(/\s+/g, '');
    let pixelIndex = 0;

    for (let i = 0; i < codeText.length; i += currentBitDepth) {
        if (pixelIndex >= GRID * GRID) break;
        const chunk = codeText.substring(i, i + currentBitDepth);
        const color = decoderPalette[chunk];
        const px = pixelIndex % GRID;
        const py = Math.floor(pixelIndex / GRID);
        if (color) {
            ctx.fillStyle = color;
            ctx.fillRect(px * CELL, py * CELL, CELL, CELL);
        }
        pixelIndex++;
    }

    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL, 0);
        ctx.lineTo(i * CELL, W);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL);
        ctx.lineTo(W, i * CELL);
        ctx.stroke();
    }
};

// 🌟 [개별 기능] 벡터 그래픽
window.updateVector = function() {
    const cx = document.getElementById('vecX').value;
    const cy = document.getElementById('vecY').value;
    const r = document.getElementById('vecR').value;
    const color = document.getElementById('vecColor').value;

    const circle = document.getElementById('vCircle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', color);

    document.getElementById('vecCode').innerHTML = 
        `&lt;svg width="200" height="200"&gt;<br>` +
        `&nbsp;&nbsp;&lt;circle <br>` +
        `&nbsp;&nbsp;&nbsp;&nbsp;cx="<span style="color:#e17055">${cx}</span>" <br>` +
        `&nbsp;&nbsp;&nbsp;&nbsp;cy="<span style="color:#0984e3">${cy}</span>" <br>` +
        `&nbsp;&nbsp;&nbsp;&nbsp;r="<span style="color:#00b894">${r}</span>" <br>` +
        `&nbsp;&nbsp;&nbsp;&nbsp;fill="<span style="color:#6c5ce7">${color}</span>" <br>` +
        `&nbsp;&nbsp;&nbsp;&nbsp;stroke="#2d3436" stroke-width="4" /&gt;<br>` +
        `&lt;/svg&gt;`;
};

window.updateVectorZoom = function() {
    const z = document.getElementById('vecZoom').value;
    document.getElementById('vecZoomText').innerText = `현재 확대 배율: ${z}x`;
    
    const w = 200 / z;
    const h = 200 / z;
    const x = 100 - w/2; 
    const y = 100 - h/2;
    
    document.getElementById('vectorSvg').setAttribute('viewBox', `${x} ${y} ${w} ${h}`);
};

// 🌟 [개별 기능] 아이패드/태블릿 터치 드로잉 지원
const gridContainerBox = document.getElementById('gridContainer');
if (gridContainerBox) {
    gridContainerBox.addEventListener('touchmove', function(e) {
        e.preventDefault(); 
        let touch = e.touches[0];
        let element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('draw-cell')) {
            const hex = document.getElementById('colorPicker').value;
            element.style.background = hex;
            gridData[element.dataset.index] = hex;
            updateResultCanvas();
        }
    }, { passive: false });

    gridContainerBox.addEventListener('touchstart', function(e) {
        e.preventDefault(); 
        let touch = e.touches[0];
        let element = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (element && element.classList.contains('draw-cell')) {
            const hex = document.getElementById('colorPicker').value;
            element.style.background = hex;
            gridData[element.dataset.index] = hex;
            updateResultCanvas();
        }
    }, { passive: false });
}