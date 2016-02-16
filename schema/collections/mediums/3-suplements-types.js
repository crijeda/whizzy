SuplementsTypes = new orion.collection('suplements_types', {
  pluralName: 'Tipos de Suplementos',
  singularName: 'Tipo de Suplementos',
  title: 'Tipos de Suplementos',
  link: {
    title: 'Tipos de Suplementos',
    parent: 'mediums-admin'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
    ]
  }
});

SchemaDeclarationSchema = new SimpleSchema({
  key: {
    type: String,
    label: 'Identificador',
    regEx: /^[a-zA-Z0-9_]+$/
  },
  title: {
    type: String,
    label: 'Título'
  },
  type: {
    type: String,
    label: 'Tipo',
    allowedValues: ['string', 'number', 'date', 'file', 'boolean', 'list'],
    autoform: {
      noselect: true,
      options: {
        string: 'Texto',
        number: 'Numero',
        date: 'Fecha',
        file: 'Archivo',
        boolean: 'Verdadero/Falso',
        list: 'Lista'
      }
    }
  },
  list: {
    type: [String],
    label: "Lista",
    optional: true
  },
  optional: {
    type: Boolean,
    label: 'Opcional'
  }
});

SuplementsTypes.attachSchema({
  name: {
    type: String
  },
  attributes: {
    type: [SchemaDeclarationSchema],
    label: 'Atributos'
  }
});
