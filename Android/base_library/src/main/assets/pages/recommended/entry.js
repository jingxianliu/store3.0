// { "framework": "Vue"} 

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 82);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (name) {
  return name;
};

exports.getQueryParams = getQueryParams;
exports.getUrlParam = getUrlParam;
exports.createLink = createLink;
exports.hasNetwork = hasNetwork;
exports.setDownload = setDownload;
exports.finishedInstall = finishedInstall;
exports.statistics = statistics;
var storage = weex.requireModule('storage');
var myModule = weex.requireModule('myModule');
var stream = weex.requireModule('stream');

var API = 'http://112.50.251.23:10096/api/v1';
var baseImg = 'http://112.50.251.23:10096';
var staticImg = 'http://112.50.251.23:10096';
var coutlyAPI = 'http://117.48.231.54:11095';
exports.API = API;
exports.baseImg = baseImg;
exports.staticImg = staticImg;
function getQueryParams(url) {
  var splitedUrl = (url || '').split('?');
  if (splitedUrl.length < 2) {
    return {};
  }
  var qs = splitedUrl[1];
  qs = qs.split('#')[0];
  if (qs.length === 0) {
    return {};
  }

  var paramPairs = qs.split('&');
  var params = {};
  paramPairs.forEach(function (e) {
    if (!e || e.length === 0) {
      return;
    }
    var pair = e.split('=');
    if (pair.length < 2) {
      return;
    }
    var key = pair[0];
    var value = pair.slice(1, pair.length).join('=');
    if (value.length === 0) {
      return;
    }
    params[decodeURIComponent(key)] = decodeURIComponent(value);
  });
  return params;
}

function getUrlParam(key, url) {
  var reg = new RegExp('[?|&]' + key + '=([^&]+)');
  var match = url.match(reg);
  return match && match[1];
}

function createLink(page) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var args = [];
  Object.keys(params).forEach(function (key) {
    if (typeof params[key] === 'string') {
      args.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
    }
  });
  if (WXEnvironment.platform === 'Web') {
    // eslint-disable-line
    var tplPathList = (getUrlParam('_wx_tpl', location.href) || '').split('/');
    tplPathList[tplPathList.length - 2] = page;
    args.unshift('_wx_tpl=' + tplPathList.join('/')); // eslint-disable-line
    return '' + location.origin + location.pathname + '?' + args.join('&');
  }
  console.log('daixin:', weex.config.bundleUrl);
  var baseURL = 'pages/';
  var bundlePathList = '' + baseURL + page + '/entry.js';
  // const bundlePathList = weex.config.bundleUrl.split('/')
  // bundlePathList[bundlePathList.length - 2] = page
  // return `${bundlePathList.join('/')}?${args.join('&')}`
  return bundlePathList + '?' + args.join('&');
}

// 网络判断
function hasNetwork(that) {
  // return true
  if (!myModule.getInternetStatus()) {
    // 无网处理
    that.isNoNetwork = true;
    that.isReqError = false;
    return false;
  } else {
    return true;
  }
}

// 存入下载队列
function setDownload(name) {
  storage.getItem('installApps', function (e) {
    var arr = [];
    if (e.result === 'success') {
      arr = e.data.includes('com') ? JSON.parse(e.data) : [];
    } else {
      arr = [];
    }
    console.log('set-------------------', name, e.result, arr);
    if (!arr.includes(name)) {
      arr.push(name);
      storage.setItem('installApps', arr, function (e) {
        console.log('存入下载队列：', arr);
      });
    }
  });
}

// 安装完成 更新本地应用
function finishedInstall(value) {
  console.log('dx:finishedInstall-', value);
  if (value.includes('packages')) {
    value = JSON.parse(value);
    storage.getItem('localApps', function (e) {
      if (e.result === 'success') {
        console.log('本地已安装应用：', value.packages[0]);
        var data = JSON.parse(e.data);
        var index = data.apps.findIndex(function (item) {
          return item.packageName === value.packages[0].packageName;
        });
        if (index !== -1) {
          data.apps.splice(index, 1);
        }
        data.apps.push(value.packages[0]);
        storage.setItem('localApps', data, function (e) {
          console.log('安装成功写入本地缓存:', data, e);
        });
      }
    });
    storage.getItem('installApps', function (e) {
      if (e.result === 'success') {
        var data = JSON.parse(e.data);
        data.splice(data.findIndex(function (item) {
          return item === value.packages[0].packageName;
        }), 1);
        storage.setItem('installApps', data, function (e) {
          console.log(e);
        });
      }
    });
  }
}

// 统计上报
function statistics(type, index, packageName) {
  console.log('dx:统计', type);
  var userInfo = JSON.parse(myModule.getUserInfo());
  var ottUsername = userInfo.MACAddress;
  var timestamp = new Date().getTime();
  var hour = new Date().getHours();
  var daw = new Date().getDay();
  var getBody = '/i?app_key=0f030ca6b46be056b81203743ca9974eec7d5c0b&timestamp=' + timestamp + '&hour=' + hour + '&dow=' + daw + '&events=[{"key":"' + packageName + '","count":1,"timestamp":' + timestamp + ',"hour": ' + hour + ',"dow": ' + daw + ',"segmentation":{"' + type + '":"count"},"sum":0}]&sdk_version=18.01&sdk_name=java-native-android&device_id=' + ottUsername + '&checksum=f4c75f11c99a6910e9d6a39015a06915fdeab84a';
  stream.fetch({
    method: 'GET',
    url: 'http://112.50.251.23:11095' + encodeURI(getBody),
    type: 'json'
  }, function (res) {
    console.log(res);
  });
  // const plateName = ['recommend', 'education', 'parentchild']
  // const clickName = ['download', 'unload', 'help', 'manager']
  // let sentData = ''
  // if (type === 'plat') {
  //   // 板块
  //   sentData = `"${plateName[index]}":"${packageName}"`
  // } else if (type === 'click') {
  //   sentData = `"${clickName[index]}":"${packageName}"`
  // }
  // let getBody = `?app_key=9efe80412273a1dcd3500ea37349d0ef&ott_username=${ottUsername}&operate={${sentData}}`
  // stream.fetch(
  //   {
  //     method: 'GET',
  //     url: `${coutlyAPI}/operate${getBody}`,
  //     type: 'json'
  //   },
  //   res => {
  //     console.log(res)
  //   }
  // )
}

/***/ }),

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vuex = __webpack_require__(2);

var _vuex2 = _interopRequireDefault(_vuex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Vue.use(_vuex2.default);
exports.default = new _vuex2.default.Store({
  state: {
    localApps: [],
    downList: [],
    updateNum: 0,
    updataList: [],
    users: '123'
  },

  actions: {
    FETCH_USER: function FETCH_USER(_ref, _ref2) {
      // 获取新的用户数据，然后提交给 mutation
      // return fetchUser(id).then(user => commit('SET_USER', { user}))

      var commit = _ref.commit;
      var id = _ref2.id;
    }
  },

  mutations: {
    SET_USER: function SET_USER(state, _ref3) {
      // 修改 users 中的数据，并且触发界面更新
      // Vue.set(state.users, user.id, user)

      var user = _ref3.user;
    },
    localApps: function localApps(state, arr) {
      console.log('存储本地应用-----------');
      var newArr = [];
      for (var i = 0; i < arr.length; i++) {
        var element = arr[i].update;
        if (element) {
          newArr.push(arr[i]);
        }
      }
      state.updateNum = newArr.length;
      state.updataList = newArr;
      state.localApps = arr;
    },
    downList: function downList(state, packageName) {
      console.log('下载队列更新=============');
      state.downList.push(packageName);
    },
    popList: function popList(state, packageName) {
      console.log('剔除下载队列=========', packageName);
      state.downList.shift();
    },
    updataList: function updataList(state, arr) {
      console.log('本地应用需更新列表');
    }
  }

});

/***/ }),

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Store", function() { return Store; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapState", function() { return mapState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapMutations", function() { return mapMutations; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapGetters", function() { return mapGetters; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mapActions", function() { return mapActions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createNamespacedHelpers", function() { return createNamespacedHelpers; });
/**
 * vuex v3.1.1
 * (c) 2019 Evan You
 * @license MIT
 */
function applyMixin (Vue) {
  var version = Number(Vue.version.split('.')[0]);

  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit });
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    var _init = Vue.prototype._init;
    Vue.prototype._init = function (options) {
      if ( options === void 0 ) options = {};

      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit;
      _init.call(this, options);
    };
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    var options = this.$options;
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store;
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store;
    }
  }
}

var target = typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
    ? global
    : {};
var devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

function devtoolPlugin (store) {
  if (!devtoolHook) { return }

  store._devtoolHook = devtoolHook;

  devtoolHook.emit('vuex:init', store);

  devtoolHook.on('vuex:travel-to-state', function (targetState) {
    store.replaceState(targetState);
  });

  store.subscribe(function (mutation, state) {
    devtoolHook.emit('vuex:mutation', mutation, state);
  });
}

/**
 * Get the first item that pass the test
 * by second argument function
 *
 * @param {Array} list
 * @param {Function} f
 * @return {*}
 */

/**
 * forEach for object
 */
function forEachValue (obj, fn) {
  Object.keys(obj).forEach(function (key) { return fn(obj[key], key); });
}

function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

function isPromise (val) {
  return val && typeof val.then === 'function'
}

function assert (condition, msg) {
  if (!condition) { throw new Error(("[vuex] " + msg)) }
}

function partial (fn, arg) {
  return function () {
    return fn(arg)
  }
}

// Base data struct for store's module, package with some attribute and method
var Module = function Module (rawModule, runtime) {
  this.runtime = runtime;
  // Store some children item
  this._children = Object.create(null);
  // Store the origin module object which passed by programmer
  this._rawModule = rawModule;
  var rawState = rawModule.state;

  // Store the origin module's state
  this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
};

var prototypeAccessors = { namespaced: { configurable: true } };

prototypeAccessors.namespaced.get = function () {
  return !!this._rawModule.namespaced
};

Module.prototype.addChild = function addChild (key, module) {
  this._children[key] = module;
};

Module.prototype.removeChild = function removeChild (key) {
  delete this._children[key];
};

Module.prototype.getChild = function getChild (key) {
  return this._children[key]
};

Module.prototype.update = function update (rawModule) {
  this._rawModule.namespaced = rawModule.namespaced;
  if (rawModule.actions) {
    this._rawModule.actions = rawModule.actions;
  }
  if (rawModule.mutations) {
    this._rawModule.mutations = rawModule.mutations;
  }
  if (rawModule.getters) {
    this._rawModule.getters = rawModule.getters;
  }
};

Module.prototype.forEachChild = function forEachChild (fn) {
  forEachValue(this._children, fn);
};

Module.prototype.forEachGetter = function forEachGetter (fn) {
  if (this._rawModule.getters) {
    forEachValue(this._rawModule.getters, fn);
  }
};

Module.prototype.forEachAction = function forEachAction (fn) {
  if (this._rawModule.actions) {
    forEachValue(this._rawModule.actions, fn);
  }
};

Module.prototype.forEachMutation = function forEachMutation (fn) {
  if (this._rawModule.mutations) {
    forEachValue(this._rawModule.mutations, fn);
  }
};

Object.defineProperties( Module.prototype, prototypeAccessors );

var ModuleCollection = function ModuleCollection (rawRootModule) {
  // register root module (Vuex.Store options)
  this.register([], rawRootModule, false);
};

ModuleCollection.prototype.get = function get (path) {
  return path.reduce(function (module, key) {
    return module.getChild(key)
  }, this.root)
};

ModuleCollection.prototype.getNamespace = function getNamespace (path) {
  var module = this.root;
  return path.reduce(function (namespace, key) {
    module = module.getChild(key);
    return namespace + (module.namespaced ? key + '/' : '')
  }, '')
};

ModuleCollection.prototype.update = function update$1 (rawRootModule) {
  update([], this.root, rawRootModule);
};

ModuleCollection.prototype.register = function register (path, rawModule, runtime) {
    var this$1 = this;
    if ( runtime === void 0 ) runtime = true;

  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, rawModule);
  }

  var newModule = new Module(rawModule, runtime);
  if (path.length === 0) {
    this.root = newModule;
  } else {
    var parent = this.get(path.slice(0, -1));
    parent.addChild(path[path.length - 1], newModule);
  }

  // register nested modules
  if (rawModule.modules) {
    forEachValue(rawModule.modules, function (rawChildModule, key) {
      this$1.register(path.concat(key), rawChildModule, runtime);
    });
  }
};

ModuleCollection.prototype.unregister = function unregister (path) {
  var parent = this.get(path.slice(0, -1));
  var key = path[path.length - 1];
  if (!parent.getChild(key).runtime) { return }

  parent.removeChild(key);
};

function update (path, targetModule, newModule) {
  if (process.env.NODE_ENV !== 'production') {
    assertRawModule(path, newModule);
  }

  // update target module
  targetModule.update(newModule);

  // update nested modules
  if (newModule.modules) {
    for (var key in newModule.modules) {
      if (!targetModule.getChild(key)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            "[vuex] trying to add a new module '" + key + "' on hot reloading, " +
            'manual reload is needed'
          );
        }
        return
      }
      update(
        path.concat(key),
        targetModule.getChild(key),
        newModule.modules[key]
      );
    }
  }
}

var functionAssert = {
  assert: function (value) { return typeof value === 'function'; },
  expected: 'function'
};

var objectAssert = {
  assert: function (value) { return typeof value === 'function' ||
    (typeof value === 'object' && typeof value.handler === 'function'); },
  expected: 'function or object with "handler" function'
};

var assertTypes = {
  getters: functionAssert,
  mutations: functionAssert,
  actions: objectAssert
};

function assertRawModule (path, rawModule) {
  Object.keys(assertTypes).forEach(function (key) {
    if (!rawModule[key]) { return }

    var assertOptions = assertTypes[key];

    forEachValue(rawModule[key], function (value, type) {
      assert(
        assertOptions.assert(value),
        makeAssertionMessage(path, key, type, value, assertOptions.expected)
      );
    });
  });
}

function makeAssertionMessage (path, key, type, value, expected) {
  var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";
  if (path.length > 0) {
    buf += " in module \"" + (path.join('.')) + "\"";
  }
  buf += " is " + (JSON.stringify(value)) + ".";
  return buf
}

var Vue; // bind on install

var Store = function Store (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  // Auto install if it is not done yet and `window` has `Vue`.
  // To allow users to avoid auto-installation in some cases,
  // this code should be placed here. See #731
  if (!Vue && typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
    assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
    assert(this instanceof Store, "store must be called with the new operator.");
  }

  var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
  var strict = options.strict; if ( strict === void 0 ) strict = false;

  // store internal state
  this._committing = false;
  this._actions = Object.create(null);
  this._actionSubscribers = [];
  this._mutations = Object.create(null);
  this._wrappedGetters = Object.create(null);
  this._modules = new ModuleCollection(options);
  this._modulesNamespaceMap = Object.create(null);
  this._subscribers = [];
  this._watcherVM = new Vue();

  // bind commit and dispatch to self
  var store = this;
  var ref = this;
  var dispatch = ref.dispatch;
  var commit = ref.commit;
  this.dispatch = function boundDispatch (type, payload) {
    return dispatch.call(store, type, payload)
  };
  this.commit = function boundCommit (type, payload, options) {
    return commit.call(store, type, payload, options)
  };

  // strict mode
  this.strict = strict;

  var state = this._modules.root.state;

  // init root module.
  // this also recursively registers all sub-modules
  // and collects all module getters inside this._wrappedGetters
  installModule(this, state, [], this._modules.root);

  // initialize the store vm, which is responsible for the reactivity
  // (also registers _wrappedGetters as computed properties)
  resetStoreVM(this, state);

  // apply plugins
  plugins.forEach(function (plugin) { return plugin(this$1); });

  var useDevtools = options.devtools !== undefined ? options.devtools : Vue.config.devtools;
  if (useDevtools) {
    devtoolPlugin(this);
  }
};

var prototypeAccessors$1 = { state: { configurable: true } };

prototypeAccessors$1.state.get = function () {
  return this._vm._data.$$state
};

prototypeAccessors$1.state.set = function (v) {
  if (process.env.NODE_ENV !== 'production') {
    assert(false, "use store.replaceState() to explicit replace store state.");
  }
};

Store.prototype.commit = function commit (_type, _payload, _options) {
    var this$1 = this;

  // check object-style commit
  var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;

  var mutation = { type: type, payload: payload };
  var entry = this._mutations[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown mutation type: " + type));
    }
    return
  }
  this._withCommit(function () {
    entry.forEach(function commitIterator (handler) {
      handler(payload);
    });
  });
  this._subscribers.forEach(function (sub) { return sub(mutation, this$1.state); });

  if (
    process.env.NODE_ENV !== 'production' &&
    options && options.silent
  ) {
    console.warn(
      "[vuex] mutation type: " + type + ". Silent option has been removed. " +
      'Use the filter functionality in the vue-devtools'
    );
  }
};

Store.prototype.dispatch = function dispatch (_type, _payload) {
    var this$1 = this;

  // check object-style dispatch
  var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;

  var action = { type: type, payload: payload };
  var entry = this._actions[type];
  if (!entry) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] unknown action type: " + type));
    }
    return
  }

  try {
    this._actionSubscribers
      .filter(function (sub) { return sub.before; })
      .forEach(function (sub) { return sub.before(action, this$1.state); });
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn("[vuex] error in before action subscribers: ");
      console.error(e);
    }
  }

  var result = entry.length > 1
    ? Promise.all(entry.map(function (handler) { return handler(payload); }))
    : entry[0](payload);

  return result.then(function (res) {
    try {
      this$1._actionSubscribers
        .filter(function (sub) { return sub.after; })
        .forEach(function (sub) { return sub.after(action, this$1.state); });
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn("[vuex] error in after action subscribers: ");
        console.error(e);
      }
    }
    return res
  })
};

Store.prototype.subscribe = function subscribe (fn) {
  return genericSubscribe(fn, this._subscribers)
};

Store.prototype.subscribeAction = function subscribeAction (fn) {
  var subs = typeof fn === 'function' ? { before: fn } : fn;
  return genericSubscribe(subs, this._actionSubscribers)
};

Store.prototype.watch = function watch (getter, cb, options) {
    var this$1 = this;

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof getter === 'function', "store.watch only accepts a function.");
  }
  return this._watcherVM.$watch(function () { return getter(this$1.state, this$1.getters); }, cb, options)
};

Store.prototype.replaceState = function replaceState (state) {
    var this$1 = this;

  this._withCommit(function () {
    this$1._vm._data.$$state = state;
  });
};

Store.prototype.registerModule = function registerModule (path, rawModule, options) {
    if ( options === void 0 ) options = {};

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
    assert(path.length > 0, 'cannot register the root module by using registerModule.');
  }

  this._modules.register(path, rawModule);
  installModule(this, this.state, path, this._modules.get(path), options.preserveState);
  // reset store to update getters...
  resetStoreVM(this, this.state);
};

Store.prototype.unregisterModule = function unregisterModule (path) {
    var this$1 = this;

  if (typeof path === 'string') { path = [path]; }

  if (process.env.NODE_ENV !== 'production') {
    assert(Array.isArray(path), "module path must be a string or an Array.");
  }

  this._modules.unregister(path);
  this._withCommit(function () {
    var parentState = getNestedState(this$1.state, path.slice(0, -1));
    Vue.delete(parentState, path[path.length - 1]);
  });
  resetStore(this);
};

Store.prototype.hotUpdate = function hotUpdate (newOptions) {
  this._modules.update(newOptions);
  resetStore(this, true);
};

Store.prototype._withCommit = function _withCommit (fn) {
  var committing = this._committing;
  this._committing = true;
  fn();
  this._committing = committing;
};

Object.defineProperties( Store.prototype, prototypeAccessors$1 );

function genericSubscribe (fn, subs) {
  if (subs.indexOf(fn) < 0) {
    subs.push(fn);
  }
  return function () {
    var i = subs.indexOf(fn);
    if (i > -1) {
      subs.splice(i, 1);
    }
  }
}

function resetStore (store, hot) {
  store._actions = Object.create(null);
  store._mutations = Object.create(null);
  store._wrappedGetters = Object.create(null);
  store._modulesNamespaceMap = Object.create(null);
  var state = store.state;
  // init all modules
  installModule(store, state, [], store._modules.root, true);
  // reset vm
  resetStoreVM(store, state, hot);
}

function resetStoreVM (store, state, hot) {
  var oldVm = store._vm;

  // bind store public getters
  store.getters = {};
  var wrappedGetters = store._wrappedGetters;
  var computed = {};
  forEachValue(wrappedGetters, function (fn, key) {
    // use computed to leverage its lazy-caching mechanism
    // direct inline function use will lead to closure preserving oldVm.
    // using partial to return function with only arguments preserved in closure enviroment.
    computed[key] = partial(fn, store);
    Object.defineProperty(store.getters, key, {
      get: function () { return store._vm[key]; },
      enumerable: true // for local getters
    });
  });

  // use a Vue instance to store the state tree
  // suppress warnings just in case the user has added
  // some funky global mixins
  var silent = Vue.config.silent;
  Vue.config.silent = true;
  store._vm = new Vue({
    data: {
      $$state: state
    },
    computed: computed
  });
  Vue.config.silent = silent;

  // enable strict mode for new vm
  if (store.strict) {
    enableStrictMode(store);
  }

  if (oldVm) {
    if (hot) {
      // dispatch changes in all subscribed watchers
      // to force getter re-evaluation for hot reloading.
      store._withCommit(function () {
        oldVm._data.$$state = null;
      });
    }
    Vue.nextTick(function () { return oldVm.$destroy(); });
  }
}

function installModule (store, rootState, path, module, hot) {
  var isRoot = !path.length;
  var namespace = store._modules.getNamespace(path);

  // register in namespace map
  if (module.namespaced) {
    store._modulesNamespaceMap[namespace] = module;
  }

  // set state
  if (!isRoot && !hot) {
    var parentState = getNestedState(rootState, path.slice(0, -1));
    var moduleName = path[path.length - 1];
    store._withCommit(function () {
      Vue.set(parentState, moduleName, module.state);
    });
  }

  var local = module.context = makeLocalContext(store, namespace, path);

  module.forEachMutation(function (mutation, key) {
    var namespacedType = namespace + key;
    registerMutation(store, namespacedType, mutation, local);
  });

  module.forEachAction(function (action, key) {
    var type = action.root ? key : namespace + key;
    var handler = action.handler || action;
    registerAction(store, type, handler, local);
  });

  module.forEachGetter(function (getter, key) {
    var namespacedType = namespace + key;
    registerGetter(store, namespacedType, getter, local);
  });

  module.forEachChild(function (child, key) {
    installModule(store, rootState, path.concat(key), child, hot);
  });
}

/**
 * make localized dispatch, commit, getters and state
 * if there is no namespace, just use root ones
 */
function makeLocalContext (store, namespace, path) {
  var noNamespace = namespace === '';

  var local = {
    dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._actions[type]) {
          console.error(("[vuex] unknown local action type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      return store.dispatch(type, payload)
    },

    commit: noNamespace ? store.commit : function (_type, _payload, _options) {
      var args = unifyObjectStyle(_type, _payload, _options);
      var payload = args.payload;
      var options = args.options;
      var type = args.type;

      if (!options || !options.root) {
        type = namespace + type;
        if (process.env.NODE_ENV !== 'production' && !store._mutations[type]) {
          console.error(("[vuex] unknown local mutation type: " + (args.type) + ", global type: " + type));
          return
        }
      }

      store.commit(type, payload, options);
    }
  };

  // getters and state object must be gotten lazily
  // because they will be changed by vm update
  Object.defineProperties(local, {
    getters: {
      get: noNamespace
        ? function () { return store.getters; }
        : function () { return makeLocalGetters(store, namespace); }
    },
    state: {
      get: function () { return getNestedState(store.state, path); }
    }
  });

  return local
}

function makeLocalGetters (store, namespace) {
  var gettersProxy = {};

  var splitPos = namespace.length;
  Object.keys(store.getters).forEach(function (type) {
    // skip if the target getter is not match this namespace
    if (type.slice(0, splitPos) !== namespace) { return }

    // extract local getter type
    var localType = type.slice(splitPos);

    // Add a port to the getters proxy.
    // Define as getter property because
    // we do not want to evaluate the getters in this time.
    Object.defineProperty(gettersProxy, localType, {
      get: function () { return store.getters[type]; },
      enumerable: true
    });
  });

  return gettersProxy
}

function registerMutation (store, type, handler, local) {
  var entry = store._mutations[type] || (store._mutations[type] = []);
  entry.push(function wrappedMutationHandler (payload) {
    handler.call(store, local.state, payload);
  });
}

function registerAction (store, type, handler, local) {
  var entry = store._actions[type] || (store._actions[type] = []);
  entry.push(function wrappedActionHandler (payload, cb) {
    var res = handler.call(store, {
      dispatch: local.dispatch,
      commit: local.commit,
      getters: local.getters,
      state: local.state,
      rootGetters: store.getters,
      rootState: store.state
    }, payload, cb);
    if (!isPromise(res)) {
      res = Promise.resolve(res);
    }
    if (store._devtoolHook) {
      return res.catch(function (err) {
        store._devtoolHook.emit('vuex:error', err);
        throw err
      })
    } else {
      return res
    }
  });
}

function registerGetter (store, type, rawGetter, local) {
  if (store._wrappedGetters[type]) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(("[vuex] duplicate getter key: " + type));
    }
    return
  }
  store._wrappedGetters[type] = function wrappedGetter (store) {
    return rawGetter(
      local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
    )
  };
}

function enableStrictMode (store) {
  store._vm.$watch(function () { return this._data.$$state }, function () {
    if (process.env.NODE_ENV !== 'production') {
      assert(store._committing, "do not mutate vuex store state outside mutation handlers.");
    }
  }, { deep: true, sync: true });
}

function getNestedState (state, path) {
  return path.length
    ? path.reduce(function (state, key) { return state[key]; }, state)
    : state
}

function unifyObjectStyle (type, payload, options) {
  if (isObject(type) && type.type) {
    options = payload;
    payload = type;
    type = type.type;
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof type === 'string', ("expects string as the type, but found " + (typeof type) + "."));
  }

  return { type: type, payload: payload, options: options }
}

function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      );
    }
    return
  }
  Vue = _Vue;
  applyMixin(Vue);
}

/**
 * Reduce the code which written in Vue.js for getting the state.
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} states # Object's item can be a function which accept state and getters for param, you can do something for state and getters in it.
 * @param {Object}
 */
var mapState = normalizeNamespace(function (namespace, states) {
  var res = {};
  normalizeMap(states).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedState () {
      var state = this.$store.state;
      var getters = this.$store.getters;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapState', namespace);
        if (!module) {
          return
        }
        state = module.context.state;
        getters = module.context.getters;
      }
      return typeof val === 'function'
        ? val.call(this, state, getters)
        : state[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

/**
 * Reduce the code which written in Vue.js for committing the mutation
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} mutations # Object's item can be a function which accept `commit` function as the first param, it can accept anthor params. You can commit mutation and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
var mapMutations = normalizeNamespace(function (namespace, mutations) {
  var res = {};
  normalizeMap(mutations).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedMutation () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      // Get the commit method from store
      var commit = this.$store.commit;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapMutations', namespace);
        if (!module) {
          return
        }
        commit = module.context.commit;
      }
      return typeof val === 'function'
        ? val.apply(this, [commit].concat(args))
        : commit.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

/**
 * Reduce the code which written in Vue.js for getting the getters
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} getters
 * @return {Object}
 */
var mapGetters = normalizeNamespace(function (namespace, getters) {
  var res = {};
  normalizeMap(getters).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    // The namespace has been mutated by normalizeNamespace
    val = namespace + val;
    res[key] = function mappedGetter () {
      if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
        return
      }
      if (process.env.NODE_ENV !== 'production' && !(val in this.$store.getters)) {
        console.error(("[vuex] unknown getter: " + val));
        return
      }
      return this.$store.getters[val]
    };
    // mark vuex getter for devtools
    res[key].vuex = true;
  });
  return res
});

/**
 * Reduce the code which written in Vue.js for dispatch the action
 * @param {String} [namespace] - Module's namespace
 * @param {Object|Array} actions # Object's item can be a function which accept `dispatch` function as the first param, it can accept anthor params. You can dispatch action and do any other things in this function. specially, You need to pass anthor params from the mapped function.
 * @return {Object}
 */
var mapActions = normalizeNamespace(function (namespace, actions) {
  var res = {};
  normalizeMap(actions).forEach(function (ref) {
    var key = ref.key;
    var val = ref.val;

    res[key] = function mappedAction () {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      // get dispatch function from store
      var dispatch = this.$store.dispatch;
      if (namespace) {
        var module = getModuleByNamespace(this.$store, 'mapActions', namespace);
        if (!module) {
          return
        }
        dispatch = module.context.dispatch;
      }
      return typeof val === 'function'
        ? val.apply(this, [dispatch].concat(args))
        : dispatch.apply(this.$store, [val].concat(args))
    };
  });
  return res
});

/**
 * Rebinding namespace param for mapXXX function in special scoped, and return them by simple object
 * @param {String} namespace
 * @return {Object}
 */
var createNamespacedHelpers = function (namespace) { return ({
  mapState: mapState.bind(null, namespace),
  mapGetters: mapGetters.bind(null, namespace),
  mapMutations: mapMutations.bind(null, namespace),
  mapActions: mapActions.bind(null, namespace)
}); };

/**
 * Normalize the map
 * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
 * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
 * @param {Array|Object} map
 * @return {Object}
 */
function normalizeMap (map) {
  return Array.isArray(map)
    ? map.map(function (key) { return ({ key: key, val: key }); })
    : Object.keys(map).map(function (key) { return ({ key: key, val: map[key] }); })
}

/**
 * Return a function expect two param contains namespace and map. it will normalize the namespace and then the param's function will handle the new namespace and the map.
 * @param {Function} fn
 * @return {Function}
 */
function normalizeNamespace (fn) {
  return function (namespace, map) {
    if (typeof namespace !== 'string') {
      map = namespace;
      namespace = '';
    } else if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/';
    }
    return fn(namespace, map)
  }
}

/**
 * Search a special module from store by namespace. if module not exist, print error message.
 * @param {Object} store
 * @param {String} helper
 * @param {String} namespace
 * @return {Object}
 */
function getModuleByNamespace (store, helper, namespace) {
  var module = store._modulesNamespaceMap[namespace];
  if (process.env.NODE_ENV !== 'production' && !module) {
    console.error(("[vuex] module namespace not found in " + helper + "(): " + namespace));
  }
  return module
}

var index_esm = {
  Store: Store,
  install: install,
  version: '3.1.1',
  mapState: mapState,
  mapMutations: mapMutations,
  mapGetters: mapGetters,
  mapActions: mapActions,
  createNamespacedHelpers: createNamespacedHelpers
};

/* harmony default export */ __webpack_exports__["default"] = (index_esm);



/***/ }),

/***/ 28:
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(29)
)

/* script */
__vue_exports__ = __webpack_require__(30)

/* template */
var __vue_template__ = __webpack_require__(35)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "D:\\store3.0\\emas\\src\\pages\\recommended\\entry.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-5916b303"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),

/***/ 29:
/***/ (function(module, exports) {

module.exports = {
  "main": {
    "width": "750",
    "flexDirection": "row"
  },
  "main-b": {
    "paddingLeft": "31.25",
    "paddingTop": "24.22",
    "paddingBottom": "39.06",
    "height": "335.94",
    "flexWrap": "wrap"
  },
  "first": {
    "width": "322.27",
    "height": "257.81",
    "marginRight": "9.38",
    "textAlign": "center"
  },
  "second": {
    "width": "195.31",
    "height": "257.81",
    "marginRight": "9.38"
  },
  "third": {
    "width": "156.25",
    "height": "162.5",
    "marginRight": "9.38",
    "marginBottom": "9.38"
  },
  "four": {
    "width": "156.25",
    "height": "85.94",
    "marginRight": "9.38"
  }
}

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(5)
)

/* script */
__vue_exports__ = __webpack_require__(6)

/* template */
var __vue_template__ = __webpack_require__(7)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "D:\\store3.0\\emas\\src\\components\\progress.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-fbce1cc6"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),

/***/ 30:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _seat = __webpack_require__(31);

var _seat2 = _interopRequireDefault(_seat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dom = weex.requireModule('dom'); //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var animation = weex.requireModule('animation');
exports.default = {
  components: {
    Seat: _seat2.default
  },
  props: {
    seatDatas: Array,
    seatCode: String,
    pageShow: Boolean,
    vodHide: Boolean
  },
  data: function data() {
    return {
      translatex: 0
    };
  },

  computed: {
    code: function code() {
      if (this.seatCode.includes('A')) {
        return parseInt(this.seatCode.slice(1));
      } else {
        return null;
      }
    },
    shouldShow: function shouldShow() {
      console.log('--------' + this.pageShow + '----------');
      return {
        opacity: this.pageShow ? 1 : 0
      };
    }
  },
  methods: {
    test: function test(old, now) {
      var _this = this;

      console.log('---------test------' + old + '----' + now + '------');
      var oldElement = old ? this.$refs['' + old][0] : null;
      var element = now ? this.$refs['' + now][0] : null;
      var mainElement = this.$refs.mainDiv;
      var maxWidth = 750;
      var minWidth = Math.round(80 / 1920 * 750 * 100) / 100;
      // const interspace = Math.round(23 / 1920 * 750 * 100) / 100
      console.log(minWidth, maxWidth);
      // 第一个位置
      if (oldElement) {
        animation.transition(oldElement, {
          styles: {
            transform: 'scale(1.0)'
          },
          duration: 1
        });
        if (old === 'A0') {
          this.$refs.A0[0].scaleVod(false);
        }
      }
      if (element) {
        dom.getComponentRect(element, function (option) {
          console.log('----\u4E0B\u4E00\u5C4F\u7126\u70B9\u4F4D\u7F6E' + option.size.left + '-' + option.size.width + '---');
          var size = option.size;
          if (size.left + size.width > maxWidth) {
            // 超出一屏 右
            var isDouble = _this.seatDatas.length % 2 === 0;
            var isLast = _this.seatDatas.length - now.slice(1);
            if (isDouble) {
              // 1 2 true
              isLast = isLast === 1 || isLast === 2;
            } else {
              // 1 true
              isLast = isLast === 1;
            }
            if (isLast) {
              // this.translatex += size.left + size.width - maxWidth + interspace
              _this.translatex += 166;
            } else {
              _this.translatex += 148;
              // this.translatex += size.left + size.width - maxWidth + interspace
            }
            console.log('------\u52A8\u753B\u53F3X\u8DDD\u79BB-' + _this.translatex + 'px------');
            animation.transition(mainElement, {
              styles: {
                transform: 'translateX(-' + _this.translatex + 'px)'
              },
              duration: 1
            });
          } else if (size.left < minWidth) {
            // 左
            if (parseInt(now.slice(1)) === 0) {
              _this.translatex = 0;
            } else {
              _this.translatex = _this.translatex - (minWidth - size.left);
            }
            console.log('------\u52A8\u753B\u5DE6X\u8DDD\u79BB' + _this.translatex + 'px------');
            animation.transition(mainElement, {
              styles: {
                transform: 'translateX(-' + _this.translatex + 'px)'
              },
              duration: 1
            });
          }
        });
        animation.transition(element, {
          styles: {
            transform: 'scale(1.06)'
          },
          duration: 1
        }, function (res) {
          if (now === 'A0') {
            _this.$refs.A0[0].scaleVod(true);
          }
        });
      }
    },

    // 回到初始状态
    tabChange: function tabChange() {
      this.translatex = 0;
      animation.transition(this.$refs.mainDiv, {
        styles: {
          transform: 'translateX(0px)'
        },
        duration: 300,
        timingFunction: 'ease',
        delay: 100
      });
    },
    restart: function restart() {
      this.$refs.A0[0].restart();
    },
    resume: function resume() {
      this.$refs.A0[0].resume();
    },
    stop: function stop() {
      this.$refs.A0[0].stop();
    },
    pause: function pause() {
      this.$refs.A0[0].pause();
    },
    setProgress: function setProgress(value, index) {
      console.log('-------------progress-------', value);
      this.$refs['A' + index][0].setProgress(value);
    },
    appearOverlay: function appearOverlay(bool) {
      console.log(bool);
      // const duration = 5000
      // if (this.$refs['mainDiv']) {
      // animation.transition(
      //   this.$refs['mainDiv'],
      //   {
      //     styles: {
      //       opacity: bool ? 1 : 0
      //     },
      //     duration,
      //     timingFunction: 'ease-out',
      //     delay: 0
      //   },
      //   () => {
      //     console.log('apper dddddd')
      //   })
      // }
    }
  }
};

/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(32)
)

/* script */
__vue_exports__ = __webpack_require__(33)

/* template */
var __vue_template__ = __webpack_require__(34)
__vue_options__ = __vue_exports__ = __vue_exports__ || {}
if (
  typeof __vue_exports__.default === "object" ||
  typeof __vue_exports__.default === "function"
) {
if (Object.keys(__vue_exports__).some(function (key) { return key !== "default" && key !== "__esModule" })) {console.error("named exports are not supported in *.vue files.")}
__vue_options__ = __vue_exports__ = __vue_exports__.default
}
if (typeof __vue_options__ === "function") {
  __vue_options__ = __vue_options__.options
}
__vue_options__.__file = "D:\\store3.0\\emas\\src\\components\\seat.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-62788516"
__vue_options__.style = __vue_options__.style || {}
__vue_styles__.forEach(function (module) {
  for (var name in module) {
    __vue_options__.style[name] = module[name]
  }
})
if (typeof __register_static_styles__ === "function") {
  __register_static_styles__(__vue_options__._scopeId, __vue_styles__)
}

module.exports = __vue_exports__


/***/ }),

/***/ 32:
/***/ (function(module, exports) {

module.exports = {
  "seat": {
    "borderStyle": "solid",
    "borderRadius": "7.81",
    "borderWidth": "1.56",
    "borderColor": "#ffffff"
  },
  "bd_border": {
    "position": "absolute",
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0,
    "zIndex": 999
  },
  "tag": {
    "position": "absolute",
    "top": "-2.34",
    "right": "-2.73",
    "width": "41.02",
    "height": "41.02",
    "zIndex": 888
  },
  "tag-big": {
    "width": "48.44",
    "height": "48.44"
  },
  "tag-opacity": {
    "opacity": 0
  },
  "bd0": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "width": "292.58",
    "height": "257.81"
  },
  "img": {
    "flex": 1,
    "borderRadius": "7.81"
  },
  "l-seat": {
    "position": "absolute",
    "bottom": 0,
    "left": 0,
    "height": "46.88",
    "width": "195.31",
    "flexDirection": "row",
    "alignItems": "center",
    "fontSize": "15",
    "color": "#ffffff"
  },
  "l-seat-icon": {
    "width": "28.13",
    "height": "28.13",
    "marginLeft": "8.98",
    "marginRight": "10.55"
  },
  "l-seat-text1": {
    "fontSize": "15",
    "color": "#ffffff"
  },
  "l-seat-text": {
    "fontSize": "8",
    "alignItems": "center",
    "width": "128.91",
    "lines": 1,
    "color": "rgba(255,255,255,0.6)"
  },
  "m-seat": {
    "position": "absolute",
    "bottom": 0,
    "left": 0,
    "height": "46.88",
    "width": "156.25",
    "flexDirection": "row",
    "alignItems": "center",
    "fontSize": "15",
    "color": "#ffffff"
  },
  "m-seat-icon": {
    "width": "28.13",
    "height": "28.13",
    "marginRight": "7.81",
    "marginLeft": "8.98"
  },
  "m-seat-text1": {
    "fontSize": "15",
    "color": "#ffffff"
  },
  "m-seat-text": {
    "fontSize": "8",
    "width": "117.19",
    "lines": 1,
    "color": "rgba(255,255,255,0.6)"
  },
  "s-seat": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "width": "156.25",
    "height": "85.94"
  },
  "s-seat-icon": {
    "position": "absolute",
    "top": "10.55",
    "left": "8.98",
    "width": "28.13",
    "height": "28.13"
  },
  "s-seat-div": {
    "position": "absolute",
    "bottom": 0,
    "left": 0,
    "height": "24.22",
    "width": "156.25",
    "flexDirection": "row",
    "alignItems": "center",
    "fontSize": "15",
    "paddingLeft": "8.98",
    "color": "#ffffff"
  },
  "s-seat-text1": {
    "fontSize": "15",
    "color": "#ffffff"
  },
  "s-seat-line": {
    "fontSize": "9",
    "color": "#ffffff",
    "marginLeft": "5.47",
    "marginRight": "5.47"
  },
  "s-seat-text": {
    "fontSize": "8",
    "color": "rgba(255,255,255,0.6)"
  },
  "tooltip": {
    "position": "absolute",
    "bottom": 0,
    "left": 0,
    "right": 0,
    "fontSize": "16",
    "backgroundColor": "rgba(0,0,0,0.5)",
    "color": "#ffffff",
    "height": "31.25",
    "textAlign": "center",
    "lineHeight": "31.25"
  },
  "vod-div": {
    "flex": 1,
    "borderRadius": "7.81"
  },
  "video": {
    "flex": 1
  },
  "bd-img": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "right": 0,
    "bottom": 0,
    "flex": 1,
    "opacity": 1,
    "borderRadius": "7.81"
  },
  "slider": {
    "height": "257.81",
    "width": "322.27",
    "borderRadius": "7.81"
  },
  "slider-img": {
    "height": "257.81",
    "width": "322.27"
  },
  "seat-overlay": {
    "position": "absolute",
    "top": 0,
    "bottom": 0,
    "left": 0,
    "right": 0,
    "borderRadius": "7.81",
    "backgroundColor": "rgba(0,0,0,0.5)"
  },
  "down-overlay": {
    "position": "absolute",
    "left": "8.98",
    "bottom": "7.03",
    "width": "28.13",
    "height": "28.13",
    "justifyContent": "center",
    "alignItems": "center",
    "borderRadius": "7.81"
  },
  "down-overlay-m": {
    "width": "28.13",
    "height": "28.13",
    "left": "8.98",
    "bottom": "7.81"
  },
  "down-overlay-s": {
    "width": "28.13",
    "height": "28.13",
    "top": "10.55",
    "left": "8.98",
    "bottom": 0
  },
  "down-overlay-text": {
    "fontSize": "7",
    "color": "#ffffff"
  },
  "progress": {
    "marginTop": "4.69",
    "marginRight": "4.69",
    "marginBottom": "4.69",
    "marginLeft": "4.69"
  },
  "test": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "bottom": 0,
    "right": 0,
    "justifyContent": "center",
    "alignItems": "center",
    "borderRadius": "17.97",
    "backgroundColor": "rgba(0,0,0,0.8)"
  }
}

/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _progress = __webpack_require__(3);

var _progress2 = _interopRequireDefault(_progress);

var _index = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var animation = weex.requireModule('animation');
var apps = new BroadcastChannel('apps');
exports.default = {
  components: {
    Progress: _progress2.default
  },
  name: 'seat',
  props: {
    tagStyle: {},
    imgStyle: {},
    type: String,
    index: Number,
    tagURL: String,
    imgURL: String,
    toolText: String,
    data: Object,
    focus: Number,
    isVod: Boolean
  },
  computed: {
    tagImg: function tagImg() {
      if (this.tagURL === '3' || this.tagURL === '2') {
        return this.index < 2 ? _index.staticImg + '/img/tag_icon_big_' + this.tagURL + '.png' : _index.staticImg + '/img/tag_icon_' + this.tagURL + '.png';
      }
    }
  },
  data: function data() {
    return {
      baseImg: _index.baseImg
    };
  },
  created: function created() {
    // console.log(this.data)
  },

  methods: {
    onfinish: function onfinish(event) {
      // this.state = 'onfinish'
    },
    change: function change(event) {
      apps.postMessage({ index: event.index });
    },
    restart: function restart() {
      this.$refs.Video.restart();
    },
    pause: function pause() {
      this.$refs.Video.pause();
    },
    resume: function resume() {
      // this.$refs.Video.overrideAutoplay()
    },
    stop: function stop() {
      this.$refs.Video.stop();
    },
    onTop: function onTop() {
      this.$refs.Video.onTop();
    },
    applyChange: function applyChange() {
      this.$refs.Video.applyChange();
    },
    scaleVod: function scaleVod(value) {
      var mWidth = Math.round(825 / 1920 * 750 * 100) / 100;
      var mHeight = Math.round(660 / 1920 * 750 * 100) / 100;
      var borderWidth = Math.round(7 / 1920 * 750 * 100) / 100;
      if (value) {
        animation.transition(this.$refs.Video, {
          styles: {
            width: mWidth * 1.06 - borderWidth + 'px',
            height: mHeight * 1.06 - borderWidth + 'px',
            transform: 'translate(9px, 8px)'
          },
          duration: 0.2
        });
      } else {
        animation.transition(this.$refs.Video, {
          styles: {
            width: mWidth + 'px',
            height: mHeight + 'px'
          },
          duration: 0.2
        });
      }
    },
    setProgress: function setProgress(value) {
      console.log('-----------seat-progress------');
      this.$refs.progressMethod.setProgress(0, value);
    }
  }
};

/***/ }),

/***/ 34:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.type === 'app') ? _c('div', {
    class: [_vm.focus === _vm.index ? 'seat' : '']
  }, [_c('image', {
    staticClass: ["img"],
    attrs: {
      "src": _vm.imgURL
    }
  }), _c('image', {
    class: [_vm.tagImg ? 'tag' : 'tag-opacity', _vm.tagImg && _vm.index < 2 ? 'tag-big' : ''],
    attrs: {
      "src": _vm.tagImg
    }
  }), (_vm.index === 1) ? _c('div', {
    staticClass: ["l-seat"]
  }, [_c('image', {
    staticClass: ["l-seat-icon"],
    attrs: {
      "src": _vm.baseImg + _vm.data.app[0].icon[0].image_url
    }
  }), _c('div', [_c('text', {
    staticClass: ["l-seat-text1"]
  }, [_vm._v(_vm._s(_vm.data.app[0].title))]), _c('text', {
    staticClass: ["l-seat-text"]
  }, [_vm._v(_vm._s(_vm.data.app[0].short_title))])])]) : _vm._e(), (_vm.index > 1 && (_vm.index - 1) % 2 === 1) ? _c('div', {
    staticClass: ["m-seat"]
  }, [_c('image', {
    staticClass: ["m-seat-icon"],
    attrs: {
      "src": _vm.baseImg + _vm.data.app[0].icon[0].image_url
    }
  }), _c('div', [_c('text', {
    staticClass: ["m-seat-text1"]
  }, [_vm._v(_vm._s(_vm.data.app[0].title))]), _c('text', {
    staticClass: ["m-seat-text"]
  }, [_vm._v(_vm._s(_vm.data.app[0].short_title))])])]) : _vm._e(), (_vm.index > 1 && (_vm.index - 1) % 2 === 0) ? _c('div', {
    staticClass: ["s-seat"]
  }, [_c('image', {
    staticClass: ["s-seat-icon"],
    attrs: {
      "src": _vm.baseImg + _vm.data.app[0].icon[0].image_url
    }
  }), _c('div', {
    staticClass: ["s-seat-div"]
  }, [_c('text', {
    staticClass: ["s-seat-text1"]
  }, [_vm._v(_vm._s(_vm.data.app[0].title))]), (_vm.data.app[0].title.length < 5) ? _c('text', {
    staticClass: ["s-seat-line"]
  }, [_vm._v("|")]) : _vm._e(), (_vm.data.app[0].title.length < 5) ? _c('text', {
    staticClass: ["s-seat-text"]
  }, [_vm._v(_vm._s(_vm.data.app[0].short_title))]) : _vm._e()])]) : _vm._e(), (_vm.data.isDownloadShow) ? _c('div', {
    staticClass: ["seat-overlay"]
  }, [(_vm.data.isDownloadShow) ? _c('div', {
    class: ['down-overlay', _vm.index > 1 && _vm.index % 2 ? 'down-overlay-s' : 'down-overlay-m']
  }, [(!_vm.data.isDownload) ? _c('div', [_c('text', {
    staticClass: ["down-overlay-text"]
  }, [_vm._v("等待安装")])]) : _c('Progress', {
    ref: "progressMethod",
    staticClass: ["progress"],
    attrs: {
      "circleWidth": "48",
      "circlePadding": "8",
      "circleRadius": "48",
      "containerWidth": "44"
    }
  })], 1) : _vm._e()]) : _vm._e()]) : (_vm.type === 'img') ? _c('div', {
    class: [_vm.focus === _vm.index ? 'seat' : '']
  }, [_c('div', {
    staticStyle: {
      flex: "1"
    }
  }, [_c('image', {
    staticClass: ["img"],
    attrs: {
      "src": _vm.imgURL
    }
  }), _c('image', {
    class: [_vm.tagImg ? 'tag' : 'tag-opacity', _vm.tagImg && _vm.index < 2 ? 'tag-big' : ''],
    attrs: {
      "src": _vm.tagImg
    }
  })])]) : (_vm.type === 'active') ? _c('div', {
    class: [_vm.focus === _vm.index ? 'seat' : '']
  }, [_c('div', {
    staticStyle: {
      flex: "1"
    }
  }, [_c('image', {
    staticClass: ["img"],
    attrs: {
      "src": _vm.imgURL
    }
  }), _c('image', {
    class: [_vm.tagImg ? 'tag' : 'tag-opacity', _vm.tagImg && _vm.index < 2 ? 'tag-big' : ''],
    attrs: {
      "src": _vm.tagImg
    }
  })])]) : (_vm.type === 'vod') ? _c('div', {
    class: [_vm.focus === _vm.index ? 'seat' : '']
  }, [_c('div', {
    ref: "VideoDiv",
    staticClass: ["vod-div"]
  }, [(_vm.isVod) ? _c('simpleVideo', {
    key: 12,
    ref: "Video",
    staticClass: ["video"],
    attrs: {
      "setPath": _vm.imgURL
    }
  }) : _vm._e()], 1), _c('image', {
    class: [_vm.tagImg ? 'tag' : 'tag-opacity', _vm.tagImg && _vm.index < 2 ? 'tag-big' : ''],
    attrs: {
      "src": _vm.tagImg
    }
  })]) : (_vm.type === 'apps') ? _c('div', {
    class: [_vm.focus === _vm.index ? 'seat' : '']
  }, [_c('slider', {
    staticClass: ["slider"],
    attrs: {
      "interval": "3000",
      "autoPlay": "true"
    },
    on: {
      "change": _vm.change
    }
  }, _vm._l((_vm.data.banner), function(img) {
    return _c('div', {
      key: img.image_url,
      staticClass: ["slider-img"]
    }, [_c('image', {
      staticClass: ["img"],
      attrs: {
        "resize": "cover",
        "src": _vm.baseImg + img.image_url
      }
    })])
  }))]) : _vm._e()
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),

/***/ 35:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('scroller', {
    staticClass: ["main"],
    attrs: {
      "scrollDirection": "horizontal"
    }
  }, [_c('div', {
    ref: "mainDiv",
    staticClass: ["main-b"]
  }, _vm._l((_vm.seatDatas), function(item, index) {
    return _c('Seat', {
      key: item.imgURL,
      ref: 'A' + index,
      refInFor: true,
      class: [item.className],
      attrs: {
        "toolText": item.title,
        "type": item.type,
        "imgURL": item.imgURL,
        "tagURL": item.superscript,
        "index": index,
        "data": item,
        "focus": _vm.code,
        "isVod": _vm.vodHide
      }
    })
  }))])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

module.exports = {
  "circle": {
    "width": "66",
    "height": "66",
    "justifyContent": "center",
    "alignItems": "center",
    "backgroundColor": "rgba(255,255,255,0.4)",
    "paddingTop": "5",
    "paddingRight": "5",
    "paddingBottom": "5",
    "paddingLeft": "5",
    "borderRadius": "33"
  },
  "progressbar": {
    "width": "61",
    "height": "61",
    "borderRadius": "30",
    "backgroundColor": "rgba(0,0,0,0)"
  },
  "left-container": {
    "position": "absolute",
    "top": 0,
    "overflow": "hidden",
    "left": 0
  },
  "right-container": {
    "position": "absolute",
    "top": 0,
    "overflow": "hidden"
  },
  "left-circle": {
    "position": "absolute",
    "backgroundColor": "rgba(0,0,0,0)",
    "left": 0
  },
  "right-circle": {
    "position": "absolute",
    "backgroundColor": "rgba(0,0,0,0)"
  },
  "left-color": {
    "position": "absolute",
    "backgroundColor": "rgba(0,0,0,0.5)",
    "top": 0
  },
  "right-color": {
    "position": "absolute",
    "backgroundColor": "rgba(0,0,0,0.5)",
    "top": 0
  }
}

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var animation = weex.requireModule('animation');
exports.default = {
  props: {
    circleWidth: '',
    circlePadding: '',
    circleRadius: '',
    containerWidth: ''
  },
  data: function data() {
    return {};
  },

  computed: {
    circleStyle: function circleStyle() {
      var circleWidth = this.pxToTV(this.circleWidth);
      var circlePadding = this.pxToTV(this.circlePadding);
      var circleRadius = this.pxToTV(this.circleRadius);
      return {
        width: circleWidth,
        height: circleWidth,
        padding: circlePadding,
        borderRadius: circleRadius
      };
    },
    barStyle: function barStyle() {
      var barWidth = this.pxToTV(this.containerWidth);
      return {
        width: barWidth,
        height: barWidth,
        borderRadius: barWidth / 2
      };
    },
    leftContainerStyle: function leftContainerStyle() {
      var containerWidth = this.pxToTV(this.containerWidth);
      return {
        width: containerWidth / 2,
        height: containerWidth
      };
    },
    rightContainerStyle: function rightContainerStyle() {
      var containerWidth = this.pxToTV(this.containerWidth);
      return {
        width: containerWidth / 2,
        height: containerWidth,
        left: containerWidth / 2
      };
    },
    leftCircleStyle: function leftCircleStyle() {
      var containerWidth = this.pxToTV(this.containerWidth);
      return {
        width: containerWidth,
        height: containerWidth,
        borderRadius: containerWidth / 2
      };
    },
    rightCircleStyle: function rightCircleStyle() {
      var containerWidth = this.pxToTV(this.containerWidth);
      return {
        width: containerWidth,
        height: containerWidth,
        borderRadius: containerWidth / 2,
        left: -containerWidth / 2
      };
    },
    leftColorStyle: function leftColorStyle() {
      var containerWidth = this.pxToTV(this.containerWidth);
      return {
        width: containerWidth / 2,
        height: containerWidth,
        borderBottomLeftRadius: containerWidth / 2,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: containerWidth / 2,
        borderTopRightRadius: 0
      };
    },
    rightColorStyle: function rightColorStyle() {
      var containerWidth = this.pxToTV(this.containerWidth);
      return {
        width: containerWidth / 2,
        height: containerWidth,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: containerWidth / 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: containerWidth / 2,
        left: containerWidth / 2
      };
    }
  },
  methods: {
    pxToTV: function pxToTV(value) {
      return Math.floor(value / 1920 * 750);
    },

    /**
     *设置进度条的变化
     *@param {number} oldPercent    进度条改变之前的半分比
     *@param {number} curPercent    进度条当前要设置的值
     *@return {boolean} 设置成功返回 true，否则，返回fasle
     */
    setProgress: function setProgress(oldPercent, curPercent) {
      console.log('-----------:', oldPercent, '++++++++++', curPercent);
      var leftBar = this.$refs.leftCircle;
      var rightBar = this.$refs.rightCircle;
      // 将传入的参数转换，允许字符串表示的数字
      oldPercent = +oldPercent;
      curPercent = +curPercent;
      // 检测参数，如果不是number类型或不在0-100，则不执行
      if (typeof oldPercent === 'number' && typeof curPercent === 'number' && oldPercent >= 0 && oldPercent <= 100 && curPercent <= 100 && curPercent >= 0) {
        var baseTime = 1000; // 默认改变半圆进度的时间，单位豪秒
        var time = 0; // 进度条改变的时间
        var deg = 0; // 进度条改变的角度
        if (oldPercent > 50) {
          console.log('原来进度大于50', oldPercent);
          // 原来进度大于50
          if (curPercent > 50) {
            // 设置左边的进度
            time = (curPercent - oldPercent) / 50 * baseTime;
            // 确定时间值为正
            // curPercent - oldPercent > 0 ? '' : (time = -time)
            deg = (curPercent - 50) / 50 * 180;
            animation.transition(leftBar, {
              styles: {
                transform: 'rotate(' + deg + 'deg)'
              }
            });
          }
        } else {
          console.log('原来进度小于50时', oldPercent);
          // 原来进度小于50时
          if (curPercent > 50) {
            console.log('设置右边的进度>50', curPercent);
            // 设置右边的进度
            time = 50 / 50 * baseTime;
            deg = 50 * 3.6;
            animation.transition(rightBar, {
              styles: {
                transform: 'rotate(' + deg + 'deg)',
                opacity: curPercent > 50 ? 0 : 1
              }
            });
            // 延时设置左边进度条的改变
            setTimeout(function () {
              time = (curPercent - 50) / 50;
              deg = (curPercent - 50) * 3.6;
              console.log(deg);
              animation.transition(leftBar, {
                styles: {
                  transform: 'rotate(' + deg + 'deg)'
                }
              });
            }, Math.floor(time / 2));
          } else {
            console.log('设置右边的进度', curPercent);
            // 设置右边的进度
            time = (curPercent - oldPercent) / 50 * baseTime;
            // 确定时间值为正
            time = curPercent - oldPercent > 0 ? '' : time = -time;
            deg = curPercent / 50 * 180;
            animation.transition(rightBar, {
              styles: {
                transform: 'rotate(' + deg + 'deg)'
              }
            });
          }
        }
      }
    }
  }
};

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["circle"],
    style: _vm.circleStyle
  }, [_c('div', {
    staticClass: ["progressbar"],
    style: _vm.barStyle
  }, [_c('div', {
    staticClass: ["left-container"],
    style: _vm.leftContainerStyle
  }, [_c('div', {
    ref: "leftCircle",
    staticClass: ["left-circle"],
    style: _vm.leftCircleStyle
  }, [_c('div', {
    staticClass: ["left-color"],
    style: _vm.leftColorStyle
  })])]), _c('div', {
    staticClass: ["right-container"],
    style: _vm.rightContainerStyle
  }, [_c('div', {
    ref: "rightCircle",
    staticClass: ["right-circle"],
    style: _vm.rightCircleStyle
  }, [_c('div', {
    staticClass: ["right-color"],
    style: _vm.rightColorStyle
  })])])])])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),

/***/ 82:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _entry = __webpack_require__(28);

var _entry2 = _interopRequireDefault(_entry);

var _store = __webpack_require__(1);

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_entry2.default.el = '#root';
_entry2.default.store = _store2.default;
new Vue(_entry2.default);

/***/ })

/******/ });