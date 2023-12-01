let fs = require("fs");
let path = require("path");

let checkError = function(res) {
	return res.error ? true : false;
}

let outputError = function(res) {
	console.log(res.error.asString());
}

// -------------------------------------------------------------------------------
let lang = {};
lang.Lexer = require("./frontend/lexer");

lang.runFile = function(filename) {

	// https://stackoverflow.com/a/32804614
	// Checking if the file exists
	if (!fs.existsSync(filename)) {
		return `File ${filename} does not exist!`;
	}

	// Reading the file
	let code = fs.readFileSync(filename, { encoding: "utf-8", flag: "r" });

	// Getting the filename without its path
	let filenameNoPath = path.basename(filename);

	lang.runCode(filenameNoPath, code);
	return ;
}

lang.runCode = function(filename, code) {
	// Lexer
	let lexer = new lang.Lexer(filename, code);
	let lexerResult = lexer.lexerize();

	if (checkError(lexerResult)) {
		return outputError(lexerResult);
	}

	console.log(lexerResult.list);
}

module.exports = lang;