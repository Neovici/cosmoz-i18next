import { PolymerElement } from '@polymer/polymer/polymer-element';
import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin';
import 'i18next-client';

const translationElements = [];

/**
 *
 * @polymer
 * @mixinFunction
 * @param	 {class} baseClass the base class
 * @return {class}					 the mixed in class
 */
export const translatable = dedupingMixin(baseClass => class extends baseClass {
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
	/**
	 * Convert arguments to an object, skipping some argument.
	 *
	 * @param {array} args Arguments.
	 * @param {number} skipnum Argument number to skip.
	 * @returns {object} Resulting object with arguments.
	 */
	_argumentsToObject(args, skipnum) {
		const argsArray = Array.prototype.slice.call(args, skipnum);
		return this._arrayToObject(argsArray);
	}
	/**
	 * Convert an array to an object.
	 *
	 * @param {array} array Array to convert.
	 * @returns {object} Resulting object.
	 */
	_arrayToObject(array) {
		const ctx = this,
			object = {};

		array.forEach((item, index) => {
			if (object.count === undefined && typeof item === 'number') {
				object.count = item;
			}
			// Don't send the 't' kicker to i18n for arguments
			if (item !== ctx.t) {
				object[index] = item;
			}
		});
		return object;
	}
	/**
	 * Ensure mixin is initialized.
	 *
	 * @returns {void}
	 */
	_ensureInitialized() {
		if (!i18n.isInitialized()) {
			// default i18n init, to ensure translate function will return something
			// even when there is no <i18next> element in the page.
			i18n.init({lng: 'en', resStore: { en: {}}, fallbackLng: false});
		}
	}
	/**
	 * Convenience method for gettext. Translates a text.
	 *
	 * @param {string} key Translation key.
	 * @returns {string} Translated text.
	 */
	_(key) {
		return this.gettextgeneric(key, arguments);
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
	gettext(key) {
		return this.gettextgeneric(key, arguments);
	}
	/**
	 * Generic handler for text translation
	 *
	 * @param {string} key Text to translate.
	 * @param {array} callerArgs Arguments from the calling function.
	 * @return {string} Translated text.
	 */
	gettextgeneric(key, callerArgs) {
		this._ensureInitialized();
		const args = this._argumentsToObject(callerArgs, 1);
		// Don't make i18next fetch more translations
		delete args.count;
		return i18n.t(key, args);
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
	ngettext(singular, plural) {
		this._ensureInitialized();

		const
			args = this._argumentsToObject(arguments, 2),
			n = args.count;
		let key;

		delete args.count;

		if (i18n.pluralExtensions.needsPlural(i18n.lng(), n)) {
			args.defaultValue = plural;
			key = i18n.options.ns.defaultNs + i18n.options.nsseparator + singular + i18n.options.pluralSuffix;
		} else {
			key = singular;
			args.defaultValue = singular;
		}
		return i18n.t(key, args);
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
	pgettext(context, key) {
		this._ensureInitialized();

		const args = this._argumentsToObject(arguments, 2);
		args.context = context;
		// Don't make i18next fetch more translations
		delete args.count;
		return i18n.t(key, args);
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
	npgettext(context, singular, plural) {
		this._ensureInitialized();

		const
			args = this._argumentsToObject(arguments, 3),
			n = args.count,
			contextKeyPart = context
				? '_' + context
				: '';
		let key = singular;

		delete args.count;

		if (i18n.pluralExtensions.needsPlural(i18n.lng(), n)) {
			args.defaultValue = plural;
			key = i18n.options.ns.defaultNs + i18n.options.nsseparator + singular + contextKeyPart + i18n.options.pluralSuffix;
		} else {
			key = singular;
			args.context = context;
		}

		return i18n.t(key, args);
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
	static get is() {
		return 'cosmoz-i18next';
	}
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
				observer: function () { // eslint-disable-line object-shorthand
					i18n.removeResourceBundle(this.language, this.namespace);
					i18n.addResources(this.language, this.namespace, this.translations);
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
		i18n.init({
			interpolationPrefix: this.interpolationPrefix,
			interpolationSuffix: this.interpolationSuffix,
			keyseparator: this.keySeparator,
			lng: this.language,
			nsseparator: this.nsSeparator,
			resStore: {}
		});
	}
}

customElements.define(CosmozI18Next.is, CosmozI18Next);
