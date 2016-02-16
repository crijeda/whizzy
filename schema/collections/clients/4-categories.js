Categories = new orion.collection('categories', {
  pluralName: 'Categorías',
  singularName: 'Categoría',
  title: 'Categorías',
  link: {
    title: 'Categorías',
    parent: 'clients'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
    ]
  }
});

Categories.attachSchema({
  name: {
    type: String
  },
  industryId: orion.attribute('hasOne', {
    label: 'Industria',
    optional: true
  }, {
    collection: Industries,
    titleField: 'name',
    publicationName: 'categories_industryId_schema',
  }),
});
