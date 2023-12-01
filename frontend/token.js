let Token = class {
	static Type = {
		Operator: "Operator",

		Parenthesis: "Parenthesis",
		Bracket: "Bracket",
		Brace: "Brace",

		Dot: "Dot",
		Comma: "Comma",
		Colon: "Colon",
		Semicolon: "Semicolon",
		Ampersand: "Ampersand",
		Pipe: "Pipe",
	}

	constructor(type, value = null) {
		this.type = type;
		this.value = value;
	}
}

module.exports = Token;