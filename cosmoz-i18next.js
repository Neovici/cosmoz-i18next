/*global Cosmoz, i18n, Polymer */
(function () {

	"use strict";

	Polymer({
		behaviors: [
			Cosmoz.TranslatableBehavior
		],
		is: 'cosmoz-i18next',
		properties: {
			domain: {
				type: String,
				value: "messages"
			},
			interpolationPrefix: {
				type: String,
				value: '__'
			},
			interpolationSuffix: {
				type: String,
				value: '__'
			},
			language: {
				type: String,
				value: "en"
			},
			namespace: {
				type: String,
				value: 'translation'
			},
			translations: {
				type: Object,
				observer: '_setTranslations'
			}
		},
		_setTranslations: function () {
			i18n.addResources(this.language, this.namespace, this.translations);
		},
		ready: function () {
			i18n.init({
				interpolationPrefix: this.interpolationPrefix,
				interpolationSuffix: this.interpolationSuffix,
				lng: this.language,
				resStore: {}
			});
		}
	});
}());