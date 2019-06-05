import { translatable } from './cosmoz-i18next.js';
import { PolymerElement } from '@polymer/polymer/polymer-element';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';


/**
 * @polymer
 * @customElement
 * @appliesMixin translatable
 */
class CosmozT extends translatable(PolymerElement) {
	static get is() {
		return 'cosmoz-t';
	}

	static get template() {
		return html`[[ _(input, t) ]]`;
	}

	static get properties() {
		return {
			input: {
				type: String
			},
			t: {
				type: Object
			}
		};
	}
}

customElements.define(CosmozT.is, CosmozT);
