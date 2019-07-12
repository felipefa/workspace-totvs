function createDataset(fields, constraints, sortFields) {
	try {
		var constraintCodigo = '';
		var constraintDados = '';
		var constraintEndpoint = '';
		var constraintSqlLimit = 55000;
		var constraintTipoRequisicao = '';
		var dataset = DatasetBuilder.newDataset();
		var erro = true;
		var mensagem = '';

		if (constraints != null) {
			for (var indexConstraints = 0; indexConstraints < constraints.length; indexConstraints++) {
				if (constraints[indexConstraints].fieldName == 'codigo')
					constraintCodigo = constraints[indexConstraints].initialValue;
				if (constraints[indexConstraints].fieldName == 'dados')
					constraintDados = constraints[indexConstraints].initialValue;
				if (constraints[indexConstraints].fieldName == 'endpoint')
					constraintEndpoint = constraints[indexConstraints].initialValue;
				// if (constraints[indexConstraints].fieldName == 'sqlLimit')
					//constraintSqlLimit = constraints[indexConstraints].initialValue;
				if (constraints[indexConstraints].fieldName == 'tipoRequisicao')
					constraintTipoRequisicao = constraints[indexConstraints].initialValue;
			}

			 log.warn('---Debug dsWsProtheus--- constraintCodigo: '+constraintCodigo);
			 log.warn('---Debug dsWsProtheus--- constraintDados: '+constraintDados);
			 log.warn('---Debug dsWsProtheus--- constraintEndpoint: '+constraintEndpoint);
			 log.warn('---Debug dsWsProtheus--- constraintSqlLimit: '+constraintSqlLimit);
			 log.warn('---Debug dsWsProtheus--- constraintTipoRequisicao: '+constraintTipoRequisicao);

			var dados = null;

			if (constraintEndpoint != '' || constraintEndpoint != null) {
				dados = JSON.parse(consultarProtheus(constraintEndpoint.trim() + '', constraintTipoRequisicao.trim() + '', constraintCodigo.trim() + '', constraintDados.trim() + ''));

				if (dados != null) {
					if (constraintEndpoint == 'armazem') {
						if (dados.ARMAS != undefined) {
							var armazens = dados.ARMAS;

							dataset.addColumn('codigo');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < armazens.length && indexDados < constraintSqlLimit; indexDados++) {
								dataset.addRow([armazens[indexDados].COD, armazens[indexDados].DESC]);
							}
						} else {
							mensagem = 'Nenhum armazém encontrado';
						}
					} else if (constraintEndpoint == 'ccusto') {
						if (dados.CUSTOS != undefined) {
							var centrosCusto = dados.CUSTOS;

							dataset.addColumn('codigo');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < centrosCusto.length && indexDados < constraintSqlLimit; indexDados++) {
								dataset.addRow([centrosCusto[indexDados].CUSTO, centrosCusto[indexDados].DESC01]);
							}
						} else {
							mensagem = 'Nenhum centro de custo encontrado';
						}
					} else if (constraintEndpoint == 'gruprod') {
						if (dados.GRUPOS != undefined) {
							var grupos = dados.GRUPOS;

							dataset.addColumn('chave');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < grupos.length && indexDados < constraintSqlLimit; indexDados++) {
								dataset.addRow([grupos[indexDados].GRUPO, grupos[indexDados].DESC]);
							}
						} else {
							mensagem = 'Nenhum tipo de produto encontrado';
						}
					} else if (constraintEndpoint == 'ncm') {
						if (dados.NCMS != undefined) {
							var ncms = dados.NCMS;

							dataset.addColumn('chave');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < ncms.length && indexDados < constraintSqlLimit; indexDados++) {
								dataset.addRow([ncms[indexDados].COD, ncms[indexDados].DESC]);
							}
						} else {
							mensagem = 'Nenhuma NCM encontrada';
						}
					} else if (constraintEndpoint == 'origem') {
						if (dados.ORIGENS != undefined) {
							var origens = dados.ORIGENS;

							dataset.addColumn('chave');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < origens.length && indexDados < constraintSqlLimit; indexDados++) {
								dataset.addRow([origens[indexDados].COD, origens[indexDados].DESC]);
							}
						} else {
							mensagem = 'Nenhuma origem encontrada';
						}
					} else if (constraintEndpoint == 'produto') {
						dataset.addColumn('codigo');
						dataset.addColumn('descricao');
						dataset.addColumn('tipo');
						dataset.addColumn('unMedida');
						dataset.addColumn('tipoRequisicao');
						dataset.addColumn('erro');
						dataset.addColumn('mensagem');

						if (constraintTipoRequisicao == 'GET' || constraintTipoRequisicao == '') {
							if (dados.PRODUTOS != undefined) {
								var produtos = dados.PRODUTOS;

								for (var indexDados = 0; indexDados < produtos.length && indexDados < constraintSqlLimit; indexDados++) {
									dataset.addRow([produtos[indexDados].CODIGO, produtos[indexDados].DESC, produtos[indexDados].TIPO, produtos[indexDados].UM, constraintTipoRequisicao, false, '']);
								}
							} else {
								dataset.addRow(['', '', '', '', constraintTipoRequisicao, true, 'Nenhum produto encontrado']);
							}
						} else if (constraintTipoRequisicao == 'POST') {
							if (constraintDados == '')
								dataset.addRow(['', '', '', '', constraintTipoRequisicao, true, 'Não foi possível cadastrar o produto, pois nenhum dado foi informado']);
							else {
								if (dados.cod == 200)
									dataset.addRow(['', dados.desc, '', '', constraintTipoRequisicao, false, dados.msg]);
								else if (dados.errorCode == 400)
									dataset.addRow(['', '', '', '', constraintTipoRequisicao, true, dados.errorMessage]);
								else
									dataset.addRow(['', '', '', '', constraintTipoRequisicao, true, 'Não foi possível cadastrar o produto no Protheus']);
							}
						} else {
							dataset.addRow(['', '', '', '', constraintTipoRequisicao, true, 'Tipo de requisição não encontrado']);
						}
					} else if (constraintEndpoint == 'solarma') {
						if (constraintDados == '')
							mensagem = 'Não foi possível cadastrar a requisição de materiais, pois nenhum dado foi informado';
						else {
							if (dados.cod == 200) {
								erro = false;
								mensagem = dados.msg;
							} else
								mensagem = dados.errorMessage;
							// else
							// 	mensagem = 'Não foi possível cadastrar a requisição de materiais no Protheus';
						}
					} else if (constraintEndpoint == 'tipoprod') {
						if (dados.TIPOS != undefined) {
							var tipos = dados.TIPOS;

							dataset.addColumn('chave');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < tipos.length && indexDados < constraintSqlLimit; indexDados++) {
								dataset.addRow([tipos[indexDados].CHAVE, tipos[indexDados].DESC]);
							}
						} else {
							mensagem = 'Nenhum tipo de produto encontrado';
						}
					} else if (constraintEndpoint == 'unimed') {
						if (dados != null && dados.UNIMEDS != undefined) {
							var unimeds = dados.UNIMEDS;

							dataset.addColumn('chave');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < unimeds.length && indexDados < constraintSqlLimit; indexDados++) {
								dataset.addRow([unimeds[indexDados].UNIMED, unimeds[indexDados].UMRES]);
							}
						} else {
							mensagem = 'Nenhuma unidade de medida encontrada';
						}
					} else {
						mensagem = 'O endpoint informado não foi encontrado';
					}
				}
			}
		}

		if (constraintEndpoint == '' || constraintEndpoint == null)
			mensagem = 'É necessário informar pelo menos um endpoint';

		if (mensagem != '') {
			dataset.addColumn('erro');
			dataset.addColumn('mensagem');
			dataset.addRow([erro, mensagem]);
		}

		return dataset;
	} catch (e) {
		log.warn('--Debug dsWsProtheus-- Erro: ' + e + '; Linha: ' + e.lineNumber);
		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn('Erro');
		dataset.addColumn('Linha');
		dataset.addRow([e, e.lineNumber]);
		return dataset;
	}
}

function consultarProtheus(endpoint, tipoRequisicao, codigo, dados) {
	if (endpoint == '' || endpoint == null) return null;
	if (tipoRequisicao == '' || tipoRequisicao == null) tipoRequisicao = 'GET';

	if (codigo != '' && endpoint == 'produto')
		endpoint += '?CODPRODUTO=' + codigo;

	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue('WKCompany') + '',
			serviceCode: 'rest_protheus',
			endpoint: endpoint,
			method: tipoRequisicao,
			timeoutService: '100',
			options: {
				encoding: 'UTF-8',
				mediaType: 'application/json'
			}
		}

		if (dados != '')
			data['params'] = JSON.parse(dados);

		var vo = clientService.invoke(JSON.stringify(data));

		if (vo.getResult() == null || vo.getResult().isEmpty())
			throw new Exception('O retorno está vazio');
		else
			return vo.getResult();
	} catch (e) {
		log.warn('Erro ao enviar requisição: ' + e);
	}
}