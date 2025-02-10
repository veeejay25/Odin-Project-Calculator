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
const plusMinusButton = document.querySelector('.plus-minus');
const percentButton = document.querySelector('.percent');

numberButtons.forEach(button => 
    button.addEventListener('click', () => appendNumber(button.textContent))
);

operatorButtons.forEach(button => 
    button.addEventListener('click', () => setOperation(button.textContent))
);

equalsButton.addEventListener('click', evaluate);
clearButton.addEventListener('click', clear);
decimalButton.addEventListener('click', appendDecimal);
plusMinusButton.addEventListener('click', toggleSign);
percentButton.addEventListener('click', convertToPercent);

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
    if (display.textContent === '0' || shouldResetScreen) {
        resetScreen();
    }
    display.textContent += number;
    clearButton.textContent = 'C';
}

function resetScreen() {
    display.textContent = '';
    shouldResetScreen = false;
}

function clear() {
    if (shouldResetScreen || display.textContent.length === 1) {
        display.textContent = '0';
        firstOperand = '';
        secondOperand = '';
        currentOperation = null;
        shouldResetScreen = false;
        clearButton.textContent = 'AC';
    } else {
        display.textContent = display.textContent.slice(0, -1);
        clearButton.textContent = 'C';
    }
}

function appendDecimal() {
    if (shouldResetScreen) resetScreen();
    const currentNumber = display.textContent.split(/[\+\−\×\÷]/).pop();
    if (currentNumber.includes('.')) return;
    if (currentNumber === '') {
        display.textContent += '0';
    }
    display.textContent += '.';
}

function setOperation(operator) {
    if (currentOperation !== null && !shouldResetScreen) {
        evaluate();
    }
    firstOperand = display.textContent.split('=')[1] || display.textContent;
    currentOperation = operator;
    display.textContent = `${firstOperand}${operator}`;
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
    
    display.textContent = `${result}`;
    currentOperation = null;
    shouldResetScreen = true;
    clearButton.textContent = 'AC';
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

function toggleSign() {
    const currentNumber = display.textContent.split(/[\+\−\×\÷]/).pop();
    if (currentNumber === '') return; // Do nothing if there's no number
    const newNumber = currentNumber.startsWith('-') ? currentNumber.slice(1) : '-' + currentNumber;
    display.textContent = display.textContent.slice(0, -currentNumber.length) + newNumber;
}

function convertToPercent() {
    const currentNumber = display.textContent.split(/[\+\−\×\÷]/).pop();
    if (currentNumber === '') return; // Do nothing if there's no number
    const newNumber = (parseFloat(currentNumber) / 100).toString();
    display.textContent = display.textContent.slice(0, -currentNumber.length) + newNumber;
}
