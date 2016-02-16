News = new orion.collection('news', {
  pluralName: 'Noticias',
  singularName: 'Artículo',
  title: 'Noticias',
  link: {
    title: 'Noticias',
    index: 14
  },
  tabular: {
    columns: [
      { data: 'title', title: 'Título' },
      { data: 'date', title: 'Fecha Sugerida', render: function(val) { return moment(val).format('LL'); } },
      {
        data: 'isReady',
        title: 'Categorizado',
        render: function(val) {
          return val ? '<i class="fa fa-check"></i>' : '<i class="fa fa-close"></i>';
        }
      },
      {
        data: '_id',
        title: 'Acciones',
        render: function(val) {
          return '<a href="' + Router.path('collections.news.show', { _id: val }) + '" class="btn btn-xs btn-default">Ver</a> ' +
          '<a href="' + Router.path('collections.news.data', { _id: val }) + '" class="btn btn-xs btn-default">Categorizar</a> ' +
          '<a href="' + Router.path('collections.news.update', { _id: val }) + '" class="btn btn-xs btn-default">Editar</a>';
        }
      }
    ]
  }
});
News.attachSchema({
  idx: {
    type: String,
    label: 'idx',
    optional: true,
    autoform: {
      omit: true
    }
  },
  agureId: {
    type: String,
    label: 'agureId',
    optional: true,
    autoform: {
      omit: true
    }
  },
  prevAprove: {
    type: Boolean,
    label: 'Visualizar en Noticias',
    optional: true,
    autoform: {
      omit: false
    }
  },
  createdBy: orion.attribute('createdBy'),
  groupsIds: orion.attribute('hasMany', {
    label: 'Grupos',
    optional: true
  }, {
    collection: Groups,
    titleField: 'name',
    publicationName: 'news_groupsIds_schema',
    additionalFields: ['agencyId'],
    validateOnServer: false,
    filter: function(userId) {
      var selectors = Roles.helper(userId, 'clients.myGroups') || null;
      return selectors.length > 0 ? { $or: selectors } : null;
    }
  }),
  brandsIds: orion.attribute('hasMany', {
    label: 'Marcas',
    optional: true
  }, {
    collection: Brands,
    titleField: 'name',
    additionalFields: ['groupId'],
    publicationName: 'news_brandsIds_schema',
    validateOnServer: false,
    filter: function(userId) {
      var selectors = Roles.helper(userId, 'clients.myBrands') || [];
      var myBrandsFilter = { $or: selectors };
      if (Meteor.isServer) {
        return selectors.length > 0 ? myBrandsFilter : null;
      } else {
        var groupsIds = AutoForm.getFieldValue('groupsIds');
        return groupsIds ? { $and: [{ groupId: { $in: groupsIds } }, myBrandsFilter] } : myBrandsFilter;
      }
    }
  }),
  title: {
    type: String,
    label: 'Título'
  },
  subtitle: {
    type: String,
    label: 'Bajada',
    optional: true
  },
  body: {
    type: String,
    label: 'Cuerpo',
    optional: true,
    autoform: {
      type: 'textarea'
    }
  },
  media: orion.attribute('images', {
    label: 'Media',
    optional: true
  }),
    pieima: {
    type: String,
    label: 'Pie Imagen',
    optional: true
  },
  date: {
    type: Date,
    label: 'Fecha Sugerida',
    autoform: {
      type: 'bootstrap-datetimepicker'
    }
  },
  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true
  },
  mediumId: {
      label: 'Medio',
      type: String,
      optional: true,
      allowedValues: function() {
        return _.pluck(Mediums.find().fetch(), '_id');
      },
      autoform: {
        options: function() {
          var mediums = Mediums.find().map(function(medium) {
            return {
              value: medium._id,
              label: medium.name
            }
          });
          // console.log(mediums)
          return _.sortBy(mediums,'label');
        }
      }
    },
  suplementId: {
    label: 'Suplemento',
    type: String,
    optional: true,
    allowedValues: function() {
      return _.pluck(Suplements.find().fetch(), '_id');
    },
    autoform: {
      options: function() {
        return Suplements.find({mediumId:AutoForm.getFieldValue('mediumId')}).map(function(supplement) {
          return {
            value: supplement._id,
            label: supplement.name
          }
        });
      }
    }
  },
  categorizedBy: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
    }
  },
  hidden: {
    type: [String],
    optional: true,
    autoform: {
      omit: true
    }
  }
});
News.helpers({
  groups: function() {
    var ids = this.groupsIds || [];
    return Groups.find({ _id: { $in: ids } });
  },
  brands: function() {
    var ids = this.brandsIds || [];
    return Brands.find({ _id: { $in: ids }});
  },
   brands2: function() {
    var ids = this.brandsIds || [];
    var agency = _.pluck(Agencies.find().fetch(), '_id');
    var group = _.pluck(Groups.find({agencyId: { $in: agency }}).fetch(), '_id');
    return Brands.find({ _id: { $in: ids }, groupId:{ $in: group }});
    
  },
  data: function() {
    var ids = this._id;
    var news_data = NewsData.find({ articleId: ids }).fetch();
    _.each(news_data,function(e){

      if(e.data && e.data.tiponot) {


      if(e.data.tiponot == "p_escrita"){
        e.data.tiponot = "Prensa Escrita"
      }

      if(e.data.tiponot == "p_tv"){
        e.data.tiponot = "Nota TV"
      }

      if(e.data.tiponot == "p_radio"){
        e.data.tiponot = "Nota Radio"
      }

      if(e.data.tiponot == "p_internet"){
        e.data.tiponot = "Nota Internet"
      }

      if(e.data.tiponot == "p_suplemento"){
        e.data.tiponot = "Suplemento"
      }
      if(e.data.tiponot == "p_online"){
        e.data.tiponot = "Web"
      }

      if(e.data.tiponot == "p_portada"){
        e.data.tiponot = "Portada"
      }}

    })
    return news_data;
  },
  mediums: function() {
    var ids = this.mediumId;
    return Mediums.find({ _id: ids });
  },
  dataForUser: function(userId) {
    check(userId, String);
    var agency;
    if (Roles.userHasRole(userId, 'cliente')) {
      var myGroupsIds = _.pluck(Brands.find({ clientsIds: userId }).fetch(), 'groupId');
      var myAgenciesIds = _.pluck(Groups.find({ _id: { $in: myGroupsIds } }).fetch(), 'agencyId');
      agency = Agencies.findOne({ _id: { $in: myAgenciesIds } });
    } else if (Roles.userHasRole(userId, 'agencia') || Roles.userHasRole(userId, 'ejecutivo')) {
      agency = Agencies.findOne({ $or: [ { adminsIds: userId }, { executivesIds: userId } ] });
    } else {
      console.log('admins no tienen agencia');
    }
    if (!agency) return;
    return NewsData.findOne({ articleId: this._id, agencyId: agency._id });
  },
  isCategorized: function(userId) {
    check(userId, String);
    var agency;
    if (Roles.userHasRole(userId, 'cliente')) {
      var myGroupsIds = _.pluck(Brands.find({ clientsIds: userId }).fetch(), 'groupId');
      var myAgenciesIds = _.pluck(Groups.find({ _id: { $in: myGroupsIds } }).fetch(), 'agencyId');
      agency = Agencies.findOne({ _id: { $in: myAgenciesIds } });
    } else if (Roles.userHasRole(userId, 'agencia') || Roles.userHasRole(userId, 'ejecutivo')) {
      agency = Agencies.findOne({ $or: [ { adminsIds: userId }, { executivesIds: userId } ] });
    }
    return agency && _.contains(this.categorizedBy, agency._id);
  }
});