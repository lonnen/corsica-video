/* Description:
 *   detects image MIME-types and presents the image more attractively.
 *
 * Author:
 *    potch, mythmon
 */

var nodeUtils = require('util');
var Promise = require('es6-promise').Promise;
var fs = require('fs');
var path = require('path');


var request;
var template = fs.readFileSync(path.join(__dirname,'template.html')).toString();

module.exports = function (corsica) {
  request = corsica.request;

  corsica.on('content', function(content) {
    if (!('url' in content)) {
      return content;
    }

    var bgColor = content.bg || '#000';

    return new Promise(function(resolve, reject) {
      request.head(content.url, function (error, response, body) {
        if (error) {
          resolve(content);
          return;
        }
        var contentType = response.headers['content-type'] || '';
        var mime = contentType.split('/');
        if (mime[0] === 'video') {
          content.type = 'html';
          content.content = template.replace('{{ url }}', content.url);
        }
        resolve(content);
      });
    });
  });
};