import { Model } from 'modapp-resource';
import l10n from 'modapp-l10n';
import MobilePanel from 'components/MobilePanel';
import './mobileCharPanel.scss';

const defaultTitle = l10n.l('mobileCharPanel.characterInfo', "Character Info");

/**
 * MobileCharPanel draws player char menu.
 */
class MobileCharPanel {
	constructor(app, params) {
		this.app = app;

		// Bind callbacks
		this._onCharPagesChange = this._onCharPagesChange.bind(this);
		this._onModelChange = this._onModelChange.bind(this);
		this._onActivePanelModelChange = this._onActivePanelModelChange.bind(this);

		this.app.require([
			'mobileActivePanel',
			'charPages',
		], this._init.bind(this));
	}

	_init(module) {
		this.module = Object.assign({ self: this }, module);

		this.model = new Model({
			data: Object.assign({ pageInfo: null }, this.module.charPages.getModel().props),
			eventBus: this.module.self.app.eventBus,
		});
		this.activePanelModel = this.module.mobileActivePanel.getModel();
		this.component = new MobilePanel("", null, {
			closed: !this.activePanelModel.charPanelOpen,
			align: 'left',
			className: 'mobilecharpanel',
			onClose: () => this.module.mobileActivePanel.toggleCharPanel(false),
		});

		this.module.mobileActivePanel.setNode('charPanel', this.component);
		this._setListeners(true);
		this._onCharPagesChange();
		this._onModelChange();
	}

	/**
	 * Toggles the panel between open or close.
	 * @param {bool} open State to toggle to. Defaults to toggle between open and close.
	 * @returns {this}
	 */
	toggle(open) {
		this.module.mobileActivePanel.toggleCharPanel(open);
		return this;
	}

	_setListeners(on) {
		let cb = on ? 'on' : 'off';
		this.module.charPages.getModel()[cb]('change', this._onCharPagesChange);
		this.model[cb]('change', this._onModelChange);
		this.activePanelModel[cb]('change', this._onActivePanelModelChange);
	}

	_onCharPagesChange(change) {
		if (!change || change.hasOwnProperty('factory')) {
			let m = this.module.charPages.getModel();
			let factory = m.factory;
			this.model.set(Object.assign({
				pageInfo: factory
					? factory('mobile')
					: null,
			}, m.props));
		}
	}

	_onModelChange(change) {
		if (change && !change.hasOwnProperty('pageInfo')) {
			return;
		}


		let m = this.model;
		let pi = m.pageInfo;
		let page = m.page;

		if (!pi) {
			this.component.setTitle("").setButton(null).setComponent(null);
			return;
		}
		let close = pi.close || (page && page.close);

		this.component
			.setTitle(pi.title || defaultTitle)
			.setButton(close || (() => this.toggle(false)), close ? pi.closeIcon || 'chevron-left-circle' : 'close-thick')
			.setComponent(pi.component, {
				onRender: () => {
					// Restore scrolling of page
					let sb = this.component.getSimpleBar();
					if (sb) {
						sb.getScrollElement().scrollTop = page.state.scrollTop || 0;
					}
				},
				onUnrender: () => {
					// Store scrolling of page
					let sb = this.component.getSimpleBar();
					if (sb) {
						page.state.scrollTop = sb.getScrollElement().scrollTop;
					}
				},
			});
	}

	_onActivePanelModelChange() {
		this.component.toggle(this.activePanelModel.charPanelOpen);
	}

	dispose() {
		this._setListeners(false);
		this.module.mobileActivePanel.setNode('charPanel', null);
	}
}

export default MobileCharPanel;
