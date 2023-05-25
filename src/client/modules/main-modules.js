import Viewport from 'modules/viewport/Viewport';
import PlayerTools from 'modules/playerTools/PlayerTools';
import Confirm from 'modules/confirm/Confirm';
import Toaster from 'modules/toaster/Toaster';
import AccountEmail from 'modules/accountEmail/AccountEmail';
import VerifyEmail from 'modules/verifyEmail/VerifyEmail';
import DialogChangeEmail from 'modules/dialogs/dialogChangeEmail/DialogChangeEmail';

const modules = {
	viewport: Viewport,
	playerTools: PlayerTools,
	confirm: Confirm,
	toaster: Toaster,
	accountEmail: AccountEmail,
	verifyEmail: VerifyEmail,
	dialogChangeEmail: DialogChangeEmail,
};

const req = require.context("./main/", true, /^\..*\/([^/]*)\/\1.js$/i);

// Using the first-character-lowercase name of the js-file as module name
req.keys().forEach(key => {
	let match = key.match(/\/([^/]*)\.js$/);
	let name = match[1].charAt(0).toLowerCase() + match[1].slice(1);
	if (modules[name]) {
		throw new Error(`duplicate module: ${key}`);
	}
	modules[name] = req(key).default;
});

export default modules;
