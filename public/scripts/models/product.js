angular.module('WidgetStoreApp').

  factory('Products', ['ModelCollection', 'Product', function (ModelCollection, Product) {
    function Products () {
      this.$model = Product;
      this.configure({url: 'api/products', cache: true});
    }

    inherit(Products, ModelCollection);

    return Products;
  }]).

  factory('Product', ['Model', 'Category', function (Model, Category) {
    function Product (data) {
      this.hydrate(data);
      this.configure({url: 'api/products/:id'});
    }

    inherit(Product, Model);

    Product.prototype.beforeHydrate = function (data) {
      data.categories = data.categories || [];
      angular.forEach(data.categories, function (c, i) {
        data.categories[i] = new Category(c);
      });
    };

    return Product;
  }])

;