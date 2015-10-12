angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, CajaDeRemedios, $ionicModal) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $ionicModal.fromTemplateUrl('templates/buscar.html', {
    scope: $scope,
    animation: 'slide-in-up',
    focusFirstInput: true
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

  $scope.hacerPedido = function(){
    alert();
    console.log('hola');
  };

  $scope.agregarRemedio = function(){
      $scope.openModal();

  };
  $scope.busqueda = {};

  $scope.clear = function(){
      alert();
      $scope.busqueda.parametro = "";
  };


  $scope.chats = CajaDeRemedios.all();
  $scope.remove = function(chat) {
    CajaDeRemedios.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, CajaDeRemedios) {
  // $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
