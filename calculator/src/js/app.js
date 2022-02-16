(function () {

    //UI
    const numbers = document.querySelectorAll('.numbers');
    const result = document.querySelector('.result');
    const symbols = document.querySelectorAll('.operation');
    const screen = document.querySelector('#screen');
    const reset = document.querySelector('.reset');

    //Data
    var operation = {
        first: null,
        second: null,
        result: 0,
        currentOperator: "",
        prevOperator: '',
    };
    var mathOperations = ["addition", "subtraction", "division", "multiplication"];


    //Functions
    function checkNumber(e) {
        let number = e.target.innerText;

        if (mathOperations.includes(operation.prevOperator)) {
            screen.value = number;
        } else if (this.dataset.decimal == "decimal") {
            screen.value = screen.value + number;
        } else {
            screen.value += parseFloat(number);
        }

        e.preventDefault();
    }
    // 4 + 5 * 3 - 2
    function operator(e) {
        let currentValue = parseFloat(screen.value);
        operation.prevOperator = (operation.prevOperator == "") ? this.dataset.operation : operation.currentOperator;
        operation.currentOperator = this.dataset.operation;

        if (operation.first !== null && operation.result > 0) {
            operation.second = currentValue;
        }

        if (operation.result <= 0) {
            operation.first = currentValue;
            operation.result = currentValue;
            screen.value = '';
        }

        if (operation.second !== null) {
            operation.result = doOperation(operation.prevOperator, operation.first, operation.second);
            screen.value = operation.result;
            operation.first = operation.result;
        }

        e.preventDefault();
    }

    function doOperation(operator, firstValue, secondValue) {
        let result = 0;
        switch (operator) {
            case "addition":
                result = firstValue + secondValue;
                break;
            case "subtraction":
                result = firstValue - secondValue;
                break;
            case "division":
                result = firstValue / secondValue;
                break;
            case "multiplication":
                result = firstValue * secondValue;
                break;
        }

        return Number.isInteger(result) ? result : parseFloat(result).toFixed(2);
    }

    function calculate(e) {
        let result = doOperation(operation.currentOperator, operation.result, parseFloat(screen.value));
        resetAll();
        screen.value = result;

        e.preventDefault();
    }

    function resetAll() {
        screen.value = '';
        operation = {
            first: null,
            second: null,
            result: 0,
            currentOperator: "",
            prevOperator: '',
        }
    }


    //Events
    numbers.forEach(number => number.addEventListener('click', checkNumber));
    symbols.forEach(operation => operation.addEventListener('click', operator));
    result.addEventListener('click', calculate);
    reset.addEventListener('click', resetAll);
})();