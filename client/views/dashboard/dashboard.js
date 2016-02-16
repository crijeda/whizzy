Template.dashboard.onCreated(function() {
  this.subscribe('dashboard');
});

Template.dashboard.helpers({

  brands: function() {
    return Brands.find();
  },
  brandTodayNews: function(){
    var start = new Date();
    var end = new Date();
    end.setDate(end.getDate() + 1);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    var brand = this;
    return (News.find({$and:[{date:{$gt: start, $lt: end}},{brandsIds:this._id}]}).count());
  },

  brandNewsCount: function() {
    var brand = this;
    console.log(News.find({brandsIds:this._id}).fetch());
    brandNewsCount = (News.find({brandsIds:this._id}).count());
    return brandNewsCount;
  },
  brandNewsToCategorize: function() {
    var brand = this;
    brandNewsCount = (News.find({brandsIds:this._id}).count());
    brandNewsCategorizedCount = News.find({$and:[{ categorizedBy: {$exists:true} },{brandsIds:this._id}]}).count();
    console.log(brandNewsCount);
    console.log(brandNewsCategorizedCount);
    return brandNewsCount - brandNewsCategorizedCount;
  },

  brandNewsCategorized: function() {
    var brand = this;
    brandNewsCategorizedCount = News.find({$and:[{ categorizedBy: {$exists:true} },{brandsIds:this._id}]}).count();
    return brandNewsCategorizedCount;
  },

  brandNewsCategorizedToday: function() {
    var brand = this;
    var start = new Date();
    var end = new Date();
    end.setDate(end.getDate() + 1);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);

    brandNewsCategorizedTodayCount = News.find({$and:[{ categorizedBy: {$exists:true} },{brandsIds:this._id},{date:{$gt: start, $lt: end}}]}).count();
    return brandNewsCategorizedTodayCount;
  },

  newsCountToday: function() {
    var start = new Date();
    var end = new Date();
    end.setDate(end.getDate() + 1);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);

    return News.find({date:{$gt: start, $lt: end}}).count();
  },
  newsCount: function() {
    return News.find().count();
  },
  newsCategorized: function() {
    return News.find({ categorizedBy: {$exists:true} }).count();
  }, 
  newsCategorizedToday: function() {

    var start = new Date();
    var end = new Date();
    end.setDate(end.getDate() + 1);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);

    return News.find({$and:[{ categorizedBy: {$exists:true} },{date:{$gt: start, $lt: end}}]}).count();
  }, 
  newsToCategorizeToday: function() {

    var start = new Date();
    var end = new Date();
    end.setDate(end.getDate() + 1);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);

    newsCount = (News.find({date:{$gt: start, $lt: end}}).count());
    newsCategorizedCount = News.find({$and:[{ categorizedBy: {$exists:true} },{date:{$gt: start, $lt: end}}]}).count();

    return newsCount - newsCategorizedCount;
  }, 
  newsToCategorize: function() {

    newsCount = (News.find().count());
    newsCategorizedCount = News.find({ categorizedBy: {$exists:true} }).count();

    return newsCount - newsCategorizedCount;
  }, 
  newsPercentCategorize: function() {
    return Math.ceil((Math.round(NewsData.find().count())/News.find().count())*100 * 100)/100;
  },
  newsPercentCategorizeToday: function() {

    var start = new Date();
    var end = new Date();
    end.setDate(end.getDate() + 1);
    start.setHours(0,0,0,0);
    end.setHours(0,0,0,0);

    newsCount = (News.find({date:{$gt: start, $lt: end}}).count());
    newsCategorizedCount = News.find({$and:[{ categorizedBy: {$exists:true} },{date:{$gt: start, $lt: end}}]}).count();

    console.log(newsCount);
    console.log(newsCategorizedCount);

    if(newsCategorizedCount){
      return Math.ceil((Math.round(newsCategorizedCount)/newsCount)*100 * 100)/100;
    }else{
      return 0;
    }

  },

})
