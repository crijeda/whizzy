SuplementsStyles = new orion.collection('suplements_styles', {
  pluralName: 'Estilos de Suplementos',
  singularName: 'Estilo de Suplementos',
  title: 'Estilos de Suplementos',
  link: {
    title: 'Estilos de Suplementos',
    parent: 'mediums-admin'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
    ]
  }
});

SuplementsStyles.attachSchema({
  name: {
    type: String
  }
});
