/**
 * Cheonan-Asan Sweet Home Manager - Main Logic
 */

// 1. Updated Data for Apartments (Based on Real Market Data 2026)
const apartments = [
    {
        id: 1,
        name: "더샵 탕정인피니티시티 1차",
        location: "아산시 탕정면 (탕정지구 A4)",
        price: 54000, // 분양가 4.8억 + P 4000 + 옵션/확장
        score: { location: 95, education: 94, future: 96 },
        features: ["elementary", "academy", "kinder", "subway", "brand"],
        description: "탕정지구 대장주. 초품아 확정 및 유치원 인접. 탕정역 도보권.",
        tags: ["대장주", "초품아", "탕정역"]
    },
    {
        id: 2,
        name: "더샵 탕정인피니티시티 2차",
        location: "아산시 탕정면 (탕정지구 A3)",
        price: 52000, // 분양가 4.8억 + P 3000 + 옵션
        score: { location: 92, education: 90, future: 94 },
        features: ["elementary", "kinder", "subway", "brand"],
        description: "1차와 인프라 공유. 초등학교 및 중학교 신설 부지 인접.",
        tags: ["신축", "학세권", "대단지"]
    },
    {
        id: 3,
        name: "더샵 탕정인피니티시티 3차",
        location: "아산시 탕정면 (탕정지구 A2)",
        price: 50000, // 분양가 + P 1000~2000
        score: { location: 89, education: 86, future: 93 },
        features: ["kinder", "brand"],
        description: "지구 하단부 위치하나 1,2차와 함께 매머드급 브랜드 타운 형성.",
        tags: ["가성비", "브랜드타운"]
    },
    {
        id: 4,
        name: "아산 탕정 자이 퍼스트시티",
        location: "아산시 탕정면 (동산리)",
        price: 54000, // 분양가 5.2억 + P 2000
        score: { location: 91, education: 88, future: 90 },
        features: ["elementary", "academy", "brand"],
        description: "신불당 생활권 공유. 자이 브랜드 파워 및 쾌적한 주거 환경.",
        tags: ["신불당생활권", "자이"]
    },
    {
        id: 5,
        name: "천안 아이파크 시티 (성성)",
        location: "천안시 서북구 성성동 (성성5지구)",
        price: 61000, // 실거래 5.6억 + P 5000 (호수조망 등)
        score: { location: 94, education: 92, future: 95 },
        features: ["elementary", "park", "brand"],
        description: "성성호수공원 영구 조망권 확보 가능 세대 존재. 초교 신설 호재.",
        tags: ["호수공원", "영구조망", "삼성SDI"]
    },
    {
        id: 6,
        name: "불당 지웰 더샵",
        location: "천안시 서북구 불당동",
        price: 75000, // 불당 대장주 실거래가 반영
        score: { location: 98, education: 99, future: 88 },
        features: ["elementary", "academy", "kinder", "subway"],
        description: "천안의 강남, 불당동 핵심 학원가 및 상권 최인접 대장주.",
        tags: ["입지끝판왕", "불당학원가"]
    },
    {
        id: 7,
        name: "힐스테이트 탕정역 퍼스트",
        location: "아산시 탕정면 (탕정역)",
        price: 63000,
        score: { location: 96, education: 90, future: 92 },
        features: ["subway", "elementary", "brand"],
        description: "탕정역 초역세권. 편리한 교통과 완성된 인프라.",
        tags: ["초역세권", "탕정역"]
    }
];

// 2. State Management
const state = {
    cash: 0,
    monthlySavings: 0,
    loanLimit: 0,
    activeFilters: new Set(['all']),
    loanAnalysis: {
        isSafe: true,
        message: "자산 정보를 입력해주세요.",
        dsr: 0
    }
};

// 3. UI Elements
const elements = {
    cash: document.getElementById('cash'),
    savings: document.getElementById('monthly-savings'),
    loan: document.getElementById('loan-limit'),
    totalBudget: document.getElementById('total-budget'),
    filterChips: document.getElementById('edu-chips'), // Renamed mentally to general filter
    aptList: document.getElementById('apartment-list'),
    budgetSummary: document.getElementById('budget-summary')
};

// 4. Logic Functions

/**
 * 대출 건전성 분석 로직
 * 원리: 월 저축액의 50% 이상이 원리금 상환에 사용되면 '위험'으로 간주 (간이 DSR)
 * 대출 이율 4.5%, 30년 원리금 균등 상환 가정
 */
function analyzeLoanSafety() {
    if (state.loanLimit <= 0) {
        state.loanAnalysis = { isSafe: true, message: "대출 없이 매수 가능한 범위를 확인합니다.", dsr: 0 };
        return;
    }

    const annualInterestRate = 0.045;
    const months = 360;
    const monthlyRate = annualInterestRate / 12;
    
    // 원리금 균등 상환액 계산 공식: [대출금 * 이율 * (1+이율)^기간] / [(1+이율)^기간 - 1]
    const monthlyPayment = (state.loanLimit * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    
    const paymentRatio = (monthlyPayment / state.monthlySavings) * 100;
    
    if (state.monthlySavings <= 0) {
        state.loanAnalysis = { isSafe: false, message: "⚠️ 월 저축액이 있어야 대출 상환이 가능합니다.", dsr: 100 };
    } else if (paymentRatio > 70) {
        state.loanAnalysis = { isSafe: false, message: `🚨 위험: 월 저축액의 ${paymentRatio.toFixed(0)}%가 대출 상환에 사용됩니다.`, dsr: paymentRatio };
    } else if (paymentRatio > 40) {
        state.loanAnalysis = { isSafe: true, message: `💡 주의: 월 저축액의 ${paymentRatio.toFixed(0)}%가 대출 상환에 사용됩니다.`, dsr: paymentRatio };
    } else {
        state.loanAnalysis = { isSafe: true, message: `✅ 안전: 대출 상환이 계획적인 저축 범위 내에 있습니다.`, dsr: paymentRatio };
    }
}

function updateBudgetUI() {
    const currentBudget = state.cash + state.loanLimit;
    elements.totalBudget.textContent = currentBudget.toLocaleString();
    
    // 분석 결과 메시지 업데이트
    let analysisEl = document.getElementById('loan-analysis-msg');
    if (!analysisEl) {
        analysisEl = document.createElement('p');
        analysisEl.id = 'loan-analysis-msg';
        analysisEl.style.fontSize = '0.85rem';
        analysisEl.style.marginTop = '10px';
        elements.budgetSummary.appendChild(analysisEl);
    }
    
    analysisEl.textContent = state.loanAnalysis.message;
    analysisEl.style.color = state.loanAnalysis.isSafe ? (state.loanAnalysis.dsr > 40 ? '#E67E22' : '#27AE60') : '#E74C3C';
}

function calculateScore(apt) {
    // Score = (Location * 0.4) + (Education * 0.3) + (Future * 0.3)
    return (apt.score.location * 0.4 + apt.score.education * 0.3 + apt.score.future * 0.3).toFixed(1);
}

function renderApartments() {
    const totalBudget = state.cash + state.loanLimit;
    
    // Filter and Sort
    const filtered = apartments.filter(apt => {
        const budgetMatch = totalBudget === 0 || apt.price <= totalBudget;
        
        if (state.activeFilters.has('all')) return budgetMatch;
        
        // Every active filter must be present in apt.features (AND logic) or at least one (OR logic)? 
        // Using OR logic for better discovery, but tailored to UX.
        const featureMatch = Array.from(state.activeFilters).some(f => apt.features.includes(f));
        return budgetMatch && featureMatch;
    }).sort((a, b) => calculateScore(b) - calculateScore(a));

    // Render
    if (filtered.length === 0) {
        elements.aptList.innerHTML = `<div class="loader">조건에 맞는 보금자리가 없습니다. 예산을 조정하거나 필터를 변경해 보세요.</div>`;
        return;
    }

    elements.aptList.innerHTML = filtered.map(apt => `
        <article class="apt-card">
            <div class="apt-tag">${apt.tags[0]}</div>
            <header class="apt-header">
                <h3 class="apt-title">${apt.name}</h3>
                <p class="apt-location">${apt.location}</p>
            </header>
            <div class="apt-body">
                <div class="score-row">
                    <span class="stat-label">미래 가치 점수</span>
                    <span class="score-badge">${calculateScore(apt)}</span>
                </div>
                <div class="stat-grid">
                    <div class="stat-item">
                        <span class="stat-label">입지</span>
                        <span class="stat-value">${apt.score.location}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">교육</span>
                        <span class="stat-value">${apt.score.education}</span>
                    </div>
                </div>
                <div class="feature-tags" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 5px;">
                    ${apt.tags.slice(1).map(t => `<span style="font-size: 0.7rem; background: #eee; padding: 2px 6px; border-radius: 4px;">#${t}</span>`).join('')}
                </div>
                <p style="margin-top: 15px; font-size: 0.85rem; color: #555;">${apt.description}</p>
            </div>
            <footer class="apt-footer">
                <span class="price-tag">${(apt.price / 10000).toFixed(1)}억~</span>
                <button class="chip active" style="font-size: 0.7rem; padding: 4px 10px;">상세 분석</button>
            </footer>
        </article>
    `).join('');
}

// 5. Event Listeners
function init() {
    // Input events
    const updateAll = () => {
        analyzeLoanSafety();
        updateBudgetUI();
        renderApartments();
    };

    elements.cash.addEventListener('input', (e) => {
        state.cash = Number(e.target.value) || 0;
        updateAll();
    });
    elements.savings.addEventListener('input', (e) => {
        state.monthlySavings = Number(e.target.value) || 0;
        updateAll();
    });
    elements.loan.addEventListener('input', (e) => {
        state.loanLimit = Number(e.target.value) || 0;
        updateAll();
    });

    // Filter events
    elements.filterChips.addEventListener('click', (e) => {
        if (e.target.classList.contains('chip')) {
            const val = e.target.dataset.value;
            
            if (val === 'all') {
                state.activeFilters.clear();
                state.activeFilters.add('all');
                elements.filterChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');
            } else {
                state.activeFilters.delete('all');
                elements.filterChips.querySelector('[data-value="all"]').classList.remove('active');
                
                if (state.activeFilters.has(val)) {
                    state.activeFilters.delete(val);
                    e.target.classList.remove('active');
                } else {
                    state.activeFilters.add(val);
                    e.target.classList.add('active');
                }
                
                if (state.activeFilters.size === 0) {
                    state.activeFilters.add('all');
                    elements.filterChips.querySelector('[data-value="all"]').classList.add('active');
                }
            }
            renderApartments();
        }
    });

    // Initial Render
    renderApartments();
}

document.addEventListener('DOMContentLoaded', init);
