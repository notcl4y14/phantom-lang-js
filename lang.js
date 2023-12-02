let utils = require("util");
let fs = require("fs");
let path = require("path");

// Checks if the result has an error
let checkError = function(res) {
	return res.error ? true : false;
}

// Outputs the error as a string
let outputError = function(res) {
	console.log(res.error.asString());
}

// -------------------------------------------------------------------------------
let lang = {};
lang.Lexer = require("./frontend/lexer");
lang.Parser = require("./frontend/parser");

lang.runFile = function(filename, flags) {

	// https://stackoverflow.com/a/32804614
	// Checking if the file exists
	if (!fs.existsSync(filename)) {
		return `File ${filename} does not exist!`;
	}

	// Reading the file
	let code = fs.readFileSync(filename, { encoding: "utf-8", flag: "r" });

	// Getting the filename without its path
	let filenameNoPath = path.basename(filename);

	lang.runCode(filenameNoPath, code, flags);
	return ;
}

lang.runCode = function(filename, code, flags) {
	let showLexer = flags.includes("--lexer");
	let showParser = flags.includes("--parser");
	// -------------------------------------------------
	// Lexer
	let lexer = new lang.Lexer(filename, code);
	let lexerResult = lexer.lexerize();

	if (checkError(lexerResult)) {
		return outputError(lexerResult);
	}

	if (showLexer) {
		console.log(lexerResult.list);
	}

	// Parser
	let parser = new lang.Parser(filename, lexerResult.list);
	let ast = parser.parse();

	if (checkError(ast)) {
		return outputError(ast);
	}

	if (showParser) {
		console.log(utils.inspect(ast.node, {showHidden: false,  depth: null, colors: true}));
	}
}

module.exports = lang;