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
let sales = [];
let savedTotal = 0;

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
const totalBtn = document.getElementById('total-btn');
const downloadCsvBtn = document.getElementById('download-csv');

function updateDisplay() {
    display.value = currentInput;
}

function resetPurchase() {
    total = 0;
    sales = [];
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
        downloadCsvBtn.classList.add('hidden');
    } else {
        previousInput = savedTotal.toString();
        operation = '-';
        modeInfo.textContent = '支払金額を入力してください';
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
        currentInput = savedTotal.toString();
        updateDisplay();
        modeInfo.textContent = '商品代金は自動入力されました。= を押してください';
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

function generateCSV() {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    let csv = '日付,商品名,価格,数量,合計\n';
    sales.forEach(item => {
        csv += `${date},${item.name},${item.price},${item.quantity},${item.price * item.quantity}\n`;
    });
    return csv;
}

function downloadCSV() {
    const csv = generateCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function appendItem(item) {
    total += item.price;
    sales.push({ name: item.name, price: item.price, quantity: 1 });
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
    if (newMode === 'change') {
        savedTotal = total;
    }
    mode = newMode;
    purchasePanel.classList.toggle('hidden', mode === 'change');
    changePanel.classList.toggle('hidden', mode === 'purchase');
    purchaseModeBtn.classList.toggle('active', mode === 'purchase');
    changeModeBtn.classList.toggle('active', mode === 'change');
    clearCalculator();
    downloadCsvBtn.classList.add('hidden');
}

purchaseModeBtn.addEventListener('click', () => switchMode('purchase'));
changeModeBtn.addEventListener('click', () => switchMode('change'));
resetBtn.addEventListener('click', clearCalculator);
totalBtn.addEventListener('click', () => {
    downloadCsvBtn.classList.remove('hidden');
});
downloadCsvBtn.addEventListener('click', downloadCSV);
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