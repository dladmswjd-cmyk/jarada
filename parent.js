/* ══════════════════════════════════════════════════════════════
   🌱 자라다(Jarada) 교사/학부모 앱 전용 로직

   두 화면을 오갑니다.
     ① 현황판  — 등록된 학생 전체를 카드로 (인원수는 어디에도 없습니다)
     ② 상세    — 카드를 누르면 그 아이 화면 + 제어판

   불러오는 순서: firebase-config.js → db.js → app.js → parent.js
   ══════════════════════════════════════════════════════════════ */

let allStudents = {};      // { "김민준": {name, hearts, tasks, ...}, ... }
let phoneMounted = false;

/* ══════════════════════════════════════════════════════════
   1. 시작
   ══════════════════════════════════════════════════════════ */
function initParentApp() {
  document.getElementById('sound-btn').textContent = state.soundOn ? '🔊 소리 켬' : '🔇 소리 끔';

  if (!initDb()) {                 // firebase-config.js 를 아직 안 채웠을 때
    showSetupNeeded('setup-slot');
    document.getElementById('dashboard').classList.add('hidden');
    return;
  }

  // 학생 전체를 실시간 구독 — 누가 체크를 하면 현황판이 저절로 갱신됩니다
  dbWatchAllStudents((students) => {
    allStudents = students;
    renderDashboard();

    // 상세 화면을 보고 있는 중이라면 그 학생 데이터도 같이 갱신
    if (currentStudentId && allStudents[currentStudentId]) {
      applyServerData(allStudents[currentStudentId]);
      render();
    }
  });
}

/* ══════════════════════════════════════════════════════════
   2. 현황판
   ══════════════════════════════════════════════════════════ */

// 한 학생의 오늘 완료율 (state 가 아니라 넘겨받은 데이터로 계산합니다)
function studentTodayProgress(d) {
  const list = asList(d.tasks && d.tasks[todayKey]);
  if (!list.length) return 0;
  return Math.round(list.filter(t => t && t.done).length / list.length * 100);
}

function studentLevel(d) {
  let idx = 0;
  LEVELS.forEach((lv, i) => { if ((d.hearts || 0) >= lv.min) idx = i; });
  return LEVELS[idx];
}

function renderDashboard() {
  // 번호가 있으면 번호순, 없으면 이름순으로 정렬합니다
  const ids = Object.keys(allStudents).sort((a, b) => {
    const A = allStudents[a], B = allStudents[b];
    if (A.num && B.num) return A.num - B.num;
    if (A.num) return -1;
    if (B.num) return 1;
    return (A.name || a).localeCompare(B.name || b, 'ko');
  });

  // ── 상단 요약 ──
  const total = ids.length;
  const done  = ids.filter(id => studentTodayProgress(allStudents[id]) === 100).length;
  const avg   = total ? Math.round(ids.reduce((s, id) => s + studentTodayProgress(allStudents[id]), 0) / total) : 0;

  document.getElementById('sum-total').textContent = `${total}명`;
  document.getElementById('sum-done').textContent  = `${done}명`;
  document.getElementById('sum-avg').textContent   = `${avg}%`;

  const grid = document.getElementById('student-grid');

  if (!total) {
    grid.innerHTML = `
      <div class="col-span-full bg-white border border-slate-200 rounded-3xl p-10 text-center">
        <div class="text-4xl mb-3">👋</div>
        <div class="font-bold mb-1">아직 등록된 학생이 없어요</div>
        <div class="text-xs text-slate-400 leading-relaxed">
          학생이 <b>login.html</b> 에서 이름을 입력하고 시작하면<br>
          이 화면에 자동으로 나타납니다
        </div>
      </div>`;
    return;
  }

  grid.innerHTML = ids.map(id => {
    const d    = allStudents[id];
    const pct  = studentTodayProgress(d);
    const lv   = studentLevel(d);
    const name = displayName(d) || id;   // "김민준 7번" — 동명이인을 구분해서 보여줍니다
    const all  = pct === 100;

    return `
      <button onclick="viewStudent('${id.replace(/'/g, "\\'")}')"
              class="bg-white border rounded-3xl p-4 text-center shadow-sm active:scale-95 transition
                     hover:border-mint hover:shadow-md ${all ? 'border-mint/50 bg-mint/5' : 'border-slate-200'}">
        <div class="text-4xl mb-1.5">${lv.emoji}</div>
        <div class="font-extrabold text-sm truncate">${escapeHtml(name)}</div>
        <div class="text-[11px] text-slate-400 mb-2">❤️ ${d.hearts || 0}</div>

        <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full ${all ? 'bg-mint' : 'bg-mint/50'} rounded-full transition-all duration-500"
               style="width:${pct}%"></div>
        </div>
        <div class="text-[11px] font-bold mt-1.5 ${all ? 'text-mint' : 'text-slate-400'}">
          ${all ? '🌱 완주!' : pct + '%'}
        </div>
      </button>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════
   3. 상세 화면
   ══════════════════════════════════════════════════════════ */
function viewStudent(id) {
  const d = allStudents[id];
  if (!d) return;

  currentStudentId   = id;
  currentStudentName = d.name || id;
  currentStudentNum  = d.num || null;

  // 이 학생 기준으로 화면 상태를 초기화합니다
  state.selectedDate = todayKey;
  state.viewYear     = today.getFullYear();
  state.viewMonth    = today.getMonth();

  applyServerData(d);

  document.getElementById('dashboard').classList.add('hidden');
  document.getElementById('detail').classList.remove('hidden');

  if (!phoneMounted) {              // 폰 마크업은 한 번만 붙이면 됩니다
    mountPhone('phone-mount');
    phoneMounted = true;
  }

  lastLevelIndex = getLevelIndex(); // 화면 열자마자 축하가 뜨지 않도록
  render();
  window.scrollTo(0, 0);
}

function backToDashboard() {
  currentStudentId   = null;
  currentStudentName = '';
  currentStudentNum  = null;
  document.getElementById('detail').classList.add('hidden');
  document.getElementById('dashboard').classList.remove('hidden');
  renderDashboard();
  window.scrollTo(0, 0);
}
