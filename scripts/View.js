const Hogan = require("hogan.js");

module.exports = class View {
	constructor(template, handler, locals) {
		this.template = Hogan.compile(template);
		this.handler = handler || (() => {});
		this.locals = locals || {};
	}

	render(locals) {
		locals = Object.assign({}, this.locals, locals);
		this.handler(this.template.render(locals), locals);
	}
};
