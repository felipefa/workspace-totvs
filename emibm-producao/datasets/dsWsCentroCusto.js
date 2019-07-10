function createDataset(fields, constraints, sortFields) {
	try {
		var dsWsCentroCusto = DatasetBuilder.newDataset();
		var dados = getCentroCusto(); // JSON.Parse(getCentroCusto());
		var centroCusto = [];

		if (dados != null && dados.CUSTOS != undefined) {
			centroCusto = dados.CUSTOS;
		}

		dsWsCentroCusto.addColumn('codigo');
		dsWsCentroCusto.addColumn('descricao');

		for (var indexDados = 0; indexDados < centroCusto.length; indexDados++) {
			dsWsCentroCusto.addRow([centroCusto[indexDados].CUSTO, centroCusto[indexDados].DESC01]);
		}

		return dsWsCentroCusto;
	} catch (e) {
		log.warn('--Debug dsWsCentroCusto-- Erro: ' + e + '; Linha: ' + e.lineNumber);
		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn('Erro');
		dataset.addColumn('Linha');
		dataset.addRow([e, e.lineNumber]);
		return dataset;
	}
}

function getCentroCusto() {
	return {
		"_classname": "CC_FULL",
		"CUSTOS": [{
				"_classname": "CC",
				"CUSTO": "TESTE",
				"DESC01": "CC TESTE 01"
			},
			{
				"_classname": "CC",
				"CUSTO": "TESTE02",
				"DESC01": "TESTE 2"
			}
		]
	}
}