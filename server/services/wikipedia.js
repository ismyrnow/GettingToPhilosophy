var rp = require('request-promise');
var _ = require('lodash');

function getPagesBetween(a, b) {
  var pages = [];
  var page = null;

  return new Promise(function (resolve, reject) {

    (function getPageRecursive(url) {

      getPage(url).then(function (page) {
        console.log(page);

        var isDuplicate = _.find(pages, { url: page.url });
        var isB = page.url === b;

        if (isDuplicate || isB) {
          pages.push(page);
          return resolve(pages);
        } else {
          pages.push(page);
          getPageRecursive(page.firstLink);
        }
      });

    }(a));

  });
}

function getPage(url) {
  return rp(url).then(function (html) {
    var title = getTitle(html);
    var firstLink = getFirstLink(html);

    return {
      title: title,
      url: url,
      firstLink: firstLink
    };
  });
}

function getTitle(html) {
  var matches = html.match(/<title>(.*?) - .*?<\/title>/);
  var title = matches[1];

  return title;
}

function getFirstLink(html) {
  // Get the first wiki link in the body.
  // Note: [\s\S] matches all characters, including a newline and spaces.
  var matches = html.match(/ id="bodyContent" [\s\S]*?<p>(?!<\/p>)[\s\S]*?<a href="(\/wiki\/[\s\S]*?)"/i);
  var firstLink = matches && matches.length && matches[1];

  if (firstLink) {
    return 'https://en.wikipedia.org' + firstLink;
  } else {
    return null;
  }
}

exports.getPage = getPage;
exports.getPagesBetween = getPagesBetween;
