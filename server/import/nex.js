// Meteor.settings.nexPath = "/Users/cristianojeda/Desktop/xmls/nex"

if (Meteor.settings.nexPath) {
  FileWatch.listen(Meteor.settings.nexPath, 'utf8', function(contents) {
    console.log('Importing nex file...');
    var data = xml2js.parseStringSync(contents);
    if (!data) {
      console.log('Error parsing xml - Format error');
      return;
    }

    var news = data.NexNews.Noticia.map(function(item) {
      var article = {};

      if (!item.idx) return;

      article.idx = item.idx[0];
      article.title = item.titulo && item.titulo[0];
      article.subtitle = item.bajada && item.bajada[0];
      article.body = item.cuerpo && item.cuerpo[0];
      article.url = item.url && item.url[0];
      article.pieima = item.pieima && item.pieima[0];


      // console.log(item)

      if (item.multimedia) {
        var items = item.multimedia[0].split('|').map(function(item) {
          return {
            url: item,
            fileId: 'none'
          };
        });
        article.media = items;
      }

      article.date = item.nefecha && moment(item.nefecha[0]).toDate();

      return article;
    });

    _.each(news, function(article) {
      News.upsert({ idx: article.idx }, { $set: article });
    });

    var newsData = data.NexNews.Noticia.map(function(item) {
      var article = {};

      // console.log(News.findOne({'idx':item.idx[0]}));

      article.articleId = News.findOne({'idx':item.idx[0]})._id;

      // article.typeId = item.typeId && item.typeId[0];
      // if (!article.articleId) return;

      article.data = {};

      if(item.pag){ 
        article.data.pagina =  item.pag && item.pag[0];
      } 

      if(item.autor){
        article.data.periodista =  item.autor && item.autor[0];
      } 
      
      if(item.anot){
        article.data.centimetraje =  item.anot && item.anot[0];
      } 

        if(item.medio){
        article.data.medio =  item.medio && item.medio[0];
      } 

         if(item.pais){
        article.data.pais =  item.pais && item.pais[0];
      } 
         if(item.region){
        article.data.region =  item.region && item.region[0];
      } 
         if(item.tiponot){
        article.data.tiponot =  item.tiponot && item.tiponot[0];
      } 
          if(item.duracion){
        article.data.duracion =  item.duracion && item.duracion[0];
      }
          if(item.hora){
        article.data.hora =  item.hora && item.hora[0];
      } 
 
      return article;
    });

  _.each(newsData, function(article) {
      
      var newsDataExists = NewsData.findOne({ articleId: article.articleId });

      if(!newsDataExists){
        NewsData.upsert({ articleId: article.articleId }, { $set: article });
      }

    });


    console.log('nex file imported');
    return true;
  });
}