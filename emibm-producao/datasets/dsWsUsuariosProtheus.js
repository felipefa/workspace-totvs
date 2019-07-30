function defineStructure() {
	addColumn('idProtheus', DatasetFieldType.NUMBER);
	addColumn('nome');
	addColumn('email');
	addColumn('sucesso', DatasetFieldType.BOOLEAN);
	addColumn('mensagem');
	addColumn('centroCusto');
	addColumn('filial');

	setKey(['idProtheus']);
	addIndex(['idProtheus']);
}

function createDataset(fields, constraints, sortFields) {}

function onSync(lastSyncDate) {
	log.warn('----- Debug dsWsUsuariosProtheus ----- onSync: ' + lastSyncDate);

	var dataset = DatasetBuilder.newDataset();
	var resultado = DatasetFactory.getDataset('dsWsConsultaUsuario', null, null, null);

	for (var i = 0; i < resultado.rowsCount; i++) {
		var IDPROTHEUS = resultado.getValue(i, 'idProtheus');
		var NOME = resultado.getValue(i, 'nome');
		var EMAIL = resultado.getValue(i, 'email');
		var SUCESSO = resultado.getValue(i, 'sucesso');
		var MENSAGEM = resultado.getValue(i, 'mensagem');
		var CENTROCUSTO = resultado.getValue(i, 'centroCusto');
		var FILIAL = resultado.getValue(i, 'filial');

		dataset.addOrUpdateRow([IDPROTHEUS, NOME, EMAIL, SUCESSO, MENSAGEM, CENTROCUSTO, FILIAL]);
	}

	return dataset;
}

function onMobileSync(user) {
	var sortingFields = [];
	var fields = [
		'idProtheus',
		'nome',
		'email',
		'sucesso',
		'mensagem',
		'centroCusto',
		'filial'
	];
	var constraints = [];
	var result = {
		'fields': fields,
		'constraints': constraints,
		'sortingFields': sortingFields
	};

	return result;
}