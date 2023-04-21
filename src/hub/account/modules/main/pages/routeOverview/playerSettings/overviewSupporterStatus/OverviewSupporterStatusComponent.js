import { Elem } from 'modapp-base-component';
import { ModelComponent } from 'modapp-resource-component';
import PanelSection from 'components/PanelSection';
import Collapser from 'components/Collapser';
import l10n from 'modapp-l10n';
import OverviewSupporterStatusNotSupporter from './OverviewSupporterStatusNotSupporter';
import OverviewSupporterStatusSupporter from './OverviewSupporterStatusSupporter';

const txtSupporterStatusInfo = l10n.l(
	'overviewSupporterStatus.supporterStatusInfo',
	`Mucklet supporters not only helps with the development and operations of the game, but also get perks, such as:
• Access to the supporter tag
• Raised character cap
• Raised profiles cap
• Access to create bots`);

class OverviewSupporterStatusComponent {
	constructor(module, user, paymentUser, state) {
		this.module = module;
		this.user = user;
		this.paymentUser = paymentUser;
		this.state = state;
	}

	render(el) {
		let components = {};
		this.elem = new Elem(n => n.elem('div', { className: 'overviewsupporterstatus' }, [
			n.component(new PanelSection(
				l10n.l('overviewSupporterStatus.supporterStatus', "Supporter status"),
				new ModelComponent(
					this.paymentUser,
					new Collapser(),
					(m, c) => c.setComponent(m.supporterUntil
						? components.supporter = components.supporter || new OverviewSupporterStatusSupporter(this.module, this.user, this.paymentUser, this.state)
						: components.notSupporter = components.notSupporter || new OverviewSupporterStatusNotSupporter(this.module, this.user, this.paymentUser, this.state),
					),
				),
				{
					className: 'common--sectionpadding',
					popupTip: txtSupporterStatusInfo,
					noToggle: true,
				},
			)),
		]));
		this.elem.render(el);
	}

	unrender() {
		if (this.elem) {
			this.elem.unrender();
			this.elem = null;
		}
	}
}

export default OverviewSupporterStatusComponent;
