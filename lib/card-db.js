// Imports
var { Request } = require('sdk/request');


// Constants
var netrunnerDB = 'http://netrunnerdb.com';
var synonymsUrl = 'https://raw.githubusercontent.com/brianrainey/special-order-synonyms/master/cards.json';
var synonymList = null;
var cardListUrl = 'http://netrunnerdb.com/api/cards/';
var cardList    = null;


/**
 * Loads initial card data and synonyms, invokes callback when
 * complete.
 */
function initialize(callback) {
  Request({
    url: cardListUrl,
    onComplete: function (response) {
      saveCardList(response, callback);
    }
  }).get();
}

/**
 * Persists card list retrieved from API and proceed to synonym list.
 */
function saveCardList(response, callback) {
  if (response.status === 200) {
    cardList = response.json;
    Request({
      url: synonymsUrl,
      onComplete: function(response) {
        saveSynonymsList(response, callback);
      }
    }).get();
  }
}

/**
 * Persists list of card synonyms and invokes callback to signify
 * initialization complete.
 */
function saveSynonymsList(response, callback) {
  if (response.status === 200) {
    synonymList = JSON.parse(response.text);
    callback();
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
  return string.replace(/((Jinteki)|(NBN)|(Haas-Bioroid)|(HB)|(Weyland Consortium)):\s*/, '')
               .replace(/^the\s+/i, '')
               .replace(/:.*$/, '')
               .replace(/[\s-.,;"'!?*‘’“”]/g, '')
               .replace(/s$/, '')
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

/**
 * Searches database for a card matching the provided text. If
 * successful, returns object containing the path to the image, and
 * the side (Corp or Runner).
 */
function findCard(searchText) {
  for each (card in cardList) {
    if (exactMatch(searchText, card.title) || synonymMatch(searchText, card.title)) {
      var imagesrc;
      if (card.imagesrc != '') {
        imagesrc = netrunnerDB + card.imagesrc;
      }
      return({
        imagesrc: imagesrc,
        side: card.side,
        url: card.url
      });
    }
  }
  return null;
}

// Export the public functions.
exports.initialize = initialize;
exports.findCard = findCard;
