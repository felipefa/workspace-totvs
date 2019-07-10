function createDataset(fields, constraints, sortFields) {
	try {
		var dsWsProduto = DatasetBuilder.newDataset();
		var constraintTipoRequisicao = 'GET';
		var constraintCodigo = '';

		dsWsProduto.addColumn('codigo');
		dsWsProduto.addColumn('descricao');
		dsWsProduto.addColumn('tipo');
		dsWsProduto.addColumn('unMedida');
		dsWsProduto.addColumn('tipoRequisicao');

		if (constraints != null) {
			for (var indexConstraints = 0; indexConstraints < constraints.length; indexConstraints++) {
				if (constraints[indexConstraints] == 'codigo')
					constraintCodigo = constraints[indexConstraints].initialValue;
				if (constraints[indexConstraints] == 'tipoRequisicao')
					constraintTipoRequisicao = constraints[indexConstraints].initialValue.toUpperCase();
			}
		}

		switch (constraintTipoRequisicao) {
			case 'GET':
				var dados = [];

				if (constraintCodigo == '')
					dados = JSON.parse(getProdutos(null)); // getProdutosTeste();
				else
					dados = JSON.parse(getProdutos(constraintCodigo));

				if (dados != null && dados.PRODUTOS != undefined) {
					var produtos = dados.PRODUTOS;

					for (var indexDados = 0; indexDados < produtos.length; indexDados++) {
						dsWsProduto.addRow([produtos[indexDados].CODIGO, produtos[indexDados].DESC, produtos[indexDados].TIPO, produtos[indexDados].UM, constraintTipoRequisicao]);
					}
				} else {
					dsWsProduto.addColumn('erro');
					dsWsProduto.addRow(['', '', '', '', constraintTipoRequisicao, 'Erro ao buscar produtos']);
				}
				break;

			case 'POST':

				break;

			default:
				dsWsProduto.addColumn('erro');
				dsWsProduto.addRow(['', '', '', '', constraintTipoRequisicao, 'Erro ao encontrar o tipo de requisição']);
				break;
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

function getProdutos(codigo) {
	var endpoint = codigo == null ? 'PRODUTO' : 'PRODUTO?CODPRODUTO='+codigo;

	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue('WKCompany') + '',
			serviceCode: 'rest_protheus',
			endpoint: endpoint,
			method: 'get',
			timeoutService: '100',
			options: {
				encoding: 'UTF-8',
				mediaType: 'application/json'
			}
		}
		var vo = clientService.invoke(JSON.stringify(data));

		if (vo.getResult() == null || vo.getResult().isEmpty())
			throw new Exception('O retorno está vazio');
		else
			return vo.getResult();
	} catch (e) {
		log.warn('Erro ao enviar requisição: ' + e);
	}
}

function getProdutosTeste() {
	return {
		"_classname": "PROD_FULL",
		"PRODUTOS": [{
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