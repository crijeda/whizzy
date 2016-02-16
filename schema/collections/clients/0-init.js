if (Meteor.isClient) {
  orion.links.add({
    identifier: 'clients',
    title: 'Marcas',
    index: 11,
    permission: 'collections.groups.index'
  });
}
