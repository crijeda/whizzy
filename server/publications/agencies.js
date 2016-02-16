Meteor.publish(null, function() {
  if (!Roles.userHasRole(this.userId, 'agencia') && !Roles.userHasRole(this.userId, 'ejecutivo')) {
    return [];
  }
  return Agencies.find({ $or: [{ adminsIds: this.userId }, { executivesIds: this.userId }] });
})

Meteor.publish(null, function() {
  if (!Roles.userHasRole(this.userId, 'cliente')) {
    return [];
  }
  var myGroupsIds = _.pluck(Brands.find({ clientsIds: this.userId }).fetch(), 'groupId');
  var myAgenciesIds = _.pluck(Groups.find({ _id: { $in: myGroupsIds } }).fetch(), 'agencyId');
  return Agencies.find({ _id: { $in: myAgenciesIds } });
})
