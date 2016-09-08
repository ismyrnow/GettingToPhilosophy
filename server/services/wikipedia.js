var rp = require('request-promise');
var _ = require('lodash');

var mockDb = {
  getPageByUrl: function () {
    return Promise.resolve();
  },
  insertPage: function (page) {
    return page;
  }
};

/**
 * Takes a database instance, which is optional.
 * @param db {object} database with { getPageByUrl, insertPage } functions.
 */
var Wikipedia = function (db) {
  this.db = db || mockDb;
};

Wikipedia.prototype.getPagesBetween = function (a, b) {
  var self = this;
  var pages = [];
  var page = null;

  return new Promise(function (resolve, reject) {

    (function getPageRecursive(url) {

      self.getPage(url).then(function (page) {
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
};

Wikipedia.prototype.getPage = function (url) {
  var db = this.db;

  return db.getPageByUrl(url).then(function (page) {
    if (page) {
      return page;
    } else {
      return requestPage(url).then(db.insertPage);
    }
  });
};

function requestPage(url) {
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

module.exports = Wikipedia;
