ExportNews = new Mongo.Collection("exportNews");

// ExportNewsSchema = new SimpleSchema({
//   groupsIds: orion.attribute('hasMany', {
//     label: 'Grupos'
//   }, {
//     collection: Groups,
//     titleField: 'name',
//     publicationName: 'export_news_groupsIds_schema',
//     additionalFields: ['agencyId'],
//     filter: function(userId) {
//       var selectors = Roles.helper(userId, 'clients.myGroups') || null;
//       return { $or: selectors };
//     }
//   }),
//   brandsIds: orion.attribute('hasMany', {
//     label: 'Marcas'
//   }, {
//     collection: Brands,
//     titleField: 'name',
//     additionalFields: ['groupId'],
//     publicationName: 'export_news_brandsIds_schema',
//     filter: function(userId) {
//       var selectors = Roles.helper(userId, 'clients.myBrands') || null;
//       var myBrandsFilter = { $or: selectors };
//       if (Meteor.isServer) {
//         return myBrandsFilter;
//       } else {
//         var groupsIds = AutoForm.getFieldValue('groupsIds');
//         return groupsIds ? { $and: [{ groupId: { $in: groupsIds } }, myBrandsFilter] } : myBrandsFilter;
//       }
//     }
//   }),
//   fromDate: {
//     type: Date,
//     label: 'Desde Fecha',
//     autoform: {
//       type: 'bootstrap-datetimepicker'
//     }
//   },
//   toDate: {
//     type: Date,
//     label: 'Hasta Fecha',
//     autoform: {
//       type: 'bootstrap-datetimepicker'
//     }
//   },
//   fileType: {
//     type: String,
//     label: 'Formato de exportable',
//     allowedValues: ['excel', 'pdf', 'pptx'],
//     autoform: {
//       options: {
//         excel: 'Excel',
//         pdf: 'Pdf',
//         pptx: 'Power Point'
//       }
//     }
//   }
// });
//
// ExportNews.attachSchema(ExportNewsSchema);

ExportNews.allow({
  insert: function (userId, doc) {
    return true;
  },
  update: function (userId, doc, fields, modifier) {
    return true;
  },
  remove: function (userId, doc) {
    return true;
  }
});
