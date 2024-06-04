/**
 * It checks if the user has the required privileges
 * @param endpoint - The Endpoint called check.
 * @param role - Role of User (req.session.user.role).
 * @param prüfstück - Wheather a prüfstück is concerned.
 * @param options - Optional data that can influence privileges.
 * @returns True if user has the required Privileges else returns false.
 */
let checkPrivileges = (endpoint, role, prüfstück = false, options = false) => {
	if (prüfstück == 1) prüfstück = true;
	const admin = 'admin';
	const user = 'user';
	const moderator = 'moderator';
	const editor = 'editor';
	const guest = 'guest';
	const developer = 'developer';
	switch (endpoint) {
		case '/users/get':
		case '/users/list':
		case '/users/delete':
			if ([admin].indexOf(role) !== -1) return true;
			break;

		case '/users/updateRole':
			if ([admin, user, moderator, editor, developer].indexOf(role) !== -1 && options !== false && options.oldRole == null && options.newRole == azubi) return true;
			if ([admin].indexOf(role) !== -1) return true;
			break;

		default:
			return false;
	}
	return false;
};

module.exports = {
	checkPrivileges,
};
