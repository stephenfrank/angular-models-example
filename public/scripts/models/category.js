angular.module('WidgetStoreApp').

  factory('Categories', ['ModelCollection', 'Category', function (ModelCollection, Category) {
    function Categories () {
      this.$model = Category;
      this.configure({url: 'api/categories', cache: true});
    }

    inherit(Categories, ModelCollection);

    return Categories;
  }]).

  factory('Category', ['Model', function (Model) {
    function Category (data) {
      this.hydrate(data);
      this.configure({url: 'api/categories/:id'});
    }

    inherit(Category, Model);

    Category.prototype.listingURL = function () {
      return '/#/category/' + this.id;
    };

    return Category;
  }])

;