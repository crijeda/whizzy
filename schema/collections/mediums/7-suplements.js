Suplements = new orion.collection('suplements', {
  pluralName: 'Suplementos',
  singularName: 'Suplemento',
  title: 'Suplementos',
  link: {
    title: 'Suplementos',
    parent: 'mediums'
  },
  tabular: {
    columns: [
      orion.attributeColumn('hasOne', 'mediumId', 'Medio'),
      { data: 'name', title: 'Nombre' },
      orion.attributeColumn('hasOne', 'typeId', 'Tipo'),
      orion.attributeColumn('hasOne', 'styleId', 'Estilo'),
      orion.attributeColumn('hasOne', 'countryId', 'País'),
      orion.attributeColumn('hasOne', 'zoneId', 'Zona'),
      orion.attributeColumn('hasOne', 'cityId', 'Ciudad'),
      {data: 'relevance', title: 'Relevancia'}
    ]
  }
});


Suplements.attachSchema({
  mediumId: orion.attribute('hasOne', {
    label: 'Medio'
  }, {
    collection: Mediums,
    titleField: 'name',
    publicationName: 'suplements_mediumId_schema',
  }),
  typeId: orion.attribute('hasOne', {
    label: 'Tipo'
  }, {
    collection: SuplementsTypes,
    titleField: 'name',
    publicationName: 'suplementsType',
  }),
  subType: orion.attribute('hasOne', {
    label: 'Subtipo',
    optional: true
  }, {
    collection: SuplementsSubTypes,
    titleField: 'name',
    publicationName: 'suplementsSubType',
    additionalFields: ['typeId'],
    filter: function(userId) {
      if (Meteor.isServer) {
        return {};
      } else {
        var typeId = AutoForm.getFieldValue('typeId');
        return typeId ? { typeId: typeId } : {};
      }
    }
  }),
  styleId: orion.attribute('hasOne', {
    label: 'Estilo'
  }, {
    collection: SuplementsStyles,
    titleField: 'name',
    publicationName: 'supplementsStyle',
  }),
  countryId: orion.attribute('hasOne', {
    label: 'País'
  }, {
    collection: Countries,
    titleField: 'name',
    publicationName: 'suplements_countryId_schema',
  }),
  zoneId: orion.attribute('hasOne', {
    label: 'Zona'
  }, {
    collection: Zones,
    titleField: 'name',
    publicationName: 'suplements_zoneId_schema',
    additionalFields: ['countryId'],
    filter: function(userId) {
      if (Meteor.isServer) {
        return {};
      } else {
        var countryId = AutoForm.getFieldValue('countryId');
        return countryId ? { countryId: countryId } : {};
      }
    }
  }),
  cityId: orion.attribute('hasOne', {
    label: 'Ciudad'
  }, {
    collection: Cities,
    titleField: 'name',
    publicationName: 'mediumsCity',
    additionalFields: ['zoneId'],
    filter: function(userId) {
      if (Meteor.isServer) {
        return {};
      } else {
        var zoneId = AutoForm.getFieldValue('zoneId');
        return zoneId ? { zoneId: zoneId } : {};
      }
    }
  }),
  name: {
    type: String,
    label: 'Nombre',
    optional: true
  },
  relevance: {
    type: Number,
    label: 'Relevancia',
    allowedValues: [1,2,3,4,5],
    optional: true
  },
  siteViews: {
    type: Number,
    label: "Tiraje",
    optional: true
  },
  dailyViews: {
    type: Number,
    label: "Lectoría / Diaria",
    optional: true
  },
  weekendViewsFactor: {
    type: Number,
    decimal: true,
    label: "Factor lectoría fin de semana"
  },
  frecuencyId: orion.attribute('hasOne', {
    label: 'Frecuencia'
  }, {
    collection: SuplementsFrecuencies,
    titleField: 'name',
    publicationName: 'suplementsFrecuencies',
  }),
  targetMarket: {
    type: String,
    label: 'Publico objetivo',
    optional: true
  },
  monthlyViews: {
    type: Number,
    label: 'Visitas mensuales (solo web)',
    optional: true
  },
  factorImpar: {
    type: String,
    label: "Factor Impar",
    optional: true
  },
  value: {
    type: String,
    label: 'Valor',
    optional: true
  },
  valueMondayThursdayColor: {
    type: String,
    label: 'Valor Lunes-Jueves color',
    optional: true,
  },
  valueFridayColor: {
    type: String,
    label: 'Valor Viernes color',
    optional: true,
  },
  valueSaturdayColor: {
    type: String,
    label: 'Valor Sábado color',
    optional: true,
  },
  valueSundayColor: {
    type: String,
    label: 'Valor Domingo color',
    optional: true,
  },
  valueMondayThursday: {
    type: String,
    label: 'Valor Lunes-Jueves',
    optional: true,
  },
  valueFriday: {
    type: String,
    label: 'Valor Viernes',
    optional: true,
  },
  valueSaturday: {
    type: String,
    label: 'Valor Sábado',
    optional: true,
  },
  valueSunday: {
    type: String,
    label: 'Valor Domingo',
    optional: true,
  },
  valueFullPage: {
    type: String,
    label: 'Valor página entera',
    optional: true
  },
  'value34Page': {
    type: String,
    label: 'Valor 3/4 página',
    optional: true
  },
  valueNarrowHalfPage: {
    type: String,
    label: 'Valor media página alto',
    optional: true
  },
  valueWideHalfPage: {
    type: String,
    label: 'Valor media página tradicional',
    optional: true
  },
  'value14Page': {
    type: String,
    label: 'Valor 1/4 página',
    optional: true
  },
  valueMediumSpot: {
    type: String,
    label: 'Valor caluga mediana',
    optional: true
  },
  valueSmallSpot: {
    type: String,
    label: 'Valor caluga pequeña',
    optional: true
  },
  valueHorizontalBanner: {
    type: String,
    label: 'Valor banner horizontal',
    optional: true
  },
  valueVerticalBanner: {
    type: String,
    label: 'Valor banner vertical',
    optional: true
  },
  portada: {
    type: String,
    label: "Portada",
    optional: true
  },
  contraportada: {
    type: String,
    label: "Contraportada",
    optional: true
  },
  politics: {
    type: String,
    label: "Politica",
    optional: true
  },
  economy: {
    type: String,
    label: "Economía",
    optional: true
  },
  nacionalActualidad: {
    type: String,
    label: "Nacional Actualidad",
    optional: true
  },
  sports: {
    type: String,
    label: "Deportes",
    optional: true
  },
  tecnology: {
    type: String,
    label: "Tecnología",
    optional: true
  },
  international: {
    type: String,
    label: "Internacional",
    optional: true
  },
  automotriz: {
    type: String,
    label: "Automotriz",
    optional: true
  },
  opinion: {
    type: String,
    label: "Opinion/Carta",
    optional: true
  },
  health: {
    type: String,
    label: "Salud",
    optional: true
  },
  market: {
    type: String,
    label: "Mercado/Marketing/Lanzamiento",
    optional: true
  },
  panoramas: {
    type: String,
    label: "Panoramas/Espectáculos/Cultura Tendencias",
    optional: true
  },
  social: {
    type: String,
    label: "Sociales",
    optional: true
  },
  latlongpos: {
    type: String,
    label: "Lat long Post",
    optional: true
  },
  latlongneu: {
    type: String,
    label: "Lat Long Neu",
    optional: true
  },
  latlongneg: {
    type: String,
    label: "Lat Long Neg",
    optional: true
  }

});
