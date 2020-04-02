import i18n from 'i18next';
import {
	assert, fixture, html
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
});

suite('core', () => {

	suiteSetup(async () => {
		const lng = 'sv',
			translations = await fetch('/base/test/translations.json').then(r => r.json());
		await i18n.init({
			interpolation: {
				prefix: '{',
				suffix: '}'
			},
			lng
		});
		loadTranslations(lng, 'translation', translations);
	});

	test('init', () => {
		assert.isTrue(i18n.isInitialized);
	});

	test('_', () => {
		assert.equal(_('Hello {0}', 'John Doe'), 'Hej John Doe');
		assert.equal(_('Hello {0}', 'John Doe'), 'Hej John Doe');
		assert.equal(_('Hello {0}', 'John Doe'), gettext('Hello {0}', 'John Doe'));
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
