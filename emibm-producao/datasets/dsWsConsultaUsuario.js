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

		var constraintEmail = '';
		var dsWsConsultaUsuario = DatasetBuilder.newDataset();
		var mensagem = 'Erro desconhecido no dsWsConsultaUsuario';
		var sucesso = false;

		dsWsConsultaUsuario.addColumn('idProtheus');
		dsWsConsultaUsuario.addColumn('nome');
		dsWsConsultaUsuario.addColumn('email');
		dsWsConsultaUsuario.addColumn('sucesso');
		dsWsConsultaUsuario.addColumn('mensagem');
		dsWsConsultaUsuario.addColumn('centroCusto');
		dsWsConsultaUsuario.addColumn('filial');

		if (constraints != null) {
			for (var indexConstraints = 0; indexConstraints < constraints.length; indexConstraints++) {
				if (constraints[indexConstraints].fieldName == 'email')
					constraintEmail = constraints[indexConstraints].initialValue;
			}

			log.warn('------------------------ Constraints dsWsConsultaUsuario ------------------------');
			log.warn('----- Debug dsWsConsultaUsuario ----- constraintEmail: ' + constraintEmail);
			log.warn('------------------------ ------------------------------- ------------------------');
		}

		var retornoProtheus = JSON.parse(consultarProtheus('users', ''));

		if (retornoProtheus != null) {
			var usuarios = retornoProtheus.resources;
			var usuarioEncontrado = false;

			for (var indexUsuarios = 0; indexUsuarios < usuarios.length; indexUsuarios++) {
				var emails = usuarios[indexUsuarios].emails;
				var id = usuarios[indexUsuarios].id;
				var nome = usuarios[indexUsuarios].displayName;

				for (var indexEmails = 0; indexEmails < emails.length; indexEmails++) {
					var email = emails[indexEmails].value;

					if ((constraintEmail == '' || (constraintEmail != '' && email == constraintEmail + '')) && !usuarioEncontrado) {
						usuarioEncontrado = true;

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
							mensagem = 'Usuário encontrado';

							dsWsConsultaUsuario.addRow([id, nome, email, sucesso, mensagem, JSON.stringify(codigosCC), JSON.stringify(codigosFiliais)]);
						} else {
							mensagem = 'Nenhum dado encontrado na consulta de centros de custos do usuário ' + id + ' - ' + nome + ' no Protheus';
							dsWsConsultaUsuario.addRow(['', '', '', sucesso, mensagem, '', '']);
						}
					} else
						usuarioEncontrado = false;
				}
			}

			if (!usuarioEncontrado && constraintEmail != '') {
				mensagem = 'Nenhum usuário com o email ' + constraintEmail + ' foi encontrado';
				dsWsConsultaUsuario.addRow(['', '', '', sucesso, mensagem, '', '']);
			}
		} else {
			mensagem = 'Nenhum dado encontrado na consulta de usuários do Protheus';
			dsWsConsultaUsuario.addRow(['', '', '', sucesso, mensagem, '', '']);
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
function consultarProtheus(endpoint, id) {
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
			companyId: '1', // Erro ao usar getValue('WKCompany') + '' no onSync,
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
		else
			return vo.getResult();
	} catch (e) {
		log.warn('----- Debug dsWsConsultaUsuario ----- Erro ao consultar Protheus: ' + e);
	}
}