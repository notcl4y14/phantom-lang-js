let fs = require("fs");
let lang = {};

lang.Lexer = require("./frontend/lexer");

lang.runFile = function(filename) {
	let data;
	
	try {
		data = fs.readFileSync(filename, { encoding: "utf-8", flag: "r" });
	} catch (error) {
		return `File ${filename} does not exist!`;
	}

	lang.runCode(data);
	return ;
}

lang.runCode = function(code) {
	// Lexer
	let lexer = new lang.Lexer(code);
	let lexerResult = lexer.lexerize();

	if (lexerResult.error) {
		console.log(lexerResult.error.asString());
		return ;
	}

	console.log(lexerResult.list);
}

module.exports = lang;