Package.describe({
  name: 'file-watch',
  version: '1.0.0',
});

Npm.depends({
  'iconv-lite': '0.4.11'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['meteor-platform']);

  api.addFiles('watch.js', 'server');

  api.export('FileWatch');
});
