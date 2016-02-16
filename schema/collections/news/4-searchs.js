filterForSearchObject = function(searchObject, userId) {
  var filter = {};
  var selectors = Roles.helper(userId, 'collections.news.indexFilter');
  filter.$or = selectors;

  if (!searchObject) return filter;

  check(searchObject, {
    groupsIds: Match.Optional([String]),
    brandsIds: Match.Optional([String]),
    fromDate: Match.Optional(Date),
    toDate: Match.Optional(Date),
    filter: Match.Optional(String),
    showToCategorize: Match.Optional(Boolean)
    // showToSend: Match.Optional(Boolean)
  });

  if (searchObject.groupsIds) {
    filter.groupsIds = { $in: searchObject.groupsIds };
  }

  if (searchObject.brandsIds) {
    filter.brandsIds = { $in: searchObject.brandsIds };
  }

  if (searchObject.fromDate && searchObject.toDate) {
    filter.date = { $gte: searchObject.fromDate, $lte: searchObject.toDate };
  } else if (searchObject.fromDate) {
    filter.date = { $gte: searchObject.fromDate };
  } else if (searchObject.toDate) {
    filter.date = { $lte: searchObject.toDate };
  }

  if (searchObject.showToCategorize) {
    var agency = Agencies.findOne({ $or: [{ adminsIds: userId }, { executivesIds: userId }] });
    if (agency) {
      filter.categorizedBy = { $ne: agency._id };
    }
  }
  //   if (searchObject.showToSend) {
  //     console.log('here')
  //      var agency = Agencies.findOne({ $or: [{ adminsIds: userId }, { executivesIds: userId }] });
  //   if (agency) {
  //     filter.categorizedBy = { $ne: agency._id };
  //   }
  // }

  return filter;
};

SearchNewsSchema = new SimpleSchema({
  groupsIds: orion.attribute('hasMany', {
    label: 'Grupos',
    optional: true
  }, {
    collection: Groups,
    titleField: 'name',
    publicationName: 'search_news_groupsIds_schema',
    additionalFields: ['agencyId'],
    filter: function(userId) {
      var selectors = Roles.helper(userId, 'clients.myGroups') || null;
      return { $or: selectors };
    }
  }),
  brandsIds: orion.attribute('hasMany', {
    label: 'Marcas',
    optional: true
  }, {
    collection: Brands,
    titleField: 'name',
    additionalFields: ['groupId', 'executivesIds'],
    publicationName: 'search_news_brandsIds_schema',
    filter: function(userId) {
      var agency = Agencies.findOne({ $or: [ { adminsIds: userId }, { executivesIds: userId } ] });
      if(agency){
        var groupIds = _.pluck(Groups.find({ agencyId:agency._id }).fetch(), '_id');
        var myBrandsFilter = { groupId: { $in: groupIds } }
      }else{
        var myBrandsFilter = { $or: [{}] };
      }
      if (Meteor.isServer) {
        return myBrandsFilter;
      } else {
        var groupsIds = AutoForm.getFieldValue('groupsIds');
        return groupsIds ? { $and: [{ groupId: { $in: groupsIds } }, myBrandsFilter] } : myBrandsFilter;
      }
    }
  }),
  fromDate: {
    type: Date,
    label: 'Desde Fecha',
    autoform: {
      type: 'date'
      // type: 'bootstrap-datetimepicker'
    }
  },
  toDate: {
    type: Date,
    label: 'Hasta Fecha',
    autoform: {
      type: 'date'
      // type: 'bootstrap-datetimepicker'
    }
  },
  showToCategorize: {
    type: Boolean,
    label: 'Mostrar solo sin categorizar'
  },
  // showToSend: {
  //   type: Boolean,
  //   label: 'Mostrar solo sin enviar'
  // },
  filter: {
    type: String,
    label: 'Filtro'
  }
});
