function defineStructure() {
	log.warn('----- Debug dsWsUnMedidaOffline ----- defineStructure');

	addColumn('codigo');
	addColumn('descricao');
	addColumn('sucesso', DatasetFieldType.BOOLEAN);
	addColumn('mensagem');

	setKey(['codigo']);
	addIndex(['codigo']);
}

function createDataset(fields, constraints, sortFields) {}

function onSync(lastSyncDate) {
	log.warn('----- Debug dsWsUnMedidaOffline ----- onSync: ' + lastSyncDate);

	var dataset = DatasetBuilder.newDataset();
	var constraintsUnMedida = [DatasetFactory.createConstraint('endpoint', 'unimed', null, ConstraintType.MUST)];
	var resultado = DatasetFactory.getDataset('dsWsProtheus', null, constraintsUnMedida, null);

	for (var i = 0; i < resultado.rowsCount; i++) {
		var codigo = resultado.getValue(i, 'codigo');
		var descricao = resultado.getValue(i, 'descricao');
		var sucesso = resultado.getValue(i, 'sucesso');
		var mensagem = resultado.getValue(i, 'mensagem');

		dataset.addOrUpdateRow([codigo, descricao, sucesso, mensagem]);
	}

	return dataset;
}

function onMobileSync(user) {
	var sortingFields = [];
	var fields = [
		'codigo',
		'descricao',
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