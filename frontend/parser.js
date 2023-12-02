let Error = require("./error");
let Token = require("./token.js");

let ParserResult = class {
	static filename = "";

	constructor() {
		this.node = null;
		this.error = null;
	}

	register(res) {
		if (res.error) {
			this.error = res.error;
		}

		return res.node;
	}

	success(node) {
		this.node = node;
		return this;
	}

	failure(leftPos, rightPos, details) {
		this.error = new Error(ParserResult.filename, {left: leftPos, right: rightPos}, details);
		return this;
	}
}

let Parser = class {
	constructor(filename, listToken) {
		// this.filename = filename;
		this.listToken = listToken;
		this.position = -1;
		ParserResult.filename = filename;

		this.advance();
	}

	at() {
		return this.listToken[this.position];
	}

	advance() {
		let token = this.listToken[this.position];
		this.position += 1;
		return token;
	}

	isEndOfFile() {
		return this.at().type == Token.Type.EOF;
	}

	// -------------------------------------------------------------------------------

	parse() {
		let program = {
			type: "program",
			body: [],
		};

		let res = new ParserResult();

		while (!this.isEndOfFile()) {
			let expr = res.register(this.parseStmt());
			if (res.error) return res;
			if (expr) program.body.push(expr);
		}

		return res.success(program);
	}

	// -------------------------------------------------------------------------------

	parseStmt() {
		return this.parseExpr();
	}

	// -------------------------------------------------------------------------------

	parseExpr() {
		return this.parseAddExpr();
	}

	// -------------------------------------------------------------------------------

	parseAddExpr() {
		return this.parseBinExpr("binary-expr", ["+", "-"], this.parseMultExpr);
	}

	parseMultExpr() {
		return this.parseBinExpr("binary-expr", ["*", "/", "%"], this.parsePrimaryExpr);
	}

	// -------------------------------------------------------------------------------

	// TODO: Make repeatable binary expression parsing
	parseBinExpr(name, operators, func) {
		let res = new ParserResult();

		let left = res.register(func.call(this));
		if (res.error) return res;

		while (!this.isEndOfFile() && this.at().type == Token.Type.Operator && operators.includes(this.at().value)) {
			let operator = this.advance().value;

			let right = res.register(func.call(this));
			if (res.error) return res;

			return res.success({
				type: name,
				left, operator, right
			});
		}

		return res.success(left);
	}

	// -------------------------------------------------------------------------------

	parsePrimaryExpr() {
		let res = new ParserResult();
		let token = this.advance();

		if (token.type == Token.Type.Number) {
			return res.success({
				type: "numeric-literal",
				value: token.value,
			});
		}

		let value = token.value != null
			? token.value
			: token.type;

		return res.failure(token.leftPos, token.rightPos, `Undefined token '${value}'`);
	}
}

module.exports = Parser;