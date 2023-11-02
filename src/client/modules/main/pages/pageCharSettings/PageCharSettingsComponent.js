import { Context, Elem, Txt } from 'modapp-base-component';
import { ModelTxt, ModelComponent, CollectionComponent, CollectionList } from 'modapp-resource-component';
import { ModifyModel, CollectionWrapper } from 'modapp-resource';
import l10n from 'modapp-l10n';
import Collapser from 'components/Collapser';
import FAIcon from 'components/FAIcon';

class PageCharSettingsComponent {
	constructor(module, char, charSettings, state, close) {
		state.changes = state.changes || {};

		this.module = module;
		this.char = char;
		this.charSettings = charSettings;
		this.state = state;
		this.close = close;
	}

	render(el) {
		this.model = new ModifyModel(this.ctrl, {
			props: this.state.changes,
			eventBus: this.module.self.app.eventBus,
		});
		this.elem = new CollectionComponent(
			this.module.player.getChars(),
			new Elem(n => n.elem('div', { className: 'pagecharsettings' }, [
				n.elem('div', { className: 'common--sectionpadding' }, [
					n.component(new ModelTxt(this.char, m => (m.name + " " + m.surname).trim(), { tagName: 'div', className: 'pagecharsettings--name' })),
					n.component(new Context(
						() => new CollectionWrapper(this.module.self.getTools(), {
							filter: t => t.type == 'topSection',
						}),
						tools => tools.dispose(),
						tools => new CollectionList(
							tools,
							t => t.componentFactory(this.char, this.charSettings, this.state),
							{
								subClassName: t => t.className || null,
							},
						),
					)),
				]),
				n.component(new Context(
					() => new CollectionWrapper(this.module.self.getTools(), {
						filter: t => t.type == 'sections',
					}),
					tools => tools.dispose(),
					tools => new CollectionList(
						tools,
						t => t.componentFactory(this.char, this.charSettings, this.state),
						{
							subClassName: t => t.className || null,
						},
					),
				)),
				n.component('message', new Collapser(null)),
				n.elem('div', { className: 'pad-top-xl flex-row margin8 flex-end' }, [
					n.elem('div', { className: 'flex-1' }, [
						n.component(new ModelComponent(
							this.model,
							new Elem(n => n.elem('update', 'button', { events: {
								click: () => this._save(this.model),
							}, className: 'btn primary flex-1' }, [
								n.component('text', new Txt()),
							])),
							(m, c) => c.getNode('text').setText(m.isModified
								? l10n.l('pageCharSettings.update', "Save edits")
								: l10n.l('pageCharSettings.close', "Close"),
							),
						)),
					]),
					n.elem('button', { events: {
						click: () => this.module.dialogDeleteChar.open(this.char),
					}, className: 'iconbtn medium light' }, [
						n.component(new FAIcon('delete')),
					]),
				]),
			])),
			(col, c) => {
				// Close if we no longer own the char
				for (var char of col) {
					if (char.id === this.char.id) return;
				}
				setTimeout(() => this.close(), 0);
			},
		);
		this.elem.render(el);
	}

	unrender() {
		if (this.elem) {
			this.elem.unrender();
			this.elem = null;
		}
		if (this.model) {
			this.state.changes = this.model.getModifications() || {};
			this.model.dispose();
			this.model = null;
		}
	}

	_save(model) {
		let change = model.getModifications();
		let p = change && Object.keys(change)
			? Promise.reject("Not implemented")
			: Promise.resolve();

		return p.then(() => {
			this._close();
		}).catch(err => {
			this._setMessage(l10n.l(err.code, err.message, err.data));
		});
	}

	_setMessage(msg) {
		if (!this.elem) return;
		this.elem.getNode('message').setComponent(msg
			? new Txt(msg, { className: 'dialog--error' })
			: null,
		);
	}

	_close() {
		this.close();
		if (this.model) {
			this.model.dispose();
			this.model = null;
		}
		this.state.changes = {};
	}
}

export default PageCharSettingsComponent;
