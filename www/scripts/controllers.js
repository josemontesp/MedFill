angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, CajaDeRemedios, $ionicModal, $state) {
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
    });

    $scope.hacerPedido = function() {
        $state.go('tab.misRemediosCheckOut');
    };


    $scope.buscarRemedio = function() {
        $state.go('tab.misRemediosBuscar');
    };

    $scope.remove = function(remedio) {
        CajaDeRemedios.remove(remedio);
    };
})


.controller('BuscarCtrl', function($scope, Productos, $ionicHistory) {
    $scope.busqueda = {
        lista: [],
        parametro: ''
    };

    $scope.$on('llegaron-los-productos', function(event, args) {
        $scope.busqueda.lista = Productos.all();
    });

    $scope.clear = function() {
        alert();
        $scope.busqueda.parametro = "";
    };

    $scope.busqueda.buscar = function() {
        $scope.busqueda.lista = Productos.filtrar($scope.busqueda.parametro);
    };

    $scope.$watch('busqueda.parametro', function() {
        if (Productos.all()) {
            $scope.busqueda.buscar();
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

.controller('CheckOutCtrl', function($scope, $stateParams, CajaDeRemedios, $cordovaCamera, $cordovaFile) {
    
    $scope.remedios = CajaDeRemedios.all();

    $scope.numFormat = function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // 1
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


.controller('ChatDetailCtrl', function($scope, $stateParams, CajaDeRemedios) {

    // $scope.chat = Chats.get($stateParams.chatId);
    $scope.refresh = function() {

    };
})

.controller('AccountCtrl', function($scope, $state) {
    $scope.settings = {
        enableFriends: true
    };

    $scope.toIntro = function(){ //temporal, para poder volver a ver el intro
        window.localStorage['didTutorial'] = "false";
        $state.go('intro');
    };
})

.controller('IntroCtrl', function($scope, $state) {
 
  $scope.startApp = function() {
    $state.go('tab.misRemedios');

    // Set a flag that we finished the tutorial
    window.localStorage['didTutorial'] = true;
   };

  // Called to navigate to the main app
  var startApp = function() {
    $state.go('tab.misRemedios');

    // Set a flag that we finished the tutorial
    window.localStorage['didTutorial'] = true;
  };

  //No this is silly
  // Check if the user already did the tutorial and skip it if so
if(window.localStorage['didTutorial'] === "true") {
    console.log('Skip intro');
    startApp();
  }
  else{
  setTimeout(function () {
        navigator.splashscreen.hide();
    }, 750);
   }
  

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