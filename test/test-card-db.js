var test     = require("sdk/test");
var carddb   = require("./card-db");

exports["test search"] = function(assert) {
  assert.ok(carddb.findCard("Account Siphon"), "Simple search failed.");
};

carddb.initialize.then(test.run(exports));

