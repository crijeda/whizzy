SuplementsZones = new orion.collection('suplements_zones', {
  pluralName: 'Zonas de Suplementos',
  singularName: 'Zona de Suplementos',
  title: 'Zonas de Suplementos',
  link: {
    title: 'Zonas de Suplementos',
    parent: 'mediums-admin'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
    ]
  }
});

SuplementsZones.attachSchema({
  name: {
    type: String
  }
});
