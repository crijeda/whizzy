Meteor.publish('newsBrands.forUser', function(articleId) {
  check(articleId, String);
  var agency = Agencies.findOne({ $or: [ { adminsIds: this.userId }, { executivesIds: this.userId } ] });
  var group = Groups.findOne({ agencyId: agency._id });

  //Revisar aqui

  if (!agency) {
    return [];
  }

  if (NewsBrands.find({ articleId: articleId, agencyId: agency._id }).count() == 0) {
    console.log('creating news brands');
    NewsBrands.insert({ articleId: articleId, agencyId: agency._id });
  }

  return [NewsBrands.find({ articleId: articleId }),Brands.find({groupId:group._id}),Campaigns.find({groupId:group._id})];
});
