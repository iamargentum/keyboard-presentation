let intervalKeeperMap =  {};
let intervalsThatAreDone = [];

function startTimer(elementId) {
    if(
        Object.keys(intervalKeeperMap).includes(elementId) ||
        intervalsThatAreDone.includes(elementId)
    ) return;

    const timerElement = document.getElementById(elementId);

    const intervalKeeper = setInterval(() => {
        const timerText = timerElement.innerText;
        const [seconds, milliseconds] = timerText.split(":");

        const secondsInteger = parseInt(seconds);
        const millisInteger = parseInt(milliseconds);

        if(millisInteger === 99) {
            timerElement.innerText = `${secondsInteger + 1}:00`;
        } else {
            timerElement.innerText = `${secondsInteger}:${millisInteger + 1}`;
        }
    }, 10);

    intervalKeeperMap[elementId] = intervalKeeper;
}

function handleExampleClick() {
}

function stopTimer(elementId) {
    if(!Object.keys(intervalKeeperMap).includes(elementId)) return;
    
    clearInterval(intervalKeeperMap[elementId]);
    delete intervalKeeperMap[elementId];
    intervalsThatAreDone.push(elementId);
}