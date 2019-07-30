function createDataset(fields, constraints, sortFields) {
	try {
		var dados = null;
		var dsWsProduto = DatasetBuilder.newDataset();
		var sucesso = false;
		var constraintLimitarDados = false; // false faz o serviço retornar todos os produtos, true trás só os 5 primeiros
		var mensagem = 'Erro desconhecido no dsWsProduto';

		dsWsProduto.addColumn('codigo');
		dsWsProduto.addColumn('descricao');
		dsWsProduto.addColumn('unMedida');
		dsWsProduto.addColumn('sucesso');
		dsWsProduto.addColumn('mensagem');

		if (constraints != null) {
			for (var indexConstraints = 0; indexConstraints < constraints.length; indexConstraints++) {
				if (constraints[indexConstraints].fieldName == 'limite')
					constraintLimitarDados = constraints[indexConstraints].initialValue;
			}
		}

		dados = JSON.parse(integracaoProdutos(constraintLimitarDados));

		log.warn('--Debug dsWsProduto-- dados: ' + JSON.stringify(dados));

		if (dados != null && dados.PRODUTOS != undefined) {
			var produtos = dados.PRODUTOS;

			sucesso = true;
			mensagem = 'Produto encontrado';

			for (var indexDados = 0; indexDados < produtos.length; indexDados++) {
				dsWsProduto.addRow([produtos[indexDados].CODIGO, produtos[indexDados].DESC, produtos[indexDados].UM, sucesso, mensagem]);
			}
		} else {
			mensagem = 'Nenhum dado encontrado na consulta ao Protheus';
			dsWsUsuariosProtheus.addRow(['', '', '', sucesso, mensagem]);
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

function integracaoProdutos(limitarDados) {
	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: '1', // Erro ao usar getValue('WKCompany') + '',
			serviceCode: 'rest_protheus',
			endpoint: 'PRODUTO?LIMITE=' + limitarDados,
			method: 'GET',
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