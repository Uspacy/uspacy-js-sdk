/* eslint-disable */
import { Uspacy } from '../core';
const uspacy = Uspacy.createInstance();

(async () => {
	try {
		const result = await uspacy.usersService.getUsers(1, 20);
		console.log(result.data);
	} catch (err) {
		console.log(err);
	}
})();
