Industries = new orion.collection('industries', {
  pluralName: 'Industrias',
  singularName: 'Industria',
  title: 'Industrias',
  link: {
    title: 'Industrias',
    parent: 'clients'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
    ]
  }
});

Industries.attachSchema({
  name: {
    type: String
  }
});
