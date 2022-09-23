// background.js

chrome.runtime.onInstalled.addListener(() => {
    console.log('installed');

    let counter = 0;
    setInterval(() => {
        console.log(++counter);
    }, 1000);
});