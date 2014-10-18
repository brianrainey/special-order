var cardImage = document.getElementById("cardImage");

self.port.on("show-card", function(cardSource) {
  cardImage.src = cardSource;
});
