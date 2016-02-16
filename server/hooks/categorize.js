NewsData.after.update(function(userId, doc) {
	var userId = Meteor.userId();
	var agency = Agencies.findOne({ $or: [ { adminsIds: userId }, { executivesIds: userId } ] });
	
	if (doc.data) {
		News.update(doc.articleId, { $addToSet: { categorizedBy: agency._id } });
	} else {
		News.update(doc.articleId, { $pull: { categorizedBy: agency._id } });
	}
});