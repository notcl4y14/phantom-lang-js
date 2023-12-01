let fs = require("fs");
let path = require("path");
let lang = {};

lang.Lexer = require("./frontend/lexer");

lang.runFile = function(filename) {
	let code = "";
	
	// I know, this is ugly
	try {
		data = fs.readFileSync(filename, { encoding: "utf-8", flag: "r" });
	} catch (error) {
		return `File ${filename} does not exist!`;
	}

	// getting the filename without its path
	let filenameNoPath = path.basename(filename);

	lang.runCode(filenameNoPath, data);
	return ;
}

lang.runCode = function(filename, code) {
	// Lexer
	let lexer = new lang.Lexer(filename, code);
	let lexerResult = lexer.lexerize();

	if (lexerResult.error) {
		console.log(lexerResult.error.asString());
		return ;
	}

	console.log(lexerResult.list);
}

module.exports = lang;