Meteor.publish(null, function() {
  if (!Roles.userHasRole(this.userId, 'agencia') && !Roles.userHasRole(this.userId, 'ejecutivo')) {
    return [];
  }
  var agenciesIds = _.pluck(Agencies.find({ $or: [{ adminsIds: this.userId }, { executivesIds: this.userId }] }).fetch(), '_id');
  return Groups.find({ agencyId: { $in: agenciesIds } });
});

Meteor.publish(null, function() {
  if (!Roles.userHasRole(this.userId, 'cliente')) {
    return [];
  }
  var groupsIds = _.pluck(Brands.find({ clientsIds: this.userId }).fetch(), 'groupId');
  return Groups.find({ _id: { $in: groupsIds } });
});
