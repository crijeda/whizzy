if (Meteor.isClient) {
  orion.links.add({
    identifier: 'mediums',
    title: 'Medios',
    index: 12,
    permission: 'collections.mediums.index'
  });

  orion.links.add({
    identifier: 'mediums-admin',
    title: 'Admin',
    parent: 'mediums',
    index: 1,
    permission: 'collections.suplements_zones.index'
  });
}
