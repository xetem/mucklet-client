import { Elem, Txt } from 'modapp-base-component';
import { ModelComponent } from 'modapp-resource-component';
import { ModelWrapper } from 'modapp-resource';
import l10n from 'modapp-l10n';
import FAIcon from 'components/FAIcon';
import counterString from 'utils/counterString';
import PageMailComponent from './PageMailComponent';
import './pageMail.scss';

/**
 * PageMail adds the mail for player panel page
 */
class PageMail {
	constructor(app, params) {
		this.app = app;

		// Bind callbacks
		this._onUnreadChange = this._onUnreadChange.bind(this);

		this.app.require([
			'playerTabs',
			'player',
			'confirm',
			'auth',
			'api',
			'avatar',
			'notify',
		], this._init.bind(this));
	}

	_init(module) {
		this.module = Object.assign({ self: this }, module);
		this.unread = new ModelWrapper(null, { eventBus: this.app.eventBus });
		this.state = { mailId: null, offset: 0 };

		// Add mail player tab
		this.module.playerTabs.addTab({
			id: 'mail',
			sortOrder: 30,
			tabFactory: click => new Elem(n => n.elem('button', { className: 'iconbtn medium light pagemail--tool-btn', events: {
				click: (c, e) => {
					click();
					e.stopPropagation();
				},
			}}, [
				n.component(new FAIcon('email')),
				n.component(new ModelComponent(
					this.unread,
					new Elem(n => n.elem('div', { className: 'counter alert' }, [
						n.component('txt', new Txt("")),
					])),
					(m, c) => {
						let l = Object.keys(m.props).length;
						c.getNode('txt').setText(counterString(l));
						c[l ? 'removeClass' : 'addClass']('hide');
					},
				)),
			])),
			factory: (state, close, layoutId) => ({
				component: new PageMailComponent(this.module, this.state, close),
				title: l10n.l('pageMail.mailInbox', "Mail Inbox"),
			}),
		});

		this.module.auth.getUserPromise().then(user => {
			if (!this.unread) return;

			this.module.api.get('mail.player.' + user.id + '.unread')
				.then(unread => {
					if (this.unread) {
						this.unread.setModel(unread);

						this._listen(true);
					}
				});
		});
	}

	/**
	 * Opens an in-panel char select page in the player panel.
	 * @param {bool} reset Flag if the tab should be reset to show the default page. Defaults to false.
	 * @returns {function} Close function.
	 */
	open(reset) {
		return this.module.playerTabs.openTab('mail', reset);
	}

	_listen(on) {
		let m = this.unread.getModel();
		if (m) {
			m[on ? 'on' : 'off']('change', this._onUnreadChange);
		}
	}

	_onUnreadChange(change, unread) {
		let p = this.module.player.getPlayer();
		if (!p || !p.notifyOnRequests) return;

		for (let k in change) {
			if (!change[k]) {
				let ref = unread.props[k];
				if (ref) {
					ref.get().then(mail => this._notifyMail(mail));
				}
			}
		}
	}

	_notifyMail(mail) {
		let c = mail.from;
		this.module.notify.send(
			l10n.l('pageMail.mailFrom', "Mail from {name}.", { name: (c.name + ' ' + c.surname).trim() }),
			{
				onClick: (ev) => {
					this.open();
					window.focus();
					ev.target.close();
				},
			},
		);
	}

	dispose() {
		this.module.playerTabs.removeTab('mail');
		this.unread.dispose();
		this.unread = null;
	}
}

export default PageMail;
