Meteor.startup(function() {
  ReactiveTemplates.set('adminSidebar', 'sidebar');
  ReactiveTemplates.set('outAdminLayout', 'outAdminLayout');
});

document.title = "WhizzCloud";