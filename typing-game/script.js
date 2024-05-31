const allowedKeys = [
    'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l',
    'm', 'n', 'o', 'p', 'q', 'r',
    's', 't', 'u', 'v', 'w', 'x',
    'y', 'z', ' '
];

const API_URL = 'http://localhost:5000/submit';

let testExpired = false;

const words = "veteran squeeze publication berry spill leaflet maximum structure hostility value crash main behead agriculture thirsty gallon possible requirement panel level can good drag guilt radiation repetition murder wrestle pie scheme council retreat snap chimney consultation hunter experience agreement self dream enjoy market application projection win makeup chair as false pay adventure tent liberty energy principle selection attract motorist authorise cash praise publisher railcar stain fitness steak chauvinist vertical conversation encourage dirty rational pour basket half bed lock maid pasture sofa coup last suntan corner leaflet judgment possession head wear freight engagement foreigner exact value video snub proportion professional elaborate revolutionary flex dozen chest exaggerate liver drag orange contribution arrow respect identity glimpse laborer economist wrong disappointment widen control normal black wonder appearance conversation outline bank sample appear shiver missile use censorship rough castle egg warning treatment fleet reign horse creation course hesitate old feminist teach flash split paragraph total royalty";

const spanWrappedWords = words.split('').map(w => `<span style="font-size: 35px;">${w}</span>`).join('');

const typingField = document.getElementById("typingField");

typingField.innerHTML = spanWrappedWords;

let timeElapsed = 0;

let startingTime = 0;

let gameCursorIndex = 0;

let timeoutKeeper = null;

let numberOfLettersTyped = 0;

let numberOfLettersCorrectlyTyped = 0;

const showSpeedAndAccuracy = () => {

    testExpired = true;

    console.log("numberOfLettersTyped*100000/(5*(Date.now() - startingTime)) is ", numberOfLettersTyped*100000/(5*(Date.now() - startingTime)));

    const wpm = startingTime === 0 ? "infinite!" : numberOfLettersTyped*100000/(9*(Date.now() - startingTime));
    const accuracy = parseInt(numberOfLettersCorrectlyTyped*100/numberOfLettersTyped);

    typingField.innerHTML = null;

    const speedElement = document.createElement("h1");
    const accuracyElement = document.createElement("h1");

    speedElement.style.color = '#2e2e2e';
    speedElement.style.fontSize = '50px';
    accuracyElement.style.color = '#2e2e2e';
    accuracyElement.style.fontSize = '50px';

    speedElement.innerText = `Speed: ${parseInt(wpm)}WPM`;
    accuracyElement.innerText = `Accuracy: ${accuracy}%`;

    typingField.appendChild(speedElement);
    typingField.appendChild(accuracyElement);

    const teammate = new URLSearchParams(window.location.search).get('teammate')

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            teammate,
            wpm,
            accuracy,
            keystrokes: numberOfLettersTyped
        })
    }).catch((e) => {
        console.log("error occurred while submitting request - ", e);
        const errorText = document.createElement('p');
        errorText.innerText = 'Could not submit score :(';
        errorText.style.fontSize = '16px';
        errorText.style.color = 'red';
        typingField.appendChild(errorText);
    });
}

/**
 * @param {KeyboardEvent} e 
 */
const keyDownEventHandler = (e) => {
    if(testExpired) return;

    if(gameCursorIndex === words.length) {
        // kill timeKeeper
        clearTimeout(timeoutKeeper);
        // show speed and accuracy
        showSpeedAndAccuracy();
    }

    if(e.key === "Backspace" && gameCursorIndex > 0) {
        // move the cursor back
        gameCursorIndex = gameCursorIndex - 1;

        // if character colour is green, it is correctly typed
        // so reduce correctly corrected letters by one
        if(typingField.children[gameCursorIndex].style.color === "green")
            numberOfLettersCorrectlyTyped = numberOfLettersCorrectlyTyped - 1;

        // bring back character's colour to #ccc (which is actually the parent's text colour)
        typingField.children[gameCursorIndex].style.color = null;

        // move cursor back visually
        typingField.children[gameCursorIndex].style.backgroundColor = "#2e2e2e";
        typingField.children[gameCursorIndex + 1].style.backgroundColor = null;

        // reduce number of letters typed
        numberOfLettersTyped = numberOfLettersTyped - 1;
    }

    // if key is not in allowed keys, don't even bother going ahead
    if(!allowedKeys.includes(e.key)) return;

    // if at 0th letter and the key is incorrect, don't start the thing
    if(
        gameCursorIndex === 0 &&
        e.key !== words[0]
    ) return;

    if(timeoutKeeper ===null) {
        startingTime = Date.now();
        timeoutKeeper = setTimeout(() => {
            // change the div contents to empty thing
            showSpeedAndAccuracy();
        }, 5000);
    }

    if(words[gameCursorIndex] === e.key) {
        // update text colour to green if the key is correct
        typingField.children[gameCursorIndex].style.color="green";
        numberOfLettersCorrectlyTyped = numberOfLettersCorrectlyTyped + 1;
    } else {
        // update text colour to red if the key is incorrect
        typingField.children[gameCursorIndex].style.color="red";
    }

    numberOfLettersTyped = numberOfLettersTyped + 1;

    // actually move the cursor ahead
    gameCursorIndex = gameCursorIndex + 1;

    // move cursor ahead visually
    typingField.children[gameCursorIndex].style.backgroundColor = "#2e2e2e";
    typingField.children[gameCursorIndex - 1].style.backgroundColor = null;
}

window.onkeydown = keyDownEventHandler;