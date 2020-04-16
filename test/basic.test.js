import i18n from 'i18next';
import {
	assert, fixture, html, aTimeout
} from '@open-wc/testing';

import {
	_, gettext, ngettext, pgettext, npgettext, loadTranslations
} from '../cosmoz-i18next.js';

import '../cosmoz-t.js';


suite('cosmoz-i18next', () => {
	let element;

	setup(async () => {
		element = await fixture(html`<cosmoz-i18next></cosmoz-i18next>`);
	});

	test('sets defaults', () => {
		assert.equal(element.domain, 'messages');
		assert.equal(element.interpolationPrefix, '__');
		assert.equal(element.interpolationSuffix, '__');
		assert.equal(element.language, 'en');
		assert.equal(element.namespace, 'translation');
		assert.equal(element.keySeparator, '.');
		assert.equal(element.nsSeparator, ':');
	});

	test('set translations', async () => {
		assert.equal(_('Hello __0__', 'John Doe'), 'Hello John Doe');
		element.translations = {
			'Hello __0__': 'Hej __0__'
		};
		await aTimeout();
		assert.equal(_('Hello __0__', 'John Doe'), 'Hej John Doe');
		element.translations = null; // doesn't throw away translations
		assert.equal(_('Hello __0__', 'John Doe'), 'Hej John Doe');
	});
});

suite('core', () => {

	const lng = 'sv',
		namespace = 'translation';

	suiteSetup(async () => {
		const translations = await fetch('/base/test/translations.json').then(r => r.json());
		await i18n.init({
			interpolation: {
				prefix: '{',
				suffix: '}'
			},
			lng
		});
		loadTranslations(lng, namespace, translations);
	});

	test('init', () => {
		assert.isTrue(i18n.isInitialized);
	});

	test('_', () => {
		assert.equal(_('Hello {0}', 'John Doe'), 'Hej John Doe');
		assert.equal(_('Hello {0}', 'John Doe'), 'Hej John Doe');
		assert.equal(_('Hello {0}', 'John Doe'), gettext('Hello {0}', 'John Doe'));
		assert.equal(
			_('Hello {0}', '<a href="mailto:john@doe.com">John Doe</a>', { interpolation: { escapeValue: false }}),
			'Hej <a href="mailto:john@doe.com">John Doe</a>'
		);
	});

	test('ngettext / plural', () => {
		assert.equal(ngettext('{0} invoice', '{0} invoices', 1), '1 faktura');
		assert.equal(ngettext('{0} invoice', '{0} invoices', 2), '2 fakturor');
		assert.equal(ngettext('{0} invoice_missingkey', '{0} invoices', 1), '1 invoice_missingkey');
		assert.equal(ngettext('{0} invoice_missingkey', '{0} invoices', 2), '2 invoices');
	});

	test('pgettext / context', () => {
		assert.equal(_('Cancel'), 'Avbryt');
		assert.equal(pgettext('', 'Cancel'), 'Avbryt');
		assert.equal(pgettext('invoice', 'Cancel'), 'Makulera');
	});

	test('npgettext / plural context', () => {
		assert.equal(npgettext('', 'Cancel {0} invoice', 'Cancel {0} invoices', 0), 'Makulera 0 fakturor');
		assert.equal(npgettext('', 'Cancel {0} invoice', 'Cancel {0} invoices', 1), 'Makulera en faktura');
		assert.equal(npgettext('', 'Cancel {0} invoice', 'Cancel {0} invoices', 2), 'Makulera 2 fakturor');
		assert.equal(npgettext('supplier', 'Cancel {0} invoice', 'Cancel {0} invoices', 0), 'Makulera 0 leverantörsfakturor');
		assert.equal(npgettext('supplier', 'Cancel {0} invoice', 'Cancel {0} invoices', 1), 'Makulera en leverantörsfaktura');
		assert.equal(npgettext('supplier', 'Cancel {0} invoice', 'Cancel {0} invoices', 2), 'Makulera 2 leverantörsfakturor');
	});

	test('update translations', () => {
		loadTranslations(lng, namespace, {
			'Cancel {0} invoice': 'Cancelar {0} factura'
		});
		assert.equal(_('Cancel {0} invoice', 1), 'Cancelar 1 factura');
		assert.equal(npgettext('supplier', 'Cancel {0} invoice', 'Cancel {0} invoices', 2), 'Cancel 2 invoices');
	});
});

suite('cosmoz-t', () => {
	let element;

	setup(async () => {
		element = await fixture(html`<cosmoz-t></cosmoz-t>`);
	});

	test('basic', () => {
		assert.equal(element._('Cancel'), _('Cancel'));
		assert.equal(element.gettext('Cancel'), gettext('Cancel'));
		assert.equal(element.ngettext('{0} invoice', '{0} invoices', 1), ngettext('{0} invoice', '{0} invoices', 1));
		assert.equal(element.pgettext('invoice', 'Cancel'), pgettext('invoice', 'Cancel'));
		assert.equal(
			element.npgettext('supplier', 'Cancel {0} invoice', 'Cancel {0} invoices', 2),
			npgettext('supplier', 'Cancel {0} invoice', 'Cancel {0} invoices', 2)
		);
	});
});
