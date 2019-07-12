function createDataset(fields, constraints, sortFields) {
	try {
		var dsWsGravaSolicitacao = DatasetBuilder.newDataset();
		var constraintDados = null;

		dsWsGravaSolicitacao.addColumn('sucesso');
		dsWsGravaSolicitacao.addColumn('msg');

		if (constraints != null) {
			for (var indexConstraints = 0; indexConstraints < constraints.length; indexConstraints++) {
				if (constraints[indexConstraints].fieldName == 'dados')
					constraintDados = constraints[indexConstraints].initialValue;
			}
		}

		if (constraintDados == null) {
			dsWsProduto.addRow([false, 'Não foi possível cadastrar a requisição de materiais, pois nenhum dado foi informado']);
		} else {
			var resposta = JSON.parse(enviarRequisicao(constraintDados));
			if (resposta != null && resposta.cod == 200)
				dsWsProduto.addRow([true, resposta.msg]);
			else if (resposta != null && resposta.errorCode == 400)
				dsWsProduto.addRow([false, resposta.errorMessage]);
			else
				dsWsProduto.addRow([false, 'Não foi possível cadastrar a requisição de materiais no Protheus']);
		}

		return datasetGravaProtocolacao;
	} catch (e) {
		log.warn('--Debug-- Erro : ' + e + ' ' + e.lineNumber);
		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn('Erro');
		dataset.addColumn('Linha');
		dataset.addRow(new Array(e, e.lineNumber));
		return dataset;
	}
}

function enviarRequisicao(dados) {
	if (dados == null) return null;
	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue('WKCompany') + '',
			serviceCode: 'rest_protheus',
			endpoint: 'solarm',
			method: 'post',
			timeoutService: '100',
			options: {
				encoding: 'UTF-8',
				mediaType: 'application/json'
			},
			params: JSON.parse(dados)
		}
		var vo = clientService.invoke(JSON.stringify(data));

		if (vo.getResult() == null || vo.getResult().isEmpty())
			throw new Exception('Retorno está vazio');
		else
			return vo.getResult();
	} catch (e) {
		log.warn('Erro ao gravar dados: ' + e);
	}
}