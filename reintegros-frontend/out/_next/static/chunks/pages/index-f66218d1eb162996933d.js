_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[22],{"/EDR":function(e,t,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return i("23aj")}])},"20a2":function(e,t,i){e.exports=i("nOHt")},"23aj":function(e,t,i){"use strict";i.r(t),i.d(t,"default",(function(){return r}));var n=i("20a2"),o=i("9ONQ");function r(){var e=Object(n.useRouter)().push,t=new o.a,i=t.get("refresh"),r=t.get("access");return e(i&&r?"/usuarios":"/login"),null}},"9ONQ":function(e,t,i){"use strict";var n=i("iVi/");function o(e,t){void 0===t&&(t={});var i=function(e){if(e&&"j"===e[0]&&":"===e[1])return e.substr(2);return e}(e);if(function(e,t){return"undefined"===typeof t&&(t=!e||"{"!==e[0]&&"["!==e[0]&&'"'!==e[0]),!t}(i,t.doNotParse))try{return JSON.parse(i)}catch(n){}return e}var r=function(){return(r=Object.assign||function(e){for(var t,i=1,n=arguments.length;i<n;i++)for(var o in t=arguments[i])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)},s=function(){function e(e,t){var i=this;this.changeListeners=[],this.HAS_DOCUMENT_COOKIE=!1,this.cookies=function(e,t){return"string"===typeof e?n.parse(e,t):"object"===typeof e&&null!==e?e:{}}(e,t),new Promise((function(){i.HAS_DOCUMENT_COOKIE="object"===typeof document&&"string"===typeof document.cookie})).catch((function(){}))}return e.prototype._updateBrowserValues=function(e){this.HAS_DOCUMENT_COOKIE&&(this.cookies=n.parse(document.cookie,e))},e.prototype._emitChange=function(e){for(var t=0;t<this.changeListeners.length;++t)this.changeListeners[t](e)},e.prototype.get=function(e,t,i){return void 0===t&&(t={}),this._updateBrowserValues(i),o(this.cookies[e],t)},e.prototype.getAll=function(e,t){void 0===e&&(e={}),this._updateBrowserValues(t);var i={};for(var n in this.cookies)i[n]=o(this.cookies[n],e);return i},e.prototype.set=function(e,t,i){var o;"object"===typeof t&&(t=JSON.stringify(t)),this.cookies=r(r({},this.cookies),((o={})[e]=t,o)),this.HAS_DOCUMENT_COOKIE&&(document.cookie=n.serialize(e,t,i)),this._emitChange({name:e,value:t,options:i})},e.prototype.remove=function(e,t){var i=t=r(r({},t),{expires:new Date(1970,1,1,0,0,1),maxAge:0});this.cookies=r({},this.cookies),delete this.cookies[e],this.HAS_DOCUMENT_COOKIE&&(document.cookie=n.serialize(e,"",i)),this._emitChange({name:e,value:void 0,options:t})},e.prototype.addChangeListener=function(e){this.changeListeners.push(e)},e.prototype.removeChangeListener=function(e){var t=this.changeListeners.indexOf(e);t>=0&&this.changeListeners.splice(t,1)},e}();t.a=s},"iVi/":function(e,t,i){"use strict";t.parse=function(e,t){if("string"!==typeof e)throw new TypeError("argument str must be a string");for(var i={},o=t||{},s=e.split(r),c=o.decode||n,u=0;u<s.length;u++){var p=s[u],f=p.indexOf("=");if(!(f<0)){var h=p.substr(0,f).trim(),d=p.substr(++f,p.length).trim();'"'==d[0]&&(d=d.slice(1,-1)),void 0==i[h]&&(i[h]=a(d,c))}}return i},t.serialize=function(e,t,i){var n=i||{},r=n.encode||o;if("function"!==typeof r)throw new TypeError("option encode is invalid");if(!s.test(e))throw new TypeError("argument name is invalid");var a=r(t);if(a&&!s.test(a))throw new TypeError("argument val is invalid");var c=e+"="+a;if(null!=n.maxAge){var u=n.maxAge-0;if(isNaN(u)||!isFinite(u))throw new TypeError("option maxAge is invalid");c+="; Max-Age="+Math.floor(u)}if(n.domain){if(!s.test(n.domain))throw new TypeError("option domain is invalid");c+="; Domain="+n.domain}if(n.path){if(!s.test(n.path))throw new TypeError("option path is invalid");c+="; Path="+n.path}if(n.expires){if("function"!==typeof n.expires.toUTCString)throw new TypeError("option expires is invalid");c+="; Expires="+n.expires.toUTCString()}n.httpOnly&&(c+="; HttpOnly");n.secure&&(c+="; Secure");if(n.sameSite){switch("string"===typeof n.sameSite?n.sameSite.toLowerCase():n.sameSite){case!0:c+="; SameSite=Strict";break;case"lax":c+="; SameSite=Lax";break;case"strict":c+="; SameSite=Strict";break;case"none":c+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}}return c};var n=decodeURIComponent,o=encodeURIComponent,r=/; */,s=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;function a(e,t){try{return t(e)}catch(i){return e}}}},[["/EDR",0,2,1]]]);