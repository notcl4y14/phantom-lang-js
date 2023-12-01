let Position = class {
	constructor(index, line, column) {
		this.index = index;
		this.line = line;
		this.column = column;
	}

	// Advances its properties
	advance(char = "", delta = 1) {
		this.index += delta;
		this.column += delta;

		if (char == "\n") {
			this.column = 0;
			this.line += 1;
		}
	}

	// Clones the object
	clone() {
		return new Position(this.index, this.line, this.column);
	}
}

module.exports = Position;