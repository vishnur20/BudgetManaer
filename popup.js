let state = {};
let budgetExeededNotifyOption = {
    type: 'basic',
    iconUrl: './icon48.png',
    title: 'Budget exeeded',
    message: 'Your spent more than your budget!'
};

const populateData = () => {
    let {alertMessage, budget, amountSpent} = state;
    $("#disp_exceedAlert").text("" + alertMessage);
    $("#disp_budget").text("" + budget);
    $("#disp_amountSpent").text("" + amountSpent);
};

const isBudgetExceeded = () => {
    return state.amountSpent > state.budget ? true : false;
};

const handleReset = () => {
    state = {
        alertMessage: "",
        budget: 0,
        amountSpent: 0,
    };
    populateData(state);
    $("#input").val("");
    chrome.storage.sync.set({state: state}, () => {
        let resetNotifyOption = {
            type: 'basic',
            iconUrl: './icon48.png',
            title: 'Reset Successful',
            message: 'BudgetManager has been reset to "0".'
        };
        chrome.notifications.create('resetNotify', resetNotifyOption);
    });
};

const handleSetBudget = () => {
    const newBudget = $("#input").val();
    if (newBudget === "") {
        window.alert("Enter valid amount!");
        return;
    }
    state.budget = parseInt(newBudget);
    console.log(state);
    state.alertMessage = isBudgetExceeded()
        ? "Alert: Exceeds budget by " + (state.budget - state.amountSpent) * (-1)
        : "";
    if(isBudgetExceeded()) {
        console.log('budget exceeded!!!');
        chrome.notifications.create('budgetExeededNotify', budgetExeededNotifyOption);
    }

    populateData(state);
    $("#input").val("");
    chrome.storage.sync.set({state: state});
};

const handleAddition = () => {
    const amt = $("#input").val();
    if (amt === "") {
        window.alert("Enter valid amount!");
        return;
    }
    state.amountSpent += parseInt(amt);
    state.alertMessage = isBudgetExceeded()
        ? "Alert: Exceeds budget by " + (state.budget - state.amountSpent) * (-1)
        : "";
    if(isBudgetExceeded()) {
        console.log('budget exceeded!!!');
        chrome.notifications.create('budgetExeededNotify', budgetExeededNotifyOption);
    }

    populateData();
    $("#input").val("");
    chrome.storage.sync.set({state: state});
};

const handleSubtraction = () => {
    const amt = $("#input").val();
    if (amt === "") {
        window.alert("Enter valid amount!");
        return;
    }
    state.amountSpent -= amt;
    state.alertMessage = isBudgetExceeded()
        ? "Alert: Exceeds budget by " + (state.budget - state.amountSpent) * (-1)
        : "";
    if(isBudgetExceeded()) {
        console.log('budget exceeded!!!');
        chrome.notifications.create('budgetExeededNotify', budgetExeededNotifyOption);
    }

    populateData();
    $("#input").val("");
    chrome.storage.sync.set({state: state});
};

$(document).ready(() => {
    // retrive state obj. from memory, if there
    chrome.storage.sync.get("state", (chromeStorage) => {
        if (chromeStorage.state) {
            state = chromeStorage.state;
            console.log("state taken from mem");
            console.log(state);
            populateData(state);
        } else {
            state = {
                alertMessage: "",
                budget: 0,
                amountSpent: 0,
            };
            chrome.storage.sync.set({state: state});
        }
    });

    const btn_reset = $("#btn_reset");
    const btn_setBudget = $("#btn_setBudget");
    const btn_add = $("#btn_add");
    const btn_sub = $("#btn_sub");

    btn_reset.click(handleReset);
    btn_setBudget.click(handleSetBudget);
    btn_add.click(handleAddition);
    btn_sub.click(handleSubtraction);
});
