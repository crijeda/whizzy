SuplementsFrecuencies = new orion.collection('suplements_frecuencies', {
  pluralName: 'Frecuencias de Suplementos',
  singularName: 'Frecuencia de Suplementos',
  title: 'Frecuencias de Suplementos',
  link: {
    title: 'Frecuencias de Suplementos',
    parent: 'mediums-admin'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
    ]
  }
});

SuplementsFrecuencies.attachSchema({
  name: {
    type: String
  }
});
