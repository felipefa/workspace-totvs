$(() => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
	const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
	const currentDate = `${year}-${month}-${day}`;

	if (ATIVIDADE == 0) {
		document.getElementById('dtSolicitacao').value = currentDate;
	}

	if (ATIVIDADE == 0 || ATIVIDADE == 4) {
		instanciarAutocomplete('grupo');
		instanciarAutocomplete('tipo');
		instanciarAutocomplete('unMedida');
	}

	if (ATIVIDADE == 5) {
		document.getElementById('dtAprov').value = currentDate;
		instanciarAutocomplete('armazem');
		instanciarAutocomplete('posIpiNcm');
		instanciarAutocomplete('origem');
		const decisao = document.getElementById('decisao');
		setTimeout(() => verificarDecisao(decisao), 1000);
	}
});


const buscarDados = (id, filtro) => {
	const dados = [];
	let endpoint = '';

	switch (id) {
		case 'grupo':
			endpoint = 'gruprod';
			break;
		case 'tipo':
			endpoint = 'tipoprod';
			break;
		case 'unMedida':
			endpoint = 'unimed';
			break;
		case 'armazem':
			endpoint = 'armazem';
			break;
		case 'posIpiNcm':
			endpoint = 'ncm';
			break;
		case 'origem':
			endpoint = 'origem';
			break;
	}

	const tipoFiltro = isNaN(filtro) ? 'desc' : 'cod';
	const constraints = [
		DatasetFactory.createConstraint('endpoint', endpoint, null, ConstraintType.MUST),
		DatasetFactory.createConstraint('filtro', filtro, null, ConstraintType.MUST),
		DatasetFactory.createConstraint('tipoFiltro', tipoFiltro, null, ConstraintType.MUST)
	];
	const dsWsProtheus = DatasetFactory.getDataset('dsWsProtheus', null, constraints, null);

	if (dsWsProtheus != null && dsWsProtheus.values.length > 0 && !dsWsProtheus.values[0].erro) {
		dsWsProtheus.values.forEach(dado => {
			dados.push({
				value: dado.codigo + ' - ' + dado.descricao,
				codigo: dado.codigo,
				descricao: dado.descricao
			});
		});
	}

	return dados;
}

const instanciarAutocomplete = (id) => {
	const elemento = $('#' + id);
	let position = {
		my: 'left bottom',
		at: 'left top'
	};

	if (MOBILE != null && MOBILE) {
		position = {
			my: 'left top',
			at: 'left bottom'
		};
	}

	if (elemento != null) {
		elemento.autocomplete({
			delay: 500,
			minlength: 0,
			position: position,
			source: (req, res) => {
				res(buscarDados(id, req.term.trim()));
			},
			select: (evento, dado) => {
				elemento.val(dado.item.descricao);
				setInputCodigo(id, dado.item.codigo);
				return false;
			},
			close: (evento) => {
				if (evento.handleObj.type != 'menuselect') {
					const campo = $('label[for=' + id + ']')[0].innerText.toLowerCase();

					elemento.val('');
					setInputCodigo(id, '');

					if (evento.handleObj.type != 'input') {
						FLUIGC.toast({
							title: 'Atenção!',
							message: 'Uma opção de ' + campo + ' deve ser selecionada.',
							type: 'warning'
						});
					}
				}
			},
		}).click(() => {
			elemento.autocomplete('search', ' ');
		});
	}
}

/**
 * Função para verificar se a string é nula | vazia | indefinida
 *
 * @param {object} value valor a ser verificado.
 *
 * @return {boolean} true: é vazia, false: existe valor.
 */
const isEmpty = (value) => {
	if (value == null || value === '' || typeof value === 'undefined')
		return true;

	return false;
}

const setInputCodigo = (idPai, codigo) => {
	switch (idPai) {
		case 'grupo':
			document.getElementById('codGrupo').value = codigo;
			break;
		case 'tipo':
			document.getElementById('codTipo').value = codigo;
			break;
		case 'unMedida':
			document.getElementById('codUnMedida').value = codigo;
			break;
		case 'armazem':
			document.getElementById('codArmazemPad').value = codigo;
			break;
		case 'posIpiNcm':
			document.getElementById('codPosIpiNcm').value = codigo;
			break;
		case 'origem':
			document.getElementById('codOrigem').value = codigo;
			break;
	}
}

const transformarDescricao = (elemento) => {
	elemento.value = elemento.value.toUpperCase();
}

/**
 * Altera a borda e label do campo vazio para vermelhas.
 *
 * @param {Object} input Elemento do DOM que deve ser validado.
 *
 * @returns {Boolean} True se o campo estiver vazio.
 */
const validarCampoVazio = (input) => {
	if (isEmpty(input.value) && !input.prop('readonly')) {
		input.parent().addClass('has-error');
		return true;
	} else {
		input.parent().removeClass('has-error');
		return false;
	}
}

const verificarDecisao = (elemento) => {
	if (elemento.value == 'Aprovado') {
		$('#armazem').attr('readonly', false).autocomplete('enable');
		$('#posIpiNcm').attr('readonly', false).autocomplete('enable');
		$('#origem').attr('readonly', false).autocomplete('enable');
	} else {
		$('#armazem').val('').attr('readonly', true).autocomplete('disable');
		$('#posIpiNcm').val('').attr('readonly', true).autocomplete('disable');
		$('#origem').val('').attr('readonly', true).autocomplete('disable');
	}
}