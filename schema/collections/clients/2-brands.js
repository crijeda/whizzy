Brands = new orion.collection('brands', {
  pluralName: 'Marcas',
  singularName: 'Marca',
  title: 'Marcas',
  link: {
    title: 'Marcas',
    parent: 'clients'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
      orion.attributeColumn('hasOne', 'groupId', 'Grupo'),
      orion.attributeColumn('tags', 'keywords', 'Keywords')
    ]
  }
});

Brands.attachSchema({
  name: {
    type: String
  },
  groupId: orion.attribute('hasOne', {
    label: 'Grupo'
  }, {
    collection: Groups,
    titleField: 'name',
    publicationName: 'brands_groupId_schema',
    additionalFields: ['agencyId'],
    filter: function(userId) {
      var selectors = Roles.helper(userId, 'clients.myGroups') || [];
      return { $or: selectors };
    }
  }),
  executivesIds: orion.attribute('users-roles', {
    label: 'Ejecutivos',
    optional: true
  }, {
    publicationName: 'brands_executivesIds_schema',
    roles: ['ejecutivo'],
    filter: function(userId) {
      var agency = Agencies.findOne({ adminsIds: userId });
      return agency ? { _id: { $in: (agency.executivesIds || []) } } : {};
    }
  }),
  clientsIds: orion.attribute('users-roles', {
    label: 'Clientes',
    optional: true
  }, {
    publicationName: 'brands_clientsIds_schema',
    roles: ['cliente']
  }),
  keywords: orion.attribute('tags', {
    label: 'Keywords (noticias que contengan alguna las siguentes frases)',
    optional: true
  }),
  keywords1: orion.attribute('tags', {
    label: 'Además Contengan',
    optional: true
  })
});
