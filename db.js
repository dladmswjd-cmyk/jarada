/* ══════════════════════════════════════════════════════════════
   🌱 자라다(Jarada) 서버 연결 계층 (Firebase Realtime Database)

   login.html / student.html / parent.html 이 모두 이 파일을 씁니다.
   Firebase 를 직접 만지는 코드는 전부 여기에만 있습니다.
   ⚠️ firebase-config.js 를 먼저 채워야 동작합니다.
   ══════════════════════════════════════════════════════════════ */

let db = null;

/* ── 서버에 저장되는 모양 ──────────────────────────────────────

   jarada/
     students/
       김민준/                     ← 이름으로 만든 열쇠
         name:       "김민준"
         hearts:     24
         stickers:   3
         tasks:      { "2026-07-15": [ {id, text, done}, ... ] }
         celebrated: { "2026-07-15": true }
         updatedAt:  1752537600000
     events/
       김민준/                     ← 학부모/교사 → 학생 알림
         msg: "❤️ 보너스 하트를 보냈어요!"
         ts:  1752537600000
   ───────────────────────────────────────────────────────────── */

const ROOT = 'jarada';

/* ══════════════════════════════════════════════════════════
   1. 연결
   ══════════════════════════════════════════════════════════ */
function initDb() {
  // firebase-config.js 를 아직 안 채웠으면 조용히 실패시킵니다
  if (typeof firebaseConfig === 'undefined') return false;
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('여기에')) return false;
  if (!firebaseConfig.databaseURL || firebaseConfig.databaseURL.includes('여기에')) return false;
  if (!window.firebase) return false;

  try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    return true;
  } catch (e) {
    console.error('Firebase 연결 실패:', e);
    return false;
  }
}

/* ══════════════════════════════════════════════════════════
   2. 로그인 (localStorage 에 "지금 이 기기의 사용자"만 기억합니다)
      ⚠️ 비밀번호가 없으므로 진짜 인증이 아니라 프로필 선택입니다.
   ══════════════════════════════════════════════════════════ */
const USER_KEY = 'jarada-user';

// Firebase 열쇠에 못 쓰는 글자: . # $ [ ] /
// 한글·영문·숫자는 그대로 쓸 수 있습니다.
//
// ⚠️ 이름만으로는 한 반의 동명이인(김민준 2명)을 구분할 수 없습니다.
//    그래서 번호를 붙일 수 있게 했습니다.  김민준 + 7 → "김민준-7"
//    번호가 없으면 예전처럼 이름만 씁니다.
function makeStudentId(name, num) {
  const clean = name.trim().replace(/[.#$\[\]\/]/g, '_').replace(/\s+/g, ' ');
  return num ? `${clean}-${num}` : clean;
}

// 화면에 보여줄 이름:  번호가 있으면 "김민준 7번", 없으면 "김민준"
function displayName(d) {
  if (!d) return '';
  const n = d.name || '';
  return d.num ? `${n} ${d.num}번` : n;
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch (e) {
    return null;
  }
}

function setCurrentUser(name, num) {
  const user = {
    id:   makeStudentId(name, num),
    name: name.trim(),
    num:  num || null,
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

function logout() {
  localStorage.removeItem(USER_KEY);
  location.href = 'login.html';
}

/* ══════════════════════════════════════════════════════════
   3. 읽기 / 쓰기
   ══════════════════════════════════════════════════════════ */

// Firebase 는 빈 배열을 없애버리고, 중간이 비면 객체로 바꿔서 돌려줍니다.
// 그래서 받아올 때마다 배열로 되돌려 놓아야 안전합니다.
function asList(v) {
  if (Array.isArray(v)) return v.filter(Boolean);
  if (v && typeof v === 'object') return Object.values(v).filter(Boolean);
  return [];
}

function normalizeTasks(tasks) {
  const out = {};
  if (!tasks) return out;
  Object.keys(tasks).forEach(date => {
    const list = asList(tasks[date]);
    if (list.length) out[date] = list;
  });
  return out;
}

// 한 학생을 실시간으로 구독합니다. 서버가 바뀌면 콜백이 자동 호출됩니다.
function dbWatchStudent(id, callback) {
  db.ref(`${ROOT}/students/${id}`).on('value', snap => callback(snap.val()));
}

// 전체 학생을 실시간으로 구독합니다 (교사 현황판용).
function dbWatchAllStudents(callback) {
  db.ref(`${ROOT}/students`).on('value', snap => callback(snap.val() || {}));
}

function dbSaveStudent(id, name, num, data) {
  return db.ref(`${ROOT}/students/${id}`).set({
    name:       name,
    num:        num || null,
    hearts:     data.hearts     || 0,
    stickers:   data.stickers   || 0,
    tasks:      data.tasks      || {},
    celebrated: data.celebrated || {},
    updatedAt:  Date.now(),
  });
}

// 학부모/교사 → 학생 알림 (FR-3)
// ts 를 같이 넣어야 같은 메시지를 연달아 보내도 학생 쪽에서 새 알림으로 인식합니다.
function dbSendEvent(id, msg) {
  return db.ref(`${ROOT}/events/${id}`).set({ msg, ts: Date.now() });
}

function dbWatchEvents(id, callback) {
  db.ref(`${ROOT}/events/${id}`).on('value', snap => callback(snap.val()));
}

/* ══════════════════════════════════════════════════════════
   4. 설정이 안 됐을 때 보여줄 안내 화면
      (초보자가 하얀 화면을 보고 당황하지 않도록)
   ══════════════════════════════════════════════════════════ */
function showSetupNeeded(mountId) {
  const box = document.getElementById(mountId);
  if (!box) return;
  box.innerHTML = `
    <div class="max-w-md mx-auto bg-white border border-amber-200 rounded-3xl p-8 text-center shadow-sm">
      <div class="text-5xl mb-4">🔌</div>
      <h2 class="font-extrabold text-lg mb-2">서버 설정이 아직 안 됐어요</h2>
      <p class="text-sm text-slate-500 leading-relaxed mb-5">
        오류가 아닙니다. <b>firebase-config.js</b> 파일에<br>
        Firebase 설정 키를 붙여넣으면 바로 동작합니다.
      </p>
      <div class="bg-beige rounded-2xl p-4 text-left text-xs text-slate-500 leading-relaxed">
        <b class="text-slate-700">지금 해야 할 일</b><br>
        1. <b>Firebase 설정 가이드.md</b> 파일을 엽니다<br>
        2. 적힌 순서대로 Firebase 프로젝트를 만듭니다<br>
        3. 설정 키를 <b>firebase-config.js</b> 에 붙여넣습니다<br>
        4. 이 페이지를 새로고침(F5)합니다
      </div>
    </div>`;
}
