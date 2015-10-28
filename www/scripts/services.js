angular.module('starter.services', [])

.factory('CajaDeRemedios', function($rootScope, $localstorage) {

  var recetas = [];
  var frecuencia = $localstorage.get('frecuencia') || 0;
  var caja = $localstorage.getObject('caja') || [];

  return {
    all: function() {
      return caja;
    },
    remove: function(remedio) {
      for (var i=0; i<caja.length; i++){
        if (caja[i].objectId == remedio.objectId){
          caja.splice(i, 1);
        }
      }
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
      for (var i = 0; i < caja.length; i++) {
        if (caja[i].objectId == remedioId) {
          return caja[i];
        }
      }
      return null;
    },
    edit: function(remedio){
      for (var i=0; i<caja.length; i++){
        if (caja[i].objectId == remedio.objectId){
            caja[i] = remedio;
            $localstorage.setObject('caja', caja);
            $rootScope.$broadcast('cambio-la-caja');
            console.log(remedio.objectId + ' editado');
            return;
        }
      }
      console.log('este remedio no está en la caja');
      return;
    },
    setFrecuencia: function(value){
      $localstorage.set('frecuencia', value);
      frecuencia = value;
    },
    getFrecuencia: function(){
      return frecuencia;
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
})
.service('SessionService', ['$rootScope',
        function($rootScope) {
            this.signup = function(name, tel, username, password) {
                return new Promise(function(resolve, reject) {
                    var user = new Parse.User();
                    user.set("username", username);
                    user.set("password", password);
                    user.set("nombreCompleto", name);
                    user.set("telefono", tel);

                    user.signUp(null, {
                        success: function(user) {
                            // Hooray! Let them use the app now.
                            console.log("user logged in!");
                            $rootScope.sessionUser = Parse.User.current();
                            resolve();
                        },
                        error: function(user, error) {
                            // Show the error message somewhere and let the user try again.
                            alert("Error: " + error.code + " " + error.message);
                            reject();
                        }
                    });
                });
            };

            this.login = function(username, password) {
                return new Promise(function(resolve, reject) {
                    Parse.User.logIn(username, password, {
                        success: function(user) {
                            // Do stuff after successful login.
                            console.log('user logged in');
                            $rootScope.$apply(function() {
                                $rootScope.sessionUser = user;
                            });
                            resolve();
                        },
                        error: function(user, error) {
                            // The login failed. Check error to see why.
                            alert("Error: " + error.code + " " + error.message);
                            reject(error);
                        }
                    });
                });
            };

            this.logout = function() {
                Parse.User.logOut();
                $rootScope.sessionUser = Parse.User.current();
                console.log('User Logged out');
            }

        }
    ]);
