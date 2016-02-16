if (Meteor.isClient) {
  orion.links.add({
    identifier: 'demographics',
    title: 'Datos Demográficos',
    index: 10,
    permission: 'collections.countries.index'
  });
}
