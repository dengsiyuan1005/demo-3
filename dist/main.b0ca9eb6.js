// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList'); //放上面因为无法访问到下面的变量
var $lastLi = $siteList.find('li.last'); //$siteList.find意思是在这个元素里面找到li里面的class为.last的元素
var x = localStorage.getItem('x'); //这个x目前还是个字符串
var xObject = JSON.parse(x); //JSON.parse把字符串重新变成对象
var hashMap = xObject || [//因为用户第一次使用都是空的，parse不解析空字符串的，所以如果xObject存在就使用,不存在就使用默认的数组
{ logo: 'A', url: 'https://www.acfun.cn' }, { logo: 'B', url: ' https://www.bilibili.com' }];
var simplifyUrl = function simplifyUrl(url) {
    return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); //删除/开头的内容
};
var render = function render() {
    //我们在渲染hashMap时，需要把之前的li删掉，然后再渲染新的
    $siteList.find('li:not(.last)').remove(); //把siteList里面的li都找到，唯独不找到最后的一个li,把找到的li删掉
    hashMap.forEach(function (node, index) {
        //声明一个节点和下标，下标是为了方便查找和删除
        var $li = $('<li>\n    <div class="site">\n        <div class="logo">' + node.logo + '</div>\n        <div class="link">' + simplifyUrl(node.url) + '</div>\n        <div class="close">\n        <svg class="icon" aria-hidden="true">\n        <use xlink:href="#icon-close"></use>\n        </svg>\n        </div>\n    </div>\n    </li>').insertBefore($lastLi); //在最后一个li的前面插入
        //用onclick来代替了a标签的作用
        $li.on('click', function () {
            window.open(node.url); //当你点击li 打开一个新的窗口，地址为node.url
        });
        $li.on('click', '.close', function (e) {
            //当你点击了里面的close，得到一个事件e，
            e.stopPropagation(); //调用这个事件的 e.stopPropagation() 来阻止冒泡
            hashMap.splice(index, 1); //从index里面删除一个
            render();
        });
    });
};
render(); //声明了render也需要调用
$('.addButton').on('click', function () {
    var url = window.prompt('请问你要贴加的网址是啥?');
    if (url.indexOf('http') !== 0) {
        //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
        url = 'https://' + url;
    }

    console.log(url);
    //${url}意思是插入新的url地址
    hashMap.push({
        logo: simplifyUrl(url)[0], //toUpperCase()使字符变成大写
        url: url
    });
    render();
});
window.onbeforeunload = function () {
    var string = JSON.stringify(hashMap); //JSON.stringify是把对象变成string
    localStorage.setItem('x', string); //在本地的存储值里设置一个x，它的值就是这个string
};
$(document).on('keypress', function (e) {
    //keypress键盘按下事件
    // const key=e.key
    //console.log(e)
    var key = e.key; //key属于 console.log(e)里面的属性

    for (var i = 0; i < hashMap.length; i++) {
        //遍历hasMap
        if (hashMap[i].logo.toLowerCase() === key) {
            //如果hasMap的第i个它的logo小写(toLowerCase)===key
            window.open(hashMap[i].url); //那就打开这个i属性对应的网址
        }
    }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.b0ca9eb6.map