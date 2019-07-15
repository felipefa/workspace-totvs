var beforeSendValidate = function (numState, nextState) {
	// ATIVIDADE 'APROVAR CADASTRO'
	if (numState == 5) {
		const decisao = document.getElementById('decisao').value;

		if (decisao == 'Aprovado') {
			// const codigo = document.getElementById('codigo').value;
			const grupo = document.getElementById('codGrupo').value;
			const tipo = document.getElementById('codTipo').value;
			const descricao = document.getElementById('descricao').value;
			const unMedida = document.getElementById('codUnMedida').value;
			const armazem = document.getElementById('codArmazemPad').value;
			const posIpiNcm = document.getElementById('codPosIpiNcm').value;
			const origem = document.getElementById('codOrigem').value;

			if (grupo != '' && tipo != '' && descricao != '' && unMedida != ''
				&& armazem != '' && posIpiNcm != '' && origem != ''
				&& grupo != null && tipo != null && descricao != null && unMedida != null
				&& armazem != null && posIpiNcm != null && origem != null) {
				// Faz integração com Protheus para gravar o produto
				const dados = JSON.stringify({
					'PRODUTO': {
						// 'COD': codigo.toUpperCase(),
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
				} else if (dsWsProtheus != null) {
					console.log('Erro ao cadastrar produto no Protheus:', dsWsProtheus.values[0].mensagem);
				}

				FLUIGC.toast({
					title: 'Atenção!',
					message: 'Erro ao cadastrar produto no Protheus.',
					type: 'danger'
				});

				return false;
			}
		} else if (decisao != '' && decisao != null) {
			const obsAprov = document.getElementById('obsAprov').value;

			if (obsAprov == '' || obsAprov == null) {
				const mensagem = MOBILE != null && MOBILE ? 'Preencha a observação da aprovação.' : 'Preencha o motivo da decisão escolhida na aprovação.';

				FLUIGC.toast({
					title: 'Atenção!',
					message: mensagem,
					type: 'warning'
				});

				return false;
			}

			return true;
		}
	}
}