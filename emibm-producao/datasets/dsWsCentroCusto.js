function createDataset(fields, constraints, sortFields) {
	try {
		var dsWsCentroCusto = DatasetBuilder.newDataset();
		var dados = JSON.parse(getCentrosCusto()); // getCentrosCustoTeste();

		dsWsCentroCusto.addColumn('codigo');
		dsWsCentroCusto.addColumn('descricao');

		if (dados != null && dados.CUSTOS != undefined) {
			var centrosCusto = dados.CUSTOS;

			for (var indexDados = 0; indexDados < centrosCusto.length; indexDados++) {
				dsWsCentroCusto.addRow([centrosCusto[indexDados].CUSTO, centrosCusto[indexDados].DESC01]);
			}
		} else {
			dsWsCentroCusto.addColumn('erro');
			dsWsCentroCusto.addRow(['', '', 'Erro ao buscar centros de custo']);
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

function getCentrosCusto() {
	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue('WKCompany') + '',
			serviceCode: 'rest_protheus',
			endpoint: 'CCUSTO',
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

function getCentrosCustoTeste() {
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