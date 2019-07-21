var beforeSendValidate = function (numState, nextState) {
	const loading = FLUIGC.loading(window);

	// ATIVIDADE 'INÍCIO'
	if (numState == 0 || numState == 4) {
		let vazio = false;

		$('input, select, textarea').not('readonly, :hidden').each(function () {
			const elemento = $(this);
			if (isEmpty(elemento.val()) && !elemento.prop('readonly')) {
				elemento.blur();
				vazio = true;
			}
		});

		if (vazio) {
			FLUIGC.toast({
				title: 'Atenção!',
				message: 'Preencha todos os campos.',
				type: 'warning'
			});

			return false;
		}

		return true;
	}

	// ATIVIDADE 'APROVAR SOLICITAÇÃO'
	if (numState == 5) {
		const decisao = document.getElementById('decisao').value;

		loading.show();

		if (decisao == 'Aprovado') {
			const dtNecessidade = document.getElementById('dtNecessidade').value;
			const localNecessidade = document.getElementById('localNecessidade').value;
			const filial = document.getElementById('codFilial').value;
			const centroCusto = document.getElementById('codCentroCusto').value;
			const motivo = document.getElementById('motivo').value;
			const quantidadeItens = $('[id^=item___]').length;

			if (!isEmpty(dtNecessidade) &&
				!isEmpty(localNecessidade) &&
				!isEmpty(filial) &&
				!isEmpty(centroCusto) &&
				!isEmpty(motivo) &&
				quantidadeItens != 0) {
				// Faz integração com Protheus para gravar a solicitação de compras
				const solicitacaoFluig = document.getElementById('solicitacaoFluig').value;
				const itens = [];

				$('[id^=item___]').each(function (index) {
					const item = $(this);
					const posicaoPaiFilho = item.prop('id').split('___')[1];
					const obs = $(`#obsItem___${posicaoPaiFilho}`).val();

					itens.push({
						'ITEM': index + 1 + '',
						'PRODUTO': $(`#codItem___${posicaoPaiFilho}`).val(),
						'QUANT': $(`#quantidade___${posicaoPaiFilho}`).val(),
						'OBS': `ID fluig: ${solicitacaoFluig} - Local: ${localNecessidade} - Motivo: ${motivo} - Obs.: ${obs}`.toUpperCase()
					});
				});

				const dados = JSON.stringify({
					'OBJETO': {
						'CC': centroCusto,
						'FIL': filial,
						'MOTIVO': transformarDataEmBr(dtNecessidade),
						'ITENS': itens
					}
				});
				const constraintsSolicitacao = [
					DatasetFactory.createConstraint('endpoint', 'solcomp', null, ConstraintType.MUST),
					DatasetFactory.createConstraint('tipoRequisicao', 'POST', null, ConstraintType.MUST),
					DatasetFactory.createConstraint('dados', dados, null, ConstraintType.MUST),
				];
				const dsWsProtheus = DatasetFactory.getDataset('dsWsProtheus', null, constraintsSolicitacao, null);

				if (dsWsProtheus != null && dsWsProtheus.values.length > 0 && !dsWsProtheus.values[0].erro) {
					FLUIGC.toast({
						title: 'OK!',
						message: dsWsProtheus.values[0].mensagem,
						type: 'success'
					});

					document.getElementById('solicitacaoProtheus').value = dsWsProtheus.values[0].solicitacao;

					loading.hide();

					return true;
				} else if (dsWsProtheus != null) {
					console.log('Erro ao cadastrar solicitação de compras no Protheus:', dsWsProtheus.values[0].mensagem);
				}

				FLUIGC.toast({
					title: 'Atenção!',
					message: 'Erro ao cadastrar solicitação de compras no Protheus.',
					type: 'warning'
				});

				loading.hide();

				return false;
			}
		} else if (!isEmpty(decisao)) {
			const obsAprov = document.getElementById('obsAprov').value;

			if (obsAprov == '' || obsAprov == null) {
				FLUIGC.toast({
					title: 'Atenção!',
					message: 'Preencha o motivo da decisão escolhida na aprovação.',
					type: 'warning'
				});

				loading.hide();

				return false;
			}

			loading.hide();

			return true;
		}

		FLUIGC.toast({
			title: 'Atenção!',
			message: 'Informe uma decisão na aprovação.',
			type: 'warning'
		});

		loading.hide();

		return false;
	}
}

/**
 * Função para verificar se a string é nula | vazia | indefinida
 *
 * @param {object} value valor a ser verificado.
 *
 * @return {boolean} true: é vazia, false: existe valor.
 */
function isEmpty(value) {
	if (value == null || value === '' || typeof value === 'undefined')
		return true;

	return false;
}