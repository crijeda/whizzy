Mediums = new orion.collection('mediums', {
  pluralName: 'Medios',
  singularName: 'Medio',
  title: 'Medios',
  link: {
    title: 'Medios',
    parent: 'mediums'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' }
    ]
  }
});


Mediums.attachSchema({
  name: {
    type: String,
    label: 'Nombre',
    optional: true
  }
});
