"use strict";

var _Object$defineProperty = require("@babel/runtime-corejs3/core-js-stable/object/define-property");

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

_Object$defineProperty(exports, "__esModule", {
  value: true
});

exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/defineProperty"));

var _slice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/slice"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _vue = require("vue");

var _default = {
  data: function data() {
    return {
      items: [],
      query: '',
      current: -1,
      loading: false,
      selectFirst: false,
      queryParamName: 'q'
    };
  },
  computed: {
    hasItems: function hasItems() {
      return this.items.length > 0;
    },
    isEmpty: function isEmpty() {
      return !this.query;
    },
    isDirty: function isDirty() {
      return !!this.query;
    }
  },
  methods: {
    update: function update() {
      var _this = this;

      this.cancel();

      if (!this.query) {
        return this.reset();
      }

      if (this.minChars && this.query.length < this.minChars) {
        return;
      }

      this.loading = true;
      this.fetch().then(function (response) {
        if (response && _this.query) {
          var data = response.data;
          data = _this.prepareResponseData ? _this.prepareResponseData(data) : data;
          _this.items = _this.limit ? (0, _slice["default"])(data).call(data, 0, _this.limit) : data;
          _this.current = -1;
          _this.loading = false;

          if (_this.selectFirst) {
            _this.down();
          }
        }
      });
    },
    fetch: function fetch() {
      var _this2 = this;

      if (!this.$http) {
        return _vue.util.warn('You need to provide a HTTP client', this);
      }

      if (!this.src) {
        return _vue.util.warn('You need to set the `src` property', this);
      }

      var src = this.queryParamName ? this.src : this.src + this.query;
      var params = this.queryParamName ? (0, _assign["default"])((0, _defineProperty2["default"])({}, this.queryParamName, this.query), this.data) : this.data;
      var cancel = new _promise["default"](function (resolve) {
        return _this2.cancel = resolve;
      });
      var request = this.$http.get(src, {
        params: params
      });
      return _promise["default"].race([cancel, request]);
    },
    cancel: function cancel() {},
    reset: function reset() {
      this.items = [];
      this.query = '';
      this.loading = false;
    },
    setActive: function setActive(index) {
      this.current = index;
    },
    activeClass: function activeClass(index) {
      return {
        active: this.current === index
      };
    },
    hit: function hit() {
      if (this.current !== -1) {
        this.onHit(this.items[this.current]);
      }
    },
    up: function up() {
      if (this.current > 0) {
        this.current--;
      } else if (this.current === -1) {
        this.current = this.items.length - 1;
      } else {
        this.current = -1;
      }
    },
    down: function down() {
      if (this.current < this.items.length - 1) {
        this.current++;
      } else {
        this.current = -1;
      }
    },
    onHit: function onHit() {
      _vue.util.warn('You need to implement the `onHit` method', this);
    }
  }
};
exports["default"] = _default;
