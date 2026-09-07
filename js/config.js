// ── config.js ──────────────────────────────────────────────
// 선생님 한 분당 딱 한 번만 채우면 되는 설정 파일입니다.
// (설치가이드.md의 1~3단계를 마친 뒤, 거기서 나온 값을 아래에 붙여넣으세요)
//
// 이 파일은 모든 단원 페이지(01_value.html, 02_bit.html, 03_number.html ...)
// 에서 concept_common.js보다 먼저 불러옵니다.

// 1) Apps Script 웹 앱 배포 URL ( .../exec 로 끝나는 주소 )
const SUBMIT_ENDPOINT = "https://script.google.com/macros/s/AKfycbxukOY8oIDe6UrbD4tqqg3cnzQ1bQUVUXcmnLmRMkhh4N8E09Yf6RSC8w54dSck1RSX/exec";

// 2) Code.gs 안의 SECRET_KEY와 정확히 같은 값
const SUBMIT_SECRET = "bitbox-2026";