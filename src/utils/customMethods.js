async function checkMatchPassword (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (error) {}
};

module.exports = { checkMatchPassword }
