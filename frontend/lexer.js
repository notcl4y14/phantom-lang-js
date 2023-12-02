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
	constructor(filename, code) {
		this.filename = filename;
		this.code = code;
		this.position = new Position(-1, 0, -1);

		this.advance();
	}

	// Moves to the next character
	advance(delta = 1) {
		let char = this.at();
		this.position.advance(this.at(), delta);
		return char;
	}

	// Returns the current character
	at(range = 1) {
		if (range > 1) {
			return this.code.substr(this.position.index, 1);
		}

		return this.code[this.position.index];
	}

	// Checks if the position has not reached the length of the code
	isEndOfFile() {
		return this.position.index >= this.code.length;
	}

	// -------------------------------------------------------------------------------

	// Makes a list of tokens
	lexerize() {
		let listToken = [];

		while (!this.isEndOfFile()) {
			let leftPos = this.position.clone();
			let char = this.at();
			let token = this.checkChar(char, leftPos);
			let skip = token == "skip";

			if (skip) {
				this.advance();
				continue;
			}

			// Checking if the lexer has noticed and made a token
			if (!token) {
				this.advance();
				let rightPos = this.position.clone();

				// Returning an "Undefined character" error
				let error = new Error(this.filename, {left: leftPos, right: rightPos}, `Undefined character '${char}'`);
				return new LexerResult().failure(error);
			}

			this.advance();

			if (!token.leftPos)
				token.setPos().left(leftPos);

			if (!token.rightPos)
				token.setPos().right(this.position.clone());

			// Push the token to the tokens list
			listToken.push(token);
		}

		listToken.push( new Token(Token.Type.EOF).setPos(this.position.clone()) );

		return new LexerResult().success(listToken);
	}

	// -------------------------------------------------------------------------------

	// Checks the character and makes a token
	checkChar(char) {

		if ((" \t\r\n").includes(char)) {
			// Skip
			return "skip";

		} else if (("+-*/%").includes(char)) {
			return new Token(Token.Type.Operator, char);

		} else if (("()").includes(char)) {
			return new Token(Token.Type.Parenthesis, char);

		} else if (("[]").includes(char)) {
			return new Token(Token.Type.Bracket, char);

		} else if (("{}").includes(char)) {
			return new Token(Token.Type.Brace, char);

		} else if ((".,:;&|").includes(char)) {

			if (char == ".")
				return new Token(Token.Type.Dot);

			else if (char == ",")
				return new Token(Token.Type.Comma);

			else if (char == ":")
				return new Token(Token.Type.Colon);

			else if (char == ";")
				return new Token(Token.Type.Semicolon);

			else if (char == "&")
				return new Token(Token.Type.Ampersand);

			else if (char == "|")
				return new Token(Token.Type.Pipe);

		// TODO: Create a table for string matches
		} else if (("1234567890").includes(char)) {
			return this.makeNumber();
		} else if (("\"'`").includes(char)) {
			return this.makeString();
		} else if (("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_").includes(char)) {
			return this.makeIdentifier();
		}

		// Return nothing
		return ;
	}

	// -------------------------------------------------------------------------------

	makeNumber() {
		let leftPos = this.position.clone();
		let numStr = "";
		let dot = false;

		// TODO: Create a table for string matches
		while (!this.isEndOfFile() && ("1234567890.").includes(this.at())) {
			let char = this.at();

			// TODO: Optimize this
			if (char == ".") {
				if (dot) break;
				dot = true;
				numStr += ".";
			} else {
				numStr += char;
			}

			this.advance();
		}

		let rightPos = this.position.clone();
		this.advance(-1);

		return new Token(Token.Type.Number, Number(numStr)).setPos(leftPos, rightPos);
	}

	makeString() {
		let leftPos = this.position.clone();
		let quote = this.advance();
		let str = "";

		// TODO: Add escape characters support

		while (!this.isEndOfFile() && this.at() != quote) {
			let char = this.advance();
			str += char;
		}

		let rightPos = this.position.clone();
		return new Token(Token.Type.String, str).setPos(leftPos, rightPos);
	}

	makeIdentifier() {
		let leftPos = this.position.clone();
		let identStr = "";

		// TODO: Create a table for string matches
		while (!this.isEndOfFile() && ("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_" + "1234567890").includes(this.at())) {
			let char = this.advance();
			identStr += char;
		}

		let rightPos = this.position.clone();
		this.advance(-1);

		return new Token(Token.Type.Identifier, identStr).setPos(leftPos, rightPos);
	}
}

module.exports = Lexer;