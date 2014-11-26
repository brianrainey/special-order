var cardImage = document.getElementById("cardImage");
var cardLink = document.getElementById("cardLink");

self.port.on("show-card", function(cardSource, cardUrl) {
  cardImage.src = cardSource;
  cardLink.href = cardUrl;
});
