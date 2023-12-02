let lang = require("./lang");

// The main function
let main = function() {
	let args = process.argv;
	args.splice(0, 2);

	let filename = args[0];
	if (!filename) {
		console.log("Please specify a filename!");
		return ;
	}
	
	let error = lang.runFile(filename, ["--lexer", "--parser"]);

	if (error) {
		console.log(error);
		return ;
	}
}

// Calling main()
main();