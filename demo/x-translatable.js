import { translatable } from '../cosmoz-i18next.js';
import {
	html, PolymerElement
} from '@polymer/polymer/polymer-element';

class XTranslatable extends translatable(PolymerElement) {
	static get properties() {
		return {
			nullContext: {
				type: String,
				value: null
			},
			undefinedContext: {
				type: String,
				value: undefined
			}
		};
	}
	// eslint-disable-next-line max-lines-per-function
	static get template() {
		return html`
            <h3>Simple tests</h3>
            <div>{{ _("Hello $0$", 'Patrik', t) }}</div>
            <div>{{_('key', t)}}</div>

            <h3>ngettext with all translations</h3>
                <div>{{ngettext('I have $0$ invoice', 'I have $0$ invoices', 1, t)}}</div>
            <div>{{ngettext('I have $0$ invoice', 'I have $0$ invoices', 2, t)}}</div>


            <h3>ngettext with missing translations</h3>

                <div>ngettext(missing singular key, missing plural key, 1):
                    <span>{{ngettext('Missing singular key $0$','Missing plural key $0$', 1, t)}}</span>
            </div>
                <div>ngettext(missing singular key, missing plural key, 2):
                    <span>{{ngettext('Missing singular key $0$','Missing plural key $0$', 2, t)}}</span>
            </div>

                <div>ngettext(existing singular key, missing plural key, 1):
                    <span>{{ngettext('existing singular key $0$','missing plural key default value $0$', 1, t)}}</span>
            </div>

                <div>ngettext(existing singular key, missing plural key, 2):
                    <span>{{ngettext('existing singular key $0$','missing plural key default value $0$', 2, t)}}</span>
            </div>

            <h3>pgetttext with all translations available</h3>
            <div>pgettext(undefinedContext, 'Cancel invoice', t)}} =&gt;
                <span>{{pgettext(undefinedContext, 'Cancel invoice', t)}}</span>
            </div>

            <div>pgettext(nullContext, 'Cancel invoice', t)}} =&gt;
                <span>{{pgettext(nullContext, 'Cancel invoice', t)}}</span>
            </div>

            <div>pgettext('supplier', 'Cancel invoice', t)}} =&gt;
                <span>{{pgettext('supplier', 'Cancel invoice', t)}}</span>
            </div>


            <h3>pgettex with missing context translations</h3>
            <div>pgettext(undefinedContext, 'Approve invoice', t)}} =&gt;
                <span>{{pgettext(undefinedContext, 'Approve invoice', t)}}</span>
            </div>

            <div>pgettext(nullContext, 'Approve invoice', t)}} =&gt;
                <span>{{pgettext(nullContext, 'Approve invoice', t)}}</span>
            </div>

            <div>pgettext('supplier', 'Approve invoice', t)}} =&gt;
                <span>{{pgettext('supplier', 'Approve invoice', t)}}</span>
            </div>

            <h3>npgettext with all translations available</h3>

            <div>npgettext(nullContext, 'Cancel $0$ invoice','Cancel $0$ invoices', 1, t)}} =&gt;
                <span>{{npgettext(nullContext, 'Cancel $0$ invoice', 'Cancel $0$ invoices', 1, t)}}</span>
            </div>

            <div>npgettext(nullContext, 'Cancel $0$ invoice','Cancel $0$ invoices', 2, t)}} =&gt;
                <span>{{npgettext(nullContext, 'Cancel $0$ invoice', 'Cancel $0$ invoices', 2, t)}}</span>
            </div>

            <div>npgettext('supplier', 'Cancel $0$ invoice','Cancel $0$invoices', 1, t)}} =&gt;
                <span>{{npgettext('supplier', 'Cancel $0$ invoice', 'Cancel $0$ invoices', 1, t)}}</span>
            </div>

            <div>npgettext('supplier', 'Cancel $0$ invoice','Cancel $0$invoices', 2, t)}} =&gt;
                <span>{{npgettext('supplier', 'Cancel $0$ invoice', 'Cancel $0$ invoices', 2, t)}}</span>
            </div>

            <h3>npgettext with missing plural/context translations</h3>

            <div>npgettext(nullContext, 'Reject $0$ invoice','Reject $0$ invoices', 1, t)}} =&gt;
                <span>{{npgettext(nullContext, 'Reject $0$ invoice', 'Reject $0$ invoices', 1, t)}}</span>
            </div>

            <div>npgettext(nullContext, 'Reject $0$ invoice','Reject $0$ invoices', 2, t)}} =&gt;
                <span>{{npgettext(nullContext, 'Reject $0$ invoice', 'Reject $0$ invoices', 2, t)}}</span>
            </div>

            <div>npgettext('supplier', 'Reject $0$ invoice','Reject $0$ invoices', 1, t)}} =&gt;
                <span>{{npgettext('supplier', 'Reject $0$ invoice', 'Reject $0$ invoices', 1, t)}}</span>
            </div>

            <div>npgettext('supplier', 'Reject $0$ invoice','Reject $0$ invoices', 2, t)}} =&gt;
                <span>{{npgettext('supplier', 'Reject $0$ invoice', 'Reject $0$ invoices', 2, t)}}</span>
            </div>
        `;
	}
}
customElements.define('x-translatable', XTranslatable);
