const items = [
    { name: '白雲石コースター', price: 1000 },
    { name: '色紙', price: 2500 },
    { name: 'シール', price: 500 },
    { name: 'クリアファイル', price: 1200 },
    { name: 'アクリルフィギュア', price: 1500 },
    { name: 'はがき（2枚）', price: 100 },
    { name: 'カレンダー', price: 500 },
    { name: '同人誌', price: 700 }
];

let currentInput = '';
let previousInput = '';
let operation = null;
let total = 0;
let mode = 'purchase';

const display = document.getElementById('calc-display');
const totalAmount = document.getElementById('total-amount');
const changeAmount = document.getElementById('change-amount');
const totalMessage = document.getElementById('total-message');
const changeMessage = document.getElementById('change-message');
const modeInfo = document.getElementById('mode-info');
const purchaseModeBtn = document.getElementById('purchase-mode');
const changeModeBtn = document.getElementById('change-mode');
const purchasePanel = document.getElementById('purchase-panel');
const changePanel = document.getElementById('change-panel');
const purchaseButtons = document.getElementById('purchase-buttons');
const itemList = document.getElementById('item-list');
const resetBtn = document.getElementById('reset');
const backspaceBtn = document.getElementById('backspace');
const clearEntryBtn = document.getElementById('clear-entry');

function updateDisplay() {
    display.value = currentInput;
}

function resetPurchase() {
    total = 0;
    itemList.innerHTML = '';
    updateTotalDisplay();
}

function clearCalculator() {
    currentInput = '';
    previousInput = '';
    operation = null;
    updateDisplay();

    if (mode === 'purchase') {
        resetPurchase();
        modeInfo.textContent = '購入モード：商品をタップしてください';
        changeMessage.classList.add('hidden');
        totalMessage.classList.remove('hidden');
    } else {
        modeInfo.textContent = 'おつりモード：支払金額 → － → 商品代金 → =';
        changeAmount.textContent = '0';
        changeMessage.classList.add('hidden');
        totalMessage.classList.add('hidden');
    }
}

function appendNumber(number) {
    if (mode !== 'change') return;
    if (currentInput.length < 12) {
        currentInput += number;
        updateDisplay();
    }
}

function setOperation(op) {
    if (mode !== 'change') return;
    if (currentInput === '') return;
    if (op === '-') {
        previousInput = currentInput;
        operation = op;
        currentInput = '';
        updateDisplay();
        modeInfo.textContent = '商品代金を入力してください';
    }
}

function calculate() {
    if (mode !== 'change') return;
    if (previousInput !== '' && currentInput !== '' && operation === '-') {
        const payment = parseFloat(previousInput);
        const cost = parseFloat(currentInput);
        const change = payment - cost;
        changeAmount.textContent = isNaN(change) ? '0' : change.toFixed(0);
        totalMessage.classList.add('hidden');
        changeMessage.classList.remove('hidden');
        currentInput = '';
        updateDisplay();
        modeInfo.textContent = 'おつり計算結果を表示しています';
    }
}

function updateTotalDisplay() {
    totalAmount.textContent = total.toFixed(0);
}

function appendItem(item) {
    total += item.price;
    const li = document.createElement('li');
    li.textContent = `${item.name} - ${item.price.toLocaleString()}円`;
    itemList.appendChild(li);
    currentInput = `${item.name} ${item.price.toLocaleString()}円`;
    updateDisplay();
    updateTotalDisplay();
}

function initPurchaseButtons() {
    items.forEach(item => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn item-btn';
        button.innerHTML = `<span class="item-name">${item.name}</span><span class="item-price">${item.price.toLocaleString()}円</span>`;
        button.addEventListener('click', () => {
            appendItem(item);
            button.classList.add('neon');
            setTimeout(() => button.classList.remove('neon'), 300);
        });
        purchaseButtons.appendChild(button);
    });
}

function switchMode(newMode) {
    mode = newMode;
    purchasePanel.classList.toggle('hidden', mode === 'change');
    changePanel.classList.toggle('hidden', mode === 'purchase');
    purchaseModeBtn.classList.toggle('active', mode === 'purchase');
    changeModeBtn.classList.toggle('active', mode === 'change');
    clearCalculator();
}

purchaseModeBtn.addEventListener('click', () => switchMode('purchase'));
changeModeBtn.addEventListener('click', () => switchMode('change'));
resetBtn.addEventListener('click', clearCalculator);
backspaceBtn.addEventListener('click', () => {
    if (mode !== 'change') return;
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
});
clearEntryBtn.addEventListener('click', () => {
    if (mode !== 'change') return;
    currentInput = '';
    updateDisplay();
});

document.querySelectorAll('.number').forEach(btn => {
    btn.addEventListener('click', () => appendNumber(btn.dataset.value));
});

document.querySelectorAll('.operator').forEach(btn => {
    btn.addEventListener('click', () => setOperation(btn.dataset.value));
});
document.querySelector('.equals').addEventListener('click', calculate);

initPurchaseButtons();
clearCalculator();