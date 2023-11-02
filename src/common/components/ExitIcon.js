import { RootElem } from 'modapp-base-component';
import './exitIcons.scss';

export const exitIcons = [ 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw', 'up', 'down', 'in', 'out' ];

const exitIconMap = {
	'n': 'mdi-arrow-up-thick',
	'ne': 'mdi-arrow-top-right-thick',
	'e': 'mdi-arrow-right-thick',
	'se': 'mdi-arrow-bottom-right-thick',
	's': 'mdi-arrow-down-thick',
	'sw': 'mdi-arrow-bottom-left-thick',
	'w': 'mdi-arrow-left-thick',
	'nw': 'mdi-arrow-top-left-thick',
	'up': 'mdi-stairs-up',
	'down': 'mdi-stairs-down',
	'in': 'mdi-login',
	'out': 'mdi-logout',

	'dot': 'mdi-circle-outline',
};

/**
 * ExitIcon is an exit icon.
 */
class ExitIcon extends RootElem {

	/**
	 * Creates an instance of ExitIcon
	 * @param {string} icon Exit icon (eg. 'n', 'se', 'up', etc.)
	 * @param {object} [opt] Optional parameters.
	 * @param {string} [opt.className] Additional class names to append to font-awesome class names.
	 * @param {object} [opt.attributes] Key/value attributes object
	 * @param {object} [opt.default] Default font-awesome icon to use. Eg. 'dot'. Defaults to none.
	 * @param {object} [opt.events] Key/value events object, where the key is the event name, and value is the callback.
	 */
	constructor(icon, opt) {
		opt = Object.assign({ attributes: null }, opt);
		icon = String(icon || "");
		opt.attributes = Object.assign({ 'aria-hidden': 'true' }, opt.attributes);
		super('i', opt);
		this._default = opt?.default || '';
		this.icon = null;
		this.setIcon(icon);
	}

	/**
	 * Sets icon
	 * @param {string} icon Exit icon name (eg. 'ne').
	 * @returns {this}
	 */
	setIcon(icon) {
		icon = String(icon || this._default);
		let cl = exitIconMap[icon] || '';
		if (!cl) {
			icon = '';
		}
		this.addClass('mdi');
		if (icon !== this.icon) {
			if (this.icon) {
				this.removeClass(exitIconMap[this.icon]);
				this.removeClass('exiticon--' + this.icon);
			}
			if (icon) {
				this.addClass(cl);
				this.addClass('exiticon--' + icon);
			}
			this.icon = icon;
		}
		return this;
	}
}

export default ExitIcon;
