var { ToggleButton } = require('sdk/ui/button/toggle');
var { Panel } = require('sdk/panel');
var { Request } = require('sdk/request');
var selection = require('sdk/selection');

var carlListUrl = 'http://netrunnerdb.com/api/cards/';

var cardList = null;

var button = ToggleButton({
    id: 'my-button',
    label: 'my button',
    icon: {
        '16': './click-original.png',
        '32': './click-original.png',
        '64': './click-original.png'
    },
    onChange: getCard
});

var panel = Panel({
    width: 300,
    height: 418,
    onHide: handleHide
});

function showPanel() {
    panel.show({
        position: button
    });
}

function handleHide() {
    button.state('window', {checked: false});
}

function getCard() {
    if (!cardList) {
        Request({
            url: carlListUrl,
            onComplete: saveCardList
        }).get();
    }
    else {
        showSelectedCard();
    }
}

function saveCardList(response) {
    if (response.status === 200) {
        cardList = response.json;
        showSelectedCard();
    }
}

function showSelectedCard() {
    for each (card in cardList) {
        if (card.title === selection.text.trim()) {
            panel.contentURL = 'http://netrunnerdb.com' + card.imagesrc;
            showPanel();
        }
    }
}
