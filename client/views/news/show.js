Template.collectionsNewsShow.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('mediums', Router.current().params._id);
    self.subscribe('newsData.forUser', Router.current().params._id);
    self.subscribe('news.article', Router.current().params._id);
  })
});

Template.collectionsNewsShow.helpers({
  article: function() {
    return News.findOne(Router.current().params._id);
  },
  medium: function() {
    var article = News.findOne(Router.current().params._id).dataForUser(Meteor.userId());
    return Mediums.findOne({ _id: article.mediumId });
  },
  suplement: function() {
    var article = News.findOne(Router.current().params._id).dataForUser(Meteor.userId());
    return Suplements.findOne({ _id: article.suplementId });
  },
  type: function() {
    var article = News.findOne(Router.current().params._id).dataForUser(Meteor.userId());
    return SuplementsTypes.findOne(article.typeId).name;
  },
  data: function() {
    return News.findOne(Router.current().params._id).dataForUser(Meteor.userId());
  }
});
