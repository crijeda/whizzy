ExecutiveRole = new Roles.Role('ejecutivo');

/**
 * Groups
 */
ExecutiveRole.allow('collections.groups.index', true); // Allows the role to see the link in the sidebar
ExecutiveRole.helper('collections.groups.indexFilter', function() {
  var myAgenciesIds = _.pluck(Agencies.find({ executivesIds: this.userId }).fetch(), '_id');
  return { agencyId: { $in: myAgenciesIds } };
});
ExecutiveRole.helper('clients.myGroups', function() {
  var myAgenciesIds = _.pluck(Agencies.find({ executivesIds: this.userId }).fetch(), '_id');
  return { agencyId: { $in: myAgenciesIds } };
});

/**
 * Brands
 */
ExecutiveRole.allow('collections.brands.index', true); // Allows the role to see the link in the sidebar
ExecutiveRole.helper('clients.myBrands', function() {
  return { executivesIds: this.userId };
});
ExecutiveRole.helper('collections.brands.indexFilter', function() {
  return { executivesIds: this.userId };
});

/**
 * News
 */
ExecutiveRole.allow('collections.news.index', true); // Allows the role to see the link in the sidebar
ExecutiveRole.allow('collections.news.insert', true); // Allows the role to insert documents
ExecutiveRole.allow('collections.news.update', true); // Allows the role to update documents
ExecutiveRole.allow('collections.news.remove', true); // Allows the role to remove documents
ExecutiveRole.allow('collections.news.showCreate', true); // Makes the "create" button visible
ExecutiveRole.allow('collections.news.showUpdate', true); // Allows the user to go to the update view
ExecutiveRole.allow('collections.news.showRemove', true); // Shows the delete button on the update view
ExecutiveRole.helper('collections.news.indexFilter', function() {
  var brandsIds = _.pluck(Brands.find({ executivesIds: this.userId }).fetch(), '_id');
  return { brandsIds: { $in: brandsIds } };
});
AgencyRole.helper('collections.news.forbiddenFields', ['groupsIds', 'brandsIds']);
