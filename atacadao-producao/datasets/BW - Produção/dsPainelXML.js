function createDataset(fields, constraints, sortFields) {
	try {
		log.warn('===== Debug DsPainelXML =====');

		var dataset = DatasetBuilder.newDataset();

		dataset.addColumn('solicitacao');
		dataset.addColumn('tipoSolicitacao');
		dataset.addColumn('tipoDemanda');
		dataset.addColumn('dataInicio');
		dataset.addColumn('responsavel');
		dataset.addColumn('fornecedor');
		dataset.addColumn('atividade');
		dataset.addColumn('noPrazo');
		dataset.addColumn('emAndamento');
		dataset.addColumn('dataConclusao');
		dataset.addColumn('contabil');

		var atividadeConstraint = null;
		var noPrazoConstraint = null;
		var demandaConstraint = null;
		var dataInicioConstraint = null;
		var dataConclusaoConstraint = null;
		var tipoSolicitacaoConstraint = null;
		var emAndamentoConstraint = null;
		var contabilConstraint = null;
		var fornecedorConstraint = null;
		var responsavelConstraint = null;

		if (constraints != null) {
			for (var c = 0; c < constraints.length; c++) {
				if (constraints[c].fieldName == 'atividade')
					atividadeConstraint = constraints[c].initialValue;

				if (constraints[c].fieldName == 'noPrazo')
					noPrazoConstraint = constraints[c].initialValue;

				if (constraints[c].fieldName == 'demanda')
					demandaConstraint = constraints[c].initialValue;

				if (constraints[c].fieldName == 'dataInicio')
					dataInicioConstraint = constraints[c].initialValue;

				if (constraints[c].fieldName == 'dataConclusao')
					dataConclusaoConstraint = constraints[c].initialValue;

				if (constraints[c].fieldName == 'tipoSolicitacao')
					tipoSolicitacaoConstraint = constraints[c].initialValue;

				if (constraints[c].fieldName == 'emAndamento')
					emAndamentoConstraint = constraints[c].initialValue;

				if (constraints[c].fieldName == 'contabil')
					contabilConstraint = constraints[c].initialValue;

				if (constraints[c].fieldName == 'fornecedor')
					fornecedorConstraint = constraints[c].initialValue;

				if (constraints[c].fieldName == 'responsavel')
					responsavelConstraint = constraints[c].initialValue;
			}
		}

		// Busca todas as solicitações de AtendimentoXML
		var consWP = [
			DatasetFactory.createConstraint('processId', 'AtendimentoXML', 'AtendimentoXML', ConstraintType.MUST)
		];

		var dsWP = DatasetFactory.getDataset('workflowProcess', null, consWP, null);

		if (dsWP.rowsCount > 0) {

			// Percorre todas as solicitações encontradas
			for (var wp = 0; wp < dsWP.rowsCount; wp++) {

				// Data inicial
				var dtadsWP = dsWP.getValue(wp, 'startDateProcess');
				var dtbWP = new java.lang.String(dtadsWP);
				var dtcWP = dtbWP.split(' ')[0].split('-').reverse().join('/');
				var dtdWP = dtbWP.split(' ')[1];

				if (dataInicioConstraint) {
					dataInicioConstraint = dataInicioConstraint.split('-').reverse().join('/');
					if (transformaTimeStamp(dtcWP, 'dd/mm/yyyy') < transformaTimeStamp(dataInicioConstraint, 'yyyy/mm/dd'))
						continue;
				}

				var documentId = dsWP.getValue(wp, 'cardDocumentId');
				var solicitacao = dsWP.getValue(wp, 'workflowProcessPK.processInstanceId');
				var tipoSolicitacao = '';
				var tipoDemanda = '';
				var dataInicio = dtcWP + ' as ' + dtdWP.substr(0, dtdWP.indexOf('.'));
				var responsavel = '';
				var fornecedor = '';
				var prazo = '';
				var atendimento = '';
				var atividade = [];
				var dataConclusao = '';
				var contabil = '';

				var achou = false;

				// Verifica se o processo está ativo
				if (dsWP.getValue(wp, 'active') + '' == 'true') {
					atendimento = 'Sim'
					dataConclusao = 'Em Andamento'

					// Busca a versão ativa do processo que está sendo percorrido
					var consWH = [
						DatasetFactory.createConstraint('processHistoryPK.processInstanceId', solicitacao, solicitacao, ConstraintType.MUST),
						DatasetFactory.createConstraint('active', true, true, ConstraintType.MUST)
					];

					var dsWH = DatasetFactory.getDataset('processHistory', null, consWH, null);

					// Armazena a atividade em que se encontra o processo
					if (dsWH.rowsCount > 0) {
						for (var wh = 0; wh < dsWH.rowsCount; wh++)
							atividade.push(validaAtividade(dsWH.getValue(wh, 'stateSequence')));
					}

				} else {
					// Processo encerrado
					atendimento = 'Não';
					atividade.push('Fim');

					// Busca data e hora em que o processo foi concluido
					var dta = dsWP.getValue(wp, 'endDateProcess');
					var dtb = new java.lang.String(dta);
					var dtc = dtb.split(' ')[0].split('-').reverse().join('/');
					var dtd = dtb.split(' ')[1];
					
					if (dataConclusaoConstraint) {
						dataConclusaoConstraint = dataConclusaoConstraint.split('-').reverse().join('/');
						if (transformaTimeStamp(dtc, 'dd/mm/yyyy') > transformaTimeStamp(dataConclusaoConstraint, 'yyyy/mm/dd'))
							continue;
					}

					dataConclusao = dtc + ' as ' + dtd.substr(0, dtd.indexOf('.'));
				}

				if (emAndamentoConstraint && emAndamentoConstraint != atendimento)
					continue;

				if (atividadeConstraint) {
					achou = false;
					var atividades = atividadeConstraint.split(',');

					for (var i = 0; i < atividades.length; i++) {
						for (var j = 0; j < atividade.length; j++) {
							if (atividades[i] == atividade[j])
								achou = true;
						}
					}

					if (!achou)
						continue;
				}

				var consWH2 = [
					DatasetFactory.createConstraint('processHistoryPK.processInstanceId', solicitacao, solicitacao, ConstraintType.MUST),
					DatasetFactory.createConstraint('stateSequence', '17', '17', ConstraintType.MUST)
				];

				var dsWH2 = DatasetFactory.getDataset('processHistory', null, consWH2, null);

				if (dsWH2.rowsCount > 0)
					prazo = 'Não';
				else
					prazo = 'Sim'

				if (noPrazoConstraint && noPrazoConstraint != prazo)
					continue;

				var consWH3 = [
					DatasetFactory.createConstraint('processHistoryPK.processInstanceId', solicitacao, solicitacao, ConstraintType.MUST),
					DatasetFactory.createConstraint('stateSequence', '43', '43', ConstraintType.MUST)
				];

				var dsWH3 = DatasetFactory.getDataset('processHistory', null, consWH3, null);

				if (dsWH3.rowsCount > 0)
					contabil = 'Não';
				else
					contabil = 'Sim';

				if (contabilConstraint && contabilConstraint != contabil)
					continue;

				var consForm = [
					DatasetFactory.createConstraint('documentid', documentId, documentId, ConstraintType.MUST)
				];

				var dsForm = DatasetFactory.getDataset('dsAtendimentoXML', null, consForm, null);

				if (dsForm.rowsCount > 0) {
					tipoSolicitacao = validaTipo('' + dsForm.getValue(0, 'radioTipo'));

					if (tipoSolicitacaoConstraint) {
						achou = false;
						var tipos = tipoSolicitacaoConstraint.split(',');

						for (var index = 0; index < tipos.length; index++) {
							if (tipos[index] == tipoSolicitacao)
								achou = true;
						}

						if (!achou)
							continue;
					}

					var arrayTipoDemanda = [];

					if ('' + dsForm.getValue(0, 'checkQuantidade') == 'on')
						arrayTipoDemanda.push('Quantidade');

					if ('' + dsForm.getValue(0, 'checkFornecedor') == 'on')
						arrayTipoDemanda.push('Fornecedor');

					if ('' + dsForm.getValue(0, 'checkSemPedido') == 'on')
						arrayTipoDemanda.push('Sem Pedido');

					if ('' + dsForm.getValue(0, 'checkForaLinha') == 'on')
						arrayTipoDemanda.push('Item Fora de Linha');

					if ('' + dsForm.getValue(0, 'checkContabil') == 'on')
						arrayTipoDemanda.push('Contábil');

					if ('' + dsForm.getValue(0, 'checkPreco') == 'on')
						arrayTipoDemanda.push('Preço');

					if ('' + dsForm.getValue(0, 'checkCadastro') == 'on')
						arrayTipoDemanda.push('Cadastro');

					if ('' + dsForm.getValue(0, 'checkNotaRejDen') == 'on')
						arrayTipoDemanda.push('Nota Rejeitada / Denegada');

					if ('' + dsForm.getValue(0, 'checkPendNotaDeneg') == 'on')
						arrayTipoDemanda.push('Pendências Notas de Devolução');

					if ('' + dsForm.getValue(0, 'checkCadServUsoConsum') == 'on')
						arrayTipoDemanda.push('Cadastro Serviços Uso/Consumo');

					if ('' + dsForm.getValue(0, 'checkAjstTribut') == 'on')
						arrayTipoDemanda.push('Ajuste Tributação');

					if ('' + dsForm.getValue(0, 'checkTribNov') == 'on')
						arrayTipoDemanda.push('Tributação Produtos Novos');

					if ('' + dsForm.getValue(0, 'checkDemaisPendencias') == 'on')
						arrayTipoDemanda.push('Demais Pendências');

					tipoDemanda = arrayTipoDemanda.join(' / ');

					if (demandaConstraint) {
						achou = false;
						var demandas = demandaConstraint.split(',');

						for (var i = 0; i < demandas.length; i++) {
							if (tipoDemanda.indexOf(demandas[i]) != -1)
								achou = true;
						}

						if (!achou)
							continue;
					}

					responsavel = dsForm.getValue(0, 'zoomDemandaPara');

					if (responsavelConstraint) {
						achou = false;
						var responsaveis = responsavelConstraint.split(',');

						for (var index = 0; index < responsaveis.length; index++) {
							if (responsaveis[index] == responsavel)
								achou = true;
						}

						if (!achou)
							continue;
					}

					fornecedor = dsForm.getValue(0, 'fornecedor');

					if (fornecedorConstraint) {
						achou = false;
						var fornecedores = fornecedorConstraint.split(',');

						for (var index = 0; index < fornecedores.length; index++) {
							if (fornecedores[index] == fornecedor)
								achou = true;
						}

						if (!achou)
							continue;
					}
				}

				var descAtv = atividade.join(' / ');

				dataset.addRow([
					solicitacao,
					tipoSolicitacao,
					tipoDemanda,
					dataInicio,
					responsavel,
					fornecedor,
					descAtv,
					prazo,
					atendimento,
					dataConclusao,
					contabil
				]);
			}
		}

		return dataset;
	} catch (e) {
		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn('erro');
		dataset.addRow([e.toString()]);
		return dataset;
	}
}

function validaAtividade(stateSequence) {
	var state = stateSequence + '';

	switch (state) {
		case '4':
			return 'Início'
		case '56':
			return 'Analisar Solução da Demanda Contábil';
		case '43':
			return 'Atender a Demanda Contabil';
		case '15':
			return 'Atender a Demanda Comercial';
		case '17':
			return 'Atender a Demanda Comercial Atrasada';
		case '21':
			return 'Verificar a Demanda Comercial Atrasada';
		case '23':
			return 'Cobrar a Demanda Comercial Atrasada';
		case '29':
			return 'Analisar Solução da Demanda Comercial';
	}
}

function validaData(time) {
	if (time != '' && time != 'null') {
		return time.split(' ')[0].split('-').reverse().join('/');
	} else {
		return 'Não Finalizado';
	}
}

function validaTipo(tipo) {
	switch (tipo) {
		case 'naPorta':
			return 'Na porta';
		case 'antecipacao':
			return 'Antecipação NF';
		default:
			return 'Tipo não encontrado';
	}
}

/**
 * Transforma datas em timeStamp.
 * 
 * @param {data} data -> Data padrão a ser transformada em timeStamp
 */
function transformaTimeStamp(data, formato) {
	switch (formato) {
		case 'dd/mm/yyyy':
			var dataSplit = data.split('/');
			var novaData = dataSplit[1] + '/' + dataSplit[0] + '/' + dataSplit[2];
			return new Date(novaData).getTime();
	
		case 'yyyy/mm/dd':
			var dataSplit = data.split('/');
			var novaData = dataSplit[1] + '/' + dataSplit[2] + '/' + dataSplit[0];
			return new Date(novaData).getTime();

		default:
			log.warn('===== Debug DsPainelXML ===== transformaTimeStamp: Formato não encontrado');
			break;
	}	
}