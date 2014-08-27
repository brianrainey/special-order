var selection = require("sdk/selection");

var url = "http://netrunnerdb.com/web/bundles/netrunnerdbcards/images/cards/en-large/01071.png"

var panel = require("sdk/panel").Panel({
  width: 430,
  height: 600,
  contentURL: url
});

selection.on('select', myListener);

function myListener() {
  console.log(selection.text);
  panel.show();
}
