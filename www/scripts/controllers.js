angular.module('starter.controllers', [])

.controller('NotificacionesCtrl', function($scope) {
    $scope.actualizar = function(){
        $scope.$broadcast('scroll.refreshComplete');
    };
})

.controller('MisRemediosCtrl', function($scope, CajaDeRemedios, $ionicModal, $state) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});
    $scope.remedios = CajaDeRemedios.all();
    $scope.$on('cambio-la-caja', function(event, args) {
        $scope.remedios = CajaDeRemedios.all();
        console.log('hola');
    });

    $scope.siguiente = function() {
        $state.go('tab.misRemediosCheckOutFrecuencia');
    };


    $scope.buscarRemedio = function() {
        $state.go('tab.misRemediosBuscar');
    };

    $scope.remove = function(remedio) {
        CajaDeRemedios.remove(remedio);
    };
})

.controller('BuscarCtrl', function($scope, Productos, $ionicHistory, $cordovaNetwork) {
     $scope.$on('$ionicView.beforeEnter', function(e) {
        $scope.busqueda.parametro = '';
    });

    $scope.online = function(){
        return $cordovaNetwork.isOnline();
    };

    $scope.busqueda = {
        lista: [],
        parametro: ''
    };

    $scope.$on('llegaron-los-productos', function(event, args) {
        $scope.busqueda.lista = Productos.all();
        $scope.$broadcast('scroll.refreshComplete');
    });

    $scope.clear = function() {
        alert();
        $scope.busqueda.parametro = "";
    };

    $scope.actualizar = function(){
        Productos.actualizar();
    };

    $scope.busqueda.buscar = function() {
        $scope.busqueda.lista = Productos.filtrar($scope.busqueda.parametro);
    };

    $scope.$watch('busqueda.parametro', function() {
        if (Productos.all()) {
            $scope.busqueda.buscar();
        }else{
            Productos.actualizar();
        }
    });
})

.controller('BuscarProductoCtrl', function($scope, $stateParams, CajaDeRemedios, Productos, $ionicHistory, goBackMany) {
    $scope.$on('llegaron-los-productos', function(event, args) {
        $scope.producto = Productos.get($stateParams.remedioId);
    });
    $scope.producto = Productos.get($stateParams.remedioId);
    $scope.agregar = function() {
        CajaDeRemedios.add($scope.producto);
        goBackMany(2);
    };
})

.controller('CheckOutFrecuenciaCtrl', function($scope, $stateParams, CajaDeRemedios, $state) {
    $scope.frecuenciaAnterior = CajaDeRemedios.getFrecuencia();
    $scope.form = {choice : $scope.frecuenciaAnterior};
    $scope.$watch('form.choice', function(newValue, oldValue){
        CajaDeRemedios.setFrecuencia($scope.form.choice); 
    });

    $scope.siguiente = function() {
        $state.go('tab.misRemediosCheckOutDetalle');
    };
})

.controller('CheckOutDetalleCtrl', function($scope, $stateParams, CajaDeRemedios, $state) {
    $scope.siguiente = function() {
        $state.go('tab.misRemediosCheckOutReceta');
        return;
        //Hay que crear la view pago para ejecutar esto
        for(var i = 0; i < $scope.remedios.length; i++){
            if ($scope.remedios[i].conReceta){
                $state.go('tab.misRemediosCheckOutReceta');
                return;
            }
        }
        $state.go('tab.misRemediosCheckOutPago');
    };
    $scope.remedios = CajaDeRemedios.all();
    $scope.frecuencia = CajaDeRemedios.getFrecuencia();
    $scope.totalPrice = function(){
        var total = 0;
        for(count=0; count<$scope.remedios.length; count++){
            total += $scope.remedios[count].precio*$scope.remedios[count].dosisDiaria*$scope.frecuencia;
        }
        return total;
    };

    $scope.numFormat = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
})

.controller('CheckOutRecetaCtrl', function($scope, $stateParams, $state, CajaDeRemedios, $cordovaCamera, $cordovaFile) {
    $scope.siguiente = function() {
        $state.go('tab.misRemediosCheckOutEnvio');
    }
    $scope.images = [];
    console.log($scope.images);
    $scope.addImage = function() {
        // 2
        var options = {
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA, // Camera.PictureSourceType.PHOTOLIBRARY
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            popoverOptions: CameraPopoverOptions,
        };

        // 3
        $cordovaCamera.getPicture(options).then(function(imageData) {

            // 4
            onImageSuccess(imageData);

            function onImageSuccess(fileURI) {
                createFileEntry(fileURI);
            }

            function createFileEntry(fileURI) {
                window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
            }

            // 5
            function copyFile(fileEntry) {
                var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                var newName = makeid() + name;

                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                        fileEntry.copyTo(
                            fileSystem2,
                            newName,
                            onCopySuccess,
                            fail
                        );
                    },
                    fail);
            }

            // 6
            function onCopySuccess(entry) {
                $scope.$apply(function() {
                    $scope.images.push(entry.nativeURL);
                    console.log($scope.images);
                });
            }

            function fail(error) {
                console.log("fail: " + error.code);
            }

            function makeid() {
                var text = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                for (var i = 0; i < 5; i++) {
                    text += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                return text;
            }

        }, function(err) {
            console.log(err);
        });
    }

    $scope.urlForImage = function(imageName) {
        var name = imageName.substr(imageName.lastIndexOf('/') + 1);
        var trueOrigin = cordova.file.dataDirectory + name;
        return trueOrigin;
    }
})

.controller('CheckOutEnvioCtrl', function($scope, $ionicModal, $rootScope, $cordovaNetwork, CajaDeRemedios, goBackMany) {
    $ionicModal.fromTemplateUrl('templates/login-modal.html', {
            scope: $scope,
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
        }).then(function(modal) {
            $scope.modal = modal;
        }).then(function(modal) {
            if (!$rootScope.sessionUser) {
                $scope.openModal();
            }
            //auto appear/dissapear
            $scope.$watch(function() {
                return $rootScope.sessionUser;
            }, function(newVal, oldVal) {
                if (!$rootScope.sessionUser) {
                    $scope.openModal();
                } else {
                    $scope.modal.hide();
                }
            });
        });

        $scope.openModal = function() {
            $scope.modal.show();
        };
        $scope.closeModal = function() {
            $scope.modal.hide();
        };

        $scope.$on('$destroy', function() {
            $scope.modal.remove();
        });

        $scope.formData = {
            direccion: '',
            telefono: '',
            comentarios: ''
        };

        $scope.volverALaCaja = function(){
            goBackMany(4);
            console.log('going back...');
        };

        $scope.hacerPedido = function(){
            var items = [];
            var remedios = CajaDeRemedios.all();
            var frecuencia = CajaDeRemedios.getFrecuencia();

            //Creando items de compra
            var ItemCompra = Parse.Object.extend("ItemCompra");
            for (var i = 0; i < remedios.length; i++){
                console.log(remedios[i].objectId);
                var item = new ItemCompra();
                item.set('producto', {"__type":"Pointer","className":"Producto","objectId": remedios[i].objectId});
                item.set('dosisDiaria', remedios[i].dosisDiaria);
                item.set('cantidad', remedios[i].dosisDiaria*frecuencia);
                console.log(frecuencia);
                items.push(item);
            }

            //Creando pedido
            var Pedido = Parse.Object.extend("Pedido");
            var pedido = new Pedido();
            pedido.set('items', items);
            pedido.set('recurrencia', parseInt(frecuencia));
            pedido.set('direccion', $scope.formData.direccion);
            pedido.set('usuario', $rootScope.sessionUser);
            pedido.save().then(function(pedido){
                console.log('guardado exitosamente');
                $scope.volverALaCaja();
            }, function(error){
                console.log("Error: " + error.code + " " + error.message);
            });


        };

})

.controller('loginModalController', function($scope, $rootScope, SessionService) {
    $scope.credenciales = {
        signup: {},
        login: {}
    };
    $scope.login = function() {
        console.log($scope.credenciales.login.password);
        console.log($scope.credenciales.login.email);
        SessionService.login($scope.credenciales.login.email, $scope.credenciales.login.password).then(function(resp) {
            $scope.modal.hide();
        }, function(err) {
            console.log(error);
        });
    }

    $scope.signup = function() {
        SessionService.signup(
            $scope.credenciales.signup.nombreCompleto,
            $scope.credenciales.signup.telefono,
            $scope.credenciales.signup.email,
            $scope.credenciales.signup.password
        ).then(function(resp) {
            $scope.modal.hide();
        }, function(err) {});
    };
})

.controller('EditarRemedioCtrl', function($scope, $stateParams, CajaDeRemedios, goBackMany) {

    // $scope.chat = Chats.get($stateParams.chatId);
    $scope.producto = CajaDeRemedios.get($stateParams.remedioId);
    $scope.$watch('producto.mg', function(newValue, oldValue){
        CajaDeRemedios.edit($scope.producto);
    });
    $scope.remove = function(id){
        CajaDeRemedios.remove(CajaDeRemedios.get(id));
        goBackMany(1);
    };

    $scope.refresh = function() {

    };
})

.controller('AccountCtrl', function($scope, $state, $rootScope, $cordovaNetwork, SessionService) {
    console.log($cordovaNetwork.isOnline());
    $rootScope.$watch('sessionUser', function(newVal, oldVal){
        $scope.user = $rootScope.sessionUser;
        console.log($scope.user);
    });
    $scope.user = $rootScope.sessionUser;
    
    $scope.settings = {
        enableFriends: true
    };

    $scope.toIntro = function(){ //temporal, para poder volver a ver el intro
        window.localStorage['didTutorial'] = "false";
        $state.go('intro', {}, {reload: true});
    };

    $scope.logout = function(){
        SessionService.logout();
    }
})

.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
    $scope.$on('$ionicView.beforeEnter', function(e) {
        $ionicSlideBoxDelegate.slide(0);
    });
 
  $scope.startApp = function() {
    $state.go('tab.misRemedios');
    window.localStorage['didTutorial'] = true;
   };

  var startApp = function() {
    $state.go('tab.misRemedios');
    window.localStorage['didTutorial'] = true;
  };

  // Move to the next slide
  $scope.next = function() {
    $scope.$broadcast('slideBox.nextSlide');
  };

  // Our initial right buttons
  var rightButtons = [
    {
      content: 'Next',
      type: 'button-positive button-clear',
      tap: function(e) {
        // Go to the next slide on tap
        $scope.next();
      }
    }
  ];
  
  // Our initial left buttons
  var leftButtons = [
    {
      content: 'Skip',
      type: 'button-positive button-clear',
      tap: function(e) {
        // Start the app on tap
        startApp();
      }
    }
  ];

  // Bind the left and right buttons to the scope
  $scope.leftButtons = leftButtons;
  $scope.rightButtons = rightButtons;


  // Called each time the slide changes
  $scope.slideChanged = function(index) {

    // Check if we should update the left buttons
    if(index > 0) {
      // If this is not the first slide, give it a back button
      $scope.leftButtons = [
        {
          content: 'Back',
          type: 'button-positive button-clear',
          tap: function(e) {
            // Move to the previous slide
            $scope.$broadcast('slideBox.prevSlide');
          }
        }
      ];
    } else {
      // This is the first slide, use the default left buttons
      $scope.leftButtons = leftButtons;
    }
    
    // If this is the last slide, set the right button to
    // move to the app
    if(index == 2) {
      $scope.rightButtons = [
        {
          content: 'Start using MyApp',
          type: 'button-positive button-clear',
          tap: function(e) {
            startApp();
          }
        }
      ];
    } else {
      // Otherwise, use the default buttons
      $scope.rightButtons = rightButtons;
    }
  };
})