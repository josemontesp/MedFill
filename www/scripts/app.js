// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'parse-angular', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $state, $cordovaNetwork, Productos) {
    //Cordova
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
      Productos.actualizar();
      console.log('online');
    })
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
      console.log('offline');
    })

    //Parse
    Parse.initialize("LTqcyG0ha3vNhMAZzoP9mbFptGLxx3Kvhpcn4kCF", "qYSZbPjccbxkRfKCOksb3kzBENtTPgBbVglwsyr3");
    $rootScope.sessionUser = Parse.User.current();
    Productos.actualizar();

    //Ionic
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      //StatusBar.styleDefault();
      //StatusBar.style(1); //status bar blanca
    }
    if(window.localStorage['didTutorial'] === "true") {
      console.log('Skip intro');
    }else{
      $state.go('intro');
    }

  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


  // Intro de la app
  .state('intro', {
    url: '/',
    templateUrl: 'intro.html',
    controller: 'IntroCtrl'
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.notificaciones', {
    url: '/notificaciones',
    views: {
      'tab-notificaciones': {
        templateUrl: 'templates/notificaciones.html',
        controller: 'NotificacionesCtrl'
      }
    }
  })
//------------------Mis remedios------------------------
  .state('tab.misRemedios', {
      url: '/misRemedios',
      views: {
        'tab-mis-remedios': {
          templateUrl: 'templates/caja-de-remedios.html',
          controller: 'MisRemediosCtrl'
        }
      }
    })
    .state('tab.misRemediosCheckOutFrecuencia', {
          url: '/misRemedios/checkOutFrecuencia',
          views: {
            'tab-mis-remedios': {
              templateUrl: 'templates/checkout-frecuencia.html',
              controller: 'CheckOutFrecuenciaCtrl'
            }
          }
        })
      .state('tab.misRemediosCheckOutDetalle', {
          url: '/misRemedios/checkOutDetalle',
          views: {
            'tab-mis-remedios': {
              templateUrl: 'templates/checkout-detalle.html',
              controller: 'CheckOutDetalleCtrl'
            }
          }
        })
        .state('tab.misRemediosCheckOutReceta', {
          url: '/misRemedios/checkOutReceta',
          views: {
            'tab-mis-remedios': {
              templateUrl: 'templates/checkout-receta.html',
              controller: 'CheckOutRecetaCtrl'
            }
          }
        })
        .state('tab.misRemediosCheckOutEnvio', {
          url: '/misRemedios/checkOutEnvio',
          views: {
            'tab-mis-remedios': {
              templateUrl: 'templates/checkout-envio.html',
              controller: 'CheckOutEnvioCtrl'
            }
          }
        })




    .state('tab.misRemediosBuscar', {
      url: '/misRemedios/buscar',
      views: {
        'tab-mis-remedios': {
          templateUrl: 'templates/buscar.html',
          controller: 'BuscarCtrl'
        }
      }
    })
      .state('tab.misRemediosBuscarProduto', {
        url: '/misRemedios/buscar/:remedioId',
        views: {
          'tab-mis-remedios': {
            templateUrl: 'templates/producto.html',
            controller: 'BuscarProductoCtrl'
          }
        }
      })
    .state('tab.editarRemedio', {
      url: '/misRemedios/:remedioId',
      views: {
        'tab-mis-remedios': {
          templateUrl: 'templates/editar-remedio.html',
          controller: 'EditarRemedioCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/misRemedios');
  // $urlRouterProvider.otherwise("/");

});
