/**
 * Cheonan-Asan Sweet Home Manager - Main Logic
 */

// 1. Mock Data for Apartments
const apartments = [
    {
        id: 1,
        name: "더샵 탕정인피니티시티 1차",
        location: "아산시 탕정면 (탕정지구)",
        price: 52000,
        score: { location: 95, education: 90, future: 95 },
        features: ["elementary", "academy", "kinder"],
        description: "탕정지구 대장주. 유치원 및 초교 신설 예정. 삼성디스플레이 근접.",
        tags: ["대장주", "직주근접"]
    },
    {
        id: 2,
        name: "더샵 탕정인피니티시티 2차",
        location: "아산시 탕정면 (탕정지구)",
        price: 51000,
        score: { location: 92, education: 88, future: 93 },
        features: ["elementary", "kinder"],
        description: "1차 대비 학교 접근성 양호. 인프라 공유 가능.",
        tags: ["신축", "학세권"]
    },
    {
        id: 3,
        name: "더샵 탕정인피니티시티 3차",
        location: "아산시 탕정면 (탕정지구)",
        price: 49000,
        score: { location: 88, education: 85, future: 92 },
        features: ["kinder"],
        description: "지구 하단부 위치. 합리적 가격대 형성.",
        tags: ["가성비", "미래가치"]
    },
    {
        id: 4,
        name: "아산 탕정 자이 퍼스트시티",
        location: "아산시 탕정면",
        price: 48000,
        score: { location: 90, education: 85, future: 88 },
        features: ["elementary"],
        description: "자이 브랜드 프리미엄. 쾌적한 주거 환경.",
        tags: ["브랜드", "숲세권"]
    },
    {
        id: 5,
        name: "천안 아이파크 시티 (성성)",
        location: "천안시 서북구 성성동",
        price: 55000,
        score: { location: 93, education: 92, future: 90 },
        features: ["elementary", "academy"],
        description: "성성호수공원 인접. 초교 신설 호재. 천안 북부 핵심권.",
        tags: ["호수공원", "초품아"]
    },
    {
        id: 6,
        name: "불당 지웰 푸르지오",
        location: "천안시 서북구 불당동",
        price: 68000,
        score: { location: 98, education: 98, future: 85 },
        features: ["elementary", "academy", "kinder"],
        description: "불당동 핵심 인프라 및 학원가 최인접.",
        tags: ["인프라끝판왕", "학원가"]
    }
];

// 2. State Management
const state = {
    cash: 0,
    monthlySavings: 0,
    loanLimit: 0,
    eduFilter: 'all'
};

// 3. UI Elements
const elements = {
    cash: document.getElementById('cash'),
    savings: document.getElementById('monthly-savings'),
    loan: document.getElementById('loan-limit'),
    totalBudget: document.getElementById('total-budget'),
    eduChips: document.getElementById('edu-chips'),
    aptList: document.getElementById('apartment-list')
};

// 4. Logic Functions
function calculateTotalBudget() {
    // Current budget = Cash + Loan
    // Future capability could include monthly savings * 60 (5 years)
    const currentBudget = state.cash + state.loanLimit;
    elements.totalBudget.textContent = currentBudget.toLocaleString();
    renderApartments();
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
        const eduMatch = state.eduFilter === 'all' || apt.features.includes(state.eduFilter);
        return budgetMatch && eduMatch;
    }).sort((a, b) => calculateScore(b) - calculateScore(a));

    // Render
    if (filtered.length === 0) {
        elements.aptList.innerHTML = `<div class="loader">조건에 맞는 보금자리가 없습니다. 예산을 조정해 보세요.</div>`;
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
    elements.cash.addEventListener('input', (e) => {
        state.cash = Number(e.target.value) || 0;
        calculateTotalBudget();
    });
    elements.savings.addEventListener('input', (e) => {
        state.monthlySavings = Number(e.target.value) || 0;
        calculateTotalBudget();
    });
    elements.loan.addEventListener('input', (e) => {
        state.loanLimit = Number(e.target.value) || 0;
        calculateTotalBudget();
    });

    // Chip events
    elements.eduChips.addEventListener('click', (e) => {
        if (e.target.classList.contains('chip')) {
            // UI Toggle
            elements.eduChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            e.target.classList.add('active');
            
            // State Update
            state.eduFilter = e.target.dataset.value;
            renderApartments();
        }
    });

    // Initial Render
    renderApartments();
}

document.addEventListener('DOMContentLoaded', init);
