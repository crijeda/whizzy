Zones = new orion.collection('zones', {
  pluralName: 'Zonas',
  singularName: 'Zona',
  title: 'Zonas',
  link: {
    title: 'Zonas',
    parent: 'demographics'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
      orion.attributeColumn('hasOne', 'countryId', 'País')
    ]
  }
});

Zones.attachSchema({
  name: {
    type: String
  },
  countryId: orion.attribute('hasOne', {
    label: 'País'
  }, {
    collection: Countries,
    titleField: 'name',
    publicationName: 'zones_countryId_schema',
  })
});
