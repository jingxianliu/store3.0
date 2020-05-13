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
/******/ 	return __webpack_require__(__webpack_require__.s = 68);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
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

var API = 'http://ahappstore.orbbec.me:10091/api/v1';
var baseImg = 'http://ahappstore.orbbec.me:10091';
var staticImg = 'http://ahappstore.orbbec.me:10091';
// const coutlyAPI = 'http://gwcountly.orbbec.me:11095'
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
    url: 'http://gwcountly.orbbec.me:11095' + encodeURI(getBody),
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
/* 1 */
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
/* 2 */
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
/* 3 */
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\components\\progress.vue"
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
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabInit = tabInit;
exports.initSeat = initSeat;
exports.favoritesInit = favoritesInit;
exports.helpInit = helpInit;
exports.appInit = appInit;
exports.getFavoriteSeat = getFavoriteSeat;
exports.getCenterSeat = getCenterSeat;
exports.getRetainSeat = getRetainSeat;
var initData = [['T', null, null, 'A1'], ['T', null, 'A0', 'A2'], ['T', 'A3', 'A1', 'A4'], ['A2', null, 'A1', 'A5']];
var centerData = [['T', 'C1', null, 'A0'], ['C0', 'C2', null, 'A0'], ['C1', null, null, null]];
var tabData = [];
var seatData = [];
var helpData = [];
var appData = [];
var favoriteData = [];
var retainData = [[[null, 'C1', null, 'B1'], [null, 'C1', 'B0', 'B2'], [null, 'C1', 'B1', 'B3'], [null, 'C1', 'B2', null]], [['B0', null, null, 'C1'], ['B0', null, 'C0', null]]];
// 栏目初始化
function tabInit(num) {
  tabData = [];
  for (var i = 0; i < num; i++) {
    tabData.push([null, 'A0', i === 0 ? null : 'T' + (i - 1), i === num - 1 ? null : 'T' + (i + 1)]);
  }
}
// 推荐初始化
function initSeat(tabIndex, seat, data) {
  console.log('--------初始化坐标-------', tabIndex, seat);
  tabIndex = parseInt(tabIndex);
  seatData = [].concat(initData);
  if (seat > 4) {
    for (var i = 4; i < seat; i++) {
      if ((i - 4) % 2) {
        // 下
        seatData.push(['A' + (i - 1), null, 'A' + (i - 2), 'A' + (i + 2)]);
      } else {
        seatData.push(['T', 'A' + (i + 1), 'A' + (i - 2), 'A' + (i + 2)]);
      }
    }
    // 改变边线
    seatData[seat - 1][3] = 'T' + (tabIndex + 1);
    seatData[0][2] = tabIndex === 0 ? null : 'T' + (tabIndex - 1);
    if (seat % 2) {
      seatData[seat - 2][3] = 'A' + (seat - 1);
      seatData[seat - 1][1] = null;
    } else {
      seatData[seat - 2][3] = 'T' + (tabIndex + 1);
    }
  }
}
// 我的收藏初始化
function favoritesInit(num) {
  console.log('wode');
  favoriteData = [];
  if (num === 0) {
    return false;
  }
  for (var i = 0; i < num; i++) {
    favoriteData.push([i % 3 ? 'A' + (i - 1) : 'T', i === num - 1 ? null : 'A' + (i + 1), i <= 2 ? 'TQ' : 'A' + (i - 3), i >= num - 3 ? 'TN' : 'A' + (i + 3)]);
  }
  if (num >= 3) {
    if (num % 3 === 1) {
      favoriteData[num - 2][3] = 'A' + (num - 1);
      favoriteData[num - 3][3] = 'A' + (num - 1);
    } else if (num % 3 === 2) {
      favoriteData[num - 3][3] = 'A' + (num - 2);
    }
  }
}
// 帮助反馈初始化
function helpInit(num) {
  console.log('help init :=----', num);
  if (num === 0) {
    helpData = ['T', 'C1', null, null];
    return false;
  }
  helpData = [];
  for (var i = 0; i < num; i++) {
    helpData.push([i === 0 ? null : 'A' + (i - 1), i === num - 1 ? null : 'A' + (i + 1), 'C0', null]);
  }
}
// 我的应用初始化
function appInit(updataNum, num) {
  appData = [];
  // 无应用时 num === 0
  if (num === 0) {
    return false;
  }
  if (updataNum) {
    // 有更新
    appData.push([null, 'A1', 'C1', null]);
    for (var i = 1; i < num + 1; i++) {
      appData.push([i < 2 ? 'A0' : 'A' + (i - 2), 'A' + (i + 2), i % 2 ? 'C1' : 'A' + (i - 1), i % 2 ? 'A' + (i + 1) : null]);
    }
    if (num % 2) {
      appData[num][3] = null;
    }
    appData[num][1] = null;
    if (num >= 2) {
      appData[num - 1][1] = null;
    }
  } else {
    // 无更新
    for (var _i = 0; _i < num; _i++) {
      appData.push([_i < 2 ? null : 'A' + (_i - 2), 'A' + (_i + 2), _i % 2 ? 'A' + (_i - 1) : 'C1', _i % 2 ? null : 'A' + (_i + 1)]);
    }
    if (num % 2) {
      appData[num - 1][3] = null;
    }
    appData[num - 1][1] = null;
    if (num >= 2) {
      appData[num - 2][1] = null;
    }
  }
  console.log('我的应用：', JSON.stringify(appData));
}
/* 获取推荐位下一个焦点 */
function getNextSeat(pageIndex, now, index) {
  // pageIndex: 当前tab index
  // now：当前focusCode
  // index 0上 1下 2左 3右
  console.log('----getNextSeat-----', pageIndex, now, index);
  var isTAB = now.includes('T'); // true为tab
  var focusIndex = parseInt(now.slice(1));
  pageIndex = parseInt(pageIndex);
  var nextCode = null;
  if (isTAB) {
    // tab 切换聚焦
    nextCode = tabData[focusIndex][index];
  } else {
    // seat切换
    console.log('seat切换', seatData);
    var getCode = seatData[focusIndex][index];
    if (getCode && getCode.includes('T')) {
      nextCode = getCode === 'T' ? 'T' + pageIndex : getCode;
    } else {
      nextCode = getCode;
    }
  }
  // 最后一格判断
  console.log('----首页下一个foucsCode-----', nextCode);
  return nextCode;
}
/* 我的收藏焦点 */
function getFavoriteSeat(now, index) {
  return favoriteData[now.slice(1)][index];
}
/* 个人中心焦点 */
function getCenterSeat(now, index, tab, appNum) {
  console.log(now, index, tab, appNum);
  var isTAB = now.includes('C');
  var tabIndex = parseInt(now.slice(1));
  centerData[1][3] = appNum === 0 ? null : 'A0';
  var nextCode = null;
  if (isTAB) {
    console.log('dx:center tab ', centerData);
    nextCode = centerData[tabIndex][index];
  } else {
    if (now.includes('T')) {
      // T => C
      nextCode = 'C0';
    } else {
      // A => A
      if (tab === 'Help') {
        nextCode = helpData[tabIndex][index];
      } else if (tab === 'App') {
        // 我的应用
        nextCode = appData[tabIndex][index];
      } else {
        nextCode = null;
      }
    }
  }
  return nextCode;
}
function getRetainSeat(now, index) {
  console.log('retainData:', now, '--------', index, retainData);
  var nextCode = null;
  var column = now.includes('B') ? 0 : 1;
  var nowIndex = now.slice(1);
  nextCode = retainData[column][nowIndex][index];
  console.log(column, 'retian--------', nowIndex, '-12123', nextCode);
  return nextCode;
}
exports.default = getNextSeat;

/***/ }),
/* 5 */
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
/* 6 */
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
/* 7 */
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(13)
)

/* script */
__vue_exports__ = __webpack_require__(14)

/* template */
var __vue_template__ = __webpack_require__(15)
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\components\\overlay.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-7f272890"
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(11)
)

/* script */
__vue_exports__ = __webpack_require__(12)

/* template */
var __vue_template__ = __webpack_require__(16)
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\components\\mask.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-abc7aa48"
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(17)
)

/* script */
__vue_exports__ = __webpack_require__(18)

/* template */
var __vue_template__ = __webpack_require__(19)
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\components\\dialog.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-1757c590"
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
/* 11 */
/***/ (function(module, exports) {

module.exports = {
  "mask": {
    "position": "fixed",
    "width": "750",
    "height": "600",
    "zIndex": 99999
  },
  "wxc-mask": {
    "position": "fixed",
    "top": "300",
    "left": "60",
    "width": "702",
    "height": "800",
    "justifyContent": "center",
    "alignItems": "center"
  }
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; //
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

var _overlay = __webpack_require__(8);

var _overlay2 = _interopRequireDefault(_overlay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var animation = weex.requireModule('animation');

exports.default = {
  components: { overlay: _overlay2.default },
  props: {
    height: {
      type: [String, Number],
      default: 800
    },
    width: {
      type: [String, Number],
      default: 607.5
    },
    top: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    },
    contentText: {
      type: String,
      default: '应用安装中'
    },
    duration: {
      type: [String, Number],
      default: 300
    },
    hasOverlay: {
      type: Boolean,
      default: true
    },
    hasAnimation: {
      type: Boolean,
      default: true
    },
    timingFunction: {
      type: Array,
      default: function _default() {
        return ['ease-in', 'ease-out'];
      }
    },
    overlayCfg: {
      type: Object,
      default: function _default() {
        return {
          hasAnimation: true,
          timingFunction: ['ease-in', 'ease-out'],
          canAutoClose: true,
          duration: 300,
          opacity: 0.6
        };
      }
    },
    borderRadius: {
      type: [String, Number],
      default: 0
    },
    overlayCanClose: {
      type: Boolean,
      default: true
    },
    maskBgColor: {
      type: String,
      default: '#ffffff'
    },
    contentTextColor: {
      type: String,
      default: '#d4f2ff'
    },
    fontSize: {
      type: [String, Number],
      default: 50
    }
  },
  data: function data() {
    return {
      opened: false
    };
  },
  computed: {
    mergeOverlayCfg: function mergeOverlayCfg() {
      return _extends({}, this.overlayCfg, {
        hasAnimation: this.hasAnimation
      });
    },
    maskStyle: function maskStyle() {
      var width = this.width,
          height = this.height,
          hasAnimation = this.hasAnimation,
          opened = this.opened,
          top = this.top;

      var newHeight = this.pxToTV(height);
      var newWidth = this.pxToTV(width);
      var newTop = this.pxToTV(top);
      var pageHeight = 1080 / 1920 * 750;
      return {
        width: newWidth + 'px',
        height: newHeight + 'px',
        left: (750 - newWidth) / 2 + 'px',
        top: (newTop || (pageHeight - newHeight) / 2) + 'px',
        backgroundColor: this.maskBgColor,
        borderRadius: this.borderRadius + 'px',
        opacity: hasAnimation && !opened ? 0 : 1
      };
    },
    contentStyle: function contentStyle() {
      return {
        fontSize: Math.floor(this.fontSize * 4 / 10),
        color: this.contentTextColor
      };
    },
    shouldShow: function shouldShow() {
      var _this = this;

      var show = this.show,
          hasAnimation = this.hasAnimation;

      hasAnimation && setTimeout(function () {
        _this.appearMask(show);
      }, 500);
      return show;
    }
  },
  methods: {
    pxToTV: function pxToTV(value) {
      return Math.floor(value / 1920 * 750);
    },
    closeIconClicked: function closeIconClicked() {
      var _this2 = this;

      setTimeout(function () {
        _this2.appearMask(false);
      }, 300);
    },
    wxcOverlayBodyClicking: function wxcOverlayBodyClicking() {
      if (this.hasAnimation) {
        this.appearMask(false);
        this.$emit('wxcOverlayBodyClicking', {});
      }
    },
    wxcOverlayBodyClicked: function wxcOverlayBodyClicked() {
      if (!this.hasAnimation) {
        this.appearMask(false);
        this.$emit('wxcOverlayBodyClicked', {});
      }
    },
    needEmit: function needEmit() {
      var bool = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this.opened = bool;
      !bool && this.$emit('obMaskSetHidden', {});
    },
    appearMask: function appearMask(bool) {
      var _this3 = this;

      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.duration;
      var hasAnimation = this.hasAnimation,
          timingFunction = this.timingFunction;

      var maskEl = this.$refs['wxc-mask'];
      if (hasAnimation && maskEl) {
        animation.transition(maskEl, {
          styles: {
            opacity: bool ? 1 : 0
          },
          duration: duration,
          timingFunction: timingFunction[bool ? 0 : 1],
          delay: 0
        }, function () {
          bool && _this3.closeIconClicked();
          !bool && _this3.$emit('obMaskSetHidden', {});
        });
      } else {
        this.needEmit(bool);
      }
    }
  }
};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = {
  "wxc-overlay": {
    "width": "750",
    "position": "fixed",
    "left": 0,
    "top": 0,
    "bottom": 0,
    "right": 0
  }
}

/***/ }),
/* 14 */
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

var animation = weex.requireModule('animation');
exports.default = {
  props: {
    show: {
      type: Boolean,
      default: true
    },
    hasAnimation: {
      type: Boolean,
      default: true
    },
    duration: {
      type: [Number, String],
      default: 300
    },
    timingFunction: {
      type: Array,
      default: function _default() {
        return ['ease-in', 'ease-out'];
      }
    },
    opacity: {
      type: [Number, String],
      default: 0.6
    },
    canAutoClose: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    overlayStyle: function overlayStyle() {
      return {
        opacity: this.hasAnimation ? 0 : 1,
        backgroundColor: 'rgba(0, 0, 0,' + this.opacity + ')'
      };
    },
    shouldShow: function shouldShow() {
      var _this = this;

      var show = this.show,
          hasAnimation = this.hasAnimation;

      hasAnimation && setTimeout(function () {
        _this.appearOverlay(show);
      }, 500);
      return show;
    }
  },
  methods: {
    overlayClicked: function overlayClicked(e) {
      this.canAutoClose ? this.appearOverlay(false) : this.$emit('wxcOverlayBodyClicked', {});
    },
    appearOverlay: function appearOverlay(bool) {
      var _this2 = this;

      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.duration;
      var hasAnimation = this.hasAnimation,
          timingFunction = this.timingFunction,
          canAutoClose = this.canAutoClose;

      var needEmit = !bool && canAutoClose;
      needEmit && this.$emit('wxcOverlayBodyClicking', {});
      console.log(bool, 'overlay');
      var overlayEl = this.$refs['wxc-overlay'];
      if (hasAnimation && overlayEl) {
        animation.transition(overlayEl, {
          styles: {
            opacity: bool ? 1 : 0
          },
          duration: duration,
          timingFunction: timingFunction[bool ? 0 : 1],
          delay: 0
        }, function () {
          needEmit && _this2.$emit('wxcOverlayBodyClicked', {});
        });
      } else {
        needEmit && this.$emit('wxcOverlayBodyClicked', {});
      }
    }
  }
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [(_vm.show) ? _c('div', {
    ref: "wxc-overlay",
    staticClass: ["wxc-overlay"],
    style: _vm.overlayStyle,
    attrs: {
      "hack": _vm.shouldShow
    },
    on: {
      "click": _vm.overlayClicked
    }
  }) : _vm._e()])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["mask"]
  }, [(_vm.show) ? _c('overlay', _vm._b({
    attrs: {
      "show": _vm.show && _vm.hasOverlay,
      "canAutoClose": _vm.overlayCanClose
    }
  }, 'overlay', _vm.mergeOverlayCfg, false)) : _vm._e(), (_vm.show) ? _c('div', {
    ref: "wxc-mask",
    staticClass: ["wxc-mask"],
    style: _vm.maskStyle,
    attrs: {
      "hack": _vm.shouldShow
    }
  }, [_c('text', {
    style: _vm.contentStyle
  }, [_vm._v(_vm._s(_vm.contentText))])]) : _vm._e()], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = {
  "dislog": {
    "position": "fixed",
    "width": "750",
    "zIndex": 99999,
    "backgroundColor": "#4f6175"
  },
  "dialog-body": {
    "position": "fixed",
    "left": "207.81",
    "top": "107.42",
    "width": "334.38",
    "height": "207.03",
    "backgroundColor": "#4f6175",
    "borderRadius": "7.81",
    "alignItems": "center"
  },
  "dialog-title": {
    "height": "128.13",
    "width": "334.38",
    "backgroundColor": "#54687e"
  },
  "dialog-title-text": {
    "fontSize": "18",
    "textAlign": "center",
    "color": "#d4f2ff",
    "marginTop": "66.8"
  },
  "dialog-button": {
    "position": "absolute",
    "bottom": 0,
    "left": 0,
    "right": 0,
    "flexDirection": "row",
    "justifyContent": "center"
  },
  "dialog-img": {
    "width": "147.66",
    "height": "56.25"
  }
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _overlay = __webpack_require__(8);

var _overlay2 = _interopRequireDefault(_overlay);

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

exports.default = {
  components: { WxcOverlay: _overlay2.default },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    single: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: '请更新应用！'
    },
    update: {
      type: Boolean,
      default: true
    },
    isCancel: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      staticImg: _index.staticImg
    };
  },
  computed: {
    buttonImg: function buttonImg() {
      if (this.update) {
        // 更新弹框
        if (this.isCancel) {
          // 取消
          return ['install_btn_normal', 'cancel_active'];
        } else {
          // 下载
          return ['install_btn_active', 'cancel_normal'];
        }
      } else {
        // 卸载弹框
        if (this.isCancel) {
          // 取消
          return ['uninstall_btn_normal', 'cancel_active'];
        } else {
          // 卸载
          return ['uninstall_btn_active', 'cancel_normal'];
        }
      }
    }
  }
};

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["dialog"]
  }, [(_vm.show) ? _c('wxc-overlay', {
    attrs: {
      "show": true,
      "hasAnimation": false
    }
  }) : _vm._e(), (_vm.show) ? _c('div', {
    staticClass: ["dialog-body"]
  }, [_c('div', {
    staticClass: ["dialog-title"]
  }, [_c('text', {
    staticClass: ["dialog-title-text"]
  }, [_vm._v(_vm._s(_vm.content))])]), _c('div', {
    staticClass: ["dialog-button"]
  }, _vm._l((_vm.buttonImg), function(item) {
    return _c('image', {
      key: item,
      staticClass: ["dialog-img"],
      attrs: {
        "src": (_vm.staticImg + "/img/" + item + ".png")
      }
    })
  }))]) : _vm._e()], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(21)
)

/* script */
__vue_exports__ = __webpack_require__(22)

/* template */
var __vue_template__ = __webpack_require__(23)
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\components\\errPage.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-5be2c7d4"
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
/* 21 */
/***/ (function(module, exports) {

module.exports = {
  "container": {
    "width": "750",
    "height": "421.88"
  },
  "bd": {
    "width": "750",
    "height": "421.88",
    "position": "absolute",
    "top": 0,
    "left": 0
  },
  "err-box": {
    "justifyContent": "center",
    "alignItems": "center",
    "marginTop": "117.19"
  },
  "err-img": {
    "width": "135.94",
    "height": "93.75",
    "marginBottom": "23.44"
  },
  "err-req-img": {
    "width": "98.05",
    "height": "94.92",
    "marginBottom": "23.44"
  },
  "err-text": {
    "fontSize": "12",
    "color": "#4da5bd",
    "marginBottom": "23.44"
  },
  "err-buttons": {
    "flexDirection": "row",
    "justifyContent": "center"
  },
  "err-button": {
    "width": "143.75",
    "height": "49.61"
  }
}

/***/ }),
/* 22 */
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

exports.default = {
  props: {
    isNoNetwork: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {};
  },
  computed: {
    buttonImg: function buttonImg() {
      if (this.isBack) {
        // 退出大厅
        return ['err_load_normal', 'err_back_active'];
      } else {
        return ['err_load_active', 'err_back_normal'];
      }
    }
  }
};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["container"]
  }, [_c('image', {
    staticClass: ["bd"],
    attrs: {
      "src": "local:///bd"
    }
  }), _c('div', {
    staticClass: ["err-box"]
  }, [(_vm.isNoNetwork) ? _c('image', {
    staticClass: ["err-img"],
    attrs: {
      "src": "local:///no_network"
    }
  }) : _c('image', {
    staticClass: ["err-img"],
    attrs: {
      "src": "local:///req_error"
    }
  }), _c('div', [(_vm.isNoNetwork) ? _c('text', {
    staticClass: ["err-text"]
  }, [_vm._v("网络链接失败，请查验")]) : _c('text', {
    staticClass: ["err-text"]
  }, [_vm._v("噢...系统出现异常，请稍等")])]), _c('div', {
    staticClass: ["err-buttons"]
  }, _vm._l((_vm.buttonImg), function(item) {
    return _c('image', {
      key: item,
      staticClass: ["err-button"],
      attrs: {
        "src": ("local:///" + item)
      }
    })
  }))])])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(25)
)

/* script */
__vue_exports__ = __webpack_require__(26)

/* template */
var __vue_template__ = __webpack_require__(27)
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\pages\\favorites\\entry.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-59467a7f"
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
/* 25 */
/***/ (function(module, exports) {

module.exports = {
  "main": {
    "width": "750",
    "flexDirection": "row"
  },
  "bd": {
    "width": "750",
    "height": "421.88",
    "position": "absolute",
    "top": 0,
    "left": 0
  },
  "apps": {
    "paddingLeft": "31.25",
    "paddingTop": "26.95",
    "height": "371.09",
    "flexWrap": "wrap"
  },
  "app": {
    "width": "274.22",
    "height": "87.89",
    "backgroundColor": "rgba(36,125,199,0.2)",
    "flexDirection": "row",
    "alignItems": "center",
    "marginBottom": "12.11",
    "marginRight": "11.72",
    "borderRadius": "7.81"
  },
  "bd-border": {
    "borderStyle": "solid",
    "borderWidth": "1.56",
    "borderColor": "#ffffff",
    "borderRadius": "7.81"
  },
  "app-icon-img": {
    "width": "54.69",
    "height": "54.69",
    "marginLeft": "16.41",
    "marginRight": "14.84"
  },
  "app-name": {
    "marginBottom": "7.03",
    "fontSize": "14",
    "color": "#ffffff"
  },
  "app-text": {
    "fontSize": "10",
    "color": "#ffffff"
  },
  "app-button": {
    "position": "absolute",
    "right": 0,
    "top": 0,
    "justifyContent": "space-around",
    "alignItems": "center",
    "width": "85.94",
    "height": "87.89",
    "marginLeft": "15.63",
    "paddingTop": "5.86",
    "paddingRight": "5.86",
    "paddingBottom": "5.86",
    "paddingLeft": "5.86",
    "opacity": 0
  },
  "app-button-text": {
    "fontSize": "12",
    "width": "61.33",
    "height": "23.05"
  },
  "app-bd": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "width": "271.09",
    "height": "84.77",
    "borderRadius": "7.81",
    "opacity": 0
  },
  "app-opacity": {
    "opacity": 1
  },
  "point-div": {
    "width": "31.25",
    "height": "14.06",
    "position": "absolute",
    "right": 0,
    "top": 0
  },
  "point-img": {
    "width": "31.25",
    "height": "14.06"
  },
  "vacancy": {
    "width": "271.09",
    "height": "84.77",
    "backgroundColor": "rgba(36,125,199,0.05)",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "marginBottom": "12.11",
    "marginRight": "11.72",
    "borderRadius": "7.81"
  },
  "vacancy-text": {
    "fontSize": "16",
    "color": "rgba(255,255,255,0.05)"
  },
  "down-overlay": {
    "position": "absolute",
    "top": "14.84",
    "left": "16.41",
    "width": "54.69",
    "height": "54.69",
    "justifyContent": "center",
    "alignItems": "center",
    "borderRadius": "7.81",
    "backgroundColor": "rgba(0,0,0,0.8)"
  },
  "down-overlay-text": {
    "fontSize": "7",
    "color": "#ffffff"
  },
  "progress": {
    "marginTop": "9.38",
    "marginRight": "9.38",
    "marginBottom": "9.38",
    "marginLeft": "9.38"
  },
  "no-box": {
    "justifyContent": "center",
    "alignItems": "center"
  },
  "no-img": {
    "width": "239.45",
    "height": "223.44"
  },
  "no-text": {
    "fontSize": "12",
    "color": "#ffffff",
    "marginBottom": "11.72"
  },
  "no-button": {
    "width": "148.83",
    "height": "56.64"
  }
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getSeat = __webpack_require__(4);

var _index = __webpack_require__(0);

var _progress = __webpack_require__(3);

var _progress2 = _interopRequireDefault(_progress);

var _mask = __webpack_require__(9);

var _mask2 = _interopRequireDefault(_mask);

var _dialog = __webpack_require__(10);

var _dialog2 = _interopRequireDefault(_dialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var myModule = weex.requireModule('myModule'); //
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

var stream = weex.requireModule('stream');
var dom = weex.requireModule('dom');
var animation = weex.requireModule('animation');
var storage = weex.requireModule('storage');
exports.default = {
  components: {
    Progress: _progress2.default,
    obMask: _mask2.default,
    obDialog: _dialog2.default
  },
  props: {
    refresh: Boolean
  },
  data: function data() {
    return {
      staticImg: _index.staticImg,
      baseImg: _index.baseImg,
      localApps: [],
      isLialog: false,
      isCancel: true,
      transX: 0,
      focusCode: 'T',
      appNum: 0,
      isNoCheck: false,
      vacancy: 0,
      isDownloadShow: false,
      isDownload: false,
      isToast: false,
      dialogText: '请更新应用！',
      imgBaseUrl: _index.baseImg
    };
  },
  created: function created() {
    console.log('------\u6211\u7684\u6536\u85CF-created----');
    // this.appNum = 0
    // this.$emit('appNum', 0)
    // favoritesInit(0)
    // let localApps = []
    // storage.getItem('localApps', e => {
    //   if (e.result === 'success') {
    //     console.log(e.data)
    //     localApps = JSON.parse(e.data).apps
    //   } else {
    //     localApps = myModule.getLocalOrbbecApp() // 本地应用
    //     localApps = localApps ? JSON.parse(localApps).packages : []
    //   }
    //   this.init(localApps)
    // })
    // console.log('DAIXIN:', localApps)
    this.localApps = [];
    this.init();
  },

  methods: {
    init: function init() {
      var _this = this;

      this.transX = 0;
      animation.transition(this.$refs.apps, {
        styles: {
          transform: 'translateX(0px)'
        },
        duration: 1
      });
      var getLocalApps = new Promise(function (resolve, reject) {
        var apps = myModule.getLocalOrbbecApp();
        if (apps) {
          resolve(JSON.parse(apps).packages);
        } else {
          reject(new Error('err'));
        }
      });
      getLocalApps.then(function (localApps) {
        stream.fetch({
          method: 'GET',
          url: _index.API + '/portal/439c165a-9854-35d1-b31b-ce312602291f/app?results_per_page=0',
          type: 'json'
        }, function (res) {
          console.log('-------\u5168\u90E8\u5E94\u7528----' + res.data.objects + '-');
          var data = res.data.objects;
          var newApps = [];

          var _loop = function _loop(i) {
            var element = localApps[i];
            var online = data.find(function (n) {
              return n.package_name === element.packageName;
            });
            // 应用存在线上
            if (online) {
              element['update'] = false;
              element['isDownloadShow'] = false;
              element['isDownload'] = false;
              element['note'] = online.note;
              element['ApplicationIcon'] = _this.baseImg + online.icon[0].image_url;
              // 需要更新
              if (online.version_code - element.versionCode > 0) {
                element['update'] = true;
                element['app_url'] = _this.baseImg + online.app_url;
              }
              newApps.push(element);
            }
          };

          for (var i = 0; i < localApps.length; i++) {
            _loop(i);
          }
          _this.$emit('appNum', newApps.length); // 上报本地应用数
          _this.appNum = newApps.length;
          (0, _getSeat.favoritesInit)(newApps.length);
          _this.localApps = newApps;
          if (newApps.length > 0) {
            if (newApps.length <= 9) {
              _this.vacancy = 9 - newApps.length;
            } else if (newApps.length % 3) {
              _this.vacancy = 3 - newApps.length % 3;
            }
          }
          _this.$store.commit('localApps', newApps);
          console.log(newApps);
        });
      }).catch(function (err) {
        console.log('我的收藏应用err=-----', err);
      });
    },
    autoFocus: function autoFocus(code) {
      console.log('---我的收藏聚焦--', code);
      if (code === 1) {
        this.focusCode = 'A0';
        if (this.appNum === 0) {
          this.isNoCheck = true;
          return false;
        }
      }
      var old = this.focusCode;
      var focusIndex = parseInt(old.slice(1));
      var currentApp = this.localApps[focusIndex];
      if (code === 4) {
        // 退出
        if (this.isLialog) {
          // 对话框返回
          this.isLialog = false;
          this.isCancel = true;
        } else {
          // 挽留
          this.$emit('retain', true);
        }
      } else if (code === 23) {
        if (this.isNoCheck) {
          // 跳推荐页
          this.$emit('upTab', { to: 'recommend', value: true });
          this.isNoCheck = false;
          return false;
        }
        if (currentApp && currentApp.isDownloadShow) {
          // 状态为下载中
          this.isToast = true;
          return false;
        }
        if (this.isLialog) {
          // 对话框层
          if (!this.isCancel) {
            // 更新
            console.log('我的收藏更新：', currentApp.packageName, currentApp.app_url);
            myModule.downLoad(currentApp.packageName, currentApp.app_url);
            // myModule.downLoad(currentApp.packageName, currentApp.note)
            // 存入下载队列
            this.$store.commit('downList', currentApp.packageName);
            // setDownload(currentApp.packageName)
          }
          this.isLialog = false;
          this.isCancel = true;
        } else {
          // 应用层
          if (currentApp.update) {
            // 弹窗更新
            // this.dialogText = `请更新${currentApp.ApplicationName}应用！`
            // this.isLialog = true
            myModule.downLoad(currentApp.packageName, currentApp.app_url);
            // myModule.downLoad(currentApp.packageName, currentApp.note)
            // 存入下载队列
            this.$store.commit('downList', currentApp.packageName);
            // setDownload(currentApp.packageName)
          } else {
            // 启动应用
            this.$emit('first', false);
            myModule.startApp(currentApp.packageName);
          }
        }
      } else {
        // 上下选择
        if (this.isNoCheck) {
          if (code === 19) {
            this.isNoCheck = false;
            this.$emit('upTab', { to: 'favorites', value: true });
          }
        }
        if (this.isLialog) {
          this.isCancel = code === 22 || code === 21 ? !this.isCancel : this.isCancel;
          return false;
        }
        code = code >= 19 || code <= 23 ? code - 19 : null;
        var nextCode = (0, _getSeat.getFavoriteSeat)(old, code);
        console.log('----\u6211\u7684\u6536\u85CF\u4E0B\u4E00\u7126\u70B9---' + nextCode + '--');
        if (nextCode) {
          this.focusCode = nextCode;
          if (nextCode === 'T') {
            this.$emit('upTab', { to: 'favorites', value: true });
          } else if (nextCode === 'TQ') {
            // 前一页
            this.$emit('upTab', { to: 'front', value: true });
          } else if (nextCode === 'TN') {
            // 个人中心页
            this.$emit('upTab', { to: 'center', value: true });
          }
          this.t2d(old, nextCode);
        }
      }
    },

    // 动画
    t2d: function t2d(old, now) {
      var _this2 = this;

      var maxWidth = 750;
      var minWidth = Math.round(80 / 1920 * 750 * 100) / 100;
      var b = Math.round(31 / 1920 * 750 * 100) / 100;
      var element = this.$refs[now] ? this.$refs[now][0] : null;
      var num = this.localApps.length;
      var index = now.slice(1);
      if (now.includes('A')) {
        dom.getComponentRect(element, function (options) {
          if (options.size.right > maxWidth) {
            var isLast = index >= num - (3 - num % 3);
            if (isLast) {
              _this2.transX += options.size.right - maxWidth;
            } else {
              _this2.transX += options.size.right - maxWidth + b;
            }
            animation.transition(_this2.$refs.apps, {
              styles: {
                transform: 'translateX(-' + _this2.transX + 'px)'
              },
              duration: 1
            });
          } else if (options.size.left < minWidth) {
            var isFirst = index <= 2;
            if (isFirst) {
              _this2.transX = 0;
            } else {
              _this2.transX -= minWidth - options.size.left;
            }
            animation.transition(_this2.$refs.apps, {
              styles: {
                transform: 'translateX(-' + _this2.transX + 'px)'
              },
              duration: 1
            });
          }
        });
      }
    },

    // mask 隐藏
    obMaskSetHidden: function obMaskSetHidden() {
      this.isToast = false;
    },

    // 下载进度
    progress: function progress(value, list) {
      console.log('我的收藏页下载进度：', value);
      var textName = value.split(':')[0];
      var progressValue = value.split(':')[1];
      var newData = this.localApps;
      // 位置状态改变
      for (var i = 0; i < newData.length; i++) {
        var packageName = newData[i].packageName;
        if (textName === packageName) {
          // 下载动画
          this.localApps[i]['isDownloadShow'] = true;
          this.localApps[i]['isDownload'] = true;
          this.loading(progressValue, packageName, i);
        } else {
          // 等待下载中
          if (list.includes(packageName)) {
            this.localApps[i]['isDownloadShow'] = true;
            this.localApps[i]['isDownload'] = false;
          }
          // storage.getItem('installApps', e => {
          //   if (e.result === 'success') {
          //     console.log('等待下载队列', e.data)
          //     let apps = JSON.parse(e.data)
          //     if (apps.includes(packageName)) {
          //       this.localApps[i]['isDownloadShow'] = true
          //       this.localApps[i]['isDownload'] = false
          //     }
          //   }
          // })
        }
      }
    },

    // 下载动画
    loading: function loading(value, packageName, index) {
      var _this3 = this;

      console.log('index下载进度：', value);
      this.$nextTick(function () {
        _this3.$refs['progressMethod' + index][0].setProgress(0, value);
      });
      // 100 时剔除下载队列
      if (value === '100') {
        this.localApps[index]['isDownloadShow'] = false;
        this.localApps[index]['isDownload'] = false;
        // storage.getItem('installApps', e => {
        //   if (e.result === 'success') {
        //     let data = JSON.parse(e.data)
        //     data.splice(data.findIndex(item => item === packageName), 1)
        //     storage.setItem('installApps', data, e => {
        //       console.log(e)
        //     })
        //   }
        // })
      }
    },

    // 安装状态更新
    installed: function installed(value) {
      console.log('我的收藏安装成功更新', value, this.localApps);
      this.init();
      // value = JSON.parse(value)
      // // let index = this.localApps.findIndex(item => {
      // //   console.log(item.packageName === value.packages[0].packageName)
      // //   item.packageName === value.packages[0].packageName
      // // })
      // let index = null
      // for (let i = 0; i < this.localApps.length; i++) {
      //   const element = this.localApps[i]
      //   if (element.packageName === value.packages[0].packageName) {
      //     index = i
      //   }
      // }
      // console.log(index)
      // if (index !== null) {
      //   this.localApps[index]['update'] = false
      //   this.localApps[index]['isDownloadShow'] = false
      //   this.localApps[index]['isDownload'] = false
      //   this.localApps[index]['versionName'] = value.packages[0].versionName
      // }
    },

    // 退出应用
    backApp: function backApp() {
      storage.removeItem('installApps');
      storage.removeItem('localApps');
      myModule.finish();
    },
    tabChange: function tabChange() {
      // add more method
    }
  },
  watch: {
    refresh: function refresh(value) {
      var _this4 = this;

      if (value) {
        var localApps = [];
        storage.getItem('localApps', function (e) {
          if (e.result === 'success') {
            console.log(e.data);
            localApps = JSON.parse(e.data).apps;
          } else {
            localApps = myModule.getLocalOrbbecApp(); // 本地应用
            localApps = localApps ? JSON.parse(localApps).packages : [];
          }
          _this4.init(localApps);
        });
      }
    }
  }
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.appNum === 0) ? _c('div', {
    staticClass: ["no-box"]
  }, [_c('image', {
    staticClass: ["no-img"],
    attrs: {
      "src": (_vm.staticImg + "/img/app_box.png")
    }
  }), _vm._m(0), _c('image', {
    staticClass: ["no-button"],
    attrs: {
      "src": (_vm.staticImg + "/img/no_button_" + (_vm.isNoCheck ? 'active' : 'normal') + ".png")
    }
  })]) : _c('scroller', {
    staticClass: ["main"],
    attrs: {
      "scrollDirection": "horizontal"
    }
  }, [_c('div', {
    ref: "apps",
    staticClass: ["apps"]
  }, [_vm._l((_vm.localApps), function(item, i) {
    return _c('div', {
      key: item.packageName,
      ref: ("A" + i),
      refInFor: true,
      class: ['app', _vm.focusCode === ("A" + i) ? 'bd-border' : '']
    }, [_c('image', {
      class: ['app-bd', _vm.focusCode === ("A" + i) ? 'app-opacity' : ''],
      attrs: {
        "src": (_vm.staticImg + "/img/app_" + (item.update ? 'bd' : 'bd_no') + ".png")
      }
    }), _c('image', {
      staticClass: ["app-icon-img"],
      attrs: {
        "src": item.ApplicationIcon
      }
    }), _c('div', {
      staticClass: ["app-about"]
    }, [_c('text', {
      staticClass: ["app-name"]
    }, [_vm._v(_vm._s(item.ApplicationName))]), _c('text', {
      staticClass: ["app-text"]
    }, [_vm._v("版本：" + _vm._s(item.versionName))]), _c('text', {
      staticClass: ["app-text"]
    }, [_vm._v("大小：" + _vm._s(item.packageSize))])]), _c('div', {
      class: ['app-button', _vm.focusCode === ("A" + i) ? 'app-opacity' : '']
    }, [(item.update) ? _c('image', {
      staticClass: ["app-button-text"],
      attrs: {
        "src": (_vm.staticImg + "/img/" + (item.isDownloadShow ? 'updated' : 'update_active') + ".png")
      }
    }) : _vm._e()]), (item.update) ? _c('div', {
      staticClass: ["point-div"]
    }, [_c('image', {
      staticClass: ["point-img"],
      attrs: {
        "src": (_vm.staticImg + "/img/point_zi.png")
      }
    })]) : _vm._e(), (item.isDownloadShow) ? _c('div', {
      staticClass: ["down-overlay"]
    }, [(!item.isDownload) ? _c('div', [_c('text', {
      staticClass: ["down-overlay-text"]
    }, [_vm._v("等待安装")])]) : _c('Progress', {
      ref: ("progressMethod" + i),
      refInFor: true,
      staticClass: ["progress"],
      attrs: {
        "circleWidth": "92",
        "circlePadding": "6",
        "circleRadius": "84",
        "containerWidth": "86"
      }
    })], 1) : _vm._e()])
  }), _vm._l((_vm.vacancy), function(item) {
    return _c('div', {
      key: item,
      staticClass: ["vacancy"]
    }, [_c('text', {
      staticClass: ["vacancy-text"]
    }, [_vm._v("精彩内容等你下载")])])
  })], 2), _c('ob-dialog', {
    attrs: {
      "content": _vm.dialogText,
      "show": _vm.isLialog,
      "single": false,
      "isCancel": _vm.isCancel
    }
  }), _c('ob-mask', {
    attrs: {
      "height": "260",
      "width": "520",
      "borderRadius": "20",
      "duration": "300",
      "maskBgColor": "#4F6175",
      "contentText": "应用更新中",
      "fontSize": "50",
      "contentTextColor": "#d4f2ff",
      "show": _vm.isToast
    },
    on: {
      "obMaskSetHidden": _vm.obMaskSetHidden
    }
  })], 1)
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('text', {
    staticClass: ["no-text"]
  }, [_vm._v("收藏还是空的，快去下载吧！")])])
}]}
module.exports.render._withStripped = true

/***/ }),
/* 28 */
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\pages\\recommended\\entry.vue"
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
/* 29 */
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
/* 30 */
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
/* 31 */
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\components\\seat.vue"
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
/* 32 */
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
/* 33 */
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
            height: mHeight * 1.06 - borderWidth + 'px'
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
/* 34 */
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
/* 35 */
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(37)
)

/* script */
__vue_exports__ = __webpack_require__(38)

/* template */
var __vue_template__ = __webpack_require__(51)
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\pages\\personalCenter\\entry.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-5803b629"
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
/* 37 */
/***/ (function(module, exports) {

module.exports = {
  "line": {
    "width": "750",
    "height": ".78",
    "backgroundColor": "rgba(255,255,255,0.05)"
  },
  "content": {
    "flexDirection": "row"
  },
  "tabs": {
    "height": "353.13",
    "alignItems": "center",
    "paddingTop": "30.47",
    "marginRight": "22.27",
    "backgroundColor": "rgba(0,255,222,0.04)"
  },
  "tab": {
    "width": "135.94",
    "height": "64.06",
    "justifyContent": "center"
  },
  "tab-img": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "width": "135.94",
    "height": "64.06"
  },
  "tab-text": {
    "fontSize": "16",
    "textAlign": "center",
    "color": "rgba(255,255,255,0.4)"
  },
  "tab-focus": {
    "color": "#ffffff"
  },
  "bd": {
    "width": "750",
    "height": "421.88",
    "position": "absolute",
    "top": 0,
    "left": 0
  }
}

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _HelpFeedback = __webpack_require__(39);

var _HelpFeedback2 = _interopRequireDefault(_HelpFeedback);

var _MyApps = __webpack_require__(43);

var _MyApps2 = _interopRequireDefault(_MyApps);

var _Goods = __webpack_require__(47);

var _Goods2 = _interopRequireDefault(_Goods);

var _getSeat = __webpack_require__(4);

var _index = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var myModule = weex.requireModule('myModule'); //
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

// import Userinfo from './UserInfo'

var storage = weex.requireModule('storage');
exports.default = {
  components: {
    // Userinfo,
    Help: _HelpFeedback2.default,
    App: _MyApps2.default,
    Order: _Goods2.default
  },
  props: {
    seatDatas: Array
  },
  data: function data() {
    return {
      tabComponent: 'Help',
      focusCode: 'T',
      myAppNum: 0,
      buttons: [
      // {
      //   name: '会员信息',
      //   page: 'Userinfo',
      //   icon: 'C0'
      // },
      {
        name: '帮助详情',
        page: 'Help',
        icon: 'C0'
      }, {
        name: '我的应用',
        page: 'App',
        icon: 'C1'
      }, {
        name: '产品信息',
        page: 'Order',
        icon: 'C2'
      }],
      staticImg: _index.staticImg,
      imgBaseUrl: _index.baseImg,
      helpData: []
    };
  },

  computed: {
    tabImg: function tabImg() {
      // 1. page 2. active
      if (this.focusCode.includes('C')) {
        return _index.staticImg + '/img/App_active.png';
      } else {
        return _index.staticImg + '/img/App_hover.png';
      }
    }
  },
  created: function created() {
    console.log('--------个人中心--------');
  },

  methods: {
    init: function init(item) {
      // 帮助页面初始化
      this.$refs['myApp'].init(item);
      this.helpData = item;
    },
    tabChange: function tabChange(item) {
      this.tabComponent = item.page;
      if (item.page === 'Help') {
        console.log('to helo :-----', this.helpData);
        this.seatDatas = this.helpData;
      }
    },

    // 我的应用数
    appNum: function appNum(value) {
      console.log('--\u672C\u5730\u5E94\u7528\u6570\u91CF--' + value + '------');
      this.myAppNum = value;
    },

    // 返回挽留
    retain: function retain() {
      this.$emit('retain', true);
    },

    // 更新状态
    toUpdate: function toUpdate(value) {
      console.log('卸载更新数量', value);
      this.$emit('updataeNum', value);
    },
    autoFocus: function autoFocus(code) {
      console.log('---个人中心--', code);
      var old = this.focusCode;
      if (this.tabComponent === 'App') {
        // 我的应用焦点控制
        this.$refs.myApp.autoFocus(old, code);
        return false;
      }
      if (code === 4) {
        // back
        this.$emit('retain', true);
      } else if (code === 23) {
        // 确认
      } else {
        code = code >= 19 || code <= 23 ? code - 19 : null;
        var nextCode = (0, _getSeat.getCenterSeat)(old, code, this.tabComponent, this.myAppNum);
        console.log('----\u4E2A\u4EBA\u4E2D\u5FC3\u4E0B\u4E00\u7126\u70B9---' + nextCode + '--');
        if (nextCode) {
          this.nextFocus(nextCode);
        }
      }
    },

    // 聚焦切换
    nextFocus: function nextFocus(nextCode) {
      if (nextCode.includes('C')) {
        // tab切换
        // 1. A => C
        // 2. C => C
        var button = this.buttons.find(function (e) {
          return e.icon === nextCode;
        });
        this.tabChange(button);
        this.focusCode = nextCode;
      } else {
        // 帮助反馈
        this.focusCode = nextCode;
        // 帮助统计
        // statistics('click', 2, 1)
        if (nextCode === 'T') {
          this.$emit('upTab', { to: 'personalcenter', value: true });
        }
      }
    },

    // 下载进度
    progress: function progress(value, list) {
      this.$refs.myApp.progress(value, list);
    },

    // 下载动画
    loading: function loading(value, packageName, index) {
      this.$refs.myApp.loading(value, packageName, index);
    },

    // 安装状态更新
    installed: function installed(value) {
      this.$refs.myApp.installed(value);
    },

    // 退出应用
    backApp: function backApp() {
      myModule.finish();
      storage.removeItem('installApps');
      storage.removeItem('localApps');
    }
  }
};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(40)
)

/* script */
__vue_exports__ = __webpack_require__(41)

/* template */
var __vue_template__ = __webpack_require__(42)
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\pages\\personalCenter\\HelpFeedback.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-2b384c9f"
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
/* 40 */
/***/ (function(module, exports) {

module.exports = {
  "helpDiv": {
    "flexDirection": "row",
    "width": "566.41",
    "height": "283.59",
    "marginTop": "30.47",
    "backgroundColor": "rgba(0,0,0,0.16)",
    "borderRadius": "7.81"
  },
  "help-l": {
    "paddingTop": "29.3"
  },
  "help-l-div": {
    "height": "39.06",
    "width": "191.41",
    "lineHeight": "39.06",
    "justifyContent": "center"
  },
  "help-l-img": {
    "width": "191.41",
    "height": "39.06",
    "position": "absolute",
    "top": 0,
    "left": 0
  },
  "help-l-text": {
    "color": "#ffffff",
    "fontSize": "12",
    "marginLeft": "23.44"
  },
  "help-l-focus": {
    "fontSize": "12"
  },
  "line": {
    "width": ".78",
    "height": "283.59",
    "backgroundColor": "rgba(255,255,255,0.05)"
  },
  "help-r": {
    "paddingTop": "29.3",
    "marginLeft": "23.44",
    "width": "304.69"
  },
  "help-r-text": {
    "color": "#ffffff",
    "fontSize": "12",
    "lineHeight": "21"
  }
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getSeat = __webpack_require__(4);

var _index = __webpack_require__(0);

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

exports.default = {
  props: {
    seatData: Array,
    focus: String
  },
  data: function data() {
    return {
      helps: [],
      feedbacks: [],
      staticImg: _index.staticImg,
      contents: []
    };
  },

  computed: {
    content: function content() {
      console.log('help content');
      var contents = this.helps.description;
      if (this.focus.includes('A')) {
        var index = this.focus.slice(1);
        return contents[index].content;
      } else {
        return contents[0].content;
      }
    }
  },
  created: function created() {
    console.log('help created', this.seatData);
    this.init(this.seatData);
  },

  methods: {
    init: function init(seatData) {
      this.seatData = seatData;
      var helps = seatData.find(function (n) {
        return n.type === 'help';
      });
      // const feedbacks = seatData.find(n => n.type === 'feedback')
      this.helps = helps;
      console.log('help created 2', seatData, helps);
      if (this.helps) {
        this.contents = helps.description;
        (0, _getSeat.helpInit)(this.helps.description.length);
      } else {
        (0, _getSeat.helpInit)(0);
      }
      // this.feedbacks = feedbacks
    }
  }
};

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["helpDiv"]
  }, [_c('div', {
    staticClass: ["help-l"]
  }, _vm._l((_vm.helps.description), function(item, index) {
    return _c('div', {
      key: item.title,
      staticClass: ["help-l-div"]
    }, [(("A" + index) === _vm.focus) ? _c('image', {
      staticClass: ["help-l-img"],
      attrs: {
        "src": (_vm.staticImg + "/img/title_check.png")
      }
    }) : _vm._e(), _c('text', {
      class: ['help-l-text', ("A" + index) === _vm.focus ? 'help-l-focus' : null]
    }, [_vm._v(_vm._s(item.title))])])
  })), _c('div', {
    staticClass: ["line"]
  }), _c('div', {
    staticClass: ["help-r"]
  }, [_c('text', {
    staticClass: ["help-r-text"]
  }, [_vm._v(_vm._s(_vm.content))])])])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(44)
)

/* script */
__vue_exports__ = __webpack_require__(45)

/* template */
var __vue_template__ = __webpack_require__(46)
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\pages\\personalCenter\\MyApps.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-0dae5492"
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
/* 44 */
/***/ (function(module, exports) {

module.exports = {
  "appDiv": {
    "marginTop": "19.53"
  },
  "update": {
    "width": "554.3",
    "height": "25.78",
    "marginBottom": "10.16",
    "backgroundColor": "rgba(36,125,199,0.3)",
    "alignItems": "center",
    "justifyContent": "center"
  },
  "update-img": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "width": "554.3",
    "height": "25.78"
  },
  "update-text": {
    "color": "#ffffff",
    "fontSize": "12"
  },
  "apps": {
    "flexDirection": "row",
    "flexWrap": "wrap",
    "width": "554.3",
    "justifyContent": "space-between"
  },
  "app": {
    "width": "274.22",
    "height": "87.89",
    "backgroundColor": "rgba(36,125,199,0.2)",
    "flexDirection": "row",
    "alignItems": "center",
    "marginBottom": "12.11",
    "borderRadius": "7.81"
  },
  "app-icon-img": {
    "width": "54.69",
    "height": "54.69",
    "marginLeft": "16.41",
    "marginRight": "14.84",
    "borderRadius": "7.81"
  },
  "app-name": {
    "marginBottom": "7.03",
    "fontSize": "14",
    "color": "#ffffff"
  },
  "app-text": {
    "fontSize": "10",
    "color": "#ffffff"
  },
  "app-button": {
    "position": "absolute",
    "right": 0,
    "top": 0,
    "justifyContent": "space-around",
    "alignItems": "center",
    "width": "85.94",
    "height": "87.89",
    "marginLeft": "15.63",
    "paddingTop": "5.86",
    "paddingRight": "5.86",
    "paddingBottom": "5.86",
    "paddingLeft": "5.86",
    "opacity": 0
  },
  "app-button-text": {
    "fontSize": "12",
    "width": "61.33",
    "height": "23.05"
  },
  "bd-border": {
    "borderStyle": "solid",
    "borderWidth": "1.56",
    "borderColor": "#ffffff",
    "borderRadius": "7.81"
  },
  "app-bd": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "width": "271.09",
    "height": "84.77",
    "borderRadius": "7.81",
    "opacity": 0
  },
  "app-opacity": {
    "opacity": 1
  },
  "point-div": {
    "width": "11.72",
    "height": "11.72",
    "position": "absolute",
    "right": 0,
    "top": 0
  },
  "point-img": {
    "width": "11.72",
    "height": "11.72"
  },
  "vacancy": {
    "width": "271.09",
    "height": "84.77",
    "backgroundColor": "rgba(36,125,199,0.05)",
    "flexDirection": "row",
    "alignItems": "center",
    "justifyContent": "center",
    "marginBottom": "12.11",
    "borderRadius": "7.81"
  },
  "vacancy-text": {
    "fontSize": "16",
    "color": "rgba(255,255,255,0.05)"
  },
  "down-overlay": {
    "position": "absolute",
    "top": "14.84",
    "left": "16.41",
    "width": "54.69",
    "height": "54.69",
    "justifyContent": "center",
    "alignItems": "center",
    "borderRadius": "7.81",
    "backgroundColor": "rgba(0,0,0,0.8)"
  },
  "down-overlay-text": {
    "fontSize": "7",
    "color": "#ffffff"
  },
  "progress": {
    "marginTop": "9.38",
    "marginRight": "9.38",
    "marginBottom": "9.38",
    "marginLeft": "9.38"
  },
  "overlay": {
    "width": "750",
    "position": "fixed",
    "left": 0,
    "top": 0,
    "bottom": 0,
    "right": 0,
    "backgroundColor": "rgba(0,0,0,0.6)",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "dialog-body": {
    "position": "absolute",
    "left": "207.81",
    "top": "107.42",
    "width": "334.38",
    "height": "207.03",
    "borderRadius": "7.81",
    "alignItems": "center",
    "backgroundColor": "#54687e"
  },
  "dialog-title": {
    "height": "128.13",
    "backgroundColor": "#54687e"
  },
  "dialog-title-text": {
    "fontSize": "18",
    "color": "#d4f2ff",
    "marginTop": "66.8"
  },
  "dialog-button": {
    "position": "absolute",
    "bottom": 0,
    "left": 0,
    "right": 0,
    "height": "78.91",
    "backgroundColor": "#4f6175",
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "dialog-img": {
    "width": "147.66",
    "height": "56.25"
  },
  "toast-div": {
    "backgroundColor": "#4f6175",
    "height": "101.56",
    "width": "203.13",
    "justifyContent": "center",
    "alignItems": "center",
    "borderRadius": "7.81"
  },
  "toast-text": {
    "fontSize": "20",
    "color": "#d4f2ff"
  }
}

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _templateObject = _taggedTemplateLiteral(['', '----', ''], ['', '----', '']);

var _getSeat = __webpack_require__(4);

var _index = __webpack_require__(0);

var _progress = __webpack_require__(3);

var _progress2 = _interopRequireDefault(_progress);

var _mask = __webpack_require__(9);

var _mask2 = _interopRequireDefault(_mask);

var _dialog = __webpack_require__(10);

var _dialog2 = _interopRequireDefault(_dialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); } //
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

var myModule = weex.requireModule('myModule');
var globalEvent = weex.requireModule('globalEvent');
var stream = weex.requireModule('stream');
var dom = weex.requireModule('dom');
var animation = weex.requireModule('animation');
var storage = weex.requireModule('storage');
exports.default = {
  components: {
    Progress: _progress2.default,
    obMask: _mask2.default,
    obDialog: _dialog2.default
  },
  props: {
    seatData: Array,
    focus: String
  },
  data: function data() {
    return {
      staticImg: _index.staticImg,
      baseImg: _index.baseImg,
      localApps: [],
      // updataeNum: 0,
      vacancy: 0,
      appNum: 0,
      updateCheck: true,
      isLialog: false,
      isToast: false,
      isCancel: true,
      isDownloadShow: false,
      isDownload: false,
      transY: 0,
      dialogText: '请更新应用!',
      update: true
    };
  },

  computed: {
    updataeNum: function updataeNum() {
      return this.$store.state.updateNum;
    }
  },
  created: function created() {
    console.log('------\u6211\u7684\u5E94\u7528-created----');
    // this.$emit('appNum', 7)
    // this.updataeNum = 1
    // appInit(1, 7)
    // let localApps = []
    // storage.getItem('localApps', e => {
    //   if (e.result === 'success') {
    //     localApps = JSON.parse(e.data).apps
    //   } else {
    //     localApps = myModule.getLocalOrbbecApp() // 本地应用
    //     localApps = localApps ? JSON.parse(localApps).packages : []
    //   }
    //   this.init(localApps)
    // })
    // console.log('DAIXIN:', localApps)
    this.init();
  },

  methods: {
    init: function init() {
      var _this = this;

      console.log('app init -----------');
      var getLocalApps = new Promise(function (resolve, reject) {
        var apps = myModule.getLocalOrbbecApp();
        if (apps) {
          resolve(JSON.parse(apps).packages);
        } else {
          reject(new Error('err'));
        }
      });
      getLocalApps.then(function (localApps) {
        stream.fetch({
          method: 'GET',
          url: _index.API + '/portal/439c165a-9854-35d1-b31b-ce312602291f/app?results_per_page=0',
          type: 'json'
        }, function (res) {
          var data = res.data.objects;
          var newApps = [];
          var updataeNum = 0;

          var _loop = function _loop(i) {
            var element = localApps[i];
            var online = data.find(function (n) {
              return n.package_name === element.packageName;
            });
            // 应用存在线上
            if (online) {
              element['update'] = false;
              element['isDownloadShow'] = false;
              element['isDownload'] = false;
              element['note'] = online.note;
              element['ApplicationIcon'] = _this.baseImg + online.icon[0].image_url;
              // 需要更新
              if (online.version_code - element.versionCode > 0) {
                element['update'] = true;
                element['app_url'] = _this.baseImg + online.app_url;
                updataeNum++;
              }
              newApps.push(element);
            }
          };

          for (var i = 0; i < localApps.length; i++) {
            _loop(i);
          }
          console.log('---\u6211\u7684\u5E94\u7528\u521D\u59CB\u5316---' + updataeNum + '-' + newApps.length + '--');
          _this.$emit('appNum', newApps.length); // 上报本地应用数
          // this.$emit('updataeNum', updataeNum)
          (0, _getSeat.appInit)(updataeNum, newApps.length);
          _this.appNum = newApps.length;
          // this.updataeNum = updataeNum
          _this.localApps = newApps;
          if (newApps.length <= 8) {
            _this.vacancy = 8 - newApps.length;
          } else if (newApps.length % 2) {
            _this.vacancy = 2 - newApps.length % 2;
          }
          _this.$store.commit('localApps', newApps);
          // console.log(JSON.stringify(newApps))
        });
      }).catch();
    },
    autoFocus: function autoFocus(old, code) {
      var _this2 = this;

      console.log(_templateObject, old, code);
      // statistics('click', 3, 1)
      var seatIndex = old.slice(1);
      var oldApp = old.includes('A') ? this.localApps[seatIndex] : { update: false };
      if (this.updataeNum && old.includes('A')) {
        oldApp = seatIndex === '0' ? { update: false } : this.localApps[seatIndex - 1];
      }
      if (code === 4) {
        // back
        if (this.isLialog) {
          // 对话框返回
          this.isLialog = false;
        } else {
          // 挽留页面
          this.$emit('retain', true);
          // this.backApp()
        }
      } else if (code === 23) {
        if (old.includes('C')) return false;
        if (oldApp.isDownloadShow) {
          // 状态为下载中
          this.isToast = true;
          setTimeout(function () {
            _this2.isToast = false;
          }, 1000);
          return false;
        }
        if (!this.isLialog) {
          // 弹出对话框
          if (this.updataeNum && old === 'A0') {
            // 所有更新
            this.localApps.forEach(function (element) {
              if (element.update) {
                myModule.downLoad(element.packageName, element.app_url);
                // myModule.downLoad(element.packageName, element.note)
                // 存入下载队列
                _this2.$store.commit('downList', element.packageName);
                // setDownload(element.packageName)
              }
            });
            this.update = true;
          } else if (oldApp.update) {
            // 有更新时 updateCheck: true 更新
            var packageName = oldApp.packageName;
            this.dialogText = this.updateCheck ? '\u8BF7\u66F4\u65B0' + oldApp.ApplicationName + '!' : '\u662F\u5426\u8981\u5378\u8F7D' + oldApp.ApplicationName + '?';
            this.update = this.updateCheck;
            if (this.updateCheck) {
              myModule.downLoad(packageName, oldApp.app_url);
              // myModule.downLoad(packageName, oldApp.note)
              // 存入下载队列
              this.$store.commit('downList', packageName);
              // setDownload(packageName)
            } else {
              this.isLialog = true;
            }
          } else {
            this.dialogText = '\u662F\u5426\u8981\u5378\u8F7D' + oldApp.ApplicationName + '?';
            this.update = false;
            this.isLialog = true;
          }
        } else {
          // 对话框的OK
          if (!this.isCancel) {
            // 更新 / 卸载
            var _packageName = oldApp.packageName;
            if (oldApp.update) {
              // 有更新时 updateCheck: true 更新
              // if (this.updateCheck) {
              //   myModule.downLoad(packageName, oldApp.app_url)
              //   // 存入下载队列
              //   setDownload(packageName)
              // } else {
              myModule.uninstall(_packageName);
              globalEvent.addEventListener('uninstall', function (e) {
                _this2.uninstall(e.packageAction, seatIndex);
              });
              // }
            } else {
              // if (old === 'A0' && this.updataeNum) {
              //   // 所有更新
              //   this.localApps.forEach(element => {
              //     if (element.update) {
              //       myModule.downLoad(element.packageName, element.app_url)
              //       // 存入下载队列
              //       setDownload(element.packageName)
              //     }
              //   })
              // } else {
              myModule.uninstall(_packageName);
              globalEvent.addEventListener('uninstall', function (e) {
                _this2.uninstall(e.packageAction, seatIndex);
              });
              // }
            }
          }
          this.isLialog = false;
          this.isCancel = true;
        }
      } else {
        if (this.isLialog) {
          this.isCancel = code === 22 || code === 21 ? !this.isCancel : this.isCancel;
          return false;
        } else if (oldApp.update) {
          if (this.updateCheck && code === 20) {
            this.updateCheck = false;
            return false;
          } else if (!this.updateCheck && code === 19) {
            this.updateCheck = true;
            return false;
          }
          this.updateCheck = true;
        }
        code = code >= 19 || code <= 23 ? code - 19 : null;
        var nextCode = (0, _getSeat.getCenterSeat)(old, code, 'App', this.localApps.length);
        console.log('----\u6211\u7684\u5E94\u7528\u4E0B\u4E00\u7126\u70B9---' + nextCode + '--');
        if (nextCode) {
          this.t2d(old, nextCode); // 动画
          this.$emit('nextFocus', nextCode); // 传递给父级
        }
      }
    },
    t2d: function t2d(old, now) {
      var _this3 = this;

      // bottom  height + b
      // 1. 最后一排 Y += height + b - (maxHeight - top)
      // up Y -= minHeight -top
      var maxHeight = Math.round(1080 / 1920 * 750 * 100) / 100;
      var minHeight = Math.round(300 / 1920 * 750 * 100) / 100;
      var b = Math.round(31 / 1920 * 750 * 100) / 100;
      if (old.includes('A') && now.includes('A')) {
        var _element = this.updataeNum && now === 'A0' ? this.$refs[now] : this.$refs[now][0];
        var num = this.localApps.length;
        var index = this.updataeNum ? now.slice(1) - 1 : now.slice(1);
        var isLast = false;
        var isFirst = false;
        dom.getComponentRect(_element, function (options) {
          if (options.size.bottom - maxHeight > 0) {
            if (num % 2) {
              isLast = parseInt(index) === num - 1;
            } else {
              isLast = parseInt(index) >= num - 2;
            }
            if (isLast) {
              _this3.transY += options.size.height + b;
            } else {
              // 最后一排
              _this3.transY += options.size.height + b - (maxHeight - options.size.top);
            }
            animation.transition(_this3.$refs.apps, {
              styles: {
                transform: 'translateY(-' + _this3.transY + 'px)'
              },
              duration: 1
            });
          } else if (options.size.top < minHeight) {
            if (num % 2) {
              isFirst = parseInt(index) === 0;
            } else {
              isFirst = parseInt(index) <= 1;
            }
            if (isFirst) {
              _this3.transY = 0;
            } else {
              _this3.transY -= minHeight - options.size.top;
            }
            animation.transition(_this3.$refs.apps, {
              styles: {
                transform: 'translateY(-' + _this3.transY + 'px)'
              },
              duration: 1
            });
          }
        });
      }
      if (old.includes('C') && now.includes('A')) {
        this.transY = 0;
        animation.transition(this.$refs.apps, {
          styles: {
            transform: 'translateY(0px)'
          },
          duration: 1
        });
      }
    },

    // mask 隐藏
    obMaskSetHidden: function obMaskSetHidden() {
      this.isToast = false;
    },

    // 卸载重刷
    uninstall: function uninstall(value, index) {
      console.log('daixin uninstall', value, index);
      if (value) {
        index = this.updataeNum === 0 ? index : index - 1;
        var newArr = this.localApps;
        var packageName = newArr[index].packageName;
        newArr.splice(index, 1);
        // 卸载统计
        // statistics('click', 1, packageName)
        // storage.getItem('localApps', e => {
        //   if (e.result === 'success') {
        //     console.log('卸载应用包名：', packageName)
        //     let data = JSON.parse(e.data)
        //     data.apps.splice(data.apps.findIndex(item => item.packageName === packageName), 1)
        //     storage.setItem('localApps', data, e => {
        //       console.log('卸载成功写入本地缓存:', data, e)
        //     })
        //   }
        // })
        globalEvent.removeEventListener('uninstall');
        this.init();
        if (newArr.length) {
          this.$emit('nextFocus', 'A0');
        } else {
          this.$emit('nextFocus', 'C2');
        }
      }
    },

    // 下载进度
    progress: function progress(value, list) {
      console.log('我的应用页下载进度：', value);
      var textName = value.split(':')[0];
      var progressValue = value.split(':')[1];
      var newData = this.localApps;
      // 位置状态改变
      for (var i = 0; i < newData.length; i++) {
        var packageName = newData[i].packageName;
        if (textName === packageName) {
          // 下载动画
          this.localApps[i]['isDownloadShow'] = true;
          this.localApps[i]['isDownload'] = true;
          this.loading(progressValue, packageName, i);
        } else {
          // 等待下载中
          if (list.includes(packageName)) {
            this.localApps[i]['isDownloadShow'] = true;
            this.localApps[i]['isDownload'] = false;
          }
          // storage.getItem('installApps', e => {
          //   if (e.result === 'success') {
          //     console.log('等待下载队列', e.data)
          //     let apps = JSON.parse(e.data)
          //     if (apps.includes(packageName)) {
          //       this.localApps[i]['isDownloadShow'] = true
          //       this.localApps[i]['isDownload'] = false
          //     }
          //   }
          // })
        }
      }
    },

    // 下载动画
    loading: function loading(value, packageName, index) {
      var _this4 = this;

      console.log('index下载进度：', value);
      this.$nextTick(function () {
        _this4.$refs['progressMethod' + index][0].setProgress(0, value);
      });
      // 100 时剔除下载队列
      if (value === '100') {
        this.$store.commit('popList', packageName);
        this.localApps[index]['isDownloadShow'] = false;
        this.localApps[index]['isDownload'] = false;
        // storage.getItem('installApps', e => {
        //   if (e.result === 'success') {
        //     let data = JSON.parse(e.data)
        //     data.splice(data.findIndex(item => item === packageName), 1)
        //     storage.setItem('installApps', data, e => {
        //       console.log(e)
        //     })
        //   }
        // })
      }
    },

    // 安装状态更新
    installed: function installed(value) {
      console.log('我的应用安装更新', value, this.localApps);
      this.init();
      // value = JSON.parse(value)
      // // let index = this.localApps.findIndex(item => item.packageName === value.packages[0].packageName)
      // let index = null
      // let updataeNum = this.updataeNum
      // for (let i = 0; i < this.localApps.length; i++) {
      //   const element = this.localApps[i]
      //   if (element.packageName === value.packages[0].packageName) {
      //     index = i
      //   }
      // }
      // if (updataeNum - 1 <= 0) {
      //   this.updataeNum = 0
      //   appInit(0, this.localApps.length)
      // }
      // if (index !== null) {
      //   this.localApps[index]['update'] = false
      //   this.localApps[index]['isDownloadShow'] = false
      //   this.localApps[index]['isDownload'] = false
      //   this.localApps[index]['versionName'] = value.packages[0].versionName
      // }
    },

    // 退出应用
    backApp: function backApp() {
      storage.removeItem('installApps');
      storage.removeItem('localApps');
      myModule.finish();
    }
  }
};

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["appDiv"]
  }, [(_vm.updataeNum !== 0) ? _c('div', {
    ref: "A0",
    staticClass: ["update"]
  }, [(_vm.focus === 'A0') ? _c('image', {
    staticClass: ["update-img"],
    attrs: {
      "src": (_vm.staticImg + "/img/update_bd.png")
    }
  }) : _vm._e(), _c('text', {
    staticClass: ["update-text"]
  }, [_vm._v("一键更新全部应用")]), _c('div', {
    staticClass: ["point-div"]
  }, [_c('image', {
    staticClass: ["point-img"],
    attrs: {
      "src": (_vm.staticImg + "/img/point.png")
    }
  })])]) : _vm._e(), _c('scroller', [_c('div', {
    ref: "apps",
    staticClass: ["apps"]
  }, [_vm._l((_vm.localApps), function(item, i) {
    return _c('div', {
      key: item.packageName,
      ref: ("A" + (_vm.updataeNum ? i + 1 : i)),
      refInFor: true,
      class: ['app', _vm.focus === ("A" + (_vm.updataeNum ? i + 1 : i)) ? 'bd-border' : '']
    }, [_c('image', {
      class: ['app-bd', _vm.focus === ("A" + (_vm.updataeNum ? i + 1 : i)) ? 'app-opacity' : ''],
      attrs: {
        "src": _vm.staticImg + '/img/app_bd.png'
      }
    }), _c('image', {
      staticClass: ["app-icon-img"],
      attrs: {
        "src": item.ApplicationIcon
      }
    }), _c('div', {
      staticClass: ["app-about"]
    }, [_c('text', {
      staticClass: ["app-name"]
    }, [_vm._v(_vm._s(item.ApplicationName))]), _c('text', {
      staticClass: ["app-text"]
    }, [_vm._v("版本：" + _vm._s(item.versionName))]), _c('text', {
      staticClass: ["app-text"]
    }, [_vm._v("大小：" + _vm._s(item.packageSize))])]), _c('div', {
      class: ['app-button', _vm.focus === ("A" + (_vm.updataeNum ? i + 1 : i)) ? 'app-opacity' : '']
    }, [(item.isDownloadShow) ? _c('image', {
      staticClass: ["app-button-text"],
      attrs: {
        "src": (_vm.staticImg + "/img/updated.png")
      }
    }) : _vm._e(), (!item.isDownloadShow && item.update) ? _c('image', {
      staticClass: ["app-button-text"],
      attrs: {
        "src": (_vm.staticImg + "/img/update_" + (_vm.updateCheck ? 'active' : 'normal') + ".png")
      }
    }) : _vm._e(), (!item.isDownloadShow) ? _c('image', {
      staticClass: ["app-button-text"],
      attrs: {
        "src": (_vm.staticImg + "/img/uninstall_" + (!item.update || !_vm.updateCheck ? 'active' : 'normal') + ".png")
      }
    }) : _vm._e()]), (item.update) ? _c('div', {
      staticClass: ["point-div"]
    }, [_c('image', {
      staticClass: ["point-img"],
      attrs: {
        "src": (_vm.staticImg + "/img/point.png")
      }
    })]) : _vm._e(), (item.isDownloadShow) ? _c('div', {
      staticClass: ["down-overlay"]
    }, [(!item.isDownload) ? _c('div', [_c('text', {
      staticClass: ["down-overlay-text"]
    }, [_vm._v("等待安装")])]) : _c('Progress', {
      ref: ("progressMethod" + i),
      refInFor: true,
      staticClass: ["progress"],
      attrs: {
        "circleWidth": "92",
        "circlePadding": "6",
        "circleRadius": "84",
        "containerWidth": "86"
      }
    })], 1) : _vm._e()])
  }), _vm._l((_vm.vacancy), function(item) {
    return _c('div', {
      key: item,
      staticClass: ["vacancy"]
    }, [_c('text', {
      staticClass: ["vacancy-text"]
    }, [_vm._v("精彩内容等您下载")])])
  })], 2)]), _c('ob-dialog', {
    attrs: {
      "content": _vm.dialogText,
      "show": _vm.isLialog,
      "single": false,
      "update": _vm.update,
      "isCancel": _vm.isCancel
    }
  }), _c('ob-mask', {
    attrs: {
      "height": "260",
      "width": "520",
      "borderRadius": "20",
      "duration": "300",
      "maskBgColor": "#4F6175",
      "contentText": "应用更新中",
      "fontSize": "50",
      "contentTextColor": "#d4f2ff",
      "show": _vm.isToast
    },
    on: {
      "obMaskSetHidden": _vm.obMaskSetHidden
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(48)
)

/* script */
__vue_exports__ = __webpack_require__(49)

/* template */
var __vue_template__ = __webpack_require__(50)
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\pages\\personalCenter\\Goods.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-3f2852ed"
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
/* 48 */
/***/ (function(module, exports) {

module.exports = {
  "goodDiv": {
    "width": "566.41",
    "height": "283.59",
    "marginTop": "30.47",
    "backgroundColor": "rgba(0,0,0,0.16)",
    "borderRadius": "7.81"
  },
  "good-img": {
    "width": "566.41",
    "height": "283.59",
    "borderRadius": "7.81"
  }
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(0);

exports.default = {
  props: {
    seatData: Array
  },
  data: function data() {
    return {
      imgUrl: String
    };
  },
  created: function created() {
    var img = this.seatData.find(function (n) {
      return n.type === 'img';
    });
    console.log(img);
    this.imgUrl = '' + _index.baseImg + img.banner[0].image_url;
  }
}; //
//
//
//
//
//

/***/ }),
/* 50 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["goodDiv"]
  }, [_c('image', {
    staticClass: ["good-img"],
    attrs: {
      "src": _vm.imgUrl
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 51 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["pcenter"]
  }, [_c('div', {
    staticClass: ["line"]
  }), _c('div', {
    staticClass: ["content"]
  }, [_c('div', {
    staticClass: ["tabs"]
  }, _vm._l((_vm.buttons), function(item) {
    return _c('div', {
      key: item.name,
      staticClass: ["tab"],
      on: {
        "click": function($event) {
          _vm.tabChange(item)
        }
      }
    }, [(_vm.tabComponent === item.page) ? _c('image', {
      staticClass: ["tab-img"],
      attrs: {
        "src": _vm.tabImg
      }
    }) : _vm._e(), _c('text', {
      class: ['tab-text', _vm.focusCode === item.icon ? 'tab-focus' : '']
    }, [_vm._v(_vm._s(item.name))])])
  })), _c(_vm.tabComponent, {
    ref: "myApp",
    tag: "component",
    attrs: {
      "seatData": _vm.seatDatas,
      "focus": _vm.focusCode
    },
    on: {
      "appNum": _vm.appNum,
      "updataeNum": _vm.toUpdate,
      "nextFocus": _vm.nextFocus,
      "retain": _vm.retain
    }
  })], 1)])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _entry = __webpack_require__(69);

var _entry2 = _interopRequireDefault(_entry);

var _store = __webpack_require__(1);

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_entry2.default.el = '#root';
_entry2.default.store = _store2.default;
new Vue(_entry2.default);

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(70)
)

/* script */
__vue_exports__ = __webpack_require__(71)

/* template */
var __vue_template__ = __webpack_require__(76)
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\pages\\index\\entry.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-6c4b883a"
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
/* 70 */
/***/ (function(module, exports) {

module.exports = {
  "container": {
    "width": "750",
    "height": "421.88"
  },
  "bd": {
    "width": "750",
    "height": "421.88",
    "position": "absolute",
    "top": 0,
    "left": 0
  },
  "header": {
    "flexDirection": "row",
    "width": "750",
    "height": "67.97"
  },
  "logo": {
    "width": "121.09",
    "height": "19.92",
    "position": "absolute",
    "justifyContent": "center",
    "top": "34.38",
    "left": "31.64"
  },
  "tags": {
    "position": "absolute",
    "top": "33.59",
    "left": "164.06",
    "width": "546.88",
    "height": "31.64",
    "flexDirection": "row",
    "justifyContent": "flex-start"
  },
  "panel": {
    "flexDirection": "row",
    "width": "85.94",
    "height": "31.64",
    "justifyContent": "center"
  },
  "cursor": {
    "width": "85.94",
    "height": "14.45",
    "position": "absolute",
    "bottom": 0,
    "left": 0,
    "right": 0
  },
  "panel-img": {
    "width": "22.27",
    "height": "15.23",
    "marginRight": "7.03",
    "opacity": 0.4
  },
  "imgFocus": {
    "opacity": 1
  },
  "panel-text": {
    "fontSize": "15",
    "textAlign": "center",
    "color": "rgba(255,255,255,0.4)"
  },
  "buttonFocus": {
    "color": "#ffffff"
  },
  "p-center": {
    "position": "absolute",
    "top": "25.78",
    "right": "27.73",
    "height": "29.69",
    "width": "91.02"
  },
  "p-center-img": {
    "width": "91.02",
    "height": "29.69"
  },
  "point-div": {
    "width": "11.72",
    "height": "11.72",
    "position": "absolute",
    "right": 0,
    "top": 0
  },
  "point-img": {
    "width": "11.72",
    "height": "11.72"
  },
  "foot": {
    "position": "fixed",
    "bottom": "15.63",
    "left": 0,
    "right": 0,
    "height": "25",
    "justifyContent": "center",
    "alignItems": "center",
    "flexDirection": "row"
  },
  "foot-img": {
    "width": "25",
    "height": "25",
    "marginRight": "8.59"
  },
  "foot-text": {
    "fontSize": "11",
    "color": "rgba(255,255,255,0.2)"
  },
  "overlay": {
    "width": "750",
    "position": "fixed",
    "left": 0,
    "top": 0,
    "bottom": 0,
    "right": 0,
    "backgroundColor": "rgba(0,0,0,0.6)",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "img-body": {
    "width": "628.13",
    "height": "354.69",
    "borderStyle": "solid",
    "borderRadius": "7.81",
    "borderWidth": "1.56",
    "borderColor": "rgba(255,255,255,0.5)"
  },
  "vod-body": {
    "width": "628.13",
    "height": "354.69",
    "borderWidth": "1.56",
    "borderStyle": "solid",
    "borderColor": "rgba(255,255,255,0.5)",
    "borderRadius": "7.81",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "mask-img": {
    "flex": 1
  },
  "mask-vod": {
    "width": "625",
    "height": "351.56"
  },
  "vod-button": {
    "width": "46.09",
    "height": "46.09"
  },
  "announcement-body": {
    "width": "334.38",
    "height": "207.03",
    "borderRadius": "7.81",
    "alignItems": "center",
    "backgroundColor": "#54687e",
    "position": "relative"
  },
  "announcement-content": {
    "width": "281.25",
    "maxHeight": "103.52",
    "marginTop": "42.19",
    "paddingLeft": "15.63",
    "paddingRight": "15.63",
    "textAlign": "center",
    "verticalAlign": "middle"
  },
  "announcement-content-text": {
    "lineHeight": "23.44",
    "alignItems": "center",
    "color": "#d4f2ff",
    "verticalAlign": "middle"
  },
  "announcement-button": {
    "position": "absolute",
    "bottom": 0,
    "left": 0,
    "width": "334.38",
    "height": "67.19",
    "backgroundColor": "#4f6175",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "announcement-img": {
    "width": "150.78",
    "height": "50"
  },
  "retain": {
    "opacity": 0
  },
  "retainOpacity": {
    "opacity": 1
  },
  "vxc-flex-row": {
    "display": "flex",
    "flexDirection": "row"
  },
  "vxc-container": {
    "width": "750"
  },
  "addbutton": {
    "position": "absolute",
    "left": 0,
    "bottom": 0,
    "right": 0,
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "button": {
    "marginRight": "15.63",
    "backgroundColor": "#ffe4ff",
    "textAlign": "center"
  },
  "test": {
    "position": "absolute",
    "width": "39.06",
    "height": "39.06",
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
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mask = __webpack_require__(9);

var _mask2 = _interopRequireDefault(_mask);

var _dialog = __webpack_require__(10);

var _dialog2 = _interopRequireDefault(_dialog);

var _errPage = __webpack_require__(20);

var _errPage2 = _interopRequireDefault(_errPage);

var _retain = __webpack_require__(72);

var _retain2 = _interopRequireDefault(_retain);

var _entry = __webpack_require__(28);

var _entry2 = _interopRequireDefault(_entry);

var _entry3 = __webpack_require__(24);

var _entry4 = _interopRequireDefault(_entry3);

var _entry5 = __webpack_require__(36);

var _entry6 = _interopRequireDefault(_entry5);

var _progress = __webpack_require__(3);

var _progress2 = _interopRequireDefault(_progress);

var _index = __webpack_require__(0);

var _getSeat = __webpack_require__(4);

var _getSeat2 = _interopRequireDefault(_getSeat);

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

var home = new BroadcastChannel('app');
var getapps = new BroadcastChannel('apps');
var globalEvent = weex.requireModule('globalEvent');
var stream = weex.requireModule('stream');
var myModule = weex.requireModule('myModule');
var navigator = weex.requireModule('navigator');
var storage = weex.requireModule('storage');
var animation = weex.requireModule('animation');
exports.default = {
  components: {
    Recommended: _entry2.default,
    PersonalCenter: _entry6.default,
    Favorites: _entry4.default,
    obMask: _mask2.default,
    obDialog: _dialog2.default,
    errPage: _errPage2.default,
    reTain: _retain2.default,
    Progress: _progress2.default
  },
  data: function data() {
    return {
      tabComponent: 'Recommended',
      focusCode: 'T0',
      lastFocusCode: null,
      pageIndex: 0,
      seatData: [],
      seatData0: [],
      buttons: [],
      Favorites: {
        name: '收藏',
        type: 'Favorites',
        page: 'Favorites',
        icon: 'icon_favorites'
      },
      Pcenter: {},
      show: false,
      maskImg: '',
      isImg: true,
      maskVideo: '',
      playState: 'play',
      staticImg: _index.staticImg,
      baseImg: _index.baseImg,
      isLialog: false,
      isCancel: true,
      isToast: false,
      downLoadUrl: '',
      isChild: false,
      myAppNum: 0,
      // updateNum: 0,
      isReqError: false,
      isNoNetwork: false,
      isErrorBack: false,
      pageShow: true,
      dialogText: '请更新应用！',
      isAnnouncement: false,
      pageStyle: 'opacity: 1',
      seatData1: [],
      seatData2: [],
      seatData3: [],
      date: String,
      progressCode: false,
      isIndex: true,
      imgBaseUrl: _index.baseImg,
      appsIndex: 0,
      isRetain: false,
      titleSize: '16'
    };
  },
  created: function created() {
    var that = this;
    that.date = new Date().getTime();
    // if (this.getQueryString('isUnload')) {
    //   this.tabComponent = 'PersonalCenter'
    //   this.focusCode = 'T4'
    // }
    // 监听遥控器键值
    globalEvent.addEventListener('keyDown', function (e) {
      console.log('\u9996\u9875\u76D1\u542C\u952E\u503C');
      that.autoFocus(e.keyDown);
    });
    // 下载进度
    globalEvent.addEventListener('loading', function (e) {
      console.log('\u9996\u9875\u76D1\u542C\u4E0B\u8F7D\u8FDB\u5EA6');
      that.progress(e.progress, e.list);
      // let data = e.list
      // storage.setItem('installApps', data, e => {
      //   console.log(e)
      // })
    });
    // 返回界面 获取下载队列
    globalEvent.addEventListener('download', function (e) {
      console.log('\u9996\u9875\u76D1\u542C\u4E0B\u8F7D\u961F\u5217');
      that['seatData' + that.pageIndex].map(function (n) {
        n.isDownloadShow = false;
        n.isDownload = false;
      });
      // console.log(JSON.parse(e.downloadList))
      // storage.setItem('installApps', e.downloadList, e => {
      //   console.log(e)
      // })
    });
    // 安装成功回调
    globalEvent.addEventListener('finishedInstall', function (e) {
      console.log('\u9996\u9875\u76D1\u542C\u5B89\u88C5', e);
      // 安装统计
      // statistics('click', 0, JSON.parse(e.packageInfo).packages[0].packageName)
      // 重新拉取本地应用列表
      // if (this.isIndex) {
      //   this.getLocalApps()
      // }
      if (e.packageInfo.includes('packages')) {
        (0, _index.finishedInstall)(e.packageInfo);
        if (that.tabComponent === 'Favorites' || that.tabComponent === 'PersonalCenter') {
          that.$refs['page' + that.pageIndex].installed(e.packageInfo);
        }
        if (that.isIndex) {
          that.getLocalApps();
        }
      }
    });
    // 更新数据
    home.onmessage = function (event) {
      console.log('首页更新状态：', event.data);
      if (event.data.isIndex) {
        that.isIndex = event.data.isIndex;
      } else if (event.data.progress) {
        // that.progress(event.data.progress)
      } else if (event.data.autoPlay) {
        that.setFirst(false);
      } else if (event.data.downapp) {
        // 加入下载队列
        that.$store.commit('downList', event.data.downapp);
      } else if (event.data.pop) {
        // 剔除下载队列
        that.$store.commit('popList', event.data.pop);
      }
    };
    getapps.onmessage = function (event) {
      console.log('首页轮播更新状态：', event.data);
      that.appsIndex = event.data.index;
    };
    // 初始化加载数据
    that.init();
    // 获取公告
    that.announcement();
    // 获取本地应用
    that.getLocalApps();
    that.First = true;
  },

  computed: {
    updateNum: function updateNum() {
      // 待更新应用数量
      return this.$store.state.updateNum;
    },
    tabFocus: function tabFocus() {
      if (this.isChild) {
        return null;
      } else {
        return this.focusCode;
      }
    },
    pcenterIcon: function pcenterIcon() {
      // 其他页面
      console.log(this.focusCode, this.isChild);
      if (this.tabComponent === 'PersonalCenter') {
        if (this.isChild) {
          return 'person_btn_2';
        } else {
          return 'person_btn_1';
        }
      } else {
        return 'person_btn_0';
      }
    },
    isVodHide: function isVodHide() {
      console.log('视频播放开放---', this.pageIndex === 0 && this.isIndex);
      return this.pageIndex === 0 && this.isIndex;
    }
  },
  methods: {
    getQueryString: function getQueryString(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      var url = weex.config.bundleUrl.split('?')[1];
      var r = url.match(reg);
      if (r != null) return unescape(r[2]);return null;
    },
    special: function special(dom, styles) {
      animation.transition(dom, {
        styles: styles,
        duration: 300,
        timingFunction: 'ease',
        delay: 100
      });
    },

    // 栏目切换
    tabChange: function tabChange(item) {
      var _this = this;

      console.log('tab change start', item.page);
      var index = parseInt(item.pageCode.slice(1));
      this.pageIndex = index;
      if (item.page === 'Recommended') {
        // this.getSeatData(item)
        (0, _getSeat.initSeat)(index, this['seatData' + index].length, item);
      }
      if (item.page === 'PersonalCenter') {
        stream.fetch({
          method: 'GET',
          url: _index.API + '/columns/' + item.code + '/position?results_per_page=20',
          type: 'json'
        }, function (res) {
          if (!res.ok) {
            _this.isReqError = true;
            _this.isNoNetwork = false;
            return false;
          }
          _this.isNoNetwork = false;
          _this.isReqError = false;
          var data = res.data.objects;
          _this.seatData = data;
          _this.$refs['page4'].init(data);
        });
      }
      var mainEl = this.$refs['vxc-main'];
      this.special(mainEl, {
        transform: 'translate(' + -750 * index + 'px,0)'
      });
      this.tabComponent = item.page;
    },

    // 子组件回到父组件
    upTab: function upTab(data) {
      if (data.value) {
        if (this.tabComponent === 'Favorites') {
          if (data.to === 'recommend') {
            this.focusCode = 'T0';
            // this.$refs[`page0`].restart()
            this.tabChange(this.buttons[0]);
          } else if (data.to === 'front') {
            // 前一页
            var _num = this.buttons.length;
            this.focusCode = this.buttons[_num - 2].pageCode;
            this.tabChange(this.buttons[_num - 2]);
          } else if (data.to === 'center') {
            // 个人中心页
            this.focusCode = this.Pcenter.pageCode;
            this.tabChange(this.Pcenter);
          } else {
            var _num2 = this.buttons.length;
            this.focusCode = this.buttons[_num2 - 1].pageCode;
          }
        } else if (this.tabComponent === 'PersonalCenter') {
          this.focusCode = this.Pcenter.pageCode;
        }
        this.isChild = false;
      }
    },

    // 挽留界面返回值处理
    reTain: function reTain(data) {
      console.log('retain------------');
      this.isRetain = false;
      if (data === 'isIndex') {
        this.isIndex = false;
      }
      if (this.pageIndex === 0) {
        this.$refs['page' + this.pageIndex].restart();
      }
    },

    // 拉起挽留界面
    toRetain: function toRetain() {
      this.isRetain = true;
      this.$refs.retainpage.retainPage();
    },
    init: function init() {
      var that = this;
      console.log('init -----------');
      if (!(0, _index.hasNetwork)(that)) {
        return false;
      }
      stream.fetch({
        method: 'GET',
        url: _index.API + '/portal/439c165a-9854-35d1-b31b-ce312602291f/columns',
        type: 'json'
      }, function (res) {
        if (!res.ok) {
          that.isReqError = true;
          that.isNoNetwork = false;
          return false;
        }
        that.$set(that.$data, 'isNoNetwork', true);
        that.isNoNetwork = false;
        that.isReqError = false;
        console.log(res);
        // console.table(res.data.objects)
        var data = res.data.objects;
        data.splice(data.length - 1, 0, that.Favorites);
        // data.push(that.Favorites, centerData)
        data.map(function (n, i) {
          n['pageCode'] = 'T' + i;
          n['icon'] = 'icon_t' + i;
          if (n.type === 'personal_center') {
            n['page'] = 'PersonalCenter';
            n['icon'] = 'icon_pcenter';
          } else if (n.type === 'recommend') {
            n['page'] = 'Recommended';
            n['icon'] = 'icon_recommend';
          } else if (n.type === 'column') {
            n['page'] = 'Recommended';
          } else if (n.type === 'Favorites') {
            n['icon'] = 'icon_favorites';
          }
        });
        (0, _getSeat.tabInit)(data.length); // 状态栏初始化
        that.Pcenter = data.pop();
        that.buttons = data;
        that.getSeatData(data, data.length - 1);
      });
    },

    // 获取栏目具体数据
    getSeatData: function getSeatData(item, num) {
      var that = this;
      if (!(0, _index.hasNetwork)(that)) {
        return false;
      }

      var _loop = function _loop(i) {
        stream.fetch({
          method: 'GET',
          url: _index.API + '/columns/' + item[i].code + '/position?results_per_page=20',
          type: 'json'
        }, function (res) {
          if (!res.ok) {
            that.isReqError = true;
            that.isNoNetwork = false;
            return false;
          }
          that.isNoNetwork = false;
          that.isReqError = false;
          var data = res.data.objects;
          if (that.tabComponent === 'PersonalCenter') {
            that.seatData = data;
            return false;
          }
          data.map(function (n, i) {
            n['isDownloadShow'] = false;
            n['isDownload'] = false;
            n['imgURL'] = n.type !== 'vod' ? _index.baseImg + n.banner[0].image_url : _index.baseImg + n.vod[0].vod_url;
            n['className'] = 'other';
            if (i === 0) {
              n['className'] = 'first';
            } else if (i === 1) {
              n['className'] = 'second';
            } else {
              if ((i - 1) % 2 === 1) {
                n['className'] = 'third';
              } else {
                n['className'] = 'four';
              }
            }
          });
          console.log('tab data created');
          // that.pageStyle = 'opacity: 0'
          if (i > 0) {
            that['seatData' + i] = data;
          } else {
            that.seatData0 = data;
            (0, _getSeat.initSeat)(0, data.length, item[i]);
          }
        });
      };

      for (var i = 0; i < num; i++) {
        _loop(i);
      }
    },

    // 获取公告
    announcement: function announcement() {
      var _this2 = this;

      stream.fetch({
        method: 'GET',
        url: _index.API + '/package/com.orbbec.gdgamecenter/announcement',
        type: 'json'
      }, function (res) {
        if (res.data.objects.length > 0) {
          var data = res.data.objects[0];
          _this2.isAnnouncement = true;
          _this2.aTitle = data.title;
          console.log('-----公告----------', data.title.length);
          _this2.titleSize = data.title.length < 30 ? '16' : '13';
        }
      });
    },

    // 获取本地应用
    getLocalApps: function getLocalApps() {
      var _this3 = this;

      if (!(0, _index.hasNetwork)(this)) {
        return false;
      }
      // let localApps = myModule.getLocalOrbbecApp() // 本地应用
      // localApps = localApps ? JSON.parse(localApps).packages : []
      var getLocalApps = new Promise(function (resolve, reject) {
        var apps = myModule.getLocalOrbbecApp();
        if (apps) {
          resolve(JSON.parse(apps).packages);
        } else {
          reject(new Error('err'));
        }
      });
      getLocalApps.then(function (localApps) {
        stream.fetch({
          method: 'GET',
          url: _index.API + '/portal/439c165a-9854-35d1-b31b-ce312602291f/app?results_per_page=0',
          type: 'json'
        }, function (res) {
          if (!res.ok) {
            _this3.isReqError = true;
            _this3.isNoNetwork = false;
            return false;
          }
          _this3.isNoNetwork = false;
          _this3.isReqError = false;
          var data = res.data.objects;
          var newApps = [];

          var _loop2 = function _loop2(i) {
            var element = localApps[i];
            var online = data.find(function (n) {
              return n.package_name === element.packageName;
            });
            // 应用存在线上
            if (online) {
              element['update'] = false;
              // 需要更新
              if (online.version_code - element.versionCode > 0) {
                num++;
                element['update'] = true;
                element['app_url'] = online.app_url;
              }
              newApps.push(element);
            }
          };

          for (var i = 0; i < localApps.length; i++) {
            _loop2(i);
          }
          // this.updateNum = num
          _this3.$store.commit('localApps', newApps);
        });
      }).catch(function (err) {
        console.log('-------------', err);
      });
    },

    // 我的应用数
    appNum: function appNum(value) {
      console.log('--\u672C\u5730\u5E94\u7528\u6570\u91CF--' + value + '------');
      this.myAppNum = value;
    },

    // 更新状态
    changeUpdate: function changeUpdate(value) {
      console.log('更新数量1：', value);
      this.updateNum = value;
    },
    setFirst: function setFirst(value) {
      if (value === false) {
        this.$refs.page0.resume();
      }
    },

    // mask 隐藏
    obMaskSetHidden: function obMaskSetHidden() {
      this.isToast = false;
    },

    // 控制焦点
    autoFocus: function autoFocus(code) {
      // 19: 上 20: 下 21: 左 22: 右
      var old = this.focusCode;
      var nextSeat = String;
      console.log('---\u9996\u9875\u5F53\u524D\u7126\u70B9-----' + old + '-------' + this.isChild + '---');
      code = code === 66 ? 23 : code;
      // 公告
      if (this.isAnnouncement) {
        if (code === 4 || code === 23) {
          this.isAnnouncement = false;
        }
        return false;
      }
      // 挽留界面
      console.log('wanliu', this.isRetain);
      if (this.isRetain) {
        this.$refs.retainpage.retainFocus(code);
        return false;
      }
      // 个人中心 我的收藏 T移动
      if (this.tabComponent !== 'Recommended') {
        if (this.isChild) {
          // 内容层移动
          console.log(this.isChild);
          this.$refs['page' + this.pageIndex].autoFocus(code);
          return false;
        }
      }
      // 推荐栏目
      if (code === 4) {
        if (this.show) {
          // 弹窗返回
          this.show = false;
          this.$refs['page' + this.pageIndex].restart();
        } else if (this.isLialog) {
          // 对话框返回
          this.isLialog = false;
        } else {
          // 挽留
          this.isRetain = true;
          this.$refs.retainpage.retainPage();
          if (this.pageIndex === 0) {
            this.$refs['page' + this.pageIndex].stop();
          }
        }
      } else if (code === 23) {
        if (this.isNoNetwork || this.isReqError) {
          // 错误处理
          if (this.isErrorBack) {
            // 退出大厅
            this.backApp();
          } else {
            // 重新加载
            this.tabComponent = 'Recommended';
            this.isChild = false;
            this.focusCode = 'T0';
            this.lastFocusCode = null;
            this.pageIndex = 0;
            this.init();
          }
          return false;
        }
        var seatIndex = this.focusCode.slice(1);
        var type = this['seatData' + this.pageIndex][seatIndex].type;
        if (old.includes('A')) {
          if (type === 'app') {
            this.startApp(seatIndex);
          } else if (type === 'img') {
            console.log('-------\u653E\u5927\u56FE\u7247------');
            this.show = true;
            this.isImg = true;
            this.maskImg = _index.baseImg + this['seatData' + this.pageIndex][seatIndex].banner[1].image_url;
          } else if (type === 'vod') {
            console.log('-------\u89C6\u9891\u64CD\u4F5C------');
            if (this.show) {
              var currState = this.playState;
              if (this.playState === 'play') {
                this.$refs.simpleVideo.pause();
              } else {
                this.$refs.simpleVideo.resume();
              }
              this.playState = currState === 'pause' ? 'play' : 'pause';
            } else {
              this.$refs['page' + this.pageIndex].stop();
              this.maskVideo = _index.baseImg + this['seatData' + this.pageIndex][seatIndex].vod[0].vod_url;
              this.show = true;
              this.isImg = false;
            }
          } else if (type === 'active') {
            console.log('-------\u6D3B\u52A8\u9875\u9762------', this['seatData' + this.pageIndex][seatIndex].link);
            var url = 'active=' + encodeURIComponent(this['seatData' + this.pageIndex][seatIndex].link);
            this.isIndex = false;
            navigator.push({
              url: url,
              animated: 'true'
            });
          } else if (type === 'apps') {
            console.log('-------\u8F6E\u64AD\u9875\u9762------');
            this.startApp(this.appsIndex, 'banner');
            // storage.getItem('bannerIndex', e => {
            //   if (e.result === 'success') {
            //     this.startApp(e.data, 'banner')
            //   }
            // })
          }
        }
      } else {
        if (this.isNoNetwork || this.isReqError) {
          // 错误处理
          if (code === 21 || code === 22) {
            this.isErrorBack = !this.isErrorBack;
          }
          return false;
        }
        if (this.show) {
          // 弹框切换按钮
          return false;
        }
        if (this.isLialog) {
          // 对话框切换
          if (code === 21 || code === 22) {
            this.isCancel = !this.isCancel;
          }
          return false;
        }
        code = code >= 19 || code <= 23 ? code - 19 : null;
        nextSeat = (0, _getSeat2.default)(this.pageIndex, this.focusCode, code);
        console.log('-----首页下一个焦点：', nextSeat);
        if (nextSeat) {
          if (nextSeat.includes('A')) {
            // => A 位置移动
            if (old.includes('T')) {
              // 特殊：从T => A
              if (this.lastFocusCode) {
                // 从 tab => seat 回去原来有记录的位置
                nextSeat = this.lastFocusCode;
              }
              if (this.tabComponent !== 'Recommended') {
                // if (this.myAppNum === 0 && this.tabComponent === 'Favorites') {
                //   return false
                // }
                this.$refs['page' + this.pageIndex].autoFocus(code);
              } else {
                this.$refs['page' + this.pageIndex].test(null, nextSeat);
              }
              this.isChild = true; // 1. 清除tab样式
              this.lastFocusCode = null;
            } else {
              this.$refs['page' + this.pageIndex].test(old, nextSeat);
            }
            this.focusCode = nextSeat;
          } else {
            // => Tab
            this.lastFocusCode = null;
            if (old.includes('A')) {
              // 特殊：从A => T
              this.lastFocusCode = this.pageIndex === parseInt(nextSeat.slice(1)) ? old : null;
              this.$refs['page' + this.pageIndex].test(old, null); // 清除上一个焦点样式
              if (this.pageIndex !== parseInt(nextSeat.slice(1))) {
                this.$refs['page' + this.pageIndex].tabChange();
              }
            }
            // 1. tab切换样式
            this.isChild = false;
            var arrs = [].concat(this.buttons);
            arrs.push(this.Pcenter);
            var button = arrs.find(function (e) {
              return e.pageCode === nextSeat;
            });
            if (old.includes('T') && button.page === 'Recommended') {
              this.progressCode = false;
              this.$refs['page' + old.slice(1)].tabChange();
              // if (parseInt(nextSeat.slice(1)) === 0) {
              //   // this.$refs[`page0`].restart()
              // } else {
              //   // this.$refs[`page0`].pause()
              // }
              if (!this.progressCode) {
                this['seatData' + parseInt(nextSeat.slice(1))].map(function (n) {
                  n.isDownloadShow = false;
                  n.isDownload = false;
                });
              }
            }
            this.tabChange(button);
            this.focusCode = nextSeat;
          }
        }
      }
    },

    // 启动应用
    startApp: function startApp(i, type) {
      var _this4 = this;

      var pageName = 'appDetails';
      var packageName = this['seatData' + this.pageIndex][i].app[0].package_name;
      // 统计板块点击上报
      var name = this['seatData' + this.pageIndex][i].app[0].title + '_clickview';
      (0, _index.statistics)(name, this.pageIndex, packageName);
      if (this['seatData' + this.pageIndex][i].isDownloadShow) {
        // 状态为下载中
        this.isToast = true;
        return false;
      }
      if (type === 'banner') {
        packageName = this['seatData' + this.pageIndex][0].app[i].package_name;
      }
      var params = {
        packageName: packageName
      };
      var isLocal = myModule.getInstalledAppVersion(packageName);
      console.log('---本地存在应用------', packageName, isLocal);
      // 1. 判断应用是否存在
      if (isLocal) {
        stream.fetch({
          method: 'GET',
          url: _index.API + '/app/' + packageName,
          type: 'json'
        }, function (res) {
          if (!res.ok) {
            // 异常
            _this4.isReqError = true;
            _this4.isNoNetwork = false;
            return false;
          }
          console.log('daixin:', JSON.stringify(res.data.objects[0]));
          var data = res.data.objects[0];
          // 2.是否需要更新
          console.log('更新判断', data.version_code, isLocal);
          if (data.version_code - isLocal > 0) {
            // 3.弹窗确认更新
            _this4.downLoadUrl = _index.baseImg + data.app_url;
            // 更新
            myModule.downLoad(packageName, _index.baseImg + data.app_url);
            // myModule.downLoad(packageName, data.note)
            // 存入下载队列
            (0, _index.setDownload)(packageName);
          } else {
            // 启动应用
            if (_this4.pageIndex !== 0) {
              _this4.setFirst(false);
            }
            myModule.startApp(packageName);
          }
        });
        return false;
      }
      var url = (0, _index.createLink)(pageName, params);
      this.isIndex = false;
      navigator.push({
        url: url,
        animated: 'true'
      });
    },

    // 下载进度
    progress: function progress(value, list) {
      console.log('\u9996\u9875\u4E0B\u8F7D\u8FDB\u5EA6---' + value + '----' + list);
      this.progressCode = true;
      if (this.tabComponent === 'Favorites' || this.tabComponent === 'PersonalCenter') {
        this.$refs['page' + this.pageIndex].progress(value, list);
        return false;
      }
      var textName = value.split(':')[0];
      var progressValue = value.split(':')[1];
      var newData = this['seatData' + this.pageIndex];
      // 位置状态改变
      for (var i = 0; i < newData.length; i++) {
        if (newData[i].type === 'app') {
          var packageName = newData[i].app[0].package_name;
          if (textName === packageName) {
            // 下载动画
            this['seatData' + this.pageIndex][i]['isDownloadShow'] = true;
            this['seatData' + this.pageIndex][i]['isDownload'] = true;
            this.loading(progressValue, packageName, i);
          } else {
            // 等待下载中
            var apps = list;
            if (apps.includes(packageName)) {
              this['seatData' + this.pageIndex][i]['isDownloadShow'] = true;
              this['seatData' + this.pageIndex][i]['isDownload'] = false;
            } else {
              this['seatData' + this.pageIndex][i]['isDownloadShow'] = false;
              this['seatData' + this.pageIndex][i]['isDownload'] = false;
            }
            // storage.getItem('installApps', e => {
            //   if (e.result === 'success') {
            //     console.log('等待下载队列', e.data)
            //     let apps = JSON.parse(e.data)
            //     if (apps.includes(packageName)) {
            //       this[`seatData${this.pageIndex}`][i]['isDownloadShow'] = true
            //       this[`seatData${this.pageIndex}`][i]['isDownload'] = false
            //     }
            //   }
            // })
          }
        }
      }
    },

    // 下载动画
    loading: function loading(value, packageName, index) {
      console.log('index下载进度：', value);
      this.$refs['page' + this.pageIndex].setProgress(value, index);
      // 100 时剔除下载队列
      if (value === '100') {
        this.$store.commit('popList', packageName);
        this['seatData' + this.pageIndex][index]['isDownloadShow'] = false;
        this['seatData' + this.pageIndex][index]['isDownload'] = false;
        // storage.getItem('installApps', e => {
        //   if (e.result === 'success') {
        //     let data = JSON.parse(e.data)
        //     data.splice(data.findIndex(item => item === packageName), 1)
        //     storage.setItem('installApps', data, e => {
        //       console.log(e)
        //     })
        //   }
        // })
      }
    },

    // 退出应用
    backApp: function backApp() {
      storage.removeItem('installApps');
      storage.removeItem('localApps');
      myModule.finish();
    }
  }
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(73)
)

/* script */
__vue_exports__ = __webpack_require__(74)

/* template */
var __vue_template__ = __webpack_require__(75)
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
__vue_options__.__file = "D:\\store3.0\\store3.0\\src\\components\\retain.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-653dea75"
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
/* 73 */
/***/ (function(module, exports) {

module.exports = {
  "bd": {
    "width": "750",
    "height": "422",
    "position": "absolute",
    "top": 0,
    "left": 0
  },
  "retain": {
    "position": "absolute",
    "top": 0,
    "left": 0,
    "width": "750",
    "height": "422",
    "opacity": 1,
    "textAlign": "center"
  },
  "other-app-top": {
    "position": "absolute",
    "top": "54",
    "color": "rgba(255,255,255,0.6)",
    "fontSize": "16",
    "textAlign": "center"
  },
  "other-app-divs": {
    "width": "585",
    "height": "207",
    "position": "absolute",
    "top": "107",
    "left": "82",
    "flexDirection": "row",
    "justifyContent": "center",
    "textAlign": "center",
    "backgroundColor": "rgba(0,0,0,0.13)",
    "borderRadius": "8"
  },
  "other-app-div": {
    "position": "relative",
    "marginTop": "14",
    "marginLeft": "11",
    "textAlign": "center"
  },
  "other-app-img": {
    "width": "133",
    "height": "178"
  },
  "other-app-title": {
    "position": "absolute",
    "bottom": "24",
    "left": "20",
    "width": "178",
    "textAlign": "center"
  },
  "other-app-title-text": {
    "color": "#ffffff",
    "fontSize": "13"
  },
  "other-app-buttons": {
    "position": "absolute",
    "top": "322",
    "left": "234",
    "marginTop": "28",
    "textAlign": "center",
    "flexDirection": "row",
    "justifyContent": "center",
    "alignItems": "center"
  },
  "other-button-active": {
    "width": "148",
    "height": "56",
    "marginLeft": "13"
  },
  "other-button": {
    "width": "116",
    "height": "39",
    "marginLeft": "13"
  }
}

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index3 = __webpack_require__(0);

var _getSeat = __webpack_require__(4);

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
var stream = weex.requireModule('stream');
var myModule = weex.requireModule('myModule');
var storage = weex.requireModule('storage');
var navigator = weex.requireModule('navigator');
exports.default = {
  data: function data() {
    return {
      staticImg: _index3.staticImg,
      baseImg: _index3.baseImg,
      retainCode: 'C1',
      otherApps: [],
      imgBaseUrl: _index3.baseImg
    };
  },

  methods: {
    // 挽留界面展示
    retainPage: function retainPage() {
      var _this = this;

      stream.fetch({
        method: 'GET',
        url: _index3.API + '/portal/439c165a-9854-35d1-b31b-ce312602291f/apk?num_display=4',
        type: 'json'
      }, function (res) {
        console.log(res);
        var data = res.data.objects;
        if (data.length > 1) {
          _this.otherApps = data;
        }
      });
    },

    // 挽留焦点
    retainFocus: function retainFocus(code) {
      var now = this.retainCode;
      var index = parseInt(now.slice(1));
      if (code === 4) {
        this.backApp();
      } else if (code === 23) {
        // 跳详情页
        if (now.includes('B')) {
          var packageName = this.otherApps[index].package_name;
          var params = {
            packageName: packageName
            // 页面取消
          };this.$emit('retain', false);
          // this.isRetain = false
          var isLocal = myModule.getInstalledAppVersion(packageName);
          console.log('---本地存在应用------', packageName, isLocal);
          if (isLocal) {
            // 1. 判断应用是否存在
            myModule.startApp(packageName);
          } else {
            // 跳转页面
            var url = (0, _index3.createLink)('appDetails', params);
            this.$emit('retain', 'isIndex');
            // this.isIndex = false
            navigator.push({
              url: url,
              animated: 'true'
            });
          }
        } else {
          if (index === 0) {
            this.backApp();
          } else {
            // 页面取消 第一页视频重播
            this.$emit('retain', false);
            this.retainCode = 'C1';
            // if (this.pageIndex === 0) {
            //   this.$refs[`page${this.pageIndex}`].restart()
            // }
          }
        }
      } else {
        // 左右选择 上下选择
        code = code >= 19 || code <= 23 ? code - 19 : null;
        var nextCode = (0, _getSeat.getRetainSeat)(now, code);
        console.log('下一步', nextCode);
        if (nextCode) {
          this.retainCode = nextCode;
          this.retain2d(now, nextCode);
        }
      }
    },

    // 挽留动画
    retain2d: function retain2d(old, now) {
      // 从B => C
      console.log('挽留动画', old, now);
      if (old.includes('B')) {
        if (now.includes('C')) {
          // B => C
          var index = old.slice(1);
          animation.transition(this.$refs['R' + index][0], {
            styles: {
              transform: 'scale(1)'
            }
          });
        } else {
          // B => B
          var oldIndex = old.slice(1);
          var _index = now.slice(1);
          animation.transition(this.$refs['R' + oldIndex][0], {
            styles: {
              transform: 'scale(1)'
            }
          });
          animation.transition(this.$refs['R' + _index][0], {
            styles: {
              transform: 'scale(1.06)'
            }
          });
        }
      } else {
        // C => B
        if (now.includes('B')) {
          var _index2 = now.slice(1);
          animation.transition(this.$refs['R' + _index2][0], {
            styles: {
              transform: 'scale(1.06)'
            }
          });
        }
      }
    },

    // 退出
    backApp: function backApp() {
      storage.removeItem('installApps');
      storage.removeItem('localApps');
      myModule.finish();
    }
  }
};

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["retain"]
  }, [_c('image', {
    staticClass: ["bd"],
    attrs: {
      "src": (_vm.staticImg + "/img/bd.png")
    }
  }), _c('text', {
    staticClass: ["other-app-top"]
  }, [_vm._v("小主~还有更多精彩内容等你体验~")]), _c('div', {
    staticClass: ["other-app-divs"]
  }, _vm._l((_vm.otherApps), function(item, index) {
    return _c('div', {
      key: item.url,
      ref: ("R" + index),
      refInFor: true,
      staticClass: ["other-app-div"]
    }, [_c('image', {
      staticClass: ["other-app-img"],
      attrs: {
        "src": _vm.imgBaseUrl + item.thumbnail[0].image_url
      }
    }), _c('div', {
      staticClass: ["other-app-title"]
    }, [_c('text', {
      staticClass: ["other-app-title-text"]
    }, [_vm._v(_vm._s(item.title))])])])
  })), _c('div', {
    staticClass: ["other-app-buttons"]
  }, [_c('image', {
    class: [_vm.retainCode.includes('C') && _vm.retainCode === 'C0' ? 'other-button-active' : 'other-button'],
    attrs: {
      "src": ("local:///" + (_vm.retainCode.includes('C') && _vm.retainCode === 'C0' ? 'retain_active' : 'retain_normal'))
    }
  }), _c('image', {
    class: [_vm.retainCode.includes('C') && _vm.retainCode === 'C1' ? 'other-button-active' : 'other-button'],
    attrs: {
      "src": ("local:///" + (_vm.retainCode.includes('C') && _vm.retainCode === 'C1' ? 'retain_back_active' : 'retain_back_normal'))
    }
  })])])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ }),
/* 76 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.isNoNetwork || _vm.isReqError) ? _c('div', {
    staticClass: ["container"]
  }, [_c('err-page', {
    attrs: {
      "isBack": _vm.isErrorBack,
      "isNoNetwork": _vm.isNoNetwork
    }
  })], 1) : _c('div', {
    staticClass: ["container"]
  }, [_c('div', {
    staticClass: ["header"]
  }, [_c('image', {
    staticClass: ["logo"],
    attrs: {
      "src": "local:///logo"
    }
  }), _c('div', {
    ref: "tabs",
    staticClass: ["tags"]
  }, _vm._l((_vm.buttons), function(item, i) {
    return _c('div', {
      key: item.name,
      ref: item.pageCode,
      refInFor: true,
      staticClass: ["panel"]
    }, [_c('image', {
      class: ['panel-img', _vm.tabFocus == item.pageCode ? 'imgFocus' : i === _vm.pageIndex ? 'imgFocus' : ''],
      attrs: {
        "src": (_vm.staticImg + "/img/" + (item.icon) + ".png")
      }
    }), _c('text', {
      class: ['panel-text', _vm.tabFocus == item.pageCode ? 'buttonFocus' : i === _vm.pageIndex ? 'buttonFocus' : '']
    }, [_vm._v(_vm._s(item.name))]), (_vm.tabFocus == item.pageCode) ? _c('image', {
      staticClass: ["cursor"],
      attrs: {
        "src": (_vm.staticImg + "/img/cursor.png")
      }
    }) : _vm._e()])
  })), _c('div', {
    ref: _vm.Pcenter.pageCode,
    staticClass: ["p-center"]
  }, [_c('image', {
    staticClass: ["p-center-img"],
    attrs: {
      "src": (_vm.staticImg + "/img/" + _vm.pcenterIcon + ".png")
    }
  }), (_vm.updateNum > 0) ? _c('div', {
    staticClass: ["point-div"]
  }, [_c('image', {
    staticClass: ["point-img"],
    attrs: {
      "src": (_vm.staticImg + "/img/point.png")
    }
  })]) : _vm._e()])]), _c('div', {
    ref: "vxc-main",
    staticClass: ["vxc-flex-row"],
    style: {
      width: (750 * 5) + 'px'
    }
  }, [_c('div', {
    staticClass: ["vxc-container"]
  }, [_c('Recommended', {
    key: _vm.tab0,
    ref: "page0",
    attrs: {
      "seatDatas": _vm.seatData0,
      "isFirst": _vm.First,
      "vodHide": _vm.isVodHide,
      "seatCode": _vm.focusCode
    }
  })], 1), _c('div', {
    staticClass: ["vxc-container"]
  }, [_c('Recommended', {
    key: _vm.tab1,
    ref: "page1",
    attrs: {
      "seatDatas": _vm.seatData1,
      "seatCode": _vm.focusCode
    }
  })], 1), _c('div', {
    staticClass: ["vxc-container"]
  }, [_c('Recommended', {
    key: _vm.tab2,
    ref: "page2",
    attrs: {
      "seatDatas": _vm.seatData2,
      "seatCode": _vm.focusCode
    }
  })], 1), _c('div', {
    staticClass: ["vxc-container"]
  }, [_c('Favorites', {
    key: _vm.tab3,
    ref: "page3",
    attrs: {
      "seatCode": _vm.focusCode,
      "refresh": _vm.tabComponent === 'Favorites'
    },
    on: {
      "first": _vm.setFirst,
      "upTab": _vm.upTab,
      "appNum": _vm.appNum,
      "retain": _vm.toRetain
    }
  })], 1), _c('div', {
    staticClass: ["vxc-container"]
  }, [_c('PersonalCenter', {
    key: _vm.tab4,
    ref: "page4",
    attrs: {
      "seatDatas": _vm.seatData,
      "seatCode": _vm.focusCode
    },
    on: {
      "upTab": _vm.upTab,
      "updataeNum": _vm.changeUpdate,
      "appNum": _vm.appNum,
      "retain": _vm.toRetain
    }
  })], 1)]), (_vm.tabComponent === 'Recommended' && !_vm.isRetain) ? _c('div', {
    staticClass: ["foot"]
  }, [_c('image', {
    staticClass: ["foot-img"],
    attrs: {
      "src": (_vm.staticImg + "/img/flat-button.png")
    }
  }), _c('text', {
    staticClass: ["foot-text"]
  }, [_vm._v("按遥控上下左右键，选择模块和内容")])]) : _vm._e(), (_vm.show) ? _c('div', {
    staticClass: ["overlay"]
  }, [(_vm.isImg) ? _c('div', {
    staticClass: ["img-body"]
  }, [_c('image', {
    staticClass: ["mask-img"],
    attrs: {
      "src": _vm.maskImg
    }
  })]) : _c('div', {
    staticClass: ["vod-body"]
  }, [_c('nativeVideo', {
    key: 123,
    ref: "simpleVideo",
    staticClass: ["mask-vod"],
    attrs: {
      "setPath": _vm.maskVideo,
      "onTop": true
    }
  })], 1)]) : _vm._e(), (_vm.isAnnouncement) ? _c('div', {
    staticClass: ["overlay"]
  }, [_c('div', {
    staticClass: ["announcement-body"]
  }, [_c('div', {
    staticClass: ["announcement-content"]
  }, [_c('text', {
    staticClass: ["announcement-content-text"],
    style: {
      fontSize: _vm.titleSize + 'px'
    }
  }, [_vm._v(_vm._s(_vm.aTitle))])]), _c('div', {
    staticClass: ["announcement-button"]
  }, [_c('image', {
    staticClass: ["announcement-img"],
    attrs: {
      "src": (_vm.staticImg + "/img/announcemen.png")
    }
  })])])]) : _vm._e(), _c('ob-dialog', {
    attrs: {
      "content": _vm.dialogText,
      "show": _vm.isLialog,
      "single": false,
      "isCancel": _vm.isCancel
    }
  }), _c('ob-mask', {
    attrs: {
      "height": "260",
      "width": "520",
      "borderRadius": "20",
      "duration": "300",
      "maskBgColor": "#4F6175",
      "contentText": "应用安装中",
      "fontSize": "50",
      "contentTextColor": "#d4f2ff",
      "show": _vm.isToast
    },
    on: {
      "obMaskSetHidden": _vm.obMaskSetHidden
    }
  }), _c('re-tain', {
    ref: "retainpage",
    class: [_vm.isRetain ? 'retainOpacity' : 'retain'],
    on: {
      "retain": _vm.reTain
    }
  })], 1)
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ })
/******/ ]);