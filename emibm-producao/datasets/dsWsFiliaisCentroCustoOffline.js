function defineStructure() {
	log.warn('----- Debug dsWsFiliaisCentroCustoOffline ----- defineStructure');

	addColumn('codigoFilial');
	addColumn('descricaoFilial');
	addColumn('codigoCC');
	addColumn('descricaoCC');

	setKey(['codigoFilial']);
	addIndex(['codigoFilial']);
}

function createDataset(fields, constraints, sortFields) {}

function onSync(lastSyncDate) {
	log.warn('----- Debug dsWsFiliaisCentroCustoOffline ----- onSync: ' + lastSyncDate);

	var dataset = DatasetBuilder.newDataset();
	var constraintsFilial = [DatasetFactory.createConstraint('endpoint', 'filial', null, ConstraintType.MUST)];
	var filiais = DatasetFactory.getDataset('dsWsProtheus', null, constraintsFilial, null);

	for (var i = 0; i < filiais.rowsCount; i++) {
		var codigoFilial = filiais.getValue(i, 'codigo');
		var descricaoFilial = filiais.getValue(i, 'descricao');
		var constraintsCC = [
			DatasetFactory.createConstraint('endpoint', 'ccusto', null, ConstraintType.MUST),
			DatasetFactory.createConstraint('filial', codigoFilial, null, ConstraintType.MUST),
		];
		var centrosCusto = DatasetFactory.getDataset('dsWsProtheus', null, constraintsCC, null);

		for (var j = 0; j < centrosCusto.rowsCount; j++) {
			var codigoCC = centrosCusto.getValue(j, 'codigo');
			var descricaoCC = centrosCusto.getValue(j, 'descricao');

			dataset.addOrUpdateRow([codigoFilial, descricaoFilial, codigoCC, descricaoCC]);
		}
	}

	return dataset;
}

function onMobileSync(user) {
	var sortingFields = [];
	var fields = [
		'codigoFilial',
		'descricaoFilial',
		'codigoCC',
		'descricaoCC'
	];
	var constraints = [];
	var result = {
		'fields': fields,
		'constraints': constraints,
		'sortingFields': sortingFields
	};

	return result;
}