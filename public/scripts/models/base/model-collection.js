
function inherit (child, parent) {
  child.prototype = new parent();
  child.prototype.constructor = parent;
  return child;
}

angular.module('WidgetStoreApp')
  .service('ModelHelper', [function () {
    function ModelHelper () {};

    ModelHelper.prototype.queryString = function queryString (obj, prefix) {
      var str = [];
      for (var p in obj) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[k];
        str.push(angular.isObject(v) ? queryString(v, k) : (k) + "=" + encodeURIComponent(v));
      }
      return str.join("&");
    }

    return new ModelHelper();
  }])

  .factory('ModelCollection', ['$http', 'ModelHelper', function ($http, ModelHelper) {

    /**
     * Constructor
     * @param data
     * @constructor
     */
    function ModelCollection (data) {
      data = data || {};

      this.$model = undefined;
      
      this.hydrate(data);
    }

    inherit(ModelCollection, Array);


    /**
     * States
     * @type {string}
     */
    ModelCollection.$LOADING = 'loading';
    ModelCollection.$SUCCESS = 'success';
    ModelCollection.$ERROR = 'error';
    ModelCollection.$state = null;

    /**
     * Hydrate
     * @param data
     */
    ModelCollection.prototype.hydrate = function (data) {
      var self = this;
      angular.forEach(data, function (item) {
        self.push(new self.$model(item));
      })
    };

    /**
     * Is Loading?
     * @param model
     * @returns {boolean}
     */
    ModelCollection.prototype.isLoading = function (model) {
      return this.$state === ModelCollection.$LOADING;
    };

    /**
     * Configure
     * @param config
     */
    ModelCollection.prototype.configure = function (config) {
      this.$config = config;
    };

    /**
     * Load models
     * @param query
     * @returns {ModelCollection}
     */
    ModelCollection.prototype.get = function (query) {
      var self = this;
      var url = this.$config.url;

      this.$state = ModelCollection.$LOADING;

      if (query) {
        url += '?' + ModelHelper.queryString(query);
      }

      this.$promise = $http.get(url, {cache: this.$config.cache}).success(function (data) {
        self.$state = ModelCollection.$SUCCESS;

        if (!data) {
          console.warn('Empty response');
          return;
        }

        self.hydrate(data);

      }).error(function () {
        self.$state = ModelCollection.$ERROR;
      });

      return this;
    };

    /**
     * Is Collection Dirty
     * @returns {boolean}
     */
    ModelCollection.prototype.isDirty = function () {
      var isDirty = false;

      angular.forEach(this, function (item) {
        if (item.isDirty()) {
          isDirty = true;
        }
      });

      return isDirty;
    };

    /**
     * Add new
     */
    ModelCollection.prototype.addNew = function () {
      var model = new this.$model();
      this.push(model);
      model.$edit = true;
    }

    /**
     * Remove
     * @param item
     */
    ModelCollection.prototype.remove = function (item) {
      var self = this;
      angular.forEach(this, function (_item, i) {
        if (item === _item) {
          self.splice(i, 1);
        }
      })
    }

    return ModelCollection;
  }]);
