AgencyRole = new Roles.Role('agencia');

AgencyRole.allow('dashboard.show', true);

/**
 * Users
 */
AgencyRole.allow('accounts.index', true);
AgencyRole.allow('accounts.showCreate', true);
AgencyRole.allow('accounts.create', true);
AgencyRole.helper('accounts.allowedRoles', function() {
  return ['cliente', 'ejecutivo'];
});

// Index filter
AgencyRole.helper('accounts.indexFilter', function() {
  var agencies = Agencies.find({ adminsIds: this.userId }).fetch();
  var agencyAdmins = _.flatten(_.pluck(agencies, 'adminsIds'));
  var agencyExecutives = _.flatten(_.pluck(agencies, 'executivesIds'));

  var agencyGroups = _.flatten(_.pluck(agencies, 'groupsIds'));
  var groups = Groups.find({ _id: { $in: agencyGroups } }).fetch();

  var groupsIds = _.pluck(groups, '_id');
  var brands = Brands.find({ groupId: { $in: groupsIds } }).fetch();

  var clientsIds = _.flatten(_.pluck(brands, 'clientsIds'));

  var userIds = _.union(clientsIds, agencyAdmins, agencyExecutives);
  return { _id: { $in: userIds } };
});


/**
 * Agencies
 */
AgencyRole.allow('collections.agencies.index', true); // Allows the role to see the link in the sidebar
AgencyRole.allow('collections.agencies.insert', false); // Allows the role to insert documents
AgencyRole.allow('collections.agencies.update', true); // Allows the role to update documents
AgencyRole.allow('collections.agencies.remove', false); // Allows the role to remove documents
AgencyRole.allow('collections.agencies.showCreate', false); // Makes the "create" button visible
AgencyRole.allow('collections.agencies.showUpdate', true); // Allows the user to go to the update view
AgencyRole.allow('collections.agencies.showRemove', false); // Shows the delete button on the update view
AgencyRole.helper('collections.agencies.indexFilter', function() {
  return { adminsIds: this.userId };
});
AgencyRole.helper('collections.agencies.forbiddenFields', function() {
  return ['adminsIds'];
});


/**
 * Groups
 */
AgencyRole.allow('collections.groups.index', true); // Allows the role to see the link in the sidebar
AgencyRole.allow('collections.groups.insert', false); // Allows the role to insert documents
AgencyRole.allow('collections.groups.update', true); // Allows the role to update documents
AgencyRole.allow('collections.groups.remove', false); // Allows the role to remove documents
AgencyRole.allow('collections.groups.showCreate', false); // Makes the "create" button visible
AgencyRole.allow('collections.groups.showUpdate', true); // Allows the user to go to the update view
AgencyRole.allow('collections.groups.showRemove', false); // Shows the delete button on the update view
AgencyRole.helper('collections.groups.indexFilter', function() {
  var myAgenciesIds = _.pluck(Agencies.find({ adminsIds: this.userId }).fetch(), '_id');
  return { agencyId: { $in: myAgenciesIds } };
});
AgencyRole.helper('collections.groups.forbiddenFields', function() {
  return ['agencyId'];
});
AgencyRole.helper('clients.myGroups', function() {
  var myAgenciesIds = _.pluck(Agencies.find({ adminsIds: this.userId }).fetch(), '_id');
  return { agencyId: { $in: myAgenciesIds } };
});

/**
 * Brands
 */
AgencyRole.allow('collections.brands.index', true); // Allows the role to see the link in the sidebar
AgencyRole.allow('collections.brands.insert', false); // Allows the role to insert documents
AgencyRole.allow('collections.brands.update', true); // Allows the role to update documents
AgencyRole.allow('collections.brands.remove', false); // Allows the role to remove documents
AgencyRole.allow('collections.brands.showCreate', false); // Makes the "create" button visible
AgencyRole.allow('collections.brands.showUpdate', true); // Allows the user to go to the update view
AgencyRole.allow('collections.brands.showRemove', false); // Shows the delete button on the update view
AgencyRole.helper('clients.myBrands', {});
AgencyRole.helper('collections.brands.indexFilter', function() {
  var myAgenciesIds = _.pluck(Agencies.find({ adminsIds: this.userId }).fetch(), '_id');
  var groupsIds = _.pluck(Groups.find({ agencyId: { $in: myAgenciesIds } }).fetch(), '_id');
  return { groupId: { $in: groupsIds } };
});
AgencyRole.helper('collections.brands.forbiddenFields', function() {
  return ['groupId'];
});

/**
 * News
 */
AgencyRole.allow('collections.news.index', true); // Allows the role to see the link in the sidebar
AgencyRole.allow('collections.news.insert', true); // Allows the role to insert documents
AgencyRole.allow('collections.news.update', true); // Allows the role to update documents
AgencyRole.allow('collections.news.remove', true); // Allows the role to remove documents
AgencyRole.allow('collections.news.showCreate', true); // Makes the "create" button visible
AgencyRole.allow('collections.news.showUpdate', true); // Allows the user to go to the update view
AgencyRole.allow('collections.news.showRemove', true); // Shows the delete button on the update view
AgencyRole.helper('collections.news.indexFilter', function() {
  var myAgenciesIds = _.pluck(Agencies.find({ adminsIds: this.userId }).fetch(), '_id');
  var groupsIds = _.pluck(Groups.find({ agencyId: { $in: myAgenciesIds } }).fetch(), '_id');
  var brandsIds = _.pluck(Brands.find({ groupId: { $in: groupsIds } }).fetch(), '_id');
  return { brandsIds: { $in: brandsIds } };
});

/**
 * Campaigns
 */
AgencyRole.allow('collections.campaigns.index', true); // Allows the role to see the link in the sidebar
AgencyRole.allow('collections.campaigns.insert', true); // Allows the role to insert documents
AgencyRole.allow('collections.campaigns.update', true); // Allows the role to update documents
AgencyRole.allow('collections.campaigns.remove', true); // Allows the role to remove documents
AgencyRole.allow('collections.campaigns.showCreate', true); // Makes the "create" button visible
AgencyRole.allow('collections.campaigns.showUpdate', true); // Allows the user to go to the update view
AgencyRole.allow('collections.campaigns.showRemove', true); // Shows the delete button on the update view
AgencyRole.helper('collections.campaigns.indexFilter', function() {
   var myAgenciesIds = _.pluck(Agencies.find({ adminsIds: this.userId }).fetch(), '_id');
   var groupsIds = _.pluck(Groups.find({ agencyId: { $in: myAgenciesIds } }).fetch(), '_id');
   var brandsIds = _.pluck(Brands.find({ groupId: { $in: groupsIds } }).fetch(), '_id');
   return { brandId: { $in: brandsIds } };
});
