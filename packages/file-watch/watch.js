var fs = Npm.require('fs');
var path = Npm.require('path');
var iconv = Npm.require('iconv-lite');

FileWatch = {};

console.log('filepath');

FileWatch.listen = function(directory, encoding, callback) {
  var findNextFiles = function() {
    var files = fs.readdirSync(directory);
    _.each(files, function(name) {
      if (name == '.DS_Store') {
        return;
      }
      console.log('File found waiting 50 seconds to load... ', name);
      Meteor._sleepForMs(50000);
      console.log('Reading file... ', name);

      var filePath = directory + '/' + name;

      try {
        if (name.slice(-'.xml'.length) !== '.xml') return;
        contents = iconv.decode(fs.readFileSync(filePath), encoding);

        if (callback(contents)) {
          fs.unlink(filePath);
        }
      } catch (e) {
        console.log(e.stack);
        console.trace(e);
        fs.unlink(filePath);
      }
    });

    Meteor.setTimeout(findNextFiles, 1000);
  }

  findNextFiles();
}
