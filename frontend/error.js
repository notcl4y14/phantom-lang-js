let RuntimeError = class {
	constructor(filename, position, details) {
		this.filename = filename;
		this.position = {
			left: position.left,
			right: position.right,
		};
		this.details = details;
	}

	// Returns the error as a string
	asString() {
		let	filename = this.filename,
			leftPos = this.position.left,
			rightPos = this.position.right,
			details = this.details;

		let line = leftPos.line == rightPos.line
			? leftPos.line + 1
			: `${leftPos.line + 1}-${rightPos.line + 1}`;
		let column = leftPos.column == rightPos.column
			? leftPos.column + 1
			: `${leftPos.column + 1}-${rightPos.column + 1}`;

		return `${filename}: ${line} : ${column} : ${details}`;
	}
}

module.exports = RuntimeError;