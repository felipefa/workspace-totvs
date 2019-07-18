/**
 * @authors Autímio e Felipe Araujo
 *
 * dsWsProtheus
 *
 * Constraints:
 * - 'endpoint': Obrigatoriamente deve ser informado pelo menos o endpoint de consulta ao Protheus.
 * - 'filtro': Parte do código ou descrição do item que será buscado no Protheus;
 * - 'tipoFiltro': Tipo do valor passado no filtro, sendo aceitos 'cod' ou 'desc'.
 * - 'tipoRequisicao': Caso o tipo de requisição não seja informado, o seu valor padrão será GET.
 * - 'dados': Os dados devem ser informados de acordo com seu endpoint e o tipo de requisição deve ser POST.
 * 	- Para o cadastro de produto, espera-se um objeto da seguinte forma:
 * 	{
 * 		'PRODUTO': {
 * 			'GRUPO':'0008',
 * 			'TIPO':'EM',
 * 			'DESC':'PRODUTO DE TESTE',
 * 			'UM':'CX',
 * 			'LOCPAD':'01',
 * 			'IPINCM':'62043200',
 * 			'ORIGEM':'0'
 * 		}
 * 	}
 *
 * 	- Para o cadastro de solicitação de compras, espera-se um objeto da seguinte forma:
 * 	{
 * 		'OBJETO': {
 * 			'CCUSTO':'700115',
 * 			'MOTIVO':'16/07/2019',
 * 			'ITENS': [
 * 				{
 * 					'ITEM':'1',
 *	 				'PRODUTO':'002',
 * 					'QUANT':'5',
 * 					'OBS':'Solicitação fluig ID: 15 - Local da necessidade: Unidade Goiânia - Motivo: Motivo da solicitação de compras - Obs.: Observação do item 1 a ser comprado'
 * 				},
 * 				{
 * 					'ITEM':'2',
 *	 				'PRODUTO':'254',
 * 					'QUANT':'42',
 * 					'OBS':'Solicitação fluig ID: 15 - Local da necessidade: Unidade Goiânia - Motivo: Motivo da solicitação de compras - Obs.: Observação do item 2 a ser comprado'
 * 				}
 * 			]
 * 		}
 * 	}
 */
function createDataset(fields, constraints, sortFields) {
	try {
		var constraintDados = '';
		var constraintEndpoint = '';
		var constraintFiltro = '';
		var constraintTipoFiltro = '';
		var constraintTipoRequisicao = '';
		var dataset = DatasetBuilder.newDataset();
		var erro = true;
		var mensagem = '';

		if (constraints != null) {
			for (var indexConstraints = 0; indexConstraints < constraints.length; indexConstraints++) {
				if (constraints[indexConstraints].fieldName == 'dados')
					constraintDados = constraints[indexConstraints].initialValue;
				if (constraints[indexConstraints].fieldName == 'endpoint')
					constraintEndpoint = constraints[indexConstraints].initialValue;
				if (constraints[indexConstraints].fieldName == 'filtro')
					constraintFiltro = constraints[indexConstraints].initialValue;
				if (constraints[indexConstraints].fieldName == 'tipoFiltro')
					constraintTipoFiltro = constraints[indexConstraints].initialValue;
				if (constraints[indexConstraints].fieldName == 'tipoRequisicao')
					constraintTipoRequisicao = constraints[indexConstraints].initialValue;
			}

			log.warn('------------------------ Constraints dsWsProtheus ------------------------');
			log.warn('---Debug dsWsProtheus--- constraintDados: ' + constraintDados);
			log.warn('---Debug dsWsProtheus--- constraintEndpoint: ' + constraintEndpoint);
			log.warn('---Debug dsWsProtheus--- constraintFiltro: ' + constraintFiltro);
			log.warn('---Debug dsWsProtheus--- constraintTipoFiltro: ' + constraintTipoFiltro);
			log.warn('---Debug dsWsProtheus--- constraintTipoRequisicao: ' + constraintTipoRequisicao);
			log.warn('------------------------ ------------------------ ------------------------');

			var dados = null;

			if (constraintEndpoint != '' || constraintEndpoint != null) {
				dados = JSON.parse(
					consultarProtheus(
						constraintEndpoint.trim() + '',
						constraintTipoRequisicao.trim() + '',
						constraintDados.trim() + '',
						constraintFiltro.trim() + '',
						constraintTipoFiltro.trim() + ''
					)
				);

				if (dados != null) {
					if (constraintEndpoint == 'armazem') {
						if (dados.ARMAS != undefined) {
							var armazens = dados.ARMAS;

							dataset.addColumn('codigo');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < armazens.length; indexDados++) {
								dataset.addRow([armazens[indexDados].COD, armazens[indexDados].DESC]);
							}
						} else mensagem = 'Nenhum armazém encontrado';
					} else if (constraintEndpoint == 'ccusto') {
						if (dados.CUSTOS != undefined) {
							var centrosCusto = dados.CUSTOS;

							dataset.addColumn('codigo');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < centrosCusto.length; indexDados++) {
								dataset.addRow([centrosCusto[indexDados].CUSTO, centrosCusto[indexDados].DESC01]);
							}
						} else mensagem = 'Nenhum centro de custo encontrado';
					} else if (constraintEndpoint == 'gruprod') {
						if (dados.GRUPOS != undefined) {
							var grupos = dados.GRUPOS;

							dataset.addColumn('codigo');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < grupos.length; indexDados++) {
								dataset.addRow([grupos[indexDados].GRUPO, grupos[indexDados].DESC]);
							}
						} else mensagem = 'Nenhum tipo de produto encontrado';
					} else if (constraintEndpoint == 'ncm') {
						if (dados.NCMS != undefined) {
							var ncms = dados.NCMS;

							dataset.addColumn('codigo');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < ncms.length; indexDados++) {
								dataset.addRow([ncms[indexDados].COD, ncms[indexDados].DESC]);
							}
						} else mensagem = 'Nenhuma NCM encontrada';
					} else if (constraintEndpoint == 'origem') {
						if (dados.ORIGENS != undefined) {
							var origens = dados.ORIGENS;

							dataset.addColumn('codigo');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < origens.length; indexDados++) {
								dataset.addRow([origens[indexDados].COD, origens[indexDados].DESC]);
							}
						} else mensagem = 'Nenhuma origem encontrada';
					} else if (constraintEndpoint == 'produto') {
						dataset.addColumn('codigo');
						dataset.addColumn('descricao');
						dataset.addColumn('unMedida');
						dataset.addColumn('tipoRequisicao');
						dataset.addColumn('erro');
						dataset.addColumn('mensagem');

						if (constraintTipoRequisicao == 'GET' || constraintTipoRequisicao == '') {
							if (dados.PRODUTOS != undefined) {
								var produtos = dados.PRODUTOS;

								for (var indexDados = 0; indexDados < produtos.length; indexDados++) {
									dataset.addRow([produtos[indexDados].CODIGO, produtos[indexDados].DESC, produtos[indexDados].UM, constraintTipoRequisicao, false, '']);
								}
							} else dataset.addRow(['', '', '', constraintTipoRequisicao, true, 'Nenhum produto encontrado']);
						} else if (constraintTipoRequisicao == 'POST') {
							if (constraintDados == '')
								dataset.addRow(['', '', '', constraintTipoRequisicao, true, 'Não foi possível cadastrar o produto, pois nenhum dado foi informado']);
							else {
								if (dados.cod == 200)
									dataset.addRow(['', dados.desc, '', constraintTipoRequisicao, false, dados.msg]);
								else if (dados.errorCode == 400)
									dataset.addRow(['', '', '', constraintTipoRequisicao, true, dados.errorMessage]);
								else
									dataset.addRow(['', '', '', constraintTipoRequisicao, true, 'Não foi possível cadastrar o produto no Protheus']);
							}
						} else dataset.addRow(['', '', '', constraintTipoRequisicao, true, 'Tipo de requisição não encontrado']);
					} else if (constraintEndpoint == 'solcomp') {
						if (constraintDados == '')
							mensagem = 'Não foi possível cadastrar a solicitação de compras, pois nenhum dado foi informado';
						else {
							if (dados.cod == 200) {
								erro = false;
								mensagem = dados.msg;
							} else mensagem = 'Código: ' + dados.errorCode + ' - Erro: ' + dados.errorMessage;
						}
					} else if (constraintEndpoint == 'tipoprod') {
						if (dados.TIPOS != undefined) {
							var tipos = dados.TIPOS;

							dataset.addColumn('codigo');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < tipos.length; indexDados++) {
								dataset.addRow([tipos[indexDados].CHAVE, tipos[indexDados].DESC]);
							}
						} else mensagem = 'Nenhum tipo de produto encontrado';
					} else if (constraintEndpoint == 'unimed') {
						if (dados != null && dados.UNIMEDS != undefined) {
							var unimeds = dados.UNIMEDS;

							dataset.addColumn('codigo');
							dataset.addColumn('descricao');

							for (var indexDados = 0; indexDados < unimeds.length; indexDados++) {
								dataset.addRow([unimeds[indexDados].UNIMED, unimeds[indexDados].UMRES]);
							}
						} else mensagem = 'Nenhuma unidade de medida encontrada';
					} else mensagem = 'Endpoint não encontrado';
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

/**
 * Faz conexão com o Protheus utilizando o serviço 'rest_protheus' cadastrado no fluig.
 *
 * @param {String} endpoint Nome do endpoint rest do Protheus que será utilizado.
 * @param {String} tipoRequisicao São aceitos GET e POST.
 * @param {String} dados Dados que serão gravados no Protheus.
 * @param {String} filtro Valor que será usado como filtro.
 * @param {String} tipoFiltro Tipo do valor passado como filtro.
 */
function consultarProtheus(endpoint, tipoRequisicao, dados, filtro, tipoFiltro) {
	if (endpoint == '' || endpoint == null) return null;
	if (tipoRequisicao == '' || tipoRequisicao == null) tipoRequisicao = 'GET';

	if (filtro != '' && tipoFiltro != '')
		endpoint += '?FILTRO=' + filtro + '&TIPO=' + tipoFiltro;

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
		log.warn('Erro ao enviar solicitação: ' + e);
	}
}