NewsBrands = new Mongo.Collection('news_brands');

NewsBrands.allow({
  update: function(userId, doc, fieldNames, modifier) {
    return true;
  }
});

NewsBrandsSchemaAttributes = {
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
  },
  data: {
    type: Object,
    autoform: {
      omit: true
    },
    optional: true,
    blackbox: true
  }
};


NewsBrandsSchema = new SimpleSchema(NewsBrandsSchemaAttributes);

NewsBrands.attachSchema(NewsBrandsSchema);