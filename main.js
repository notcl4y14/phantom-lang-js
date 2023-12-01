let lang = require("./lang");

// The main function
let main = function() {
	let filename = "tests/operators.pht";
	let error = lang.runFile(filename);

	if (error) {
		console.log(error);
		return ;
	}
}

// Calling main()
main();