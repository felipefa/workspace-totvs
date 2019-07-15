function createDataset(fields, constraints, sortFields) {
	//log.warn("==================================== DATASET CENTRO DE CUSTO ======================= ");
	try {
		var paiEmpresaCodigo = "";
		var centroCustoCodigo = "";

		if (constraints != null) {
			for (var c = 0; c < constraints.length; c++) {
				if (constraints[c].fieldName == "paiEmpresaCodigo") {
					paiEmpresaCodigo = constraints[c].initialValue;
				}
				if (constraints[c].fieldName == "centroCustoCodigo") {
					centroCustoCodigo = constraints[c].initialValue;
				}
			}
		}

		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn("documentid");
		dataset.addColumn("paiEmpresaCodigo");
		dataset.addColumn("paiEmpresaCNPJ");
		dataset.addColumn("paiEmpresaNome");
		dataset.addColumn("centroDeCustoCodigo");
		dataset.addColumn("centroDeCustoDescricao");

		var c1 = DatasetFactory.createConstraint("tablename", "tabelaUnidadeXCentroDeCusto", "tabelaUnidadeXCentroDeCusto", ConstraintType.MUST);
		var c2 = DatasetFactory.createConstraint("metadata#parent_id", 51456, 51456, ConstraintType.MUST);
		//var c3 = DatasetFactory.createConstraint("metadata#version", 1000, 1000, ConstraintType.MUST);
		var constraintsFilhos = new Array(c1, c2/*, c3*/);

		if (paiEmpresaCodigo) {
			constraintsFilhos.push(DatasetFactory.createConstraint("paiEmpresaCodigo", paiEmpresaCodigo, paiEmpresaCodigo, ConstraintType.MUST))
		}

		//Busca o dataset
		var datasetFilhos = DatasetFactory.getDataset("fsUnidadeCentroCusto", null, constraintsFilhos, null);
		//log.warn("====================== QUANTIDADE FILHOS:" + datasetFilhos.rowsCount);
		if (centroCustoCodigo != "") {
			for (var j = 0; j < datasetFilhos.rowsCount; j++) {
				if (centroCustoCodigo == datasetFilhos.getValue(j, "centroDeCustoCodigo")) {
					dataset.addRow(new Array(
						datasetFilhos.getValue(j, "documentid"),
						datasetFilhos.getValue(j, "paiEmpresaCodigo"),
						datasetFilhos.getValue(j, "paiEmpresaCNPJ"),
						datasetFilhos.getValue(j, "paiEmpresaNome"),
						datasetFilhos.getValue(j, "centroDeCustoCodigo"),
						datasetFilhos.getValue(j, "zoomCentroDeCusto")
					));
				}
			}
		} else {
			for (var j = 0; j < datasetFilhos.rowsCount; j++) {
				dataset.addRow(new Array(
					datasetFilhos.getValue(j, "documentid"),
					datasetFilhos.getValue(j, "paiEmpresaCodigo"),
					datasetFilhos.getValue(j, "paiEmpresaCNPJ"),
					datasetFilhos.getValue(j, "paiEmpresaNome"),
					datasetFilhos.getValue(j, "centroDeCustoCodigo"),
					datasetFilhos.getValue(j, "zoomCentroDeCusto")
				));
			}
		}

		return dataset;
	} catch (e) {
		log.warn('============================== ERRO DATASET CENTRO DE CUSTO ');
		log.error('============================= ERRO:. ' + e.message);
		log.error('============================= LINHA: ' + e.lineNumber);
		return;
	}
}