var getColumns = function(fields, data, userId) {
  var rows = [];

  _.each(data, function(item) {
    var row = [];
    _.each(fields, function(field, index) {
      if(field.newsData){
        var newsData = NewsData.findOne({articleId:item._id}); 
        var value = orion.helpers.searchObjectWithDots(newsData, field.key) || null;
      } else if(field.isData) {
        var newsData = NewsData.findOne({articleId:item._id});
        var value = orion.helpers.searchObjectWithDots(newsData.data, field.key) || null;
      } 
      else if(field.isBrandData) {
        
        var newsBrands = NewsBrands.findOne({articleId:item._id});

        if(newsBrands)
        var value = orion.helpers.searchObjectWithDots(newsBrands.data[field.brandKey], field.key) || null;

      }
      else {
        var value = orion.helpers.searchObjectWithDots(item, field.key) || null;
      }

      // if(field.isData){
      //   var newsData = item.dataForUser(userId);
      //   var type = SuplementsTypes.findOne(newsData.typeId);
      // }

      value = _.isFunction(field.transform) ? field.transform(value) : value;
      value = String(value);
      row[index] = value
    });
    rows.push(row);
  });

  return rows;
};

var getData = function(data, userId){
  var rows = [];

  _.each(data, function(item) {
    var row = [];
    _.each(fields, function(field, index) {

      // var value = orion.helpers.searchObjectWithDots(item, field.key) || null;


      value = _.isFunction(field.transform) ? field.transform(value) : value;
      value = String(value);
      row[index] = value
    });
    rows.push(row);
  });

  return rows;
}


exportToExcel = function(title, fields, data, userId) {
  if(userId){
    var rows = getColumns(fields, data, userId);
  } else {
    var rows = getColumns(fields, data);
  }

  var excel = {};
  excel.cols = fields.map(function(field) {
    return {
      caption: field.title,
      type: 'string',
      width: 28.7109375
    };
  });

  excel.rows = rows;
  return Excel.execute(excel);
}
