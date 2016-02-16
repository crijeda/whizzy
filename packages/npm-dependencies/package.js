Package.describe({
  name: 'npm-dependencies',
  version: '1.0.0',
});

Npm.depends({
  'excel-export': '0.4.1',
  'joadr-officegen': '0.3.0',
  'pdfkit': '0.7.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['meteor-platform']);

  api.addFiles('export.js', 'server');

  api.export('Excel', 'server');
  api.export('Officegen', 'server');

  api.use(['underscore'], 'server');
  api.export('PDFDocument');
  api.add_files(['pdfkitWrapper.js'], 'server');
  //api.export();

});
