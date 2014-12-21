var links = document.querySelectorAll('[href*="netrunnerdb.com"]')

for each (link in links) {
    link.onclick = function(mouseEvent) {
        console.log(mouseEvent);
        return false;
    }
}
