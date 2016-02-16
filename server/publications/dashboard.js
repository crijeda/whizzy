Meteor.publishComposite('dashboard', {
  find: function() {
    if (!Roles.userHasPermission(this.userId, 'dashboard.show')) {
      return [];
    }
    return Agencies.find({ adminsIds: this.userId });
  },
  children: [{
    find: function(agency) {
      return Meteor.users.find({ _id: { $in: agency.executivesIds } }, { fields: { profile: 1 } });
    }
  }, {
    find: function(agency) {
      return Groups.find({ agencyId: agency._id }, { fields: { _id: 1 } });
    },
    children: [{
      find: function(group) {
        return Brands.find({ groupId: group._id }, { fields: { _id: 1, executivesIds: 1, name: 1 } });
      }
    }, {
      find: function(group) {
        return News.find({ groupsIds: group._id }, { fields: { _id: 1, brandsIds: 1, date: 1 , categorizedBy:1} });
      },
      children: [{
        find: function(article) {
          return NewsData.find({ articleId: article._id, data: { $exists : true, $ne : null } }, { fields: { _id: 1, articleId: 1 } });
        }
      }]
    }]
  }]
});
