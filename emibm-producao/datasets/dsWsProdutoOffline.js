function defineStructure() {
	log.warn('----- Debug dsWsProdutoOffline ----- defineStructure');

	addColumn('codigo');
	addColumn('descricao');
	addColumn('unMedida');
	addColumn('sucesso', DatasetFieldType.BOOLEAN);
	addColumn('mensagem');

	setKey(['codigo']);
	addIndex(['codigo']);
}

function createDataset(fields, constraints, sortFields) {}

function onSync(lastSyncDate) {
	log.warn('----- Debug dsWsProdutoOffline ----- onSync: ' + lastSyncDate);

	var dataset = DatasetBuilder.newDataset();
	var resultado = DatasetFactory.getDataset('dsWsProduto', null, null, null);

	for (var i = 0; i < resultado.rowsCount; i++) {
		var codigo = resultado.getValue(i, 'codigo');
		var descricao = resultado.getValue(i, 'descricao');
		var unMedida = resultado.getValue(i, 'unMedida');
		var sucesso = resultado.getValue(i, 'sucesso');
		var mensagem = resultado.getValue(i, 'mensagem');

		dataset.addOrUpdateRow([codigo, descricao, unMedida, sucesso, mensagem]);
	}

	return dataset;
}

function onMobileSync(user) {
	var sortingFields = [];
	var fields = [
		'codigo',
		'descricao',
		'unMedida',
		'sucesso',
		'mensagem'
	];
	var constraints = [];
	var result = {
		'fields': fields,
		'constraints': constraints,
		'sortingFields': sortingFields
	};

	return result;
}