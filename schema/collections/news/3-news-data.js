NewsData = new Mongo.Collection('news_data');

NewsData.allow({
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  }
});

NewsDataSchemaAttributes = {
  articleId: {
    type: String,
    autoform: {
      omit: true
    }
  },
  agencyId: {
    type: String,
    autoform: {
      omit: true
    },
    optional: true,
  },
  typeId: {
    label: 'Tipo',
    type: String,
    optional: true,
    allowedValues: function() {
      return _.pluck(SuplementsTypes.find().fetch(), '_id');
    },
    autoform: {
      options: function() {
        return SuplementsTypes.find().map(function(type) {
          return {
            value: type._id,
            label: type.name
          }
        });
      }
    }
  },
  // mediumId: orion.attribute('hasOne', {
  //   label: 'Medio',
  //   optional: true
  // }, {
  //   collection: Mediums,
  //   titleField: 'name',
  //   publicationName: 'news_mediumId_schema',
  // }),
  // suplementId: orion.attribute('hasOne', {
  //   label: 'Suplemento',
  //   optional: true
  // }, {
  //   collection: Suplements,
  //   titleField: 'name',
  //   additionalFields: ['mediumId'],
  //   publicationName: 'news_suplementId_schema',
  //   filter: function(userId) {
  //     if (Meteor.isServer) {
  //       return {};
  //     } else {
  //       var mediumId = AutoForm.getFieldValue('mediumId');
  //       return mediumId ? { mediumId: mediumId } : {};
  //     }
  //   }
  // }),
  data: {
    type: Object,
    autoform: {
      omit: true
    },
    optional: true,
    blackbox: true
  }
};

NewsDataSchema = new SimpleSchema(NewsDataSchemaAttributes);

NewsData.attachSchema(NewsDataSchema);
