import { uspacySdk } from '../index';

(async () => {
	try {
		await uspacySdk.authService.login({ email: process.env.LOGIN_EMAIL, password: process.env.LOGIN_PASSWORD, remember: true });
		uspacySdk.usersService.getUsers(1, 20);
		uspacySdk.departmentsService.getDepartments(1, 20);
		uspacySdk.usersService.getUserById(1);
		uspacySdk.profileService.getProfile();
		uspacySdk.notificationsService.getNotifications();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log(err);
	}
})();
