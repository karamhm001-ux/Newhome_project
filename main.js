import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Cheonan-Asan Sweet Home Manager - Main Logic
 */

// 0. AI Configuration
const API_KEY = "AIzaSyBYph46fnUM-USuhDAcblYWBpr4C2IZ2Gg"; 
const genAI = new GoogleGenerativeAI(API_KEY);

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
    filterChips: document.getElementById('edu-chips'),
    aptList: document.getElementById('apartment-list'),
    budgetSummary: document.getElementById('budget-summary'),
    chatbotToggle: document.getElementById('chatbot-toggle'),
    chatbotContainer: document.getElementById('chatbot-container'),
    closeChat: document.getElementById('close-chat'),
    chatInput: document.getElementById('chat-input'),
    sendChat: document.getElementById('send-chat'),
    chatMessages: document.getElementById('chat-messages')
};

// 4. Logic Functions

function analyzeLoanSafety() {
    if (state.loanLimit <= 0) {
        state.loanAnalysis = { isSafe: true, message: "대출 없이 매수 가능한 범위를 확인합니다.", dsr: 0 };
        return;
    }

    const annualInterestRate = 0.045;
    const months = 360;
    const monthlyRate = annualInterestRate / 12;
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
    return (apt.score.location * 0.4 + apt.score.education * 0.3 + apt.score.future * 0.3).toFixed(1);
}

function renderApartments() {
    const totalBudget = state.cash + state.loanLimit;
    const filtered = apartments.filter(apt => {
        const budgetMatch = totalBudget === 0 || apt.price <= totalBudget;
        if (state.activeFilters.has('all')) return budgetMatch;
        const featureMatch = Array.from(state.activeFilters).some(f => apt.features.includes(f));
        return budgetMatch && featureMatch;
    }).sort((a, b) => calculateScore(b) - calculateScore(a));

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

// 6. Chatbot Logic
async function getAIResponse(userMessage) {
    if (API_KEY === "YOUR_API_KEY_HERE") {
        return "⚠️ API 키가 설정되지 않았습니다. main.js 상단의 API_KEY 변수에 키를 입력해주세요. (Google AI Studio에서 발급 가능)";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const context = `
            당신은 천안/아산 지역 아파트 전문가입니다. 아래는 현재 추천 가능한 아파트 데이터입니다:
            ${JSON.stringify(apartments, null, 2)}
            
            사용자의 질문에 대해 이 데이터를 바탕으로 친절하게 답변해주세요. 
            가격은 만원 단위이며, 점수는 100점 만점입니다.
            답변은 한국어로, 친근한 전문가 톤으로 해주세요.
        `;

        const prompt = `${context}\n\n사용자 질문: ${userMessage}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Error:", error);
        return "죄송합니다. 답변을 생성하는 중에 오류가 발생했습니다.";
    }
}

function addMessage(text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', isUser ? 'user' : 'bot');
    msgDiv.textContent = text;
    elements.chatMessages.appendChild(msgDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

async function handleSendMessage() {
    const text = elements.chatInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    elements.chatInput.value = '';
    
    const loadingId = Date.now();
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot');
    loadingDiv.id = loadingId;
    loadingDiv.textContent = "생각 중...";
    elements.chatMessages.appendChild(loadingDiv);

    const aiRes = await getAIResponse(text);
    const loader = document.getElementById(loadingId);
    if (loader) loader.remove();
    addMessage(aiRes);
}

// 5. Event Listeners
function init() {
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

    elements.chatbotToggle.addEventListener('click', () => {
        elements.chatbotContainer.classList.toggle('chatbot-hidden');
    });

    elements.closeChat.addEventListener('click', () => {
        elements.chatbotContainer.classList.add('chatbot-hidden');
    });

    elements.sendChat.addEventListener('click', handleSendMessage);
    elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSendMessage();
    });

    renderApartments();
}

document.addEventListener('DOMContentLoaded', init);
