/**
 * @author Felipe Araujo
 *
 * dsWsConsultaUsuario
 * Verifica se um email passado por constraint possui cadastro no Protheus e
 * retorna os centros de custo do usuário encontrado caso necessário.
 *
 * @param constraints
 * - buscarCC (padrão: true)
 * 	Caso seja informado 'false', o dataset retornará apenas o id do usuário que possui o email buscado.
 * - email (obrigatório)
 * 	Email do usuário que deve ser buscado no Protheus.
 * - filial
 * 	Código da filial da empresa que será usado para filtrar os centros de custo disponíveis.
 */
function createDataset(fields, constraints, sortFields) {
	try {
		log.warn('------------------------ dsWsConsultaUsuario ------------------------');

		var constraintBuscarCC = true;
		var constraintEmail = '';
		var dsWsConsultaUsuario = DatasetBuilder.newDataset();
		var mensagem = 'Nenhuma constraint informada';
		var sucesso = false;

		dsWsConsultaUsuario.addColumn('sucesso');
		dsWsConsultaUsuario.addColumn('mensagem');

		if (constraints != null) {
			for (var indexConstraints = 0; indexConstraints < constraints.length; indexConstraints++) {
				if (constraints[indexConstraints].fieldName == 'buscarCC')
					constraintBuscarCC = constraints[indexConstraints].initialValue;
				if (constraints[indexConstraints].fieldName == 'email')
					constraintEmail = constraints[indexConstraints].initialValue;
			}

			log.warn('------------------------ Constraints dsWsConsultaUsuario ------------------------');
			log.warn('---Debug dsWsProtheus--- constraintBuscarCC: ' + constraintBuscarCC);
			log.warn('---Debug dsWsProtheus--- constraintEmail: ' + constraintEmail);
			log.warn('------------------------ ------------------------------- ------------------------');

			if (constraintEmail != '') {
				var retornoProtheus = JSON.parse(consultarProtheus('users', ''));

				if (retornoProtheus != null) {
					var usuarios = retornoProtheus.resources;
					var usuarioEncontrado = false;

					for (var indexUsuarios = 0; indexUsuarios < usuarios.length; indexUsuarios++) {
						var emails = usuarios[indexUsuarios].emails;

						for (var indexEmails = 0; indexEmails < emails.length; indexEmails++) {
							var email = emails[indexEmails].value;

							if (email == constraintEmail + '' && !usuarioEncontrado) {
								var id = usuarios[indexUsuarios].id;

								usuarioEncontrado = true;

								dsWsConsultaUsuario.addColumn('id');
								dsWsConsultaUsuario.addColumn('email');

								if (constraintBuscarCC) {
									// Se encontrar o usuário com o email informado, busca seus centros de custo se a constraintBuscarCC for true
									retornoProtheus = JSON.parse(consultarProtheus('userxcc', id));

									if (retornoProtheus != null) {
										var centrosCusto = retornoProtheus.CCUSTO;
										var codigosCC = [];
										var codigosFiliais = [];

										if (centrosCusto) {
											for (var indexCC = 0; indexCC < centrosCusto.length; indexCC++) {
												codigosCC.push(centrosCusto[indexCC].CODIGO);
												codigosFiliais.push(centrosCusto[indexCC].FILIAL);
											}
										}

										sucesso = true;
										mensagem = 'Centros de custo consultados com sucesso';
										dsWsConsultaUsuario.addColumn('centroCusto');
										dsWsConsultaUsuario.addColumn('filial');

										dsWsConsultaUsuario.addRow([sucesso, mensagem, id, email, JSON.stringify(codigosCC), JSON.stringify(codigosFiliais)]);
									}
								} else {
									// Retorna apenas o id do usuário no Protheus se a constraintBuscarCC for false
									sucesso = true;
									mensagem = 'Usuário encontrado';
									dsWsConsultaUsuario.addRow([sucesso, mensagem, id, email]);
								}
							}
						}
					}

					if (!usuarioEncontrado) {
						mensagem = 'Nenhum usuário com o email ' + constraintEmail + ' foi encontrado';
						dsWsConsultaUsuario.addRow([sucesso, mensagem]);
					}
				} else {
					mensagem = 'Nenhum dado encontrado na consulta ao Protheus';
					dsWsConsultaUsuario.addRow([sucesso, mensagem]);
				}
			} else {
				mensagem = 'Nenhum email informado';
				dsWsConsultaUsuario.addRow([sucesso, mensagem]);
			}
		} else {
			dsWsConsultaUsuario.addRow([sucesso, mensagem]);
		}

		return dsWsConsultaUsuario;
	} catch (e) {
		log.warn('--Debug dsWsConsultaUsuario-- Erro: ' + e + '; Linha: ' + e.lineNumber);
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
 * @param {String} id Código do usuário no Protheus, usado apenas com o endpoint 'userxcc'.
 */
function consultarProtheus(endpoint, id, filial) {
	if (endpoint == '' || endpoint == null) return null;
	else if (endpoint == 'userxcc') {
		if (id != '') {
			endpoint += '?ID=' + id;
		} else return null;
	} else if (endpoint == 'users') {
		endpoint += '?atributes=emails,id';
	}

	log.warn('----- Debug dsWsConsultaUsuario ----- endpoint: ' + endpoint);

	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue('WKCompany') + '',
			serviceCode: 'rest_protheus',
			endpoint: endpoint,
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
		else {
			// log.warn('----- Debug dsWsConsultaUsuario ----- consultarProtheus: ' + vo.getResult());
			return vo.getResult();
		}
	} catch (e) {
		log.warn('----- Debug dsWsConsultaUsuario ----- Erro ao consultar Protheus: ' + e);
	}
}