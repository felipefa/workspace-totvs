function createDataset(fields, constraints, sortFields) {
	try {
		var dsWsArmazem = DatasetBuilder.newDataset();
		var dados = JSON.parse(getArmazens()); // getArmazensTeste();

		dsWsArmazem.addColumn('codigo');
		dsWsArmazem.addColumn('descricao');

		if (dados != null && dados.ARMAZENS != undefined) {
			var armazens = dados.ARMAZENS;

			for (var indexDados = 0; indexDados < armazens.length; indexDados++) {
				dsWsArmazem.addRow([armazens[indexDados].COD, armazens[indexDados].DESC]);
			}
		} else {
			dsWsArmazem.addColumn('erro');
			dsWsArmazem.addRow(['', '', 'Erro ao buscar armazéns']);
		}

		return dsWsArmazem;
	} catch (e) {
		log.warn('--Debug dsWsArmazem-- Erro: ' + e + '; Linha: ' + e.lineNumber);
		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn('Erro');
		dataset.addColumn('Linha');
		dataset.addRow([e, e.lineNumber]);
		return dataset;
	}
}

function getArmazens() {
	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue('WKCompany') + '',
			serviceCode: 'rest_protheus',
			endpoint: 'ARMAZEM',
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

function getArmazensTeste() {
	return {
		"_classname": "ARMAZEM_FULL",
		"ARMAZENS": [{
				"_classname": "ARMAZEM",
				"COD": "01",
				"DESC": "Armazém 001"
			},
			{
				"_classname": "ARMAZEM",
				"COD": "05",
				"DESC": "Armazém 002"
			}
		]
	}
}