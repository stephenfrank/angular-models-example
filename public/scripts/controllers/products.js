angular.module('WidgetStoreApp')

  .controller('ProductsController', function ($scope, Products, Categories) {
    $scope.products = (new Products).get();
    $scope.categories = (new Categories).get();

    /*
    Save
     */
    $scope.save = function (product) {
      product.save().success(function () {
        $scope.messages.push(['success', 'Product saved']);
        product.$edit = false;
      }).error(function () {
        $scope.messages.push(['danger', 'Unexpected error, product failed to save']);
      });
    };

    /*
    Destroy
     */
    $scope.destroy = function (product) {
      product.destroy().success(function () {
        $scope.messages.push(['success', 'Product deleted']);
        $scope.products.remove(product);
      }).error(function () {
        $scope.messages.push(['danger', 'Unexpected error, product failed to delete']);
      });

    }

  });