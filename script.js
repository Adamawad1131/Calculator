let display = document.getElementById('display');
let historyExpr = document.getElementById('history-expr');
let isDegree = true;

// 1. Appends numbers and simple math operators
function appendValue(val) {
    if (display.innerText === '0' || display.innerText === 'Error') {
        display.innerText = val;
    } else {
        display.innerText += val;
    }
}

// 2. Appends mathematical functions
function appendFunc(func) {
    if (display.innerText === '0' || display.innerText === 'Error') {
        display.innerText = func;
    } else {
        display.innerText += func;
    }
}

// 3. Clears screen entirely
function clearDisplay() {
    display.innerText = '0';
    historyExpr.innerText = '';
}

// 4. Backspace functionality
function deleteChar() {
    if (display.innerText.length === 1 || display.innerText === 'Error') {
        display.innerText = '0';
    } else {
        display.innerText = display.innerText.slice(0, -1);
    }
}

// 5. Toggle between Degrees and Radians
function toggleAngleMode() {
    isDegree = !isDegree;
    document.getElementById('angle-mode').innerText = isDegree ? 'DEG' : 'RAD';
}

// 6. Theme Switching
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

// 7. Toggle Slide-out History
function toggleHistory() {
    document.getElementById('history-panel').classList.toggle('open');
}

// 8. Core Mathematical Parser & Calculator
function calculate() {
    let expression = display.innerText;
    historyExpr.innerText = expression + ' =';

    try {
        let parsed = parseExpression(expression);
        let result = eval(parsed);

        // Format float rounding issues
        result = Number(Math.round(result + 'e10') + 'e-10');

        display.innerText = result;
        addHistoryItem(expression, result);
    } catch (e) {
        display.innerText = 'Error';
    }
}

// Helper: Convert scientific operators into JavaScript Math methods
function parseExpression(expr) {
    let parse = expr
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/abs\(/g, 'Math.abs(')
        .replace(/\^/g, '**');

    // Handle Factorials (e.g. 5! -> factorial(5))
    parse = parse.replace(/(\d+)!/g, (_, num) => factorial(parseInt(num)));

    // Handle Trigonometry (DEG vs RAD)
    if (isDegree) {
        parse = parse
            .replace(/sin\(([^)]+)\)/g, (_, val) => `Math.sin((${val}) * Math.PI / 180)`)
            .replace(/cos\(([^)]+)\)/g, (_, val) => `Math.cos((${val}) * Math.PI / 180)`)
            .replace(/tan\(([^)]+)\)/g, (_, val) => `Math.tan((${val}) * Math.PI / 180)`);
    } else {
        parse = parse
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(');
    }

    return parse;
}

// Factorial recursive calculation
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
}

// 9. Manage History Log
function addHistoryItem(expr, res) {
    const list = document.getElementById('history-list');
    const li = document.createElement('li');
    li.innerHTML = `<div>${expr}</div><strong>= ${res}</strong>`;
    li.onclick = () => {
        display.innerText = res;
        toggleHistory();
    };
    list.prepend(li);
}

function clearHistoryLog() {
    document.getElementById('history-list').innerHTML = '';
}

// 10. Physical Keyboard Bindings
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || ['+', '-', '*', '/', '.', '(', ')', '^', '%'].includes(e.key)) {
        appendValue(e.key);
    } else if (e.key === 'Enter') {
        calculate();
    } else if (e.key === 'Backspace') {
        deleteChar();
    } else if (e.key === 'Escape') {
        clearDisplay();
    }
});
