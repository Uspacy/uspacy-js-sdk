/* eslint-disable */
import { Uspacy } from '../index';
const uspacy = Uspacy.createInstance();

(async () => {
	try {
		// await uspacy.authService.login({ email: 'gRaFinn88+19@gmail.com', password: '12345678', remember: true });
		// await uspacy.tokensService.setToken(
		// 	'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3N0YWdlMS5zdGFnaW5nLnVzcGFjeS50ZWNoL2F1dGgvdjEvYXV0aC9zaWduX2luIiwiaWF0IjoxNjkyMjEyMzQ5LCJleHAiOjE2OTIyMTU5NDksIm5iZiI6MTY5MjIxMjM0OSwianRpIjoiQm9GRjNMTFJwU2F5d0xzQyIsInN1YiI6IjEiLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3IiwiaWQiOjEsImVtYWlsIjoiZ1JhRmlubjg4KzE5QGdtYWlsLmNvbSIsImF1dGhVc2VySWQiOjEsImZpcnN0TmFtZSI6IlVzZXIiLCJsYXN0TmFtZSI6IlJvb3QiLCJ3b3Jrc3BhY2VJZCI6InN0YWdlMSIsImRvbWFpbiI6InN0YWdlMS5zdGFnaW5nLnVzcGFjeS50ZWNoIiwicm9sZXMiOlsiT1dORVIiXSwiZGVwYXJ0bWVudHMiOlsxXSwicGVybWlzc2lvbnMiOnsiY3JlYXRlIjpbImNybS5sZWFkcy5jcmVhdGUuYWxsb3dlZCIsImNybS5jb250YWN0cy5jcmVhdGUuYWxsb3dlZCIsImNybS5jb21wYW5pZXMuY3JlYXRlLmFsbG93ZWQiLCJjcm0uZGVhbHMuY3JlYXRlLmFsbG93ZWQiLCJjcm0uaW52b2ljZS5jcmVhdGUuYWxsb3dlZCIsImNybS5wcm9kdWN0LmNyZWF0ZS5hbGxvd2VkIiwiY3JtLmFjdGl2aXR5LmNyZWF0ZS5hbGxvd2VkIiwiaHJtLmhpcmluZy5jcmVhdGUuYWxsb3dlZCIsImhybS5jYW5kaWRhdGUuY3JlYXRlLmFsbG93ZWQiLCJocm0uZGVwYXJ0bWVudC5jcmVhdGUuYWxsb3dlZCIsImhybS5lbXBsb3llZS5jcmVhdGUuYWxsb3dlZCIsInRhc2tzLnRhc2suY3JlYXRlLmFsbG93ZWQiLCJ0YXNrcy5ib2FyZC5jcmVhdGUuYWxsb3dlZCIsInRhc2tzLnRlbXBsYXRlLmNyZWF0ZS5hbGxvd2VkIl0sInZpZXciOlsiY3JtLmxlYWRzLnZpZXcuYWxsb3dlZCIsImNybS5jb250YWN0cy52aWV3LmFsbG93ZWQiLCJjcm0uY29tcGFuaWVzLnZpZXcuYWxsb3dlZCIsImNybS5kZWFscy52aWV3LmFsbG93ZWQiLCJjcm0uaW52b2ljZS52aWV3LmFsbG93ZWQiLCJjcm0ucHJvZHVjdC52aWV3LmFsbG93ZWQiLCJjcm0uYWN0aXZpdHkudmlldy5hbGxvd2VkIiwiaHJtLmhpcmluZy52aWV3LmFsbG93ZWQiLCJocm0uY2FuZGlkYXRlLnZpZXcuYWxsb3dlZCIsImhybS5kZXBhcnRtZW50LnZpZXcuYWxsb3dlZCIsImhybS5lbXBsb3llZS52aWV3LmFsbG93ZWQiLCJ0YXNrcy50YXNrLnZpZXcuYWxsb3dlZCIsInRhc2tzLmJvYXJkLnZpZXcuYWxsb3dlZCIsInRhc2tzLnRlbXBsYXRlLnZpZXcuYWxsb3dlZCJdLCJlZGl0IjpbImNybS5sZWFkcy5lZGl0LmFsbG93ZWQiLCJjcm0uY29udGFjdHMuZWRpdC5hbGxvd2VkIiwiY3JtLmNvbXBhbmllcy5lZGl0LmFsbG93ZWQiLCJjcm0uZGVhbHMuZWRpdC5hbGxvd2VkIiwiY3JtLmludm9pY2UuZWRpdC5hbGxvd2VkIiwiY3JtLnByb2R1Y3QuZWRpdC5hbGxvd2VkIiwiY3JtLmFjdGl2aXR5LmVkaXQuYWxsb3dlZCIsImhybS5oaXJpbmcuZWRpdC5hbGxvd2VkIiwiaHJtLmNhbmRpZGF0ZS5lZGl0LmFsbG93ZWQiLCJocm0uZGVwYXJ0bWVudC5lZGl0LmFsbG93ZWQiLCJocm0uZW1wbG95ZWUuZWRpdC5hbGxvd2VkIiwidGFza3MudGFzay5lZGl0LmFsbG93ZWQiLCJ0YXNrcy5ib2FyZC5lZGl0LmFsbG93ZWQiLCJ0YXNrcy50ZW1wbGF0ZS5lZGl0LmFsbG93ZWQiLCJuZXdzX2ZlZWQubmV3cy5lZGl0LmFsbG93ZWQiXSwiZGVsZXRlIjpbImNybS5sZWFkcy5kZWxldGUuYWxsb3dlZCIsImNybS5jb250YWN0cy5kZWxldGUuYWxsb3dlZCIsImNybS5jb21wYW5pZXMuZGVsZXRlLmFsbG93ZWQiLCJjcm0uZGVhbHMuZGVsZXRlLmFsbG93ZWQiLCJjcm0uaW52b2ljZS5kZWxldGUuYWxsb3dlZCIsImNybS5wcm9kdWN0LmRlbGV0ZS5hbGxvd2VkIiwiY3JtLmFjdGl2aXR5LmRlbGV0ZS5hbGxvd2VkIiwiaHJtLmhpcmluZy5kZWxldGUuYWxsb3dlZCIsImhybS5jYW5kaWRhdGUuZGVsZXRlLmFsbG93ZWQiLCJocm0uZGVwYXJ0bWVudC5kZWxldGUuYWxsb3dlZCIsImhybS5lbXBsb3llZS5kZWxldGUuYWxsb3dlZCIsInRhc2tzLnRhc2suZGVsZXRlLmFsbG93ZWQiLCJ0YXNrcy5ib2FyZC5kZWxldGUuYWxsb3dlZCIsInRhc2tzLnRlbXBsYXRlLmRlbGV0ZS5hbGxvd2VkIiwibmV3c19mZWVkLm5ld3MuZGVsZXRlLmFsbG93ZWQiXX0sInRhcmlmZklkIjoxfQ.uS14bgZlnMjMSw4vznyp8YjlBpAHSiSos5jL85WL-vg',
		// );
		uspacy.usersService.getUsers(1, 20);
		uspacy.departmentsService.getDepartments(1, 20);
		uspacy.usersService.getUserById(1);
		uspacy.profileService.getProfile();
		// console.log(result1.data);
	} catch (err) {
		console.log(err);
	}
})();
