Template.sidebar.helpers({
  agency: function() {
    return Agencies.findOne();
  },
  showAgencyLogo: function() {
    return _.contains(Meteor.user().roles(), 'agencia') || _.contains(Meteor.user().roles(), 'ejecutivo') || _.contains(Meteor.user().roles(), 'cliente')
  }
})
