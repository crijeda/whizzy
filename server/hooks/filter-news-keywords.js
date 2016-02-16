var filterArticle = function(article) {
  var brands = [];
  var groups = [];
  Brands.find({}).forEach(function(brand) {
    var matches = false;
    var matches1 = false;

    _.each(brand.keywords, function(keyword) {
      if (!keyword) return;
      if ((new RegExp('\\b' + keyword + '\\b', 'gi')).test(article.title)) matches = true;
      if ((new RegExp('\\b' + keyword + '\\b', 'gi')).test(article.subtitle)) matches = true;
      if ((new RegExp('\\b' + keyword + '\\b', 'gi')).test(article.body)) matches = true;
    });

    if(!(typeof brand.keywords1 != "undefined" && brand.keywords1 != null && brand.keywords1.length > 0)){
      // console.log('this1')
      var matches1 = true;
    }else{
        // console.log('that1')
      _.each(brand.keywords1, function(keyword) {
        if (!keyword) return;
        if ((new RegExp('\\b' + keyword + '\\b', 'gi')).test(article.title)) matches1 = true;
        if ((new RegExp('\\b' + keyword + '\\b', 'gi')).test(article.subtitle)) matches1 = true;
        if ((new RegExp('\\b' + keyword + '\\b', 'gi')).test(article.body)) matches1 = true;
      });
    }

    // console.log(brand.keywords1)

    if (matches && matches1) {
      brands.push(brand._id);
      groups.push(brand.groupId);
    }
  });

  News.update({ _id: article._id }, { $set: { brandsIds: brands, groupsIds: groups } });
}

var filterNewsForBrand = function(brand) {
  News.update({ brandsIds: brand._id }, { $pull: { brandsIds: brand._id, groupsIds: brand.groupId } }, { multi: true });

  var newsIdsKeywords = [];
  var newsIdsKeywords1 = [];

  _.each(brand.keywords, function(keyword) {
    if (!keyword) return;
    newsIdsKeywords = _.union(newsIdsKeywords, _.pluck(News.find({
      $or: [
        { title: { $regex: '\\b' + keyword + '\\b', $options: 'gi' } },
        { subtitle: { $regex: '\\b' + keyword + '\\b', $options: 'gi' } },
        { body: { $regex: '\\b' + keyword + '\\b', $options: 'gi' } }
      ]
    }).fetch(), '_id'));
  });

  if(!(typeof brand.keywords1 != "undefined" && brand.keywords1 != null && brand.keywords1.length > 0)){
    // console.log('this2')
    var newsIds = newsIdsKeywords;
  }else{
    // console.log('that2')
    _.each(brand.keywords1, function(keyword) {
      if (!keyword) return;
      newsIdsKeywords1 = _.union(newsIdsKeywords1, _.pluck(News.find({
        $or: [
          { title: { $regex: '\\b' + keyword + '\\b', $options: 'gi' } },
          { subtitle: { $regex: '\\b' + keyword + '\\b', $options: 'gi' } },
          { body: { $regex: '\\b' + keyword + '\\b', $options: 'gi' } }
        ]
      }).fetch(), '_id'));
    });

    var newsIds = _.intersection(newsIdsKeywords,newsIdsKeywords1); 
  }

  News.update({ _id: { $in: newsIds } }, { $addToSet: { brandsIds: brand._id, groupsIds: brand.groupId } }, { multi: true });
}

News.after.insert(function(userId, doc) {
  filterArticle(doc);
});

News.after.update(function (userId, doc, fieldNames, modifier, options) {
  if (!_.isEqual(this.previous.title, doc.title) || !_.isEqual(this.previous.subtitle, doc.subtitle) || !_.isEqual(this.previous.body, doc.body)) {
    filterArticle(doc);
  }
});

Brands.after.insert(function(userId, doc) {
  if (doc.keywords) {
    filterNewsForBrand(doc);
  }
});

Brands.after.update(function (userId, doc, fieldNames, modifier, options) {
  if (!_.isEqual(this.previous.keywords, doc.keywords) || !_.isEqual(this.previous.keywords1, doc.keywords1)) {
    filterNewsForBrand(doc);
  }
});