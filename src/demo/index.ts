import { uspacySdk } from '../index';

(async () => {
	try {
		await uspacySdk.authService.login({ email: process.env.LOGIN_EMAIL, password: process.env.LOGIN_PASSWORD, remember: true });
		await uspacySdk.tasksService.getFiltersPresets();
		const a = await uspacySdk.tasksService.getTasksSettings();
		// eslint-disable-next-line no-console
		console.log(a.data.table_settings.tasks.column_ordering);
		// uspacySdk.tasksService.getFiltersPreset(d.data.docs[0]._id);
		// uspacySdk.tasksService.updateFilterPreset(d.data.docs[0]._id, d.data.docs[0]._rev, { aa: 'bb111' });
		// uspacySdk.tasksService.createFilterPreset({ aa: 'bb' });
		// uspacySdk.tasksService.deleteFilterPreset(d.data.docs[0]._id, d.data.docs[0]._rev);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log(err);
	}
})();
