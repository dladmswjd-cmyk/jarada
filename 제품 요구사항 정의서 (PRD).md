# **🌱 제품 요구사항 정의서 (PRD) \- 자라다 (Jarada)**

## **1\. 프로젝트 개요 (Overview)**

* **제품명:** 자라다 (Jarada)  
* **버전:** v2.0 (달력 퍼스트 및 보상 인터랙션 강화 버전)  
* **목적:** 초등학생 및 학령기 아동의 자기주도적 학습 및 생활 습관 형성을 돕기 위한 캘린더 기반의 게이미케이션 대시보드 솔루션입니다.  
* **핵심 가치:**  
  * 아동에게는 "성장하는 캐릭터"를 통한 즉각적인 성취감을 제공합니다.  
  * 학부모에게는 "원격 격려 및 보상 메커니즘"을 제공하여 잔소리 없는 긍정적 양육 환경을 유도합니다.

## **2\. 핵심 타겟 및 페르소나 (Target & Persona)**

### **2.1 주 사용자 (아동 / 학생)**

* **연령:** 만 7세 \~ 12세 (초등학생)  
* **행동적 특징:** 디지털 기기 사용에 익숙하나, 지루하거나 반복적인 일과(학습, 독서, 양치 등)에는 쉽게 집중력을 잃음.  
* **요구사항:** 나의 노력이 시각적(캐릭터 진화) 및 청각적으로 즉시 보상받기를 원함.

### **2.2 부 사용자 (학부모 / 교사)**

* **역할:** 학습 조력자 및 보상 제공자  
* **행동적 특징:** 아동의 일과 수행 여부를 실시간으로 모니터링하고 칭찬하고 싶어 함.  
* **요구사항:** 강압적인 통제 대신 자발적 참여를 유도하는 칭찬 도구와 원격 소통 채널이 필요함.

## **3\. 주요 기능적 요구사항 (Functional Requirements)**

### **\[FR-1\] 달력 기반 학습 및 습관 대시보드 (Calendar-First View)**

* **FR-1.1 월간 달력 로드 및 포커스:**  
  * 진입 시 현재 날짜(예: ![][image1]년 ![][image2]월)가 자동으로 포커스된 달력을 노출합니다.  
  * 사용자는 이전/다음 달로 유연하게 네비게이션할 수 있어야 합니다.  
* **FR-1.2 날짜별 완주 상태 시각화:**  
  * 특정 날짜의 등록된 할 일이 모두 완료된 경우, 달력 셀 내부에 새싹 완주 도장(🌱)을 실시간으로 표시합니다.  
  * 할 일이 완료되지 않았거나 진행 중인 날짜에는 작은 점(Dot)을 표시합니다.  
* **FR-1.3 날짜별 할 일 목록(Todo List) 연동:**  
  * 달력의 특정 일자를 탭하면, 하단 영역에 해당 날짜 전용의 체크리스트가 동적으로 로딩됩니다.  
  * 사용자는 날짜별로 계획을 추가(addNewTask)하거나 삭제(deleteTask)할 수 있어야 합니다.

### **\[FR-2\] 게이미케이션 및 캐릭터 진화 시스템 (Gamification)**

* **FR-2.1 하트(Heart) 획득 및 진척도 계산:**  
  * 하나의 할 일을 완료 상태로 전환할 때마다 하트가 ![][image3] 획득되며, 완료율(![][image4])이 실시간 계산됩니다.  
  * 목표 달성률 ![][image4]는 다음과 같이 정의됩니다.  
    ![][image5]  
* **FR-2.2 하루 완주 보상:**  
  * 일일 완료율 $C \= 100%$에 도달하는 순간, 하트 ![][image6] 보너스와 함께 시각적인 폭죽(Confetti) 효과와 'All-Clear' 오디오 피드백을 출력합니다.  
* **FR-2.3 캐릭터 진화(Evolution) 공식:**  
  * 누적된 하트 수(![][image7])에 따라 캐릭터의 레벨과 형태(Emoji)가 실시간으로 자동 업데이트됩니다.

| 레벨 | 상태 타이틀 | 하트 범위 (H) | 이모지 |
| :---- | :---- | :---- | :---- |
| **Lv 1** | 아기 씨앗 | ![][image8] | 🥚 |
| **Lv 2** | 무럭무럭 새싹 | ![][image9] | 🌱 |
| **Lv 3** | 가지 치는 잎새 | ![][image10] | 🌿 |
| **Lv 4** | 활짝 핀 꽃망울 | ![][image11] | 🌸 |
| **Lv 5** | 자라난 수호 나무 | ![][image12] | 🌳 |

### **\[FR-3\] 학부모 원격 상호작용 (Parent Connection)**

* **FR-3.1 칭찬 스티커 및 보너스 전송:**  
  * 학부모는 원격 인터페이스를 통해 자녀에게 칭찬 스티커(🌟)와 보너스 하트(❤️)를 즉시 보낼 수 있습니다.  
* **FR-3.2 커스텀 응원 메시지 피드:**  
  * 학부모가 입력한 텍스트 메시지는 자녀의 화면 상단에 실시간 토스트 알림으로 푸시되며, 시각적 주목을 유도하기 위해 마이크로 사운드(Gift Sound)가 재생됩니다.

## **4\. 비기능적 요구사항 (Non-Functional Requirements)**

* **NFR-1. 사용성 및 반응형 UX:**  
  * 모바일 기기(Viewport 가로 ![][image13] 기준)에 최적화된 컴팩트한 화면 배치를 제공하며, 웹 환경에서도 좌측 제어판과 우측 모바일 폰 뷰가 독립적으로 작용하여 사용성을 유지해야 합니다.  
* **NFR-2. 시각/청각 피드백 최적화:**  
  * 사용자의 모든 인터랙션(체크박스 클릭, 달력 터치, 리스트 삭제 등)은 시각 피드백(진동 펄스 애니메이션)과 Tone.js를 활용한 신디사이저 오디오 피드백을 동반합니다.  
  * 오디오에 민감한 환경을 고려해 사용자가 수동으로 오디오를 끌 수 있는 토글 옵션을 항상 제공합니다.

## **5\. UI/UX 디자인 가이드라인**

* **컬러 시스템:**  
  * 메인 민트 그린: \#1ABC9C (생명력과 성장을 대변하는 파스텔톤 그린)  
  * 강조 핑크/레드: \#FF4D6D (하트 및 액티브 피드백용)  
  * 배경 베이지: \#F9F9F7 (눈의 피로도를 완화하는 샌드 베이지 틴트)  
* **폰트 스택:** 가독성이 뛰어난 산돌 고딕 계열 및 현대적인 Pretendard 서체를 채택하여 학부모와 아동 모두에게 명확한 텍스트 가독성을 제공합니다.

## **6\. 미래 발전 로드맵 (Future Roadmap)**

1. **소셜 케어 네트워크:** 동일 연령대의 다른 사용자 또는 형제자매와 함께 식물을 가꾸고 숲을 이루는 '우리들의 숲' 기능 도입.  
2. **AI 스마트 스케줄러:** 아동의 수행 상태와 속도를 AI로 측정하여 지나치게 무리한 계획을 방지하고 완주율이 높은 최적의 일정 템플릿을 자동으로 추천하는 보조 기능.  
3. **오프라인 굿즈 리워드 연동:** 레벨 5(자라난 수호 나무 🌳) 달성 시 실제 반려식물 밀키트나 상장을 가정으로 오프라인 배송해주는 O2O 연동 서비스 기획.

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAZCAYAAACsGgdbAAACl0lEQVR4Xu2VT4hNYRjGz80ooiRdN90/3/2jNFlQV2yGEJYSFjIb2UxJiimi1EjTxEJYiGlKkp1iMwuxmCyNpWwsRFN2FlOjpHH9njnnu/eb795z5xxZ6Tz1dN73/d73Oe93vj8nCDJkyPCfwxizBV6Hk9Vq9UapVNrq5wi1Wm0bObeVB0+Tt9bPSaoFcozvIe8+fID2PsX8pCUwuJuk1+VyeS/2Duxp2IKjgVOEfwJ+RHhnPp9fj31TdfV6fUNarUKhsK5SqTwm/gIOYm/n+Z7nYZvThr4EAy9JOIu7SrFisbiJRt4RW2CsqVij0Sjjf4LDtpaxjfiz8HwarSD8gnfhWztBxi9pMuRciXI6MOHSfIHzmrkTv6YiFUf+sPciIUfsGZyJvmwiLWlIiyZHbA6TKREbZ6xuY200m83VJN9j8JVeYuOakYTtzEy4b/wmA2qfEP8m8aRa5Izh/8IfspMjtqajmgwDFD6HixTvVyBqJq7JrriDZVpqxoT7VDUT+I9MuNTaSueCuIPjoxqeuAU4qa8TzXamVzMrNdlHqwWnSBlQHvYBOM+BO+pJdEMbmeQ38KlOoGJ6RrGuZvo12UvLafI3NYdsruns52l97Y6KB82Uwock3vHvv7hm4uJxWnETdpoU2/t5GawoL70aRNcHyYOc0iORPe4LC1GTczqdNpZAa8rXStKkrpJRRC/KtkH8EeLHZWuvYC+6S6RlMeEhcJdoRS3sU9g/0Rqy406TPZc7R/AMgz/gHIVfLfG/WyF7KcMxW6jfnWr00jRa/Bg243+oOBe36XdwnBm0enDp/rO5COwi9pnYZXgSe5ambml502rhHzThRCbgBdnG+3X+NbTxtbdo7ph+lf54GvxLrQwZMnj4A+z3FjYgyDZwAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAaCAYAAACO5M0mAAAA40lEQVR4XmNgGLFAQUHBQ15efpGsrKwOkJZExoqKiuLGxsasYIVycnLlQMH/OPBbINYEKwQy5gDxeiCehYRnA/EDoCFlQCWMDKKiojxAznQpKSkRJNeAnGMOVLhYRkaGEywAYoAEgUwWmCJlZWUxoKI1QPfJw8SwARagoklAzeHoEigA6HNboMLdSkpK/OhyKIBYhSBrl4OsRpdAAdAAfw/E0ehyKADogXSgov/A4PJFl0MB8pCA/w1UaIMuBwdA0ziAirYC8VegQmN0eTgQFxfnBiraQ1AhCIBiAmotM7rcsAIAOoQ2PwhrAVsAAAAASUVORK5CYII=>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAAAzUlEQVR4XmNgGAWjYEgDeXl5Q0VFRTd0caoABQUFczk5uTKgJaeB+D+QXY6uBi8AukwcqHGWuLg4N7ocMoBa5AtU6wXEX0m2CKhJEmjIQlFRUR50OWwAaIHxqEVgQBOLgAYKgAxGxsDEoA+kV8vIyKigy2GznKBFoFQFVFANxLPQ8FIgvg/UOB+LXDK6OQQtwgVALqd60GEDg94iIK5Cl8MLiLUIqCYDqPYZEP9Hwu+A+LCysrIYunoMQKxFFAOQBcDgCAUyWdDlRsHwBAClHVEgTEjNZwAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAABVUlEQVR4Xu2TvytGURjHz02KKEnX9XZ/32vBeDelJINRsVutTEiyGA0mi4TNHyBl0qsY/AdMSuySgcLnyY1zzn17X4syvN/6ds55Pud5zo97rlJt/a1c1+1NkmQyiqL5OI5HCHVI3PO8Ht/3A2v6j0gYJeEKP1PgmHYZH9E/g43RP6WdtvNUURSdwHX8yuSVIAi6dR6G4QTsCd9XdiDJVN0FvuE5A5aiaBfsRCx9Gy4CPmhXGToG1AQ/ZN6aEWSrwwQf8G2e56EBLTFnr3J+qm7K6njLAA2UZVmfHPc7IJ+KxHP8Xqn8G5FYw3f4kQKZzVtKKyCu2VxXedHjRpBV+wletyrAdx+A73PJgzaTXWzLHbDCjM1KOfHXa2z4PlSapjHJN7iOh3Qmr5FdbhBfUk3eh5wvYYVL/ELCAcMFvMP4Ak+pZsmaHCmEZsW8/VyVf2Bb/1mfa8BMgN8523sAAAAASUVORK5CYII=>

[image5]: <data:image/png;base64,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>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAABmUlEQVR4Xu2TwSsEURzHZ0MpRDEms2Nmd3Zqj2j+ASlycRGnPTooVwdFSvFXSMnBycGJszgqTpsLSYkbN7ms9fnZWc28GXpyov3Wt/m99/v+ft/33rxnGC208Cfhed4QXIfbcLlUKg2rml/Ddd0Zmh8Xi8WRIAhM4k34CmdVbSYotGSFlmV1qbkmCoVCJ5oj+AzHZA5jn/gRVm3bHlBrUpDjoNGeaZrdaq6JyOgQ1ojHZS6fzzuM7+GNLFYpSUPHSCBmNO8nzEXjaWrf4A7D9qQ6A7pGcchuqDml9lxiNZ+JnxhxywbRn0VHdiEXw4h2mAAN+6RxnCLme+A4TqDmvjMnPwFf6LkRhmHHZ0JuFYk1r/EG4tyHt9yi3YzcQqx3AuVyucdr7K5G7aSaT8HTODrf93tl5WgrRuyopI65OkYrMXk2dIyix1qHd6KXOdETn8g89YtqTQqaRiG6J7jV/B/RP32AV1o3T8cI5NAtwSpchRV4Ca+pHVXFmdA0+oD8K27pFDuck10y1aZqvoQYUDRv6LzuFv4F3gG5D2tR8cUN5AAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAaCAYAAABVX2cEAAABD0lEQVR4XmNgGAXDFMjLyzsC8Wsg/o+E38nJycVKSUmJAOmDQP5fJLkvQLEV4uLi3OhmwQFQ0Rwg/gdU6IIuBxKDys0HchnR5VEAUJEgUPFpIH4gIyMjjUW+HOqqaHQ5DABUpAnEb4F4DZDLgibNAhKHymuiyWECkI0gm0EuQJcDuRTkYpDLQT5Al8cAQIWTgPiPgoJCAJCWRMZAA0KB9D+QGnR9GAApvL4C8SIgnoWG78sPaHgBcRG6HDnhBUpfv4GKbdDlQGIgOXkSw4vy9AVUbCwPCXiM8ALGLAdQfCsQf1JUVNRHlkMB0OzxDGorDL8CGhApLS0tDGTvBuJfSHIg9lJgXuVCN2sUjAIcAAAK52kroCBfLAAAAABJRU5ErkJggg==>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADsAAAAXCAYAAAC1Szf+AAABw0lEQVR4Xu2WO0sDQRSFExLBBwo+IJgNuwkEQhottrCxUewVQVBEQf+AYGPjPxAtLEUQBMHC1spCxEYIBCsLG60sFC1EGx/R75IVxmtAXdkswT1wmJ05Mzd7c+7MbCwWIUKECI0Ax3GG4A18M3hn2/ZMOp3uoT2i/2poD4ztplKpNh2rYUASm7BCIiNakzFP26Ib13pDgSQ6SaYELzOZjFVDX/JcndbaX1EoFNppEno8MJBEEd7CPbpJJSdl3NOLSvOLeDabHSDeIVzlD27REwKDOCbOiYNaE6fFcViSCtD6L5EgyVFincBly7K69YTAwQ+vwxdeZIy21yQJTtBWZI5e91O4rttE7ElilIm3ENrhZuzXR7gNNxQvHJ/7VcqTdfPwVNq6lmstOAHsV3FOHGRNWRwVZ/WcUCCOec4tas3vfiXBOXjOuvFYPU/a7+BU79dnkhnUmoyJ5vjYr6a7tLOhl3A97ldj356FfTi5TvVg+rJfKcNmxvfhfS6X6zc1n/h07eTz+Q49IRDY1c+/K8+1D17zMlNy9/F8AJ8MTZ53+FZu1bF8IEGsYXgMV0K5a0NAnIrpI+E1Sr1LixEiRPifeAfx5IvhoshEXAAAAABJRU5ErkJggg==>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGUAAAAXCAYAAAASloEFAAADfklEQVR4Xu2YXUgUURTHd9HCvj9t0f2YdhUWW4pioUiiB4kggpIiLJIgezB8Ceohgp4CoYiMzKdIqocIstcIIkrooSCQCJUoggqhp3wyCCPrd5pZux72c3bWlOYPfy5zz5mz597/nXN2JhDw4cOHDx8+fPw/WG/jsJ4XxGKxQ5ZlNdfW1i7lMtjQ0LCOuXb8N2vf2UJ9ff1acnoOfxmcJK/b5FUDL3E9Ydh+wuFIJLJRx5pTIMkm2AWfStIs5I72AdXM3zcWl+FAIpFYoZ1doIr4+4n3krFNGwuB+/Y4+fRqmyPcCPyIGGFtn5Mg2SY2opWxGY7lEEX8bsJhTuFnxgdwL9NV2q8UpNPpBfJkEmuIuKdCodAS7VMMuL9bRIlGo/u0jbhpbN8kZy6rtb0cJJPJZYEy9yAvSLoOfsojynVZoJ53A9l8EYGYo7CDE7xI+xQLKVPEeAi/EDOh7cwfFcHw69Q2lwgSaxsxn8Er5eReELMhSmNj43LinLfsMtUqT4r2KRUihAgCB51+ZyKI/Ra2H4w7lK1UTJdYWUM4HF6jHTxHEaL0sbCrjENwDL6AW7RfNjixeyy7KbcEPHzkyWkXMackP+d3poktxfgWjkhv0fcWA69KrCs4C8kpipw4bOcCzoZy3Y7/eDwe36pcZ4ATFcHvPfdeY2MWa3u5sJx+Ah/BGyb5zceOreR+ImWJ+zrgaxkrWqZywSogim5qzmbLE3MvUGDBlTptlegnRr8bkpy9KLGuUUgUjYw//MDTEtL2HJhRl6XHaIdSYPSTJ1mEdtVPyO84fMd9BwIelllXyCeKJIptivFkZs4QRVhn+heBKu5pseweI72m1Pv/wPr7ftKtbQixivlXlot+Yj4tjMf+SekSZDY5mygkdlYWb4pilK9s/3qKRZCnbJNl94N+GNcO+SBiSF6Vej8x+sqol2W3aGREgXe5DCrbdthn1lcEamPuOzxo+roF4iSJNUDcI9qWDXIQ8B+0cvQT4nSKYPC0trmAp2W3IGL2X0o58fJdSBYhnCCJN8Y3oiBzZyz7hekE7IVfYZfYzHiVhnxzs+yyN2nmC/tTqdRCxgtw3LAJ5UvEBh3LBcyye3lW3lUKgQ2JIlYrp3q3R9+85isyZbeHg7taG+cDgnKiLPVil4uIXqMD+PAYbPJKeNFSL3a5yAncqWP48OHDx0z8BveHKU3OoAkwAAAAAElFTkSuQmCC>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGUAAAAXCAYAAAASloEFAAAD/UlEQVR4Xu1YXUgUURSeRYv+/23R/bmzu9JW2y8LRREREkUEJf1gkQTpQ9FLlA8R9FIgJJFR+SRJRkiRvUYQQUIPRYH0oBKZUBH1lFEkRKH2nZ07u9fDju7MzkjGfPBxd+45c+bce+49Z+/VNB8+fPjw4cPH/4/Kysp50Wj0lBCiVdf1C/F4fBm6A6oO5Ach31xWVjaHZIlEYin6aqG/TtWbTFRUVCyBT8/AUYW/4Vc7/JoBNuH5pyIbBnvC4fBqbuufQiwWWwtHuzCAbRjMQrTHaWBgg5YLTCn67yuDM9mJAM5X7TlECezvhb0XaGu4cCLgvV3Sn+tcJgPXC75HMEJc/k+CBgIORyKRPfRMgcHzK/AruELRuwn2QP4R7QNwN7pLsoYcIJ1OT0MQDsFWN+3UYDA4m+sUArzfSEExx6ACdtOQDZHPeCzl8mKQTCbnakXOQV7A2Ss0ILCenulDwkgJP2gXKXo3aIC5N52DJl+myz6wDit4JtcpFJSmYOMh+AU241yO/iM0PsoAXOYQAdjaCJtPae6K8d0StFppi2sy4lhtq/Cxb2CXrB8ZuBEUql2wc14Yaaqavs117IICQQHh/koEIL8F2R+0W5jMLrIplsYQCoUWcwVPICetg1KUzgo4+lvQfxVtN/gJfA6uV3WsAL1ysFkYO7BKc3HLw6ftsDlC/snvZAlZCu0bsFcuPNtwK8Xahkwn92S9GIATOzU2cbTi0H/O7MdzLXQHkeI2qHocWFFh6PXj3WuYmFlcXiyErCfgI7BVJb75WMps1xNKS3ivDnxNrSdpqlBgIMvhxGfwjroqeFGTk0075q42wYC9Wm1e1BOl3nWTz26kWDcQgEMdcjAnuNCEMFLEB3AAuyXI5RYYk5cpXXIFO1DqyZM8gXZUT+DfMfAt3tunuZhmC4ZcwaeJ6orAIM7KoNymZ3IUzyNqkJSgEMvN/gJRgneqhFFjqNbYfT8DkTufNHJZNPfX3nY9UXcL2qOTmrqiuf/wQ/Tb7KdgyMFmDmNKkLJBUdJXvn89hSKAXbZGGPWgDYxxhfFAwSC/vDqfKHWlz820Oy4SiUQEH+zHB9vNkzn91cPkvxTG3+LMvyu0m8AWdTdBpwZ9v8D9Zl8xQHCSsNUJu4e5LB9oIUC/S1jUE924mRgFz3CZA7iadieEMFLAO3y0STeKMRXO79SvqFGdaRDGgaleGLcAdOI/STJFz3PQnZsw0h5dBY1K0v1WWyqVmo72IjioyIh0E7GS23IANe1e9vSsohuXd3T3dQArdqvVPw7aWdCrhs4Ol+68pirMtNuMFLeIC6cCArSiBDvYWZEWCDfgw2VgkheAlwQ72FmRdiq34cOHDx9j8RcZJEN2inkJFwAAAABJRU5ErkJggg==>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG4AAAAXCAYAAADqdnryAAAD/ElEQVR4Xu2YXUhUQRTHd9HCvj9t0dWd3VUQk74wiiJ6sA+IqKQI+5Agg4pegnqoqKdAKCIjs5dIqiche40ghIQekgTxQS2K6AOhh8iHKAgj63e89+o47qZ7964fcf/wZ3bmnHvunDlzz5nZQMCHDx8+fPjw4WOqoqCgYJZS6hC8A2vD4XCBLo9EIvsZ35ibmzuXbrCoqGgZY9XRaHS1rjeRyM/PX8qcnsM/GvuZ133mlQOv0v+uyX7DLnxdYdqalsCZUtiJoxckYBIkfr+U4Ngq2fQfGgskbI7H4wtGGHOHLOzvwV4bbZUpHAs8t8OeT70ps4PbDT8QsLApn7aQ4OBUlwSNbjAUCs2h3wJ/EMByR4/+XdFj7BPtI7iT4axhS6mjvLx8Bu89gK0O7J6Wd5s64wHP10rgCgsLd5sy8UF8kTnTzTbl6aCkpGReIM01cA0cO4dTX2GpNraFBT0v6dMZQ35LD2Q6kABJoLDZA2v096QKSYnYeAw/YzNuyhk/LEFF74Qpc4kgttZj8xm8ns7cXUPSHC9vg+2kyCVCOz2O2kVeBK64uHg+di7JO3G+Ur44UydVSLAkaLDVrr86gsjvIftFu8mQpYqhdC4+yFqZChMGZdU2+dpkMrfhRQkQ7I4ahw7GGnD+Bm0H7IUv4BpdJxnQy4N1yjpIVAQSbAy3YE5bsTkg87PfM0RkZbSvYbfUOvPZ8cCrdO4ptPwvju+1hyUVyGnslX6ylJ1r18HBRadfjU5fLBZb5+gkgthA7y3P3mTxZpvydKHs+gafKOtEPETe+dSWpVzf7FN2DeyUdlJSYjJogRuxIxnfJQ7rdcEsxHZA5MtrCoyxKJnatZmob1r97ZA5e5HOPQdfyyom+E0Z9UEL3ANdX4ey0tFH+A47IVOeBCPqhNQ8UyEVaPWtJcFmcFXfmN9R+EZZGcizlO4pZMFl4ccKnDhDf4D2pKOjBU6Y54yPE1k8U6Gsmie1L9XnB6GG72+1pgwfFjHerlzUN/2roz0ypdKkjWwm1yQOiqPOoJkqI9aVQfpDgdNSZaLT3HgRZPOsVFZ9aoQxU+FfkIDJvDJ1f9PqXI+XKd4TMKFtTOyLOGoPjTqc8HsDbNDzPTpVjP2E+5yxdEAAS7DVjN2DpiwRZLOg36qS1DfZdBJUeMaUuYCnKd4TSDBkMvA9C3BcWdeBXnbxWk0tyNhZZV06j8F6ZV0jTolM08s47H96JMX2q+G/3uT/yMaysrKZtJdhnyYTyj8+y01bLqCn+GuTepdzwIIUsqsq2fnbk6UEXcej/yinK5wUX0c6XWwK/xcEZWcq43KcjGyMHNOAj0kAgVgIryjjcpyM7OTNpg0fPnz4mDz8BWIiSDzmHu67AAAAAElFTkSuQmCC>

[image12]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAXCAYAAACyCenrAAAB8UlEQVR4Xu2Xu0oDQRSGVxLBG4KXEMwuO7sQkNhYbGFjo9hYaSMoYqEvINjYBHwAO7FSQRQEQVsriyA2gYj4BlpZKFqINl6i/2EnMJ4kJDGGjDIf/Gx2/tnJzNkzJxPLMhgMBkNjEEKMQffQp6JH13UXEolEP65nuP9QvGe0Hcbj8U4+1r8CC92B8ljsBPeoTXq7uG3hPsfzvEX0z0DjuI1wX3uw0B5MPgfdOI5jl/BXZXbMc68cyWSyG/3TUBYBmg6CoJX30RZMOgU9QMe4jTI7Su3STzGvIrS1ENBlPHsFLSHg7byPdtCbpwygTOAeZQxlDpSjTOJ+tVCGIFNmMc4lBUjrGoRJbkDvlNq4DqjC5GdwzVMf/twPieB7pjBeFkrT1uIdmopSP16gfWiL6VrUWD+qgQKBwOxRYJCFvdxvGqKB9aMUSrG9oC2kXbGlNy8zYIV7v1U/CNu2+zDOOnQudP45FuH54w0LHuUetZEn6qgfIqxFm1AGGTFiVXGOaRqNOH8U8H1/EM8dkTDOkKVzIApgooEIi2lR/cDbbEP7CfSExQ2rXiXkuWMb8rmnJW54FL+Vb7+gOwRhTu71U+hV8ejzAf7bdPCxDIbakdvt2wGvnCgjrb9QX+oBC50UxQe8ksL2XYvFYl18DINBH74AJryczk40oUoAAAAASUVORK5CYII=>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAAZCAYAAACRiGY9AAADn0lEQVR4Xu2WW4iNURTHzzQUuU6Mydz2mQtjSqEJEZoHksSDlIknTeGJkJQX8SaR8DDNi1tTRCSUBw8TJZcy0gxyyaXwJFEUGsfv71t77LPnHJcHNDn/+rf3Wnuttff69tp7f6lUAQUUUMB/jfr6+pHV1dUbnHPt6XR6R21t7UTURX68tLR0OOOHGF9VUVFRSTs+JD6jZUebRl4pG8RixCE1NTVT8F2jvo/3x6FJWUgnkzYzeQntWuRPcHPKErPFP4OZPNxvdrPhx2jsPVycNemfhhYEe6uqqpZKVmLIN+Fr2Gi6Jvq3YHvEc7CHD+MCu7vwPrytXacdH873V8Cke1zyRVslNzQ0jKB/Bb7TLkrHYpdoB0O/pqamwejb4AKvs6QOhHb/BFpceXn5WLrFktmxySzsDezUWZKOfmNlZWVF6GdluiUVnL2fJaVzpZ1TqcOZqIoVG7/l0Tku4lyOka2nfLWeWBeEzw1dGBh3MMlzHKbG4x7YTIOnWcioUG9JnYFH4SPFgdv5IEOD8W6Y0RhtJ+16uMbkk4ppye+EL2QLP/Cx56JfbXIv/TuKF86fhbKysmEYHLfAj3FYmLKdi6GdZfwEbInHNAm8ThL1kvW1sbtBzHb5SWdfuxN21dXVjfO+WjS6j9jvS9mOWYkfQvdA55a4E+Tr4/8yCDAJx5fwmJKNx9HPgk+dXSIhtIjYB7ttWqz8JAdJ9ZW3oN0kgYvoX9HWer2SUVLwCGNH00nZ/jaKcO6AGQKsyzF2EN5k4pJoLCew26pYcJPkfEkJtvDP+MwJ9cgL0PfStqWCM5wTVkobRV8egl+IJgntdaGg78m1IDvYegq6w7LysdRK/oWkdH6mh3orzSfwDTs3IxzrB50BlzyO79X3eguecfaoethD/Q6eQhwUjrnvD3RWUi4pv4x/B/MlpQsC3TV4j3nKvN7K76zNfYn+DX1AP94PTF6F4UMSOuxvsuBw61qfFtpjNx/dl3gHDYNUHmHN2012WYvx8YOkdCGlvS3dFS651fpKXr9b5r9McvDc9F08OYHBIvgI512whf4F+Fb6PLb9ytJDX9UlD/du2Aq74FX7F/yGICld+RetKs7D10oMkyLttLOr33hJFxDtpkCnX7m9wfTZINiQdPLvt5yFzcv3FewMNrsf/PrIRjEUyyU3ZNbTEJcf8Uar3PLNOSAQJxWPDzioItiVBpeUZZf60sV2AwokMNVFf/rSxXYF/A/4CnQXOVnMeq3rAAAAAElFTkSuQmCC>