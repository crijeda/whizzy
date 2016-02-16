function getName(collection, id){
  var doc = this[collection].findOne(id);
  return doc && doc.name;
}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
            return true;
        }
    }

    return false;
}


Router.route('/admin/export/news/:exportable', function () {
  var row = ExportNews.findOne(this.params.exportable);
  exportable = row;

  var news = News.find(JSON.parse(exportable.filter)).fetch();
  var agency = Agencies.findOne({ $or: [{executivesIds: exportable.userId}, {adminsIds: exportable.userId}] });

  var meteorUrl = Meteor.absoluteUrl();
  meteorUrl = meteorUrl.slice(0, -1);

  if(exportable.type == 'pdf'){
    this.response.writeHead(200, {
      'Content-type': 'application/pdf',
      'Content-Disposition': "attachment; filename=exportable.pdf"
    });
    var doc = new PDFDocument({size: [961, 539], layout: 'portrait'/*, margin: 50*/});

    doc.pipe(this.response);

    doc.fontSize(12);

    news.forEach(function(element, index, array){
      // we add a page per news
      if(index != 0){
        doc.addPage();
      }

      // console.log('ELEM')
      // console.log(element)

      // Logo is inserted on every page
      if(agency){
        // console.log(meteorUrl + agency.logo.url);
        var result = request.getSync(meteorUrl + agency.logo.url, {
            encoding: null
        });
        var buffer = result.body;

        doc.image(buffer, 10, 10, { width: 200 });
      }

      // we put the news photo
      if(element.media){
        // console.log(meteorUrl + element.media[0].url);

        if( (element.media[0].url).includes('http') ){
          // console.log('this')
          var image = request.getSync(element.media[0].url, {
              encoding: null
          });
        }else{
          // console.log('that')
          var image = request.getSync(meteorUrl + element.media[0].url, {
              encoding: null
          });
        }

        
        var imageBuffer = image.body;
        doc.image(imageBuffer, 450, 10, { width: 500, height: 500 });
      }

      // if(element.mediumId){
      //   doc.text("Medio: " + getName('Mediums', element.mediumId), 30, 370);
      // }

      // the news data
      // data = [
      //   { title: 'TITULO', data: element.title },
      //   { title: 'MEDIO', data: getName('Mediums', element.mediumId) },
      //   // { title: 'SUPLEMENTO', data: element.title },
      //   { title: 'FECHA', data: moment(element.date).format('LL') },
      //   { title: 'CENTIMETRAJE', data: element.size },
      //   { title: 'Ad Value', data: 'Test' },
      // ];
      // options = {
      //   columns: [
      //     { id: 'title', width: 35, name: '' },
      //     { id: 'data', width: 65, name: '' }
      //   ],
      //   margins: {
      //     left: 20,
      //     top: 40,
      //     right: 20,
      //     bottom: 0
      //   },
      //   padding: {
      //     left: 10,
      //     top: 10,
      //     right: 10,
      //     bottom: 10
      //   }
      // };
      if(element.mediumId){
        doc.text("Medio: " + getName('Mediums', element.mediumId), 30, 370);
      }else{
        doc.text("Medio: " + "Sin categorizar", 30, 370);  
      }
      //doc.table(data, options)
      var extraData = element.dataForUser(exportable.userId);

      if(extraData){
        // console.log('extraData')
        // console.log(extraData)

        var suplement = SuplementsTypes.findOne(element.suplementId);
        if(suplement){
          if(suplement.title == "Diario" || suplement.title == "Revista"){
            // Factor tamaño
            if(NewsData.data.tamano){
              if(NewsData.data.tamano == "Pagina Entera"){
                var valorpagina = suplement.valueFullPage;
              } else if(NewsData.data.tamano == "3/4 Pagina"){
                var valorpagina = suplement.value34Page;
              } else if(NewsData.data.tamano == "1/2 Pagina Alto"){
                var valorpagina = suplement.valueNarrowHalfPage;
              } else if(NewsData.data.tamano == "1/2 Pagina Tradicional"){
                var valorpagina = suplement.valueWideHalfPage;
              } else if(NewsData.data.tamano == "1/4 Pagina Tradicional"){
                var valorpagina = suplement.value14Page;
              } else if(NewsData.data.tamano == "Caluga Mediana"){
                var valorpagina = suplement.valueMediumSpot;
              } else if(NewsData.data.tamano == "Caluga Pequeña"){
                var valorpagina = suplement.valueSmallSpot;
              } else if(NewsData.data.tamano == "Banner Horizontal"){
                var valorpagina = suplement.valueHorizontalBanner;
              } else if(NewsData.data.tamano == "Banner Vertical"){
                var valorpagina = suplement.valueVerticalBanner;
              }

              // Factor dia y valor color dia
              var factordia = 1;
              var valorColor = 0;

              var diasemana = moment(element.date).format('dddd');
              if (diasemana == "Lunes" || diasemana == "Martes" || diasemana == "Miércoles" || diasemana == "Jueves"){
                if(suplement.valueMondayThursday){
                  var factordia = suplement.valueMondayThursday;
                }
                if(suplement.valueMondayThursdayColor){
                  var valorColor = suplement.valueMondayThursdayColor;
                }

              } else if(diasemana == "Viernes"){
                if(suplement.valueFriday){
                  var factordia = suplement.valueFriday;
                }
                if(suplement.valueFridayColor){
                  var valorColor = suplement.valueFridayColor;
                }
              } else if(diasemana == "Sábado"){
                if(suplement.valueSaturday){
                  var factordia = suplement.valueSaturday;
                }
                if(suplement.valueSaturdayColor){
                  var valorColor = suplement.valueSaturdayColor;
                }
              } else if(diasemana == "Domingo"){
                if(suplement.valueSunday){
                  var factordia = suplement.valueSunday;
                }
                if(suplement.valueSundayColor){
                  var valorColor = suplement.valueSundayColor;
                }
              }

              // Valor Color
              if(NewsData.data.blancoynegro == false){
                var valorColor = 0;
              }

              // Factor seccion
              if(NewsData.seccion){
                var cases = {
                  'Portada' : function(){
                    return suplement.portada;
                  },
                  'Contraportada' : function(){
                    return suplement.contraportada;
                  },
                  'Política' : function(){
                    return suplement.politics;
                  },
                  'Economía / Empresas' : function(){
                    return suplement.economy;
                  },
                  'Nacional Actualidad' : function(){
                    return suplement.nacionalActualidad;
                  },
                  'Deportes' : function(){
                    return suplement.sports;
                  },
                  'Tecnología' : function(){
                    return suplement.tecnology;
                  },
                  'Internacional' : function(){
                    return suplement.international;
                  },
                  'Automotriz' : function(){
                    return suplement.automotriz;
                  },
                  'Opinión/Cartas' : function(){
                    return suplement.opinion;
                  },
                  'Salud' : function(){
                    return suplement.health;
                  },
                  'Mercado/Marketing/Lanzamiento' : function(){
                    return suplement.market;
                  },
                  'Tendencias/ Panoramas/ Espectáculos/ Cultura' : function(){
                    return suplement.panoramas;
                  },
                  'Sociales' : function(){
                    return suplement.social;
                  }
                }
                if (cases[NewsData.seccion]) {
                  var factorseccion = cases[NewsData.seccion]();
                } else {
                  var factorseccion = 1;
                }
              }

              var valor = (valorpagina * factordia * factorseccion) + valorcolor;
            } else {
              var valor = suplement.value;
            }

            // Si Valor tamaño pagina existe : Valor tamaño pagina * factor dia * factor seccion + Valor color dia (Sin color=0)
                       //Sino Valor general
          } else if(suplement.title == "Online"){
            var valor = suplement.value;
          } else if(suplement.title == "Radio" || suplement.title == "Tv"){
            var valor = suplement.value * (NewsData.data.duracion/30);
          }
        } else {
          var valor = "NN"
        }


      } else {
        
        var valor = "NN";
      }
      doc.text("TITULO: " + element.title);
      //doc.text("SUPLEMENTO: " + element.suplementId);
      doc.text("FECHA: " + moment(element.date).format('LL'));
      // doc.text("CENTIMETRAJE: " + element.size);
      doc.text("VALOR APROX: " + valor);
    });
    doc.end();
    //this.response.end( doc.outputSync() );

  } else if (exportable.type == 'excel') {
    // console.log('excel')
    // console.log(this)

    var fields = [
      { key: '_id', title: 'ID' },
      {
        key: 'createdBy',
        title: 'Usuario',
        transform: function(createdBy) {
          var user = Meteor.users.findOne(createdBy);
          return user && user.profile.name;
        }
      },
      {
        key: 'mediumId',
        title: 'Medio',
        transform: function(id) {
          var medium = Mediums.findOne(id);
          return medium && medium.name;
        }
      },
      {
        key: 'suplementId',
        title: 'Suplemento',
        transform: function(id) {
          var suplement = Suplements.findOne(id);
          return suplement && suplement.name;
        }
      },
      {
        key: 'date',
        title: 'Fecha',
        newsData: false,
        transform: function(date){
          var fecha = moment(date).format('LL');
          return fecha;
        }
      },

      // { key: 'brandsIds', title: 'Marcas' },

      // {
      //   key: 'brandsIds',
      //   title: 'Marcas',
      //   newsData: false,
      //   transform: function(array) {
      //     // var names = [];
      //     // _.each(array, function(id){
      //     //   var brand = Brands.findOne(id);
      //     //   names[] = brand && brand.name;
      //     //   // return brand && brand.name;
      //     // });
      //     // return names;

      //     return _.map(array, function(id)
      //       {
      //         var brand = Brands.findOne(id);
      //         return = brand && brand.name;
      //       })
      //   }
      // },

      // { key: 'section', title: 'Sección' },
      // { key: 'size', title: 'Tamaño' },
      // { key: 'colorType', title: 'Color' },
      // {
      //   key: 'groupId',
      //   title: 'Grupo',
      //   transform: function(id) {
      //     var group = Groups.findOne(id);
      //     return group && group.name;
      //   }
      // },
      //{ key: 'size', title: 'Producto' },
      // { key: 'size', title: 'Campaña' },
      // { key: 'sentiment', title: 'Sentimiento' },
      // { key: 'relevance', title: 'Relevancia' },
      // { key: 'typeOfNote', title: 'Tipo de nota' },
      // { key: 'opinion', title: 'Opinion' },
      // { key: 'topic', title: 'Tema' },
      // { key: 'size', title: 'Centimetraje' },
      // { key: 'page', title: 'Páginas' },

      { key: 'title', title: 'Título' },
      { key: 'body', title: 'Cuerpo' },
      // { key: 'date', title: 'Fecha' },
      // { key: 'duration', title: 'Duración' },
      // { key: 'journalist', title: 'Periodista' },
      // { key: 'agency', title: 'Agencia' },
      // { key: 'mentionsTheBrandInTheTitle', title: 'Mención Título' },
      // { key: 'mentionsTheBrandInTheBody', title: 'Mención Cuerpo' },
      // { key: 'media[0].url', title: 'Foto' },
      // { key: 'secretMessage0Exists', title: 'Clave' },
      // { key: 'secretMessage1Exists', title: 'Clave 1' },
      // { key: 'secretMessage2Exists', title: 'Clave 2' },
      // { key: 'secretMessage3Exists', title: 'Clave 3' },
      // { key: 'secretMessage4Exists', title: 'Clave 4' },
      // { key: 'secretMessage5Exists', title: 'Clave 5' },
      // { key: 'spokesmans[0]', title: 'Vocero' },
      // {
      //   key: 'suplementId',
      //   title: 'Suplemento',
      //   transform: function(id) {
      //     var suplement = Suplements.findOne(id);
      //     return suplement && suplement.name;
      //   }
      // },
      { key: 'url', title: 'Link' },
      // { key: 'mediumId', title: 'Medio' }
      
      // { key: 'url', title: 'Link' }

    ];

    news.forEach(function(element, index, array){



        var newsBrands = NewsBrands.find({articleId:element._id});
        newsBrands.forEach(function(singleNewsBrandsData){

          var brandsKeys = Object.keys(singleNewsBrandsData.data)

          brandsKeys.forEach(function(brandKey){

            var brandData = singleNewsBrandsData.data[brandKey];

            var brandDataKeys = Object.keys(brandData);
            brandDataKeys.forEach(function(brandDataKey){
              
              var newField = {
                key: brandDataKey,
                brandKey: brandKey,
                title: brandKey +'.' + brandDataKey,
                isBrandData: true
              };

              if(containsObject(newField, fields)){
                // console.log('ya esta');
              } else {
                fields.push(newField);
              }

            })

          })
        })

        var newsData = NewsData.findOne({articleId:element._id});  
        var type = SuplementsTypes.findOne(newsData.typeId);
        if (!type || !type.attributes) return;
        type.attributes.forEach(function(elem, i, arr){
          console.log(elem)
          var newField = {
            key: elem.key,
            title: elem.title,
            isData: true
          };

          if(containsObject(newField, fields)){
            // console.log('ya esta');
          } else {
            fields.push(newField);
          }

          console.log('fields 2');
          console.log(fields);


        });

       
    });

    var title = "exportableExcel";
    file = exportToExcel(title, fields, news, exportable.userId);
    var headers = {
      'Content-type': 'application/vnd.openxmlformats',
      'Content-Disposition': 'attachment; filename=' + title + '.xlsx'
    };

    this.response.writeHead(200, headers);
    this.response.end(file, 'binary');

  } else if(exportable.type == 'powerpoint'){
    var pptx = officegen( 'pptx' );
    pptx.setWidescreen(true);

    var title = "exportablePPTX";
    var headers = {
      'Content-type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'Content-Disposition': 'attachment; filename=' + title + '.pptx'
    };
    news.forEach(function(element, index, array){
      // we create a slide per each news
      slide = pptx.makeNewSlide();
      // slide.font_size(1200);

      // we add the company's logo on each slide
      if(agency){
        var result = request.getSync(meteorUrl + agency.logo.url, {
            encoding: null
        });
        var buffer = result.body;
        slide.addImage( buffer, {x: 25, y: 25, cx: 250, cy: 100} );
      }

     if(element.media){
        // console.log(meteorUrl + element.media[0].url);

        if( (element.media[0].url).includes('http') ){
          // console.log('this')
          var image = request.getSync(element.media[0].url, {
              encoding: null
          });
        }else{
          // console.log('that')
          var image = request.getSync(meteorUrl + element.media[0].url, {
              encoding: null
          });
        }
        var imageBuffer = image.body;
        slide.addImage( imageBuffer, {x: 700, y: 25, cx: 500, cy: 560} );
      }

      // agregamos la tabla
      var extraData = element.dataForUser(exportable.userId);

      var rows = [];

      if(element.mediumId){
        rows.push(['Medio', getName('Mediums', element.mediumId)]);
      }else{
        rows.push(['Medio', "Sin medio"]);
      }
      
      if(extraData){
        var suplement = SuplementsTypes.findOne(element.suplementId);
        if(suplement){
          if(suplement.title == "Diario" || suplement.title == "Revista"){
            // Factor tamaño
            if(NewsData.data.tamano){
              if(NewsData.data.tamano == "Pagina Entera"){
                var valorpagina = suplement.valueFullPage;
              } else if(NewsData.data.tamano == "3/4 Pagina"){
                var valorpagina = suplement.value34Page;
              } else if(NewsData.data.tamano == "1/2 Pagina Alto"){
                var valorpagina = suplement.valueNarrowHalfPage;
              } else if(NewsData.data.tamano == "1/2 Pagina Tradicional"){
                var valorpagina = suplement.valueWideHalfPage;
              } else if(NewsData.data.tamano == "1/4 Pagina Tradicional"){
                var valorpagina = suplement.value14Page;
              } else if(NewsData.data.tamano == "Caluga Mediana"){
                var valorpagina = suplement.valueMediumSpot;
              } else if(NewsData.data.tamano == "Caluga Pequeña"){
                var valorpagina = suplement.valueSmallSpot;
              } else if(NewsData.data.tamano == "Banner Horizontal"){
                var valorpagina = suplement.valueHorizontalBanner;
              } else if(NewsData.data.tamano == "Banner Vertical"){
                var valorpagina = suplement.valueVerticalBanner;
              }

              // Factor dia y valor color dia
              var factordia = 1;
              var valorColor = 0;

              var diasemana = moment(element.date).format('dddd');
              if (diasemana == "Lunes" || diasemana == "Martes" || diasemana == "Miércoles" || diasemana == "Jueves"){
                if(suplement.valueMondayThursday){
                  var factordia = suplement.valueMondayThursday;
                }
                if(suplement.valueMondayThursdayColor){
                  var valorColor = suplement.valueMondayThursdayColor;
                }

              } else if(diasemana == "Viernes"){
                if(suplement.valueFriday){
                  var factordia = suplement.valueFriday;
                }
                if(suplement.valueFridayColor){
                  var valorColor = suplement.valueFridayColor;
                }
              } else if(diasemana == "Sábado"){
                if(suplement.valueSaturday){
                  var factordia = suplement.valueSaturday;
                }
                if(suplement.valueSaturdayColor){
                  var valorColor = suplement.valueSaturdayColor;
                }
              } else if(diasemana == "Domingo"){
                if(suplement.valueSunday){
                  var factordia = suplement.valueSunday;
                }
                if(suplement.valueSundayColor){
                  var valorColor = suplement.valueSundayColor;
                }
              }

              // Valor Color
              if(NewsData.data.blancoynegro == false){
                var valorColor = 0;
              }

              // Factor seccion
              if(NewsData.seccion){
                var cases = {
                  'Portada' : function(){
                    return suplement.portada;
                  },
                  'Contraportada' : function(){
                    return suplement.contraportada;
                  },
                  'Política' : function(){
                    return suplement.politics;
                  },
                  'Economía / Empresas' : function(){
                    return suplement.economy;
                  },
                  'Nacional Actualidad' : function(){
                    return suplement.nacionalActualidad;
                  },
                  'Deportes' : function(){
                    return suplement.sports;
                  },
                  'Tecnología' : function(){
                    return suplement.tecnology;
                  },
                  'Internacional' : function(){
                    return suplement.international;
                  },
                  'Automotriz' : function(){
                    return suplement.automotriz;
                  },
                  'Opinión/Cartas' : function(){
                    return suplement.opinion;
                  },
                  'Salud' : function(){
                    return suplement.health;
                  },
                  'Mercado/Marketing/Lanzamiento' : function(){
                    return suplement.market;
                  },
                  'Tendencias/ Panoramas/ Espectáculos/ Cultura' : function(){
                    return suplement.panoramas;
                  },
                  'Sociales' : function(){
                    return suplement.social;
                  }
                }
                if (cases[NewsData.seccion]) {
                  var factorseccion = cases[NewsData.seccion]();
                } else {
                  var factorseccion = 1;
                }
              }

              var valor = (valorpagina * factordia * factorseccion) + valorcolor;
            } else {
              var valor = suplement.value;
            }

            // Si Valor tamaño pagina existe : Valor tamaño pagina * factor dia * factor seccion + Valor color dia (Sin color=0)
                       //Sino Valor general
          } else if(suplement.title == "Online"){
            var valor = suplement.value;
          } else if(suplement.title == "Radio" || suplement.title == "Tv"){
            var valor = suplement.value * (NewsData.data.duracion/30);
          }
        } else {
          var valor = "NN"
        }

      } else {
        
        var valor = "NN"
      }
      rows.push(['Titulo', element.title]);
      rows.push(['Fecha',  moment(element.date).format('LL')]);
      rows.push(['Ad Value', valor]);

      // slide.addTable(rows, {x: 25, y: 500, cx: '50%', cy: '100%'});
      slide.addTable(rows, {x: '301000', y: '4881000', cx: '3596000', columnWidth: 3257600, font_size: 54 });

    });

    this.response.writeHead(200, headers);
    pptx.generate(this.response);

  }
}, {name: 'news.export.file', where: 'server'});

Router.route('/', function() {
  this.router.go(Options.get('adminHomeRoute'), {}, { replaceState: true });
});

Router.route('/admin/export/news',  {
  layoutTemplate: 'orionBootstrapLayout',
  name: 'news.export'
});

orion.accounts.addProtectedRoute('news.export');

Router.route('/admin/news-show/:_id',  {
  layoutTemplate: 'orionBootstrapLayout',
  name: 'collections.news.show'
});

orion.accounts.addProtectedRoute('collections.news.show');

Router.route('/admin/news-data/:_id',  {
  layoutTemplate: 'orionBootstrapLayout',
  name: 'collections.news.data'
});

orion.accounts.addProtectedRoute('collections.news.data');

Router.route('/admin/dashboard',  {
  layoutTemplate: 'orionBootstrapLayout',
  name: 'dashboard'
});

orion.accounts.addProtectedRoute('dashboard');

if (Meteor.isClient) {
  orion.links.add({
    identifier: 'dashboard',
    title: 'Dashboard',
    routeName: 'dashboard',
    activeRouteRegex: 'dashboard',
    index: 1,
    permission: 'dashboard.show'
  });
}
