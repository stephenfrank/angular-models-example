angular.module('WidgetStoreApp', [])

  .run(function ($rootScope) {
    $rootScope.messages = [];

    $rootScope.closeMessage = function (message) {
      angular.forEach($rootScope.messages, function (_m, i) {
        if (_m === message) {
          $rootScope.messages.splice(i, 1);
        }
      })
    };
  });