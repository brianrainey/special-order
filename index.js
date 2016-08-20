// Imports
var { ToggleButton } = require('sdk/ui/button/toggle');
var { Panel }        = require('sdk/panel');
var { Hotkey }       = require('sdk/hotkeys');
var { prefs }        = require('sdk/simple-prefs');
var self             = require('sdk/self')
var selection        = require('sdk/selection');
var carddb           = require('lib/card-db');

// Initialize card DB and begin listening for text selections
carddb.initialize(beginListening);


// Toolbar button
var button = ToggleButton({
  id: 'so-button',
  label: 'Special Order (v' + self.version + ')',
  icon: {
    '16': './click-16.png',
    '32': './click-32.png',
    '64': './click-64.png'
  },
  disabled: true,
  onChange: showPanel
});

// Panel for displaying cards
var panel = Panel({
  width: 300,
  height: 418,
  contentURL: self.data.url('card-renderer.html'),
  contentScriptFile: self.data.url('card-renderer.js'),
  onHide: handleHide
});

/**
 * If the link in the panel gets clicked, hide the panel as the full
 * NetrunnerDB page gets opened.
 */
panel.port.on('card-clicked', function(){
  panel.hide();
});

// Keyboard shortcut
var showHotKey = Hotkey({
  combo: 'control-alt-s',
  onPress: showPanel
});

// After init, start listening for selections.
function beginListening() {
  selection.on('select', function() {
    if (selection.text) {
      setContentUrl(selection.text)
    }
  });
}

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
 * Resets the icons and button state
 */
function reset() {
  button.icon = {
    '16': './click-16.png',
    '32': './click-32.png',
    '64': './click-64.png'
  };
  button.disabled = true;
  panel.port.emit('load-card', './loading.png', '#');
}

/**
 * Checks if a card matches the current selection.  If so, set the
 * card displayed in the panel and color of the icon (blue for Corp,
 * red for Runner) accordingly.
 */
function setContentUrl(selectedText) {
  var card = carddb.findCard(selectedText);
  if (card && card.imagesrc) {
     panel.port.emit('load-card', card.imagesrc, card.url);
    if (prefs['autoDisplay']) {
      showPanel();
    }
    if (card.side === 'runner') {
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
  }
}
