$(() => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
	const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
	const currentDate = `${year}-${month}-${day}`;

	// ATIVIDADE 'INÍCIO'
	if (ATIVIDADE == 0)
		document.getElementById('dtSolicitacao').value = currentDate;

	// ATIVIDADE 'INÍCIO'
	if (ATIVIDADE == 0 || ATIVIDADE == 4) {
		if (FORM_MODE == 'VIEW') {
			const decisao = document.getElementById('decisao').innerHTML;
			const dtSolicitacao = document.getElementById('dtSolicitacao').innerHTML;

			document.getElementById('dtSolicitacao').innerHTML = transformarDataEmBr(dtSolicitacao);

			if (decisao == 'Ajustar') {
				const dtAprov = document.getElementById('dtAprov').innerHTML;
				document.getElementById('dtAprov').innerHTML = transformarDataEmBr(dtAprov);
				$('#camposProtheusAprov').hide();
			}
		} else {
			instanciarAutocomplete('grupo');
			instanciarAutocomplete('tipo');
			instanciarAutocomplete('unMedida');

			$('#motivo').blur(function () {
				const id = 'motivo';

				if ($(this).val() == '')
					mostrarLabelErro(id, true, 'Informe o motivo da solicitação de compras.');
				else
					mostrarLabelErro(id, false, '');
			});

			$('#descricao').blur(function () {
				const id = 'descricao';

				if ($(this).val() == '')
					mostrarLabelErro(id, true, 'Informe uma descrição para o produto.');
				else
					mostrarLabelErro(id, false, '');
			});
		}
	}

	// ATIVIDADE 'APROVAR CADASTRO'
	if (ATIVIDADE == 5) {
		const decisao = document.getElementById('decisao');

		document.getElementById('dtAprov').value = currentDate;
		instanciarAutocomplete('filial');
		instanciarAutocomplete('armazem');
		instanciarAutocomplete('posIpiNcm');
		instanciarAutocomplete('origem');
		verificarDecisao(decisao);

		if (FORM_MODE == 'VIEW') {
			const dtSolicitacao = document.getElementById('dtSolicitacao').innerHTML;
			document.getElementById('dtSolicitacao').innerHTML = transformarDataEmBr(dtSolicitacao);
			document.getElementById('dtAprov').innerHTML = `${day}/${month}/${year}`;
		}
	}

	// ATIVIDADES 'CADASTRAR E FINALIZAR' OU 'CANCELAR E FINALIZAR'
	if (ATIVIDADE == 9 || ATIVIDADE == 11) {
		if (FORM_MODE == 'VIEW') {
			const decisao = document.getElementById('decisao').innerHTML;
			const dtAprov = document.getElementById('dtAprov').innerHTML;
			const dtSolicitacao = document.getElementById('dtSolicitacao').innerHTML;

			document.getElementById('dtSolicitacao').innerHTML = transformarDataEmBr(dtSolicitacao);
			document.getElementById('dtAprov').innerHTML = transformarDataEmBr(dtAprov);

			if (decisao == 'Reprovado')
				$('#camposProtheusAprov').hide();
		}
	}
});

/**
 * Busca os dados do Protheus de acordo com o campo e o valor informados.
 *
 * @param {String} id Id do input que receberá o autocomplete.
 * @param {String} filtro Valor que deve ser buscado no Protheus.
 */
const buscarDados = (id, filtro) => {
	const dados = [];
	let endpoint = '';
	let filial = '';

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
		case 'filial':
			endpoint = 'filial';
			break;
		case 'armazem':
			endpoint = 'armazem';
			filial = document.getElementById('codFilial').value;
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
		DatasetFactory.createConstraint('tipoFiltro', tipoFiltro, null, ConstraintType.MUST),
		DatasetFactory.createConstraint('filial', filial, null, ConstraintType.MUST)
	];
	const dsWsProtheus = DatasetFactory.getDataset('dsWsProtheus', null, constraints, null);

	if (dsWsProtheus != null && dsWsProtheus.values.length > 0 && !dsWsProtheus.values[0].erro) {
		dsWsProtheus.values.forEach(dado => {
			dados.push({
				value: dado.codigo + ' - ' + dado.descricao,
				codigo: dado.codigo,
				descricao: dado.descricao,
				dados: dado
			});
		});

		if (id = 'filial')
			mostrarLabelErro('filial', false, '');

	} else {
		if (id == 'armazem')
			mostrarLabelErro(id, true, `Não existem armazéns para a filial: ${$('#filial').val()}.`);
		else if (id == 'filial')
			mostrarLabelErro('filial', true, 'Nenhuma filial encontrada.');
	}

	return dados;
}

/**
 * Instancia um autocomplete em um input do tipo text de acordo com o id informado.
 *
 * @param {String} id Id do input onde deve ser instanciado um autocomplete.
 */
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
			minlength: 0,
			position: position,
			source: (req, res) => {
				res(buscarDados(id, req.term.trim()));
			},
			select: (evento, dado) => {
				elemento.val(dado.item.descricao);
				setInputCodigo(id, dado.item.codigo);
				mostrarLabelErro(id, false, '');

				if (id == 'filial')
					$('#armazem').val('');

				return false;
			},
			close: (evento) => {
				if (evento.handleObj.type != 'menuselect') {
					const campo = $('label[for=' + id + ']')[0].innerText.toLowerCase();

					elemento.val('');
					setInputCodigo(id, '');

					if (evento.handleObj.type != 'input')
						mostrarLabelErro(id, true, `Uma opção de ${campo} deve ser selecionada.`);
				}
			},
		}).click(() => {
			const filial = document.getElementById('codFilial').value;

			if (id == 'armazem' && filial == '') {
				mostrarLabelErro('filial', true, 'Selecione uma filial.');
			} else {
				const valorElemento = elemento.val();
				elemento.autocomplete('search', valorElemento == '' ? ' ' : valorElemento);
			}
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

/**
 * Função responsável pela busca dos fornecedores que responderam o pedido.
 *
 * @param {string} elemento identificador do campo
 * @param {string} bool true: apresenta erro, false: remove erro.
 * @param {string} text texto apresentado na tag <p>
 * @return {void} retorno vazio.
 */
function mostrarLabelErro(elemento, bool, text) {
	if (bool) {
		$(`.help-block-${elemento}`).text(text)
		$(`#${elemento}`).parent().addClass('has-error');
		$(`.help-block-${elemento}`).show();
	} else {
		$(`#${elemento}`).parent().removeClass('has-error');
		$(`.help-block-${elemento}`).hide();
	}
}

/**
 * Atribui valor do código de um item de acordo com seu idPai
 *
 * @param {String} idPai Id do campo que responsável pelo código
 * @param {String} codigo Valor do código
 */
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
		case 'filial':
			document.getElementById('codFilial').value = codigo;
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

/**
 * Formata uma string de data para o padrão brasileiro dd/mm/yyyy.
 *
 * @param {String} data Data no formato yyyy-mm-dd.
 */
const transformarDataEmBr = (data) => {
	const arrayData = data.split('-');
	return `${arrayData[2]}/${arrayData[1]}/${arrayData[0]}`
}

/**
 * Transforma o valor de um campo para apenas letras maiúsculas.
 *
 * @param {Object} input Elemento do DOM que terá seu valor transformado.
 */
const transformarDescricao = (input) => {
	input.value = input.value.toUpperCase();
}

/**
 * Libera os campos Armazém, Pos. IPI/NCM e Origem para preenchimento caso o cadastro esteja aprovado.
 * Senão bloqueia esses campos e remove seus valores.
 *
 * @param {Object} select Elemento do DOM que possui a opção escolhida pelo usuário.
 */
const verificarDecisao = (select) => {
	if (select.value == 'Aprovado') {
		$('#filial').attr('readonly', false).autocomplete('enable');
		$('#armazem').attr('readonly', false).autocomplete('enable');
		$('#posIpiNcm').attr('readonly', false).autocomplete('enable');
		$('#origem').attr('readonly', false).autocomplete('enable');
	} else {
		const campos = ['filial', 'armazem', 'posIpiNcm', 'origem'];

		campos.forEach(campo => {
			$('#' + campo).val('').attr('readonly', true).autocomplete('disable');
			setInputCodigo(campo, '');
		});
	}
}