/*global Cosmoz, i18n, Polymer */

if (typeof Cosmoz === 'undefined') {
	var Cosmoz = {};
}

(function () {

	"use strict";

	Cosmoz.TranslatableBehavior = {
		_argumentsToObject: function (args, skipnum) {
			var argsArray = Array.prototype.slice.call(args, skipnum);
			return this._arrayToObject(argsArray);
		},
		_arrayToObject: function (array) {
			var object = {};
			array.forEach(function (item, index) {
				if (object.count === undefined && typeof item === "number") {
					object.count = item;
				}
				object[index] = item;
			});
			return object;
		},
		_: function (key) {
			var args = this._argumentsToObject(arguments, 1);
			// Don't make i18next fetch more translations
			delete args.count;
			return this.gettext(key, args);
		},
		gettext: function (key, args) {
			console.log(args);
			return i18n.t(key, args);
		},
		ngettext: function (singular, plural) {
			var args = this._argumentsToObject(arguments, 2);
			return i18n.t(singular, args);
		},
		pgettext: function (context, key) {
			var args = this._argumentsToObject(arguments, 2);
			args.context = context;
			delete args.count;
			return i18n.t(key, args);
		},
		npgettext: function (context, singular, plural) {
			var args = this._argumentsToObject(arguments, 3);
			args.context = context;
			return i18n.t(singular, args);
		}
	};
}());