angular.module('starter.services', [])

.factory('CajaDeRemedios', function($rootScope, $localstorage) {

  var recetas = [];
  var caja = $localstorage.getObject('caja') || [];

  return {
    all: function() {
      return caja;
    },
    remove: function(remedio) {
      caja.splice(caja.indexOf(remedio), 1);
      $localstorage.setObject('caja', caja);
    },
    add: function(remedio){
      for (var i=0; i<caja.length; i++){
        console.log('id del producto:' + remedio.objectId );
        if (caja[i].objectId == remedio.objectId){
            console.log('Ya está este remedio en tus remedios');
            $rootScope.$broadcast('cambio-la-caja');
            return;
        }
      }
      caja.push(remedio);
      $localstorage.setObject('caja', caja);
      $rootScope.$broadcast('cambio-la-caja');
    },
    get: function(remedioId) {
      for (var i = 0; i < chats.length; i++) {
        if (caja[i].objectId == remedioId) {
          return caja[i];
        }
      }
      return null;
    }
  };
})
.factory('Productos', function($rootScope) {
  var productos = [];

  return {
    all: function() {
      return productos;
    },
    actualizar: function(){
        var Producto = Parse.Object.extend("Producto");
        var query = new Parse.Query(Producto);
        query.find({
          success: function(results){
              productos = results.map(function(v) {return v._toFullJSON([]);});
              $rootScope.$broadcast('llegaron-los-productos');
              console.log('productos sacados desde el factory');
          },
          error: function(error) {
              console.log("Error: " + error.code + " " + error.message);
          }
        });
    },
    filtrar: function(filtro){
      a = function(v){
          v = v.nombre.toLowerCase().split(' ');
          p = filtro.toLowerCase().split(' ');
          for (var j = 0; j<p.length; j++){
            for (var i = 0; i<v.length; i++){
              if (v[i].lastIndexOf(p[j], 0) === 0)
                return true;
            }
          }
          return false;
      };
      if (!filtro)
          return productos;
      else
        return productos.filter(a);
    },
    get: function(id) {
      for (var i = 0; i < productos.length; i++) {
        if (productos[i].objectId == id) {
          return productos[i];
        }
      }
      return null;
    }
  };
})
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '[]');
    }
  }
}])
.service('goBackMany',function($ionicHistory){
  return function(depth){
    var historyId = $ionicHistory.currentHistoryId();
    var history = $ionicHistory.viewHistory().histories[historyId];
    var targetViewIndex = history.stack.length - 1 - depth;
    $ionicHistory.backView(history.stack[targetViewIndex]);
    $ionicHistory.goBack();
  }
});
