Cities = new orion.collection('cities', {
  pluralName: 'Ciudades',
  singularName: 'Ciudad',
  title: 'Ciudades',
  link: {
    title: 'Ciudades',
    parent: 'demographics'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
      orion.attributeColumn('hasOne', 'zoneId', 'Zona'),
      orion.attributeColumn('hasOne', 'countryId', 'País')
    ]
  }
});

Cities.attachSchema({
  name: {
    type: String
  },
  countryId: orion.attribute('hasOne', {
    label: 'País'
  }, {
    collection: Countries,
    titleField: 'name',
    publicationName: 'cities_countryId_schema',
  }),
  zoneId: orion.attribute('hasOne', {
    label: 'Zona'
  }, {
    collection: Zones,
    titleField: 'name',
    publicationName: 'cities_zoneId_schema',
    additionalFields: ['countryId'],
    filter: function(userId) {
      if (Meteor.isServer) {
        return {};
      } else {
        var countryId = AutoForm.getFieldValue('countryId');
        return countryId ? { countryId: countryId } : {};
      }
    }
  })
});
