// Imports =============================================

var { ToggleButton } = require('sdk/ui/button/toggle');
var { Panel }        = require('sdk/panel');
var { Request }      = require('sdk/request');
var { Hotkey }       = require("sdk/hotkeys");
var selection        = require('sdk/selection');


// Globals ============================================

var netRunnerDB = 'http://netrunnerdb.com';
var cardListUrl = 'http://netrunnerdb.com/api/cards/';
var cardList    = null;


// Retrieve card data ================================

Request({
    url: cardListUrl,
    onComplete: saveCardList
}).get();


// UI Elements ========================================

var button = ToggleButton({
    id: 'so-button',
    label: 'Special Order',
    icon: {
        '16': './click-16.png',
        '32': './click-32.png',
        '64': './click-64.png'
    },
    onChange: showSelectedCard
});

var panel = Panel({
    width: 300,
    height: 418,
    onHide: handleHide
});

var showHotKey = Hotkey({
    combo: "control-alt-s",
    onPress: showSelectedCard
});


// Functions ==========================================

/** 
 * Displays the panel, contents already set 
 */
function showPanel() {
    panel.show({
        position: button
    });
}

/** 
 * Hides the panel after escape / clicking elsewhere 
 */
function handleHide() {
    button.state('window', {checked: false});
    panel.contentURL = null;
}

/**
 * Persists card list retrieved from API
 */
function saveCardList(response) {
    if (response.status === 200) {
        cardList = response.json;
    }
}

/**
 * Finds card in list that matches user selection.
 */
function showSelectedCard() {
    for each (card in cardList) {
        if (card.title.toLowerCase() === selection.text.trim().toLowerCase()) {
            panel.contentURL = netRunnerDB + card.imagesrc;
            break;
        }
    }
    showPanel();
}
