// Imports =============================================

var { ToggleButton } = require('sdk/ui/button/toggle');
var { Panel }        = require('sdk/panel');
var { Request }      = require('sdk/request');
var { Hotkey }       = require("sdk/hotkeys");
var self             = require("sdk/self")
var selection        = require('sdk/selection');


// Globals ============================================

var netrunnerDB = 'http://netrunnerdb.com';
var synonymsUrl = "https://raw.githubusercontent.com/brianrainey/special-order-synonyms/master/cards.json";
var synonymList = null;
var cardListUrl = 'http://netrunnerdb.com/api/cards/';
var cardList    = null;


// Retrieve card data ================================

Request({
  url: cardListUrl,
  onComplete: saveCardList
}).get();

Request({
  url: synonymsUrl,
  onComplete: saveSynonymsList
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
  disabled: true,
  onChange: showPanel
});

var panel = Panel({
  width: 300,
  height: 418,
  contentURL: self.data.url("card-renderer.html"),
  contentScriptFile: self.data.url("card-renderer.js"),
  onHide: handleHide
});

var showHotKey = Hotkey({
  combo: "control-alt-s",
  onPress: showPanel
});

selection.on('select', function() {
  setContentUrl(selection.text)
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
  reset();
}

/**
 * Resets the icons and content URL
 */
function reset() {
  button.icon = {
    '16': './click-16.png',
    '32': './click-32.png',
    '64': './click-64.png'
  };
  button.disabled = true;
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
 * Persists list of card synonyms
 */
function saveSynonymsList(response) {
  if (response.status === 200) {
    synonymList = JSON.parse(response.text);
  }
}

/**
 * Checks if a card matches the current selection.  If so, set the
 * card displayed in the panel and color of the icon (blue for Corp,
 * red for Runner) accordingly.
 */
function setContentUrl(selectedText) {
  for each (card in cardList) {
    if (exactMatch(selectedText, card.title) || synonymMatch(selectedText, card.title)) {
      panel.port.emit("show-card", netrunnerDB + card.imagesrc);
      if (card.side === 'Runner') {
        button.icon = {
          '16': './click-red-16.png',
          '32': './click-red-32.png',
          '64': './click-red-64.png'
        };
      }
      else {
        button.icon = {
          '16': './click-blue-16.png',
          '32': './click-blue-32.png',
          '64': './click-blue-64.png'
        };
      }
      button.disabled = false;
      break;
    }
  }
}

/**
 * Cleans up card names by:
 * - Remove the corp name from IDs (Jinteki: Personal Evolution -> Personal Evolution)
 * - Removing "the" from the start (The Helpful AI -> Helpful AI)
 * - Removing anything after a colon (Exile: Streethawk -> Exile)
 * - Removing punctuation (Shock! -> Shock)
 * - De-pluralising (Hedge Funds -> Hedge Fund)
 * - Converting to lower case
 */
function strip(string) {
  return string.replace(/((Jinteki)|(NBN)|(Haas-Bioroid)|(HB)|(Weyland Consortium)):\s*/, "")
               .replace(/^the\s+/i, "")
               .replace(/:.*$/, "")
               .replace(/[\s-.,;"'!?*]/g, "")
               .replace(/s$/, "")
               .toLowerCase();
}

/**
* Returns true if the selection, minus punctuation and spaces, equals
* the supplied card name.
*/
function exactMatch(selectedText, cardTitle) {
  return strip(selectedText) === strip(cardTitle);
}

/**
 * Returns true if the provided text is one of the defined synonyms
 * for the provided full card name.
 */
function synonymMatch(selectedText, cardTitle) {
  for each (synonym in synonymList[cardTitle]) {
    if (strip(synonym) === strip(selectedText)) {
      return true;
    }
  }
  return false;
}
