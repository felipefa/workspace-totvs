function createDataset(fields, constraints, sortFields) {
	try {
		var dsWsProduto = DatasetBuilder.newDataset();
		var tipoRequisicao = 'consultar';
		var constraintCodigo = '';

		if (constraints != null) {
			for (var indexConstraints = 0; indexConstraints < constraints.length; indexConstraints++) {
				if (constraints[indexConstraints] == 'codigo') {
					constraintCodigo = constraints[indexConstraints].initialValue;
				}
			}
		}

		if (tipoRequisicao == 'consultar' && constraintCodigo == '') {
			var dados = getProduto(); // JSON.Parse(getProdutos());
			var produtos = [];

			if (dados != null && dados.PRODUTOS != undefined) {
				produtos = dados.PRODUTOS;
			}

			dsWsProduto.addColumn('codigo');
			dsWsProduto.addColumn('descricao');
			dsWsProduto.addColumn('tipo');
			dsWsProduto.addColumn('unMedida');
			dsWsProduto.addColumn('tipoRequisicao');

			for (var indexDados = 0; indexDados < produtos.length; indexDados++) {
				dsWsProduto.addRow([produtos[indexDados].CODIGO, produtos[indexDados].DESC, produtos[indexDados].TIPO, produtos[indexDados].UM, tipoRequisicao]);
			}
		} else if (tipoRequisicao == 'consultar') {

		}

		return dsWsProduto;
	} catch (e) {
		log.warn('--Debug dsWsProduto-- Erro: ' + e + '; Linha: ' + e.lineNumber);
		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn('Erro');
		dataset.addColumn('Linha');
		dataset.addRow([e, e.lineNumber]);
		return dataset;
	}
}

function getProduto() {
	return {
		"_classname": "PROD_FULL",
		"PRODUTOS": [
			{
				"_classname": "PROD",
				"CODIGO": "1",
				"DESC": "MI 8 LITE",
				"TIPO": "ME",
				"UM": "UN"
			},
			{
				"_classname": "PROD",
				"CODIGO": "2",
				"DESC": "S8",
				"TIPO": "ME",
				"UM": "UN"
			},
			{
				"_classname": "PROD",
				"CODIGO": "0002",
				"DESC": "Mi 3s",
				"TIPO": "ME",
				"UM": "UN"
			},
			{
				"_classname": "PROD",
				"CODIGO": "0003",
				"DESC": "iPhone 4S",
				"TIPO": "ME",
				"UM": "UN"
			},
			{
				"_classname": "PROD",
				"CODIGO": "0004",
				"DESC": "iPhone 4",
				"TIPO": "ME",
				"UM": "UN"
			},
			{
				"_classname": "PROD",
				"CODIGO": "0005",
				"DESC": "iPhone 3",
				"TIPO": "ME",
				"UM": "UN"
			},
			{
				"_classname": "PROD",
				"CODIGO": "0006",
				"DESC": "Alcatel E801",
				"TIPO": "ME",
				"UM": "UN"
			},
			{
				"_classname": "PROD",
				"CODIGO": "0007",
				"DESC": "iphone teste",
				"TIPO": "ME",
				"UM": "UN"
			},
			{
				"_classname": "PROD",
				"CODIGO": "0009",
				"DESC": "NOTEBOOK DELL G7",
				"TIPO": "ME",
				"UM": "UN"
			},
			{
				"_classname": "PROD",
				"CODIGO": "0010",
				"DESC": "Ultimo teste",
				"TIPO": "MM",
				"UM": "UN"
			},
			{
				"_classname": "PROD",
				"CODIGO": "999999",
				"DESC": "99999999999999999",
				"TIPO": "AI",
				"UM": "AR"
			},
			{
				"_classname": "PROD",
				"CODIGO": "9555599",
				"DESC": "prod955599",
				"TIPO": "AI",
				"UM": "AR"
			},
			{
				"_classname": "PROD",
				"CODIGO": "93555599",
				"DESC": "prod955599",
				"TIPO": "AI",
				"UM": "AR"
			},
			{
				"_classname": "PROD",
				"CODIGO": "955599",
				"DESC": "prod955599",
				"TIPO": "AI",
				"UM": "AR"
			},
			{
				"_classname": "PROD",
				"CODIGO": "939",
				"DESC": "prod955599",
				"TIPO": "AI",
				"UM": "AR"
			},
			{
				"_classname": "PROD",
				"CODIGO": "99998",
				"DESC": "prod955599",
				"TIPO": "AI",
				"UM": "AR"
			},
			{
				"_classname": "PROD",
				"CODIGO": "99990",
				"DESC": "prod955599",
				"TIPO": "AI",
				"UM": "AR"
			},
			{
				"_classname": "PROD",
				"CODIGO": "2424",
				"DESC": "Teste de hoje",
				"TIPO": "AI",
				"UM": "AR"
			}
		]
	}
}