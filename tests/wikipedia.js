var test = require('tape');
var Wikipedia = require('../server/services/wikipedia');
var wiki = new Wikipedia();

test('Can get philosophy page', function (t) {
  var url = 'https://en.wikipedia.org/wiki/Philosophy';

  wiki.getPage(url)
    .then(function (page) {
      t.equals(page.title, 'Philosophy');
      t.equals(page.url, url);
      t.equals(page.firstLink, 'https://en.wikipedia.org/wiki/Greek_language');

      t.end();
    })
});

test('Can get from philosophy to greek', function (t) {
  var a = 'https://en.wikipedia.org/wiki/Philosophy';
  var b = 'https://en.wikipedia.org/wiki/Modern_Greek';

  wiki.getPagesBetween(a, b)
    .then(function (pages) {
      t.equals(pages[0].title, 'Philosophy');
      t.equals(pages[1].title, 'Greek language');
      t.equals(pages[2].title, 'Modern Greek');

      t.end();
    })
});
