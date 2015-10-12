// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'parse-angular', 'ngCordova'])

.run(function($ionicPlatform, Productos) {
    //Parse
    Parse.initialize("LTqcyG0ha3vNhMAZzoP9mbFptGLxx3Kvhpcn4kCF", "qYSZbPjccbxkRfKCOksb3kzBENtTPgBbVglwsyr3");
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
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
//------------------Mis remedios------------------------
  .state('tab.misRemedios', {
      url: '/misRemedios',
      views: {
        'tab-mis-remedios': {
          templateUrl: 'templates/caja-de-remedios.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.misRemediosCheckOut', {
      url: '/misRemedios/checkOut',
      views: {
        'tab-mis-remedios': {
          templateUrl: 'templates/checkout.html',
          controller: 'CheckOutCtrl'
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
    .state('tab.misRemediosDetalle', {
      url: '/misRemedios/:remedioId',
      views: {
        'tab-mis-remedios': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
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

});
