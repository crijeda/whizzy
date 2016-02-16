var exportNews = function(type, filter) {
  /**
   * Mira, te lo deje listo.
   * Tipo puede ser excel,powerpoint,pdf.
   *
   * Filter es el filtro que tienes que ponerle a las noticias, por ejemplo
   * var noticiasAExportar = News.find(filter);
   * así se mágico.
   *
   * El cliente no va estar subscrito a todas las noticias, asique tienes que
   * hacerlo desde el servidor.
   *
   * La informacion que llena el analista esta en otra collection pero te deje un helper
   * para que lo saques facilmente: (solo para servidor)
   * var article = News.findOne();
   * var data = article.dataForUser(__userId__);
   */

   ExportNews.insert({filter: JSON.stringify(filter), type: type, userId: Meteor.userId()}, function(error, exportable){
      console.log(exportable);
      Router.go('news.export.file', {exportable: exportable});
   });
}


ReactiveTemplates.set('collections.news.index', 'collectionsNewsIndex');
var formDep = new Tracker.Dependency();

Template.collectionsNewsIndex.onCreated(function() {
  var self = this;
  Session.set('collectionsNewsIndexLimit', 20);

  self.autorun(function() {
    formDep.depend();
    var data = AutoForm.getFormValues('collectionsNewsIndexSearchForm');
    Session.set('collectionsNewsIndexValues', data && data.insertDoc);
    if(Session.get('collectionsNewsIndexValues') != null){
      Session.set('collectionsNewsIndexValuesBackup', Session.get('collectionsNewsIndexValues'));
    } else {
      if(Session.get('collectionsNewsIndexValuesBackup') != undefined){
        Session.set('collectionsNewsIndexValues', Session.get('collectionsNewsIndexValuesBackup'));
      }
    }
  })

  self.autorun(function() {
    var limit = Session.get('collectionsNewsIndexLimit');
    var values = Session.get('collectionsNewsIndexValues');
    self.subscribe('news.search', values, limit);
    Meteor.call('countForSearch', values, function(error, response) {
      if (!error) {
        Session.set('collectionsNewsIndexCount', response);
      }
    });
  })
});

Template.collectionsNewsIndex.onRendered(function() {
  Session.set('allChecked', false);
  Session.set('selectedNews', []);
});

Template.collectionsNewsIndex.helpers({

  news: function() {
    var values = Session.get('collectionsNewsIndexValues');
    return News.find(filterForSearchObject(values, Meteor.userId()), { sort: { date: -1 } });
  },
  newsToShow: function() {
    var userId = Meteor.userId();
    var agency = Agencies.findOne({ $or: [ { adminsIds: userId }, { executivesIds: userId } ] });

    var values = Session.get('collectionsNewsIndexValues');
    var news = News.find(filterForSearchObject(values, Meteor.userId()), { sort: { date: -1 } });
    var newsIds = _.pluck(news.fetch(),'_id');

    var newsFilteredIds = _.pluck(News.find({ _id:  { $in: newsIds } }).fetch(),'_id');
    var newsHiddenIds = _.pluck(News.find({ hidden: agency._id }).fetch(),'_id');

    var newsToShow = News.find({ _id:  { $in: _.difference(newsFilteredIds,newsHiddenIds) } })

    return newsToShow;
  },
  localCount: function() {
    var values = Session.get('collectionsNewsIndexValues');
    return News.find(filterForSearchObject(values, Meteor.userId())).count();
  },
  totalCount: function() {
    return Session.get('collectionsNewsIndexCount');
  },
  canLoadMore: function() {
    var values = Session.get('collectionsNewsIndexValues');
    var localCount = News.find(filterForSearchObject(values, Meteor.userId())).count();
    return Session.get('collectionsNewsIndexCount') != localCount;
  },
  allChecked: function() {
    return Session.get('allChecked');
  },
  checkedCount: function() {
    var count = Session.get('allChecked') ? Session.get('collectionsNewsIndexCount') : Session.get('selectedNews').length;
    if (count == 1) return '1 noticia';
    if (count > 1) return count + ' noticias';
  },
  theDoc: function(){
    if(Session.get('collectionsNewsIndexValuesBackup') != null){
      return Session.get('collectionsNewsIndexValuesBackup');
    }
    return;
  }
})

Template.collectionsNewsIndex.events({
  'change select': function(event, template) {
    formDep.changed();
  },
  'blur input': function(event, template) {
    formDep.changed();
  },
  'click input[name=showToCategorize]': function(event, template) {
    formDep.changed();
  },
  'click .load-more-btn': function(event, template) {
    Session.set('collectionsNewsIndexLimit', Session.get('collectionsNewsIndexLimit') + 20);
  },
  'change .check-all': function(event, template) {
    Session.set('allChecked', event.currentTarget.checked);
  },
  'change .check-doc': function(event, template) {
    var ids = Session.get('selectedNews');
    if (event.currentTarget.checked) {
      ids.push(this._id);
      Session.set('selectedNews', ids);
    } else {
      Session.set('selectedNews', _.without(ids, this._id));
    }
  },
  'click .export-btn': function(event, template) {
    var type = $(event.currentTarget).attr('data-type');

    var values = Session.get('collectionsNewsIndexValues');
    var filter = filterForSearchObject(values, Meteor.userId());

    if (Session.get('selectedNews') && Session.get('selectedNews').length > 0) {
      filter._id = { $in: Session.get('selectedNews') };
    }

    exportNews(type, filter);
  },

  'click .btn-deletenews': function(event, template) {
    var ids = Session.get('selectedNews');

      var r = confirm('Seguro de que quieres borrar las noticias seleccionadas?');

          if(r){
            _.each(ids,function(item){
              News.remove(item);
            })
          }
  },
  
  'click td .btn-danger': function(event, template) {

    // var id = $(event.currentTarget).attr('data-newsId');
    var userId = Meteor.userId();
    var agency = Agencies.findOne({ $or: [ { adminsIds: userId }, { executivesIds: userId } ] });
    // console.log(agency)
    // console.log(this)
    var newsId = this._id;
    var hiddenArray = News.findOne({_id: newsId}).hidden;

    // console.log(hiddenArray)

    // console.log(newsId)
     var r = confirm('Seguro de que quieres borrar esta noticia?');

          if(r){

    if( (typeof hiddenArray !== 'undefined' && hiddenArray.length > 0) ){
      // console.log('this')
      hiddenArray.push(agency._id);
      News.update({_id: newsId}, {$set: {hidden: hiddenArray}});
    }else{
      // console.log('that')
      News.update({_id: newsId}, {$set: { hidden: [agency._id] } } );
    }
    // console.log(this)
  }

  },

   'click .btn-aprovenews': function(event, template) {

    var ids = Session.get('selectedNews');

    // console.log(ids);

    _.each(ids,function(item){

      News.update({_id: item}, {$set: {prevAprove: true}});

      //console.log(item)

    });
  }
});