let Token = class {
	static Type = {
		Operator: "Operator",
		Number: "Number",
		String: "String",
		Identifier: "Identifier",

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

		this.leftPos = null;
		this.rightPos = null;
	}

	setPos(leftPos = null, rightPos = null) {
		if (!leftPos && !rightPos) {
			let token = this;

			return {
				left: function(leftPos) {
					token.leftPos = leftPos;
				},

				right: function(rightPos) {
					token.rightPos = rightPos;
				}
			};
		}

		this.leftPos = leftPos;
		this.rightPos = rightPos;

		return this;
	}
}

module.exports = Token;