let Error = require("./error");
let Position = require("./position");
let Token = require("./token");

let LexerResult = class {
	constructor() {
		this.list = null;
		this.error = null;
	}

	success(list) {
		this.list = list;
		return this;
	}

	failure(error) {
		this.error = error;
		return this;
	}
}

let Lexer = class {
	constructor(code) {
		this.code = code;
		this.pos = new Position(-1, 0, -1);

		this.advance();
	}

	// Moves to the next character
	advance(delta = 1) {
		this.pos.advance(this.at(), delta);
	}

	// Returns the current character
	at(range = 1) {
		if (range > 1) {
			return this.code.substr(this.pos.index, 1);
		}

		return this.code[this.pos.index];
	}

	// Checks if the position has not reached the length of the code
	isEndOfFile() {
		return this.pos.index >= this.code.length;
	}

	// -------------------------------------------------------------------------------

	// Makes a list of tokens
	lexerize() {
		let listToken = [];

		while (!this.isEndOfFile()) {
			let leftPos = this.pos.clone();
			let char = this.at();
			let token = this.checkChar(char);

			if (!token) {
				this.advance();
				let rightPos = this.pos.clone();

				let error = new Error("<stdin>", {left: leftPos, right: rightPos}, `Undefined character '${char}'`);
				return new LexerResult().failure(error);
			}

			// Push the token to the tokens list
			listToken.push(token);

			this.advance();
		}

		return new LexerResult().success(listToken);
	}

	// -------------------------------------------------------------------------------

	// Checks the character and makes a token
	checkChar(char) {

		if ((" \t\r\n").includes(char)) {
			// Skip
		} else if (("+-*/%").includes(char)) {
			return new Token("operator", char);
		}

		// Return nothing
		return ;
	}
}

module.exports = Lexer;