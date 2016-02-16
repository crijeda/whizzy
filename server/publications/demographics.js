Meteor.publish('demographics', function() {
  return [Countries.find(), Zones.find(), Cities.find()];
});
