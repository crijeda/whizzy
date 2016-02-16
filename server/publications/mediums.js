Meteor.publish('mediums', function() {
  return [Mediums.find(), Suplements.find()];
});
