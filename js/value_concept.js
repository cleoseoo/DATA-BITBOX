// ── value_concept.js ─────────────────────────────────────────────
// [1단원: 디지털 데이터의 가치] 전용 스크립트

// 🌟 [설정] 1단원 고유 정보

        const THIS_STEP = 1; 
        const STEP_TITLE = "1. 디지털 데이터의 가치";
        const FILE_NAME_PREFIX = "디지털_데이터의_가치";
        const PASS_SCORE = 70;
        const MEMO_KEY = "value_concept_memo";
        const REF_KEY = "value_concept_reflection";

        const stepDotMap = {
            'step1-intro':  0,
            'step2-visual': 1,
            'step3-quiz':   2
        };

        // 🌟 [개별 기능] 이 페이지에만 있는 특수 기능 (아날로그 vs 디지털 비교 등)
        function toggleCompare() {
            const section = document.getElementById('compare-section');
            const btn = document.getElementById('compareToggleBtn');
            if (section.style.display === 'none' || section.style.display === '') {
                section.style.display = 'grid';
                section.style.animation = 'fadeSlideDown 0.6s ease-out forwards';
                btn.classList.add('open');
                btn.querySelector('div').innerText = '아날로그와 디지털 비교 닫기';
                setTimeout(() => { section.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 50);
            } else {
                section.style.display = 'none';
                btn.classList.remove('open');
                btn.querySelector('div').innerText = '아날로그와 디지털 비교';
            }
        }

        function toggleExample(element) {
            const answerBox = element.querySelector('.answer-box');
            const qText = element.querySelector('.q-text');
            if (answerBox.style.display === 'none' || answerBox.style.display === '') {
                answerBox.style.display = 'block';
                qText.innerText = '🔽 예시 닫기';
            } else {
                answerBox.style.display = 'none';
                qText.innerText = '❓ 실생활 예시 확인하기';
            }
        }
