import { Elem, Txt } from 'modapp-base-component';
import ModelCollapser from 'components/ModelCollapser';
import FAIcon from 'components/FAIcon';
import PanelSection from 'components/PanelSection';
import l10n from 'modapp-l10n';

class OverviewAccountSecurityComponent extends ModelCollapser {
	constructor(module, user, state) {
		super(user, [
			{
				factory: m => new PanelSection(
					l10n.l('overviewAccountSecurity.security', "Security"),
					new Elem(n => n.elem('button', { events: {
						click: () => module.dialogChangePassword.open(m.id),
					}, className: 'btn medium light icon-left' }, [
						n.component(new FAIcon('key-variant')),
						n.component(new Txt(l10n.l('overviewAccountSecurity.changePassword', "Change password"))),
					])),
					{
						className: 'common--sectionpadding',
						noToggle: true,
					},
				),
				condition: m => m.hasLogin,
			},
		]);
	}
}

export default OverviewAccountSecurityComponent;
