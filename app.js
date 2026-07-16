/* ══════════════════════════════════════════════════════════════
   🌱 자라다(Jarada) 공통 로직

   student.html(학생용)과 parent.html(교사/학부모용)이 이 파일을
   같이 씁니다. 기능을 고칠 일이 생기면 여기만 고치면 두 앱에
   동시에 반영됩니다. ⚠️ 절대 복사해서 나누지 마세요.

   불러오는 순서: firebase-config.js → db.js → app.js
   ══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   1. 설정값  ─ PRD 수치가 이미지라 읽을 수 없어 임시 확정한 값.
                실제 값이 정해지면 여기 숫자만 고치면 됩니다.
   ══════════════════════════════════════════════════════════ */
const HEART_PER_TASK    = 1;    // FR-2.1 할 일 1개 완료당
const HEART_ALL_CLEAR   = 10;   // FR-2.2 하루 100% 완주 보너스
const HEART_FROM_PARENT = 5;    // FR-3.1 학부모 보너스 하트

/* ── 매일 자동으로 생기는 기본 약속 (반 전체 공통) ──────────────
   학생이 아침에 앱을 열면 그날 약속이 이 목록대로 자동 생성됩니다.

   ✏️ 약속을 바꾸려면 여기만 고치면 됩니다. 개수는 몇 개든 상관없습니다.
   ⚠️ 이미 지나간 날짜에는 소급 적용되지 않습니다.
   ⚠️ 학생이 지운 약속은 그날 다시 생기지 않습니다.
   ───────────────────────────────────────────────────────────── */
const DAILY_TASKS = [
  '리딩앤 1권 하기',
  '마타수학 1일치 하기',
  '매일국어 1일치 하기',
];

// FR-2.3 캐릭터 진화 테이블 (누적 하트 H 기준)
const LEVELS = [
  { min: 0,   emoji: '🥚', title: '아기 씨앗' },
  { min: 10,  emoji: '🌱', title: '무럭무럭 새싹' },
  { min: 30,  emoji: '🌿', title: '가지 치는 잎새' },
  { min: 60,  emoji: '🌸', title: '활짝 핀 꽃망울' },
  { min: 100, emoji: '🌳', title: '자라난 수호 나무' },
];

/* ══════════════════════════════════════════════════════════
   2. 상태
   ══════════════════════════════════════════════════════════ */
const today = new Date();

// ⚠️ toISOString()은 UTC로 바뀌며 날짜가 하루 밀립니다. 직접 만듭니다.
function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

// 지금 화면에서 보고 있는(조작 중인) 학생
// 학생 앱 = 로그인한 본인 / 교사 앱 = 현황판에서 고른 학생
let currentStudentId   = null;
let currentStudentName = '';
let currentStudentNum  = null;   // 동명이인 구분용 번호 (없으면 null)

// 화면에 보여줄 이름: "김민준 7번" 또는 "김민준"
function currentLabel() {
  return displayName({ name: currentStudentName, num: currentStudentNum });
}

let state = {
  // ── 서버에 저장되는 데이터 ──
  tasks:      {},   // { "2026-07-16": [{id, text, done}, ...] }
  hearts:     0,
  stickers:   0,
  celebrated: {},   // { "2026-07-16": true } — 폭죽 중복 방지
  seeded:     {},   // { "2026-07-16": true } — 기본 약속을 넣어준 날 표시
                    //   이게 있어야 학생이 지운 약속이 되살아나지 않습니다

  // ── 이 기기에만 있는 화면 상태 (서버에 올리지 않습니다) ──
  selectedDate: todayKey,
  viewYear:     today.getFullYear(),
  viewMonth:    today.getMonth(),   // ⚠️ JS의 월은 0부터 (6 = 7월)
  soundOn:      localStorage.getItem('jarada-sound') !== 'off',
};

let lastLevelIndex = 0;    // 레벨업 순간을 감지하기 위한 기억용
let nextId = 1;
let openedAt = Date.now(); // 이 시각 이후의 알림만 보여줍니다

/* ══════════════════════════════════════════════════════════
   3. 폰 화면 마크업
      두 앱이 똑같은 화면을 쓰므로 여기 한 곳에서만 관리합니다.
      각 HTML의 <div id="phone-mount"> 안에 채워집니다.
   ══════════════════════════════════════════════════════════ */
const PHONE_HTML = `
<div id="phone"
     class="relative w-[380px] h-[740px] bg-beige rounded-[42px] border-[10px] border-slate-800
            shadow-2xl overflow-hidden flex flex-col">

  <!-- 폰 상단 노치 -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-2xl z-30"></div>

  <!-- 폭죽이 그려지는 레이어 -->
  <div id="confetti" class="absolute inset-0 pointer-events-none z-20"></div>

  <!-- FR-3.2 토스트 알림 -->
  <div id="toast"
       class="hidden absolute top-9 left-4 right-4 z-30 bg-slate-800/95 backdrop-blur text-white
              text-sm font-medium rounded-2xl px-4 py-3 shadow-xl text-center"></div>

  <!-- ── 캐릭터 카드 (FR-2) ── -->
  <div class="pt-11 pb-5 px-5 bg-gradient-to-b from-mint/15 to-transparent shrink-0">
    <div id="who" class="text-[11px] font-bold text-mint mb-2"></div>
    <div class="flex items-center gap-4">
      <div id="char-emoji" class="text-[56px] leading-none">🥚</div>
      <div class="flex-1 min-w-0">
        <div id="char-title" class="font-extrabold text-lg leading-tight">아기 씨앗</div>
        <div class="flex items-center gap-2.5 mt-1 text-sm">
          <span id="char-lv" class="bg-mint text-white text-[11px] font-bold rounded-full px-2 py-0.5">Lv 1</span>
          <span id="char-hearts" class="font-bold text-pink">❤️ 0</span>
          <span id="char-stickers" class="font-bold text-amber-500">🌟 0</span>
        </div>
        <div id="char-next" class="text-[11px] text-slate-400 mt-1">다음 단계까지 하트 10개</div>
      </div>
    </div>

    <!-- 선택한 날짜의 완료율 (FR-2.1) -->
    <div class="mt-4">
      <div class="flex justify-between text-[11px] font-bold text-slate-500 mb-1.5">
        <span id="prog-label">오늘의 완주율</span>
        <span id="prog-pct">0%</span>
      </div>
      <div class="h-2.5 bg-white rounded-full overflow-hidden border border-slate-200">
        <div id="prog-bar" class="h-full bg-mint rounded-full transition-all duration-500" style="width:0%"></div>
      </div>
    </div>
  </div>

  <!-- ── 달력 (FR-1) ── -->
  <div class="px-5 pb-3 shrink-0">
    <div class="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm">
      <div class="flex items-center justify-between mb-3">
        <button onclick="moveMonth(-1)" class="w-8 h-8 rounded-full hover:bg-slate-100 active:scale-90 transition text-slate-400">◀</button>
        <div id="cal-title" class="font-extrabold">2026년 7월</div>
        <button onclick="moveMonth(1)"  class="w-8 h-8 rounded-full hover:bg-slate-100 active:scale-90 transition text-slate-400">▶</button>
      </div>

      <div class="grid grid-cols-7 gap-y-1 text-center text-[11px] font-bold text-slate-400 mb-1">
        <div class="text-pink">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div class="text-sky-500">토</div>
      </div>

      <div id="cal-grid" class="grid grid-cols-7 gap-y-1 text-center"></div>
    </div>
  </div>

  <!-- ── 할 일 목록 (FR-1.3) ── -->
  <div class="flex-1 min-h-0 px-5 pb-5 flex flex-col">
    <div class="flex items-baseline justify-between mb-2 px-1 shrink-0">
      <div id="todo-title" class="font-extrabold text-sm">오늘의 약속</div>
      <div id="todo-count" class="text-[11px] text-slate-400">0 / 0 완료</div>
    </div>

    <div id="todo-list" class="flex-1 min-h-0 overflow-y-auto thin-scroll space-y-2 pr-1"></div>

    <div class="flex gap-2 mt-3 shrink-0">
      <input id="task-input" type="text" maxlength="30" placeholder="할 일을 적어보세요"
             onkeydown="if(event.key==='Enter') addTask()"
             class="flex-1 min-w-0 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm
                    focus:outline-none focus:border-mint focus:ring-2 focus:ring-mint/20">
      <button onclick="addTask()"
              class="bg-mint hover:bg-mintDk active:scale-95 text-white font-bold rounded-2xl px-5 transition shadow-sm">＋</button>
    </div>
  </div>

</div>`;

function mountPhone(id) {
  document.getElementById(id).innerHTML = PHONE_HTML;
}

/* ══════════════════════════════════════════════════════════
   4. 서버와 주고받기
   ══════════════════════════════════════════════════════════ */

// 서버에서 받은 데이터를 state 에 붙입니다.
// ⚠️ 보고 있는 날짜/달은 건드리지 않습니다. 안 그러면 교사가 달력을
//    넘길 때 학생 화면까지 같이 넘어가 버립니다.
function applyServerData(d) {
  state.hearts     = (d && d.hearts)   || 0;
  state.stickers   = (d && d.stickers) || 0;
  state.tasks      = normalizeTasks(d && d.tasks);
  state.celebrated = (d && d.celebrated) || {};
  state.seeded     = (d && d.seeded)     || {};

  // 저장된 할 일 중 가장 큰 id 다음부터 이어서 발급
  Object.values(state.tasks).flat().forEach(t => {
    if (t.id >= nextId) nextId = t.id + 1;
  });
}

/* 그날 기본 약속을 아직 안 넣었으면 넣어줍니다.
   저장이 필요하면 true 를 돌려줍니다.

   ⚠️ seeded 표시가 핵심입니다. 이게 없으면 학생이 약속을 다 지웠을 때
      Firebase 가 빈 배열을 지워버려서 "약속이 없는 날"로 보이고,
      다음에 앱을 열 때마다 지운 약속이 계속 되살아납니다. */
function ensureDailyTasks(key) {
  if (state.seeded[key]) return false;          // 이미 넣어준 날

  if ((state.tasks[key] || []).length) {        // 학생이 직접 적어둔 게 있으면
    state.seeded[key] = true;                   // 건드리지 않고 표시만
    return true;
  }

  state.tasks[key] = DAILY_TASKS.map(text => ({ id: nextId++, text, done: false }));
  state.seeded[key] = true;
  return true;
}

function save() {
  if (!db || !currentStudentId) return;
  dbSaveStudent(currentStudentId, currentStudentName, currentStudentNum, state)
    .catch(e => console.error('저장 실패:', e));
}

function saveSound() {
  localStorage.setItem('jarada-sound', state.soundOn ? 'on' : 'off');
}

/* ══════════════════════════════════════════════════════════
   5. 유틸
   ══════════════════════════════════════════════════════════ */
// 완료율 C = (완료 수 / 전체 수) × 100
function getProgress(key) {
  const list = state.tasks[key] || [];
  if (list.length === 0) return 0;              // ⚠️ 0으로 나누기 방지
  const done = list.filter(t => t.done).length;
  return Math.round((done / list.length) * 100);
}

function getLevelIndex() {
  let idx = 0;
  LEVELS.forEach((lv, i) => { if (state.hearts >= lv.min) idx = i; });
  return idx;
}

function isAllClear(key) {
  const list = state.tasks[key] || [];
  return list.length > 0 && list.every(t => t.done);
}

// XSS 방지 — 사용자가 <script> 를 입력해도 글자로만 보이게
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ══════════════════════════════════════════════════════════
   6. 화면 그리기 — 무엇이 바뀌든 render() 하나로 전부 다시 그립니다
   ══════════════════════════════════════════════════════════ */
function render() {
  if (!document.getElementById('cal-grid')) return;   // 폰이 아직 안 붙었으면 건너뜀
  renderCalendar();
  renderTodos();
  renderCharacter();
  renderParentPanel();   // 학생 앱에는 제어판이 없으므로 알아서 건너뜁니다
}

// ── FR-1.1 / FR-1.2 달력 ──
function renderCalendar() {
  document.getElementById('cal-title').textContent = `${state.viewYear}년 ${state.viewMonth + 1}월`;

  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  const firstDay = new Date(state.viewYear, state.viewMonth, 1).getDay();       // 1일의 요일
  const lastDate = new Date(state.viewYear, state.viewMonth + 1, 0).getDate();  // 이 달의 마지막 날

  // 1일 앞의 빈 칸 채우기
  for (let i = 0; i < firstDay; i++) {
    grid.innerHTML += `<div class="h-9"></div>`;
  }

  for (let d = 1; d <= lastDate; d++) {
    const key      = dateKey(state.viewYear, state.viewMonth, d);
    const list     = state.tasks[key] || [];
    const selected = key === state.selectedDate;
    const isToday  = key === todayKey;
    const allClear = isAllClear(key);
    const weekday  = (firstDay + d - 1) % 7;

    // FR-1.2 상태 표시: 완주 = 🌱 도장, 진행 중 = 점(Dot)
    let mark = '<div class="h-[9px]"></div>';
    if (allClear)         mark = `<div class="text-[9px] leading-[9px]">🌱</div>`;
    else if (list.length) mark = `<div class="text-mint text-[13px] leading-[9px]">·</div>`;

    let cls = 'text-slate-600';
    if (weekday === 0) cls = 'text-pink';
    if (weekday === 6) cls = 'text-sky-500';
    if (selected)      cls = 'bg-mint text-white font-extrabold shadow-sm';
    else if (isToday)  cls += ' ring-1 ring-mint/50 font-bold';

    grid.innerHTML += `
      <div onclick="selectDate('${key}')"
           class="h-9 mx-auto w-9 rounded-xl flex flex-col items-center justify-center
                  cursor-pointer transition hover:bg-mint/10 ${cls}">
        <div class="text-xs leading-none">${d}</div>
        ${mark}
      </div>`;
  }
}

// ── FR-1.3 할 일 목록 ──
function renderTodos() {
  const [, m, d] = state.selectedDate.split('-').map(Number);   // 연도는 안 쓰므로 건너뜁니다
  document.getElementById('todo-title').textContent = `${m}월 ${d}일의 약속`;

  const list = state.tasks[state.selectedDate] || [];
  const done = list.filter(t => t.done).length;
  document.getElementById('todo-count').textContent = `${done} / ${list.length} 완료`;

  const box = document.getElementById('todo-list');

  if (list.length === 0) {
    box.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center text-slate-300 gap-1">
        <div class="text-3xl">🗓️</div>
        <div class="text-xs">이 날은 약속이 없어요<br>아래에 직접 적어볼 수 있어요</div>
      </div>`;
    return;
  }

  box.innerHTML = list.map(t => `
    <div class="flex items-center gap-3 bg-white border rounded-2xl px-3.5 py-3 transition
                ${t.done ? 'border-mint/40 bg-mint/5' : 'border-slate-100'}">
      <button onclick="toggleTask(${t.id})"
              class="shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center text-xs
                     active:scale-90 transition
                     ${t.done ? 'bg-mint border-mint text-white' : 'border-slate-300 hover:border-mint'}">
        ${t.done ? '✓' : ''}
      </button>
      <div class="flex-1 min-w-0 text-sm truncate ${t.done ? 'line-through text-slate-300' : ''}">${escapeHtml(t.text)}</div>
      <button onclick="deleteTask(${t.id})"
              class="shrink-0 text-slate-300 hover:text-pink text-xs w-5 active:scale-90 transition">✕</button>
    </div>`).join('');
}

// ── FR-2.1 / FR-2.3 캐릭터·하트·진척도 ──
function renderCharacter() {
  const idx = getLevelIndex();
  const lv  = LEVELS[idx];

  document.getElementById('who').textContent           = currentStudentName ? `${currentLabel()}의 정원` : '';
  document.getElementById('char-emoji').textContent    = lv.emoji;
  document.getElementById('char-title').textContent    = lv.title;
  document.getElementById('char-lv').textContent       = `Lv ${idx + 1}`;
  document.getElementById('char-hearts').textContent   = `❤️ ${state.hearts}`;
  document.getElementById('char-stickers').textContent = `🌟 ${state.stickers}`;

  const next = LEVELS[idx + 1];
  document.getElementById('char-next').textContent =
    next ? `다음 단계까지 하트 ${next.min - state.hearts}개`
         : '최고 단계에 도달했어요! 🎉';

  const pct = getProgress(state.selectedDate);
  document.getElementById('prog-label').textContent =
    state.selectedDate === todayKey ? '오늘의 완주율' : '이 날의 완주율';
  document.getElementById('prog-pct').textContent = `${pct}%`;
  document.getElementById('prog-bar').style.width = `${pct}%`;

  // 레벨이 올라간 순간 축하 (교사가 보낸 하트로 올라가도 여기서 터집니다)
  if (idx > lastLevelIndex) {
    setTimeout(() => {
      showToast(`🎉 축하해요! ${lv.title}(으)로 자랐어요`);
      fireConfetti();
      playSound('levelup');
      pop(document.getElementById('char-emoji'));
    }, 500);
  }
  lastLevelIndex = idx;
}

// ── 제어판의 현황 요약 (parent.html 에만 있습니다) ──
function renderParentPanel() {
  const el = document.getElementById('p-hearts');
  if (!el) return;   // 학생 앱에는 제어판이 없으므로 그냥 넘어갑니다

  el.textContent = state.hearts;
  document.getElementById('p-stickers').textContent = state.stickers;
  const days = Object.keys(state.tasks).filter(k => isAllClear(k)).length;
  document.getElementById('p-days').textContent = `${days}일`;

  const target = document.getElementById('p-target');
  if (target) target.textContent = currentLabel();
}

/* ══════════════════════════════════════════════════════════
   7. 사용자 동작 — 모든 함수는 save() + render() 로 끝납니다
   ══════════════════════════════════════════════════════════ */
function selectDate(key) {
  state.selectedDate = key;
  playSound('tap');
  render();          // 화면 상태라 서버에 저장하지 않습니다
}

function moveMonth(diff) {
  state.viewMonth += diff;
  if (state.viewMonth > 11) { state.viewMonth = 0;  state.viewYear++; }  // 12월 → 다음 해 1월
  if (state.viewMonth < 0)  { state.viewMonth = 11; state.viewYear--; }  // 1월 → 지난 해 12월
  playSound('tap');
  render();          // 화면 상태라 서버에 저장하지 않습니다
}

function addTask() {
  const input = document.getElementById('task-input');
  const text  = input.value.trim();
  if (!text) return;

  if (!state.tasks[state.selectedDate]) state.tasks[state.selectedDate] = [];
  state.tasks[state.selectedDate].push({ id: nextId++, text, done: false });

  input.value = '';
  playSound('tap');
  save();
  render();
}

function toggleTask(id) {
  const list = state.tasks[state.selectedDate] || [];
  const task = list.find(t => t.id === id);
  if (!task) return;

  task.done = !task.done;

  if (task.done) {
    state.hearts += HEART_PER_TASK;      // FR-2.1
    playSound('check');
  } else {
    state.hearts = Math.max(0, state.hearts - HEART_PER_TASK);
  }

  checkAllClear(state.selectedDate);
  save();
  render();
  pop(document.getElementById('char-hearts'));
}

function deleteTask(id) {
  const list = state.tasks[state.selectedDate] || [];
  const task = list.find(t => t.id === id);
  if (task && task.done) state.hearts = Math.max(0, state.hearts - HEART_PER_TASK);

  state.tasks[state.selectedDate] = list.filter(t => t.id !== id);
  checkAllClear(state.selectedDate);   // 남은 할 일이 모두 완료 상태가 될 수도 있으므로
  playSound('tap');
  save();
  render();
}

// FR-2.2 하루 완주 보상 — celebrated 덕분에 하루에 딱 한 번만 터집니다
function checkAllClear(key) {
  if (getProgress(key) === 100 && !state.celebrated[key]) {
    state.celebrated[key] = true;
    state.hearts += HEART_ALL_CLEAR;
    fireConfetti();
    playSound('allclear');
    showToast(`🎊 오늘의 약속을 모두 지켰어요! 하트 +${HEART_ALL_CLEAR}`);
  }
}

/* ══════════════════════════════════════════════════════════
   8. 교사/학부모 기능 (FR-3) — parent.html 의 버튼에만 연결돼 있습니다
      showToast   : 내 화면의 미리보기에 표시
      dbSendEvent : 서버를 거쳐 그 학생의 기기로 전달
   ══════════════════════════════════════════════════════════ */
function sendSticker() {
  if (!currentStudentId) return;
  state.stickers += 1;
  const msg = `🌟 ${currentStudentName} 님, 칭찬 스티커를 받았어요!`;
  showToast(msg);
  dbSendEvent(currentStudentId, msg);
  playSound('gift');
  save();
  render();
  pop(document.getElementById('char-stickers'));
}

function sendBonusHeart() {
  if (!currentStudentId) return;
  state.hearts += HEART_FROM_PARENT;
  const msg = `❤️ 보너스 하트 ${HEART_FROM_PARENT}개를 받았어요!`;
  showToast(msg);
  dbSendEvent(currentStudentId, msg);
  playSound('gift');
  save();
  render();
  pop(document.getElementById('char-hearts'));
}

function sendMessage() {
  if (!currentStudentId) return;
  const input = document.getElementById('msg-input');
  const text  = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }
  const msg = `💌 ${text}`;
  showToast(msg);
  dbSendEvent(currentStudentId, msg);
  playSound('gift');
  input.value = '';
}

function fillMsg(text) {
  document.getElementById('msg-input').value = text;
}

/* ══════════════════════════════════════════════════════════
   9. 피드백 (NFR-2) — 토스트 / 폭죽 / 펄스 / 사운드
   ══════════════════════════════════════════════════════════ */
let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.classList.remove('toast-in');
  void toast.offsetWidth;              // 애니메이션 재시작 트릭
  toast.classList.add('toast-in');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

function fireConfetti() {
  const box = document.getElementById('confetti');
  if (!box) return;
  const colors = ['#1ABC9C', '#FF4D6D', '#FFD93D', '#6BCB77', '#4D96FF'];

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left           = Math.random() * 100 + '%';
    piece.style.background     = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 0.5 + 's';
    box.appendChild(piece);
    setTimeout(() => piece.remove(), 2600);   // 끝난 조각은 반드시 치웁니다
  }
}

function pop(el) {
  if (!el) return;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

// ⚠️ 브라우저는 사용자가 클릭하기 전엔 소리를 내지 않습니다. 정상입니다.
let synth = null;

function playSound(type) {
  if (!state.soundOn) return;
  try {
    if (Tone.context.state !== 'running') Tone.start();
    if (!synth) synth = new Tone.Synth({ oscillator: { type: 'triangle' } }).toDestination();

    const now = Tone.now();
    if (type === 'tap')   synth.triggerAttackRelease('A4', '32n', now);
    if (type === 'check') synth.triggerAttackRelease('E5', '16n', now);
    if (type === 'gift') {
      synth.triggerAttackRelease('G4', '16n', now);
      synth.triggerAttackRelease('C5', '16n', now + 0.1);
    }
    if (type === 'allclear' || type === 'levelup') {
      ['C5', 'E5', 'G5', 'C6'].forEach((n, i) =>
        synth.triggerAttackRelease(n, '8n', now + i * 0.13));
    }
  } catch (e) {
    console.warn('오디오 재생 실패 (무시해도 됩니다)', e);
  }
}

function toggleSound() {
  state.soundOn = !state.soundOn;
  document.getElementById('sound-btn').textContent = state.soundOn ? '🔊 소리 켬' : '🔇 소리 끔';
  if (state.soundOn) playSound('tap');
  saveSound();
}

/* ══════════════════════════════════════════════════════════
   10. 학생 앱 시작  (student.html 이 부릅니다)
   ══════════════════════════════════════════════════════════ */
function initStudentApp() {
  const user = getCurrentUser();
  if (!user) {                      // 로그인 안 했으면 로그인 화면으로
    location.href = 'login.html';
    return;
  }

  currentStudentId   = user.id;
  currentStudentName = user.name;
  currentStudentNum  = user.num || null;
  document.getElementById('sound-btn').textContent = state.soundOn ? '🔊 소리 켬' : '🔇 소리 끔';

  const nameLabel = document.getElementById('login-name');
  if (nameLabel) nameLabel.textContent = currentLabel();

  if (!initDb()) {                  // firebase-config.js 를 아직 안 채웠을 때
    showSetupNeeded('phone-mount');
    return;
  }

  mountPhone('phone-mount');

  // ── 내 데이터를 실시간으로 구독 ──
  // 서버가 바뀌면(=교사가 하트를 보내면) 이 함수가 저절로 다시 불립니다.
  let first = true;
  dbWatchStudent(user.id, (data) => {
    applyServerData(data);

    // 오늘 약속이 아직 없으면 자동으로 만들어 줍니다.
    // 저장하면 이 콜백이 한 번 더 불리지만, seeded 표시 덕분에 두 번 만들지 않습니다.
    if (ensureDailyTasks(todayKey)) save();

    if (first) {
      first = false;
      lastLevelIndex = getLevelIndex();   // 첫 화면에서 축하가 뜨지 않도록
    }
    render();
  });

  // ── 교사/학부모가 보낸 알림을 실시간으로 구독 (FR-3.2) ──
  dbWatchEvents(user.id, (ev) => {
    if (!ev || !ev.ts) return;
    if (ev.ts <= openedAt) return;  // 내가 켜기 전에 온 옛날 메시지는 무시
    showToast(ev.msg);
    playSound('gift');
  });
}

