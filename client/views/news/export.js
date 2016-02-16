Template.newsExport.events({
  'click .create-btn': function () {
    $('#newsExportForm').submit();
  }
});

AutoForm.addHooks('newsExportForm', {
  onSuccess: function(formType, result) {
    Router.go('news.export.file', {exportable: result});
    //RouterLayer.go(this.collection.indexPath());
  }
});
