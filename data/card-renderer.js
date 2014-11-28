var cardImage = document.getElementById('cardImage');
var cardLink = document.getElementById('cardLink');

self.port.on('show-card', function(cardSource, cardUrl) {
  cardImage.src = cardSource;
  cardLink.href = cardUrl;
});

cardLink.addEventListener('click', function(ev){
    self.port.emit('card-clicked');
});
