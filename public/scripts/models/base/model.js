angular.module('WidgetStoreApp')
  .factory('Model', ['$http', function ($http) {

    function Model () {
    }

    Model.prototype.beforeHydrate = function () {};

    /**
     * Hydrate
     * @param data
     */
    Model.prototype.hydrate = function (data) {
      data = data || {};

      this.$originalData = data;

      if (this.beforeHydrate) {
        this.beforeHydrate(data);
      }

      this.$original = angular.copy(data);

      angular.extend(this, data);
    };

    /**
     * Configure
     * @param config
     */
    Model.prototype.configure = function (config) {
      this.$config = config;
    };

    /**
     * Resource update URL
     * @returns {*}
     */
    Model.prototype.resourceUpdateURL = function () {
      var self = this;

      if (! this.id) {
        throw new Error('Calling resourceUpdateURL of uninitialized entity');
      }

      var url = this.$config.url;

      var matches = url.match(/:[\$\w]+/g);

      if (matches) {
        angular.forEach(matches, function (key) {
          url = url.replace(key, self[key.substr(1)]);
        });
      }

      return url;
    };

    /**
     * Resource Create URL
     * @returns {*}
     */
    Model.prototype.resourceCreateURL = function () {
      var self = this;

      var url = this.$config.url;

      url = url.replace('/:id', '');

      var matches = url.match(/:[\$\w]+/g);

      if (matches) {
        angular.forEach(matches, function (key) {
          url = url.replace(key, self[key.substr(1)]);
        });
      }

      return url;
    };

    /**
     * Find
     * @param id
     * @returns {Model}
     */
    Model.prototype.find = function (id) {
      var self = this;
      this.$promise = $http.get(this.$config.url.replace(':id', id));

      this.$promise.then(function (response) {
        self.hydrate(response.data);
      });

      return this;
    };

    /**
     * Data
     * @returns {{}}
     */
    Model.prototype.data = function () {
      var data = {};

      angular.forEach(this, function (value, key) {
        if (key.charAt(0) !== '$') {
          data[key] = value;
        }
      });

      return data;
    }

    /**
     * Save
     * @returns {*}
     */
    Model.prototype.save = function () {
      var self = this;

      var promise;

      if (this.id) {
        promise = $http.put(this.resourceUpdateURL(), this.data());
      } else {
        promise = $http.post(this.resourceCreateURL(), this.data());
      }

      promise.success(function (data) {
        self.hydrate(data);
      });

      return promise;
    };

    /**
     * Is Dirty?
     * @returns {boolean}
     */
    Model.prototype.isDirty = function () {
      return !angular.equals(this, this.$original);
    };

    /**
     * Revert to original state
     * @returns {*}
     */
    Model.prototype.revert = function () {
      return this.hydrate(this.$originalData);
    };

    /**
     * Delete this
     * @returns {*}
     */
    Model.prototype.destroy = function () {
      return $http({url: this.resourceUpdateURL(), method: 'DELETE'});
    };

    return Model;
  }]);
