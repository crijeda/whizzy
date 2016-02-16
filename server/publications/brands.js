Meteor.publish(null, function() {
  return Brands.find({ clientsIds: this.userId });
});
