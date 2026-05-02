# Blueprint: 천안아산 보금자리 매니저 (Cheonan-Asan Sweet Home Manager)

## Overview
**천안아산 보금자리 매니저**는 천안 및 아산 지역 내 집 마련을 꿈꾸는 신혼부부 및 영유아 자녀 가구를 위한 맞춤형 아파트 추천 웹 애플리케이션입니다. 단순한 가격 비교를 넘어 사용자의 자산 상황, 자녀 교육 환경, 그리고 부동산 경제학적 미래 가치를 종합적으로 분석하여 최적의 보금자리를 제안합니다.

### 핵심 가치
- **자산 기반 매칭**: 현재 가용 자산과 저축 계획을 바탕으로 실현 가능한 매물 필터링.
- **교육 인프라 고도화**: 유치원, 초/중/고 밀집도 및 학원가 접근성 중심의 분석.
- **미래 가치 평가**: 직주근접, 교통 호재, 공급 물량 분석을 통한 자산 가치 보존 가능성 평가.

---

## Detailed Outline

### 1. 디자인 및 스타일 (Design & Aesthetics)
- **컬러 팔레트**: 
  - `Primary`: Deep Blue (`#1A237E`) - 신뢰와 전문성.
  - `Accent`: Vibrant Mint (`#00BFA5`) - 활력과 미래 지향.
  - `Background`: Subtle Gray with Texture (`#F5F7FA`).
- **타이포그래피**: 
  - `Pretendard` 등 고딕 계열 사용.
  - Hero text 및 섹션 헤드라인 강조.
- **시각 효과**: 
  - 카드 레이아웃에 멀티 레이어 드롭 섀도우 적용.
  - 버튼 및 대화형 요소에 글로우 효과 및 부드러운 애니메이션.
- **반응형 디자인**: 
  - 모바일 퍼스트 접근 방식.
  - `@container` 쿼리를 활용한 컴포넌트 단위 반응형 대응.

### 2. 기술 스택 (Technical Stack)
- **Frontend**: Vanilla HTML5, CSS3 (Modern Baseline), JavaScript (ES Modules).
- **Core Features**:
  - Web Components를 활용한 캡슐화된 UI.
  - CSS Grid/Flexbox 기반의 견고한 레이아웃.
  - Local Data Handling (JSON 기반 모의 데이터).

### 3. 주요 기능 및 로직
- **Budget Planner**: 
  - 현금 + 대출 가능액 + 미래 저축 시나리오 반영.
- **Future Value Engine**: 
  - 점수 = (입지 점수 * 0.4) + (교육 환경 점수 * 0.3) + (호재 점수 * 0.3).
  - 입지: 직주근접 (삼성디스플레이시티 등), 역세권.
  - 교육: 초품아 여부, 학원가 거리.
  - 호재: GTX-C, 신설 학교, 지구 확장성.

### 4. 대상 단지 (Initial Data)
- **탕정 인피니티 시티 (1, 2, 3차)**: 차수별 학교 인접성 및 입지 차이 반영.
- **아산 탕정 자이 (퍼스트, 센트럴, 메트로)**: 브랜드 프리미엄 및 입지 분석.
- **천안 아이파크 시티 (성성)**: 호수공원 접근성 및 신설 학교 호재 반영.
- **기타**: 불당, 성성, 탕정 주요 대장주 단지.

---

## Current Plan: Initial Setup & MVP Development

### Phase 1: 기반 구조 설정 (Current)
- [x] `blueprint.md` 작성 및 프로젝트 가이드라인 수립.
- [ ] `index.html` 시맨틱 레이아웃 및 폼 구조 구현.
- [ ] `style.css` 테마 및 전역 스타일 정의.
- [ ] `main.js` 데이터셋 및 계산 로직 기본 틀 마련.

### Phase 2: 로직 고도화
- [ ] 자산 분석 알고리즘 (Budget Planner) 구현.
- [ ] 아파트별 스코어링 엔진 (Value Analyzer) 구현.

### Phase 3: UI/UX 폴리싱
- [ ] 매물 카드 및 상세 분석 대시보드 디자인.
- [ ] 애니메이션 및 인터랙션 추가.
