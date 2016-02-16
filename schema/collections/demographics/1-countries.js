Countries = new orion.collection('countries', {
  pluralName: 'Paises',
  singularName: 'País',
  title: 'Paises',
  link: {
    title: 'Paises',
    parent: 'demographics'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
    ]
  }
});

Countries.attachSchema({
  name: {
    type: String
  }
});
