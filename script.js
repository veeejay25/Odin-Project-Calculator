let firstOperand = '';
let secondOperand = '';
let currentOperation = null;
let shouldResetScreen = false;

const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const clearButton = document.querySelector('.ac');
const decimalButton = document.querySelector('.decimal');
const display = document.querySelector('.display');

numberButtons.forEach(button => 
    button.addEventListener('click', () => appendNumber(button.textContent))
);

operatorButtons.forEach(button => 
    button.addEventListener('click', () => setOperation(button.textContent))
);

equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
decimalButton.addEventListener('click', appendDecimal);

window.addEventListener('keydown', handleKeyboardInput);

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        display.textContent = "Error";
        return null;
    }
    return a / b;
}

function operate(operator, a, b) {
    a = Number(a);
    b = Number(b);
    switch (operator) {
        case '+': return add(a, b);
        case '−': return subtract(a, b);
        case '×': return multiply(a, b);
        case '÷': return divide(a, b);
        default: return null;
    }
}

function appendNumber(number) {
    if (shouldResetScreen) resetScreen();
    if (display.textContent === '0' && currentOperation === null) {
        display.textContent = number;
    } else {
        display.textContent += number;
    }
}

function resetScreen() {
    display.textContent = '';
    shouldResetScreen = false;
}

function clear() {
    display.textContent = '0';
    firstOperand = '';
    secondOperand = '';
    currentOperation = null;
}

function appendDecimal() {
    if (shouldResetScreen) resetScreen();
    if (display.textContent === '') display.textContent = '0';
    if (display.textContent.includes('.')) return;
    display.textContent += '.';
}

function setOperation(operator) {
    if (currentOperation !== null) {
        evaluate();
    }
    firstOperand = display.textContent;
    currentOperation = operator;
    display.textContent += operator;
    shouldResetScreen = false;
}

function evaluate() {
    if (currentOperation === null || shouldResetScreen) return;
    if (currentOperation === '÷' && display.textContent.endsWith('÷0')) {
        display.textContent = "Error";
        clear();
        return;
    }
    
    const parts = display.textContent.split(currentOperation);
    secondOperand = parts[1];
    
    if (!secondOperand) {
        display.textContent = "Error";
        clear();
        return;
    }
    
    const result = roundResult(
        operate(currentOperation, firstOperand, secondOperand)
    );
    
    display.textContent = `${firstOperand}${currentOperation}${secondOperand}=${result}`;
    currentOperation = null;
    shouldResetScreen = true;
}

function roundResult(number) {
    return Math.round(number * 1000) / 1000;
}

function handleKeyboardInput(e) {
    if (e.key >= 0 && e.key <= 9) appendNumber(e.key);
    if (e.key === '.') appendDecimal();
    if (e.key === '=' || e.key === 'Enter') evaluate();
    if (e.key === 'Backspace') clear();
    if (e.key === 'Escape') clear();
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        const operator = e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key;
        setOperation(operator);
    }
}
