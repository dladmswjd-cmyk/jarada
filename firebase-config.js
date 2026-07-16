/* ══════════════════════════════════════════════════════════════
   🔌 Firebase 설정 키

   프로젝트: hongsan-jarada
   설정일:   2026-07-15

   ⚠️ 이 값들은 Firebase 콘솔에서 가져온 것입니다.
      바꿀 일이 생기면 콘솔 → ⚙️ 설정 → 일반 → 내 앱 에서 다시 확인하세요.

   ⚠️ 이 키는 원래 브라우저에 공개되는 값이라 비밀이 아닙니다.
      (진짜 보안은 Realtime Database 의 "규칙"이 담당합니다)
   ══════════════════════════════════════════════════════════════ */

const firebaseConfig = {
  apiKey:            "AIzaSyChWy-cC03hJMLTApWnicw9ODg_n1BDsVc",
  authDomain:        "hongsan-jarada.firebaseapp.com",
  databaseURL:       "https://hongsan-jarada-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId:         "hongsan-jarada",
  storageBucket:     "hongsan-jarada.firebasestorage.app",
  messagingSenderId: "136098000384",
  appId:             "1:136098000384:web:150432ebca85168e1db2e5",
};

/* ── 참고 ──────────────────────────────────────────────────────

   Firebase 콘솔이 보여준 코드에는 이런 줄이 있었습니다.

     import { initializeApp } from "firebase/app";
     const app = initializeApp(firebaseConfig);

   이건 "모듈 방식"이라 빌드 도구(npm, Vite 등)가 필요합니다.
   우리 앱은 설치 없이 돌아가야 하므로 "compat 방식"을 씁니다.
   그래서 위의 설정값만 가져오고, 연결은 db.js 가 알아서 합니다.

   ⚠️ 보안 규칙 만료일: 2026-08-15
      그날이 지나면 앱이 멈춥니다. 콘솔 → Realtime Database → 규칙
      에서 날짜를 미루거나 true 로 바꾸세요.
   ───────────────────────────────────────────────────────────── */
