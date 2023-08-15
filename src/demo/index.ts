/* eslint-disable */
import { Uspacy } from '../core';
const uspacy = Uspacy.createInstance();

(async () => {
	try {
		const result = await uspacy.authService.login({ email: 'gRaFinn88+19@gmail.com', password: '12345678' });
		console.log(result);
	} catch (err) {
		console.log(err);
	}
})();
