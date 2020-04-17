import { PolymerElement } from '@polymer/polymer/polymer-element';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin';
import i18n from 'i18next';

const
	translationElements = [],
	ensureInitialized = () => {
		if (!i18n.isInitialized) {
			// default i18n init, to ensure translate function will return something
			// even when there is no <i18next> element in the page.
			i18n.init({
				lng: 'en',
				resStore: { en: {} },
				fallbackLng: false
			});
		}
	},
	/**
	 * Convert arguments to an object, skipping some argument.
	 *
	 * @param {array} args Arguments.
	 * @returns {object} Resulting object with arguments.
	 */
	argumentsToObject = args => {
		return args.reduce((object, item, index) => {
			if (object.count === undefined && typeof item === 'number') {
				object.count = item;
			}

			if (typeof item === 'object') {
				return {
					...object,
					...item
				};
			}

			object[index] = item;
			return object;
		}, {});
	},
	gettext = function (key) {
		ensureInitialized();
		const args = argumentsToObject([...arguments].slice(1));
		// Don't make i18next fetch more translations
		delete args.count;
		return i18n.t(key, args);
	},
	ngettext = function (singular, plural) {
		ensureInitialized();
		const args = argumentsToObject([...arguments].slice(2)),
			n = args.count;
		let key;

		delete args.count;

		const pluralSuffix = i18n.services.pluralResolver.getSuffix(i18n.language, n);
		if (pluralSuffix) {
			args.defaultValue = plural;
			key = singular + pluralSuffix;
		} else {
			key = singular;
			args.defaultValue = singular;
		}
		return i18n.t(key, args);
	},
	pgettext = function (context, key) {
		ensureInitialized();
		const args = argumentsToObject([...arguments].slice(2));
		args.context = context;
		// Don't make i18next fetch more translations
		delete args.count;
		return i18n.t(key, args);
	},
	npgettext = function (context, singular, plural) {
		ensureInitialized();

		const
			args = argumentsToObject([...arguments].slice(3)),
			n = args.count,
			contextKeyPart = context ? '_' + context : '';
		let key = singular;

		delete args.count;

		const pluralSuffix = i18n.services.pluralResolver.getSuffix(i18n.language, n);
		if (pluralSuffix) {
			args.defaultValue = plural;
			key = singular + contextKeyPart + pluralSuffix;
		} else {
			key = singular;
			args.context = context;
		}

		return i18n.t(key, args);
	},
	loadTranslations = (lang, namespace, translations) => {
		i18n.init({ resources: {} });
		i18n.addResourceBundle(lang, namespace, translations);
	},
	translatable = dedupingMixin(baseClass => class extends baseClass {
		/**
		 * Get mixin properties.
		 * @returns {object} Mixin properties.
		 */
		static get properties() {
			return {
				t: {
					type: Object,
					value() {
						return {};
					}
				}
			};
		}
		_filterT(args) {
			return args.filter(item => item !== this.t);
		}

		/**
		 * Convenience method for gettext. Translates a text.
		 *
		 * @param {string} key Translation key.
		 * @returns {string} Translated text.
		 */
		_() {
			return gettext.apply(null, this._filterT([...arguments]));
		}

		/**
		 * Runs when connected.
		 * @returns {void}
		 */
		connectedCallback() {
			super.connectedCallback();
			translationElements.push(this);
		}

		/**
		 * Runs when disconnected.
		 * @returns {void}
		 */
		disconnectedCallback() {
			super.disconnectedCallback();
			const i = translationElements.indexOf(this);
			if (i >= 0) {
				translationElements.splice(i, 1);
			}
		}

		/**
		 * Translates a text.
		 *
		 * Example of basic translation:
		 * `_(string, t)`
		 *	 <div>{{ _(‘My translation’, t) }}</div>
		 *
		 * Example of basic translation with interpolation:
		 * `_(string, [args], t)`
		 *	 <div>{{ _(‘Hello {0}’, user.name, t) }}</div>
		 *
		 * @param {string} key Text to translate.
		 * @param {object} t Behavior t object.
		 * @return {string} Translated text.
		 */
		gettext() {
			return gettext.apply(null, this._filterT([...arguments]));
		}

		/**
		 * Plural version of gettext. Translates a text to the current locale
		 * using the first numeric argument after the two first arguments to
		 * determine if output should be singular or plural.
		 *
		 * Example of translation in singular or plural:
		 * `ngettext(singular, plural, count, t)`
		 * <div>{{ ngettext(‘My translation’,
		 *	 ‘My translations’, count, t) }}</div>
		 *
		 * Example of translation in singular or plural with interpolation:
		 * `ngettext(singular, plural, [count and other args], t)`
		 * <div>{{ ngettext(‘My translation for “{1}”’,
		 *	 ‘My {0} translations for “{1}”’, count, ‘hello’, t) }}</div>
		 *
		 * @param {string} singular Singular text variant.
		 * @param {string} plural Plural text variant.
		 * @return {string} Translated text.
		 */
		ngettext() {
			return ngettext.apply(null, this._filterT([...arguments]));
		}

		/**
		 * Translates a text using a specific context.
		 *
		 * Example of translation with context:
		 * `pgettext(context, ‘text’, t)`
		 *	 <div>{{ pgettext(‘Cancel Invoice’, ‘Cancel’, t) }}</div>
		 *
		 * Example of translation including context with interpolation:
		 * `pgettext(context, ‘text’, [args], t)`
		 * <div>{{ pgettext(‘Cancel Invoice’, ‘Cancel {0}’,
		 *	 document.type, t) }}</div>
		 *
		 * @param {string} context Context text.
		 * @param {string} key Text to translate.
		 * @return {string} Translated text.
		 */
		pgettext() {
			return pgettext.apply(null, this._filterT([...arguments]));
		}

		/**
		 * Translates a text in singular or plural with a specific context.
		 *
		 * Example of translation in singular or plural with context:
		 * `npgettext(context, singular, plural, count, t)`
		 * <div>{{ npgettext('Cancel invoice', ‘My cancellation’,
		 *	 ‘My {0} cancellations’, count, t) }}</div>
		 *
		 * Example of translation in singular or plural with context and
		 * interpolation:
		 * `npgettext(context, singular, plural, count, t)`
		 * <div>{{ npgettext('Cancel invoice', ‘My {1} cancellation’,
		 *	 ‘My {0} {1} cancellations’, count, document.type, t) }}</div>
		 *
		 * @param {string} context Context text.
		 * @param {string} singular Singular text variant.
		 * @param {string} plural Plural text variant.
		 * @return {string} Translated text.
		 */
		npgettext() {
			return npgettext.apply(null, this._filterT([...arguments]));
		}
	});

/**
 * `<cosmoz-i18next>` is a translation component based on i18next
 *
 * ### Usage
 *
 * Use the component as a singleton to interface the i18next library.
 *
 * `<cosmoz-i18next translations="{{ translations }}"></cosmoz-i18next>`
 *
 * @polymer
 * @customElement
 * @demo demo/index.html
 */
class CosmozI18Next extends PolymerElement {
	static get properties() { // eslint-disable-line max-lines-per-function
		return {
			domain: {
				type: String,
				value: 'messages'
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
				value: 'en'
			},
			namespace: {
				type: String,
				value: 'translation'
			},
			translations: {
				type: Object,
				observer(newTranslations) {
					if (newTranslations == null) {
						return;
					}
					loadTranslations(this.language, this.namespace, newTranslations);
					translationElements.forEach(element => element.set('t', {}));
				}
			},
			keySeparator: {
				type: String,
				value: '.'
			},
			nsSeparator: {
				type: String,
				value: ':'
			}
		};
	}
	ready() {
		super.ready();
		i18n.init({
			interpolation: {
				escapeValue: false,
				prefix: this.interpolationPrefix,
				suffix: this.interpolationSuffix
			},
			keyseparator: this.keySeparator,
			lng: this.language,
			nsseparator: this.nsSeparator,
			resStore: {}
		});
	}
}

customElements.define('cosmoz-i18next', CosmozI18Next);

export {
	gettext,
	gettext as _,
	ngettext,
	pgettext,
	npgettext,
	loadTranslations,
	translatable
};
