Groups = new orion.collection('groups', {
  pluralName: 'Grupos',
  singularName: 'Grupo',
  title: 'Grupos',
  link: {
    title: 'Grupos',
    parent: 'clients'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
      orion.attributeColumn('hasOne', 'agencyId', 'Agencia')
    ]
  }
});

Groups.attachSchema({
  name: {
    type: String
  },
  agencyId: orion.attribute('hasOne', {
    label: 'Agencia'
  }, {
    collection: Agencies,
    titleField: 'name',
    publicationName: 'groups_agencyId_schema',
  }),
  createdAt: orion.attribute('createdAt')
});
