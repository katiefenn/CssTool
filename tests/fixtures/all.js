define(
	'fixtures/all',
	[
		'fixtures/simpleDeclarations', 'fixtures/multipleDeclarations', 'fixtures/simpleDeclaration',
		'fixtures/complexDeclaration'
	],
	function(simpleDeclarations, multipleDeclarations, simpleDeclaration, complexDeclaration) {
		return {
			simpleDeclarations: simpleDeclarations,
			multipleDeclarations: multipleDeclarations,
			simpleDeclaration: simpleDeclaration,
			complexDeclaration: complexDeclaration
		};
	}
);