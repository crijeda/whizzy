Campaigns = new orion.collection('campaigns', {
  pluralName: 'Campañas',
  singularName: 'Campaña',
  title: 'Campañas',
  link: {
    title: 'Campañas',
    parent: 'clients'
  },
  tabular: {
    columns: [
      { data: 'name', title: 'Nombre' },
      orion.attributeColumn('hasOne', 'industryId', 'Industria'),
      orion.attributeColumn('hasOne', 'categoryId', 'Categoría'),
      orion.attributeColumn('hasOne', 'groupId', 'Grupo'),
      orion.attributeColumn('hasOne', 'brandId', 'Marca'),
      {data: 'products', title: 'productos'}
    ]
  }
});

Campaigns.attachSchema({
  name: {
    type: String,
    label: 'Nombre'
  },
  industryId: orion.attribute('hasOne', {
    label: 'Industria',
    optional: true
  }, {
    collection: Industries,
    titleField: 'name',
    publicationName: 'campaigns_industryId_schema',
  }),
  categoryId: orion.attribute('hasOne', {
    label: 'Categoría',
    optional: true
  }, {
    collection: Categories,
    titleField: 'name',
    publicationName: 'campaigns_categoryId_schema',
    additionalFields: ['industryId'],
    filter: function(userId) {
      if (Meteor.isServer) {
        return {};
      } else {
        var industryId = AutoForm.getFieldValue('industryId');
        return industryId ? { industryId: industryId } : {};
      }
    }
  }),
  groupId: orion.attribute('hasOne', {
    label: 'Grupo'
  }, {
    collection: Groups,
    titleField: 'name',
    publicationName: 'campaigns_groupId_schema',
    additionalFields: ['agencyId'],
    filter: function(userId) {
      var selectors = Roles.helper(userId, 'clients.myGroups') || [];
      return { $or: selectors };
    }
  }),
  brandId: orion.attribute('hasOne', {
    label: 'Marca'
  }, {
    collection: Brands,
    titleField: 'name',
    additionalFields: ['groupId'],
    publicationName: 'campaigns_brandId_schema',
    filter: function(userId) {
      if (Meteor.isServer) {
        return {};
      } else {
        var groupId = AutoForm.getFieldValue('groupId');
        return groupId ? { groupId: groupId } : {};
      }
    }
  }),
  products: orion.attribute('tags', {
    label: 'Productos',
    optional: true
  })
});
