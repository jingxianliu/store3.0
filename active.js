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
/******/ 	return __webpack_require__(__webpack_require__.s = 54);
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
  var plateName = ['recommend', 'education', 'parentchild'];
  var clickName = ['download', 'unload', 'help', 'manager'];
  var ottUsername = myModule.getUserInfo().MACAddress;
  var sentData = '';
  if (type === 'plat') {
    // 板块
    sentData = '"' + plateName[index] + '":"' + packageName + '"';
  } else if (type === 'click') {
    sentData = '"' + clickName[index] + '":"' + packageName + '"';
  }
  var getBody = '?app_key=9efe80412273a1dcd3500ea37349d0ef&ott_username=' + ottUsername + '&operate={' + sentData + '}';
  stream.fetch({
    method: 'GET',
    url: coutlyAPI + '/operate' + getBody,
    type: 'json'
  }, function (res) {
    console.log(res);
  });
}

/***/ }),

/***/ 54:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _entry = __webpack_require__(55);

var _entry2 = _interopRequireDefault(_entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_entry2.default.el = '#root';
new Vue(_entry2.default);

/***/ }),

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {

var __vue_exports__, __vue_options__
var __vue_styles__ = []

/* styles */
__vue_styles__.push(__webpack_require__(56)
)

/* script */
__vue_exports__ = __webpack_require__(57)

/* template */
var __vue_template__ = __webpack_require__(58)
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
__vue_options__.__file = "D:\\store3.0\\emas\\src\\pages\\active\\entry.vue"
__vue_options__.render = __vue_template__.render
__vue_options__.staticRenderFns = __vue_template__.staticRenderFns
__vue_options__._scopeId = "data-v-5e4f7b3a"
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

/***/ 56:
/***/ (function(module, exports) {

module.exports = {
  "page": {
    "width": "750",
    "flex": 1,
    "justifyContent": "center",
    "alignItems": "center"
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

/***/ 57:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _index = __webpack_require__(0);

var globalEvent = weex.requireModule('globalEvent'); //
//
//
//
//
//
//
//
//

var navigator = weex.requireModule('navigator');
var myModule = weex.requireModule('myModule');

exports.default = {
  data: function data() {
    return {
      link: '',
      staticImg: _index.staticImg,
      isEPG: Boolean
    };
  },
  created: function created() {
    var _this = this;

    // 监听遥控器键值
    globalEvent.addEventListener('keyDown', function (e) {
      console.log('\u6D3B\u52A8\u9875\u76D1\u542C\u952E\u503C898989');
      _this.autoFocus(e.keyDown);
    });
    var url = weex.config.bundleUrl;
    if (this.getQueryString('isEPG')) {
      // EPG拉起
      // const activeName = this.getQueryString('activeName')
      this.isEPG = true;
      // this.link = `http://112.50.251.23:10095/static/js/${activeName}.js`
      console.log('EPG------------ACTIVE');
    } else {
      // 大厅活动页拉起
      this.isEPG = false;
      console.log(url, url.split('link=')[1]);
      var link = decodeURIComponent(url.split('link=')[1]);
      this.link = link;
      console.log('daixin123:', url, link);
    }
  },

  methods: {
    getQueryString: function getQueryString(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
      var url = weex.config.bundleUrl.split('?')[1];
      var r = url.match(reg);
      if (r != null) return unescape(r[2]);return null;
    },
    autoFocus: function autoFocus(code) {
      if (code === 4) {
        globalEvent.removeEventListener('keyDown');
        if (this.isEPG === true) {
          var url = 'pages/index/entry.js';
          navigator.push({
            url: url,
            animated: 'true'
          });
        } else {
          navigator.pop({
            animated: 'true'
          });
        }
      } else if (code === 23) {
        var packageName = 'com.Orbbec.MagicSalad2';
        var isLocal = myModule.getInstalledAppVersion(packageName);
        console.log('---本地存在应用------', packageName, isLocal);
        // 1. 判断应用是否存在
        if (isLocal) {
          myModule.startApp(packageName);
          return false;
        }
        var pageName = 'appDetails';
        var params = {
          packageName: packageName
        };
        var _url = (0, _index.createLink)(pageName, params);
        this.isIndex = false;
        navigator.push({
          url: _url,
          animated: 'true'
        });
      }
    }
  }
};

/***/ }),

/***/ 58:
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: ["page"]
  }, [_c('image', {
    staticClass: ["bd"],
    attrs: {
      "src": (_vm.staticImg + "/img/active_bd.jpg")
    }
  })])
},staticRenderFns: []}
module.exports.render._withStripped = true

/***/ })

/******/ });