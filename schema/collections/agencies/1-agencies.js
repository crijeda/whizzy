Agencies = new orion.collection('agencies', {
  pluralName: 'Agencias',
  singularName: 'Agencia',
  title: 'Agencia',
  link: {
    title: 'Agencias',
    index: 2
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
      orion.attributeColumn('hasMany', 'executivesIds', 'Ejecutivos'),
      orion.attributeColumn('image', 'logo', 'Logo')
    ]
  }
});

Agencies.attachSchema({
  name: {
    type: String
  },
  logo: orion.attribute('image', {
    label: 'Logo',
    optional: true
  }),
  adminsIds: orion.attribute('users-roles', {
    label: 'Administradores',
    optional: true,
    custom: function() {
      if (!_.isArray(this.value)) return;
      var count = Agencies.find({
        _id: { $ne: this.docId },
        $or: [
          { adminsIds: { $in: this.value } },
          { executivesIds: { $in: this.value } }
        ]
      }).count();
      return count == 0 ? true : 'userInOtherAgency';
    }
  }, {
    publicationName: 'agencies_adminsIds_schema',
    roles: ['agencia']
  }),
  executivesIds: orion.attribute('users-roles', {
    label: 'Ejecutivos',
    optional: true
  }, {
    publicationName: 'brands_executivesIds_schema',
    roles: ['ejecutivo'],
    filter: function(userId) {
      var agency = Agencies.findOne({ adminsIds: userId });
      return agency ? { _id: { $in: (agency.executivesIds || []) } } : {};
    }
  })
});
