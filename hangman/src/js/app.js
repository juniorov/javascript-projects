(function () {

    //UI
    const lettersUI = document.querySelector('.wp-letters');
    const resultUI = document.querySelector('.result');
    const attempsUI = document.querySelector('.card-title');
    const messageUI = document.querySelector('.message');

    //data
    const alphabet = { 65: "A", 66: "B", 67: "C", 68: "D", 69: "E", 70: "F", 71: "G", 72: "H", 73: "I", 74: "J", 75: "K", 76: "L", 77: "M", 78: "N", 79: "O", 80: "P", 81: "Q", 82: "R", 83: "S", 84: "T", 85: "U", 86: "V", 87: "W", 88: "X", 89: "Y", 90: "Z" };
    var character = {
        name: [],
        fullName: "",
        image: "",
    };
    var numAttemps = 0,
        totalOpportunities = 5;

    function addAlphabet() {
        for (let index in alphabet) {
            let button = document.createElement('input');
            button.setAttribute("type", "button");
            button.setAttribute("class", "btn btn-outline-info active");
            button.setAttribute("value", alphabet[index]);
            button.dataset.key = index;
            lettersUI.appendChild(button);
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function getCharacter() {
        let status = ["alive", "dead", "unknown"];
        let random = getRandomInt(3);
        fetch(`https://rickandmortyapi.com/api/character?status=${status[random]}`)
            .then(response => response.json())
            .then(response => {
                let characterInput = response.results[getRandomInt(response.results.length)];

                createGuess(characterInput.name, characterInput.image);
            })
            .catch(err => console.debug(err));
    }

    function createGuess(name, image) {
        console.debug('Character', name);
        character.fullName = name;
        let fullName = name.split(" ");
        character.name = (fullName[0].replace(/[^a-zA-Z0-9 ]/g, '')).toUpperCase().split("");
        character.image = image;
        totalOpportunities = character.name.length;
        attempsUI.querySelector('.opportunities').textContent = totalOpportunities;

        (character.name).forEach((charac) => {
            let input = document.createElement('input');
            input.setAttribute('readonly', true);
            input.setAttribute('class', 'form-control');
            input.setAttribute('Value', '?');
            resultUI.appendChild(input);
        });
    }

    function checkGuess(e) {
        let letter = (e.key !== undefined && e.keyCode !== undefined && e.keyCode > 64 && e.keyCode < 91) ? document.querySelector(`input[data-key="${e.keyCode}"]`) : e.target,
            chanceGuess = false;

        if (letter.localName == 'input') {
            if (letter.className.includes('active')) {
                character.name.forEach((letterChar, index) => {
                    if (letterChar == letter.value) {
                        let inputFound = resultUI.querySelectorAll('input')[index];
                        inputFound.classList.remove('btn-success');
                        inputFound.classList.add('btn-success');
                        inputFound.value = letterChar;
                        chanceGuess = true;
                    }
                });

                if (!chanceGuess)
                    ++numAttemps;

                letter.setAttribute('disabled', true);
                letter.classList.add('btn-secondary');
            }
        }

        messageUI.textContent = `Attemps: ${numAttemps}`;
        attempsUI.querySelector('.opportunities').textContent = --totalOpportunities;

        if (numAttemps == 3) {
            messageUI.classList.add('alert-danger');
            messageUI.textContent = "Sorry you lost";
        }

        if (resultUI.querySelectorAll('.btn-success').length == character.name.length) {
            document.querySelector('.wp-img img').src = character.image;
            messageUI.classList.add('alert-success');
            messageUI.innerHTML = `You win the name is: <b>${character.fullName}</b>`;
        }
    }

    function getKeyCode(e) {
        if (e.defaultPrevented) {
            return; // Should do nothing if the default action has been cancelled
        }
        console.debug(e.key, e.keyCode);
    }

    window.addEventListener('DOMContentLoaded', () => {
        addAlphabet();
        getCharacter();
    });
    lettersUI.addEventListener('click', checkGuess);
    window.addEventListener('keydown', checkGuess);
})()