var beforeSendValidate = function (numState, nextState) {
	// ATIVIDADE 'INÍCIO'
	if (numState == 0 || numState == 4) {
		// PAINEL 'DADOS DA SOLICITAÇÃO'
		const motivo = document.getElementById('motivo').value;

		// PAINEL 'PRODUTO'
		const descricao = document.getElementById('descricao').value;
		const unMedida = document.getElementById('codUnMedida').value;

		if (!isEmpty(motivo) &&
			!isEmpty(descricao) &&
			!isEmpty(unMedida)) {
			if (descricao.length > 30) {
				FLUIGC.toast({
					title: 'Atenção!',
					message: 'A descrição do produto deve ter no máximo 30 caracteres.',
					type: 'warning'
				});

				return false;
			}
			return true;
		}

		FLUIGC.toast({
			title: 'Atenção!',
			message: 'Preencha todos os campos.',
			type: 'warning'
		});

		return false;
	}

	// ATIVIDADE 'APROVAR CADASTRO'
	if (numState == 5) {
		const decisao = document.getElementById('decisao').value;

		if (decisao == 'Aprovado') {
			// PAINEL 'PRODUTO'
			const descricao = document.getElementById('descricao').value;
			const unMedida = document.getElementById('codUnMedida').value;

			// PAINEL 'APROVAÇÃO'
			const filial = document.getElementById('codFilial').value;
			const grupo = document.getElementById('codGrupo').value;
			const tipo = document.getElementById('codTipo').value;
			const armazem = document.getElementById('codArmazemPad').value;
			const posIpiNcm = document.getElementById('codPosIpiNcm').value;
			const origem = document.getElementById('codOrigem').value;

			// remove label error obs caso aprovado
			mostrarLabelErro('obsAprov', false, '');

			if (!isEmpty(descricao) &&
				!isEmpty(unMedida) &&
				!isEmpty(filial) &&
				!isEmpty(grupo) &&
				!isEmpty(tipo) &&
				!isEmpty(armazem) &&
				!isEmpty(posIpiNcm) &&
				!isEmpty(origem)) {
				// Faz integração com Protheus para gravar o produto
				const dados = JSON.stringify({
					'PRODUTO': {
						'GRUPO': grupo,
						'TIPO': tipo,
						'DESC': descricao.toUpperCase(),
						'UM': unMedida,
						'LOCPAD': armazem,
						'IPINCM': posIpiNcm,
						'ORIGEM': origem,
					}
				});
				const constraintsProtheus = [
					DatasetFactory.createConstraint('endpoint', 'produto', null, ConstraintType.MUST),
					DatasetFactory.createConstraint('tipoRequisicao', 'POST', null, ConstraintType.MUST),
					DatasetFactory.createConstraint('dados', dados, null, ConstraintType.MUST),
				];
				const dsWsProtheus = DatasetFactory.getDataset('dsWsProtheus', null, constraintsProtheus, null);

				if (dsWsProtheus != null && dsWsProtheus.values.length > 0 && !dsWsProtheus.values[0].erro) {
					FLUIGC.toast({
						title: 'OK!',
						message: dsWsProtheus.values[0].mensagem,
						type: 'success'
					});

					return true;
				} else if (dsWsProtheus != null)
					console.log('Erro ao cadastrar produto no Protheus:', dsWsProtheus.values[0].mensagem);

				FLUIGC.toast({
					title: 'Atenção!',
					message: 'Erro ao cadastrar produto no Protheus.',
					type: 'danger'
				});

				return false;
			} else {
				FLUIGC.toast({
					title: 'Atenção!',
					message: 'Preencha todos os campos.',
					type: 'warning'
				});

				return false;
			}
		} else if (!isEmpty(decisao)) {
			const id = 'obsAprov';
			const obsAprov = document.getElementById(id).value;

			if (isEmpty(obsAprov)) {
				const mensagem = MOBILE != null && MOBILE ? 'Preencha a observação da aprovação.' : 'Preencha o motivo da decisão escolhida na aprovação.';
				mostrarLabelErro(id, true, mensagem);

				return false;
			}

			return true;
		}
	}
}