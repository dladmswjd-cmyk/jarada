/* ══════════════════════════════════════════════════
   자라다(Jarada) 공통 디자인 테마 (PRD 5장 컬러 시스템)
   ⚠️ Tailwind CDN 스크립트 '다음'에 불러와야 합니다
   ══════════════════════════════════════════════════ */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        mint:   '#1ABC9C',   // 메인 민트 그린 (생명력과 성장)
        mintDk: '#16A085',   // 민트 hover용
        pink:   '#FF4D6D',   // 강조 핑크/레드 (하트, 액티브 피드백)
        beige:  '#F9F9F7',   // 배경 베이지 (눈의 피로도 완화)
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      },
    },
  },
};
