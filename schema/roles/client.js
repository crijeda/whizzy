ClientRole = new Roles.Role('cliente');

/**
 * Groups
 */
 ClientRole.allow('collections.groups.index', true); // Allows the role to see the link in the sidebar
 ClientRole.helper('collections.groups.indexFilter', function() {
   var groupsIds = _.pluck(Brands.find({ clientsIds: this.userId }).fetch(), 'groupId');
   return { _id: { $in: groupsIds } };
 });
 ClientRole.helper('clients.myGroups', function() {
   var groupsIds = _.pluck(Brands.find({ clientsIds: this.userId }).fetch(), 'groupId');
   return { _id: { $in: groupsIds } };
 });

 /**
  * Brands
  */
ClientRole.allow('collections.brands.index', true); // Allows the role to see the link in the sidebar
ClientRole.helper('clients.myBrands', function() {
  return { clientsIds: this.userId };
});
ClientRole.helper('collections.brands.indexFilter', function() {
  return { clientsIds: this.userId };
});

/**
 * News
 */
ClientRole.allow('collections.news.index', true); // Allows the role to see the link in the sidebar
ClientRole.allow('collections.news.insert', false); // Allows the role to insert documents
ClientRole.allow('collections.news.update', false); // Allows the role to update documents
ClientRole.allow('collections.news.remove', false); // Allows the role to remove documents
ClientRole.allow('collections.news.showCreate', false); // Makes the "create" button visible
ClientRole.allow('collections.news.showUpdate', false); // Allows the user to go to the update view
ClientRole.allow('collections.news.showRemove', false); // Shows the delete button on the update view
ClientRole.helper('collections.news.indexFilter', function() {
  var brandsIds = _.pluck(Brands.find({ clientsIds: this.userId }).fetch(), '_id');
  return { brandsIds: { $in: brandsIds } };
});
ClientRole.helper('collections.news.forbiddenFields', function() {
  return [];
});
