var CENTROSCUSTO = [];
var FILIAIS = [];

$(() => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
	const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
	const currentDate = `${year}-${month}-${day}`;

	esconderUltimaHr('hrItens');

	// ATIVIDADE 'INÍCIO'
	if (ATIVIDADE == 0)
		document.getElementById('dtSolicitacao').value = currentDate;

	// ATIVIDADE 'INÍCIO'
	if (ATIVIDADE == 0 || ATIVIDADE == 4) {
		if (FORM_MODE == 'VIEW') {
			const decisao = document.getElementById('decisao').innerHTML;
			const dtNecessidade = document.getElementById('dtNecessidade').innerHTML;
			const dtSolicitacao = document.getElementById('dtSolicitacao').innerHTML;

			document.getElementById('dtNecessidade').innerHTML = transformarDataEmBr(dtNecessidade);
			document.getElementById('dtSolicitacao').innerHTML = transformarDataEmBr(dtSolicitacao);

			if (decisao == 'Ajustar') {
				const dtAprov = document.getElementById('dtAprov').innerHTML;
				document.getElementById('dtAprov').innerHTML = transformarDataEmBr(dtAprov);
				$('#camposProtheusAprov').hide();
			}
		} else {
			const constraintUsuario = [DatasetFactory.createConstraint('email', top.WCMAPI.userEmail, null, ConstraintType.MUST)];
			const dsWsConsultaUsuario = DatasetFactory.getDataset('dsWsConsultaUsuario', null, constraintUsuario, null);

			if (dsWsConsultaUsuario != null && dsWsConsultaUsuario.values.length > 0 && dsWsConsultaUsuario.values[0].sucesso) {
				CENTROSCUSTO = JSON.parse(dsWsConsultaUsuario.values[0].centroCusto);
				FILIAIS = JSON.parse(dsWsConsultaUsuario.values[0].filial);
			}

			if (FILIAIS.length > 0 && CENTROSCUSTO.length > 0) {
				// Remove possíveis códigos repetidos
				FILIAIS = FILIAIS.filter((cod, index) => {
					return FILIAIS.indexOf(cod) === index;
				});
				CENTROSCUSTO = CENTROSCUSTO.filter((cod, index) => {
					return CENTROSCUSTO.indexOf(cod) === index;
				});
			} else {
				// Usuário não possui centros de custo no Protheus
				$('#alerta').show();
				$('#filial').attr('disabled', true);
				$('#centroCusto').attr('disabled', true);
			}

			instanciarAutocomplete('filial');
			instanciarAutocomplete('centroCusto');

			$('[id^=item___]').each(function () {
				const posicao = $(this).prop('id').split('___')[1];
				instanciarAutocomplete('item___' + posicao);
			});

			setTimeout(() => {
				// Atribui a data da solicitação como data mínima para a data da necessidade
				document.getElementById('dtNecessidade').min = document.getElementById('dtSolicitacao').value;
			}, 500);

			$('#dtNecessidade').blur(function () {
				if ($(this).val() == '')
					mostrarLabelErro('dtNecessidade', true, 'Informe uma data.');
				else
					mostrarLabelErro('dtNecessidade', false, '');
			});

			$('#localNecessidade').blur(function () {
				if ($(this).val() == '')
					mostrarLabelErro('localNecessidade', true, 'Informe um local.');
				else
					mostrarLabelErro('localNecessidade', false, '');
			});

			$('#centroCusto').blur(function () {
				if ($('#filial').val() == '' || $('#codCentroCusto').val() == '' || $(this).val() == '') {
					$(this).val('');
					$('#codCentroCusto').val('');
					mostrarLabelErro('centroCusto', true, 'Informe um centro de custo.');
				} else
					mostrarLabelErro('centroCusto', false, '');
			});

			$('#filial').blur(function () {
				if ($(this).val() == '') {
					$('#centroCusto').val('');
					$('#codCentroCusto').val('');
					$('#codFilial').val('');
					mostrarLabelErro('filial', true, 'Informe uma filial.');
				} else
					mostrarLabelErro('filial', false, '');
			});

			$('#motivo').blur(function () {
				if ($(this).val() == '')
					mostrarLabelErro('motivo', true, 'Informe o motivo da solicitação de compras.');
				else
					mostrarLabelErro('motivo', false, '');
			});
		}

		if (MOBILE != null && MOBILE) {
			document.getElementById('btnIncluirProduto').style.display = 'none';
			document.getElementById('helpIncluirProduto').style.display = 'block';
		}
	}

	// ATIVIDADE 'APROVAR SOLICITAÇÃO'
	if (ATIVIDADE == 5) {
		if (FORM_MODE == 'VIEW') {
			const dtNecessidade = document.getElementById('dtNecessidade').innerHTML;
			const dtSolicitacao = document.getElementById('dtSolicitacao').innerHTML;

			document.getElementById('dtAprov').innerHTML = `${day}/${month}/${year}`;
			document.getElementById('dtNecessidade').innerHTML = transformarDataEmBr(dtNecessidade);
			document.getElementById('dtSolicitacao').innerHTML = transformarDataEmBr(dtSolicitacao);
		} else {
			document.getElementById('dtAprov').value = currentDate;

			$('#decisao').blur(function () {
				if (isEmpty($(this).val()))
					mostrarLabelErro('decisao', true, 'É necessário informar uma decisão.');
				else
					mostrarLabelErro('decisao', false, '');
				$('#obsAprov').blur();
			});

			$('#obsAprov').blur(function () {
				const decisao = document.getElementById('decisao').value;

				if (isEmpty($(this).val()) && decisao != 'Aprovado')
					mostrarLabelErro('obsAprov', true, 'É necessário informar o motivo da reprovação ou necessidade de ajuste.');
				else
					mostrarLabelErro('obsAprov', false, '');
			});
		}
	}

	// ATIVIDADES 'LANÇAR E FINALIZAR' OU 'CANCELAR E FINALIZAR'
	if (ATIVIDADE == 9 || ATIVIDADE == 11) {
		if (FORM_MODE == 'VIEW') {
			const dtAprov = document.getElementById('dtAprov').innerHTML;
			const dtNecessidade = document.getElementById('dtNecessidade').innerHTML;
			const dtSolicitacao = document.getElementById('dtSolicitacao').innerHTML;

			document.getElementById('dtAprov').innerHTML = transformarDataEmBr(dtAprov);
			document.getElementById('dtNecessidade').innerHTML = transformarDataEmBr(dtNecessidade);
			document.getElementById('dtSolicitacao').innerHTML = transformarDataEmBr(dtSolicitacao);
		}
	}

	document.getElementById('btnAdicionarItem').onclick = () => {
		const posicao = wdkAddChild('itens');

		esconderUltimaHr('hrItens');
		instanciarAutocomplete(`item___${posicao}`);
	};

	document.getElementById('btnIncluirProduto').onclick = () => {
		FLUIGC.message.confirm({
			message: 'Deseja abrir uma nova solicitação para inclusão de um produto?',
			title: 'Incluir Produto?',
			labelYes: 'Confirmar',
			labelNo: 'Cancelar'
		}, (confirmar) => {
			if (confirmar)
				parent.open(top.WCMAPI.tenantURL + '/pageworkflowview?processID=CadastroDeProduto');
		});
	};
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

	if (id == 'centroCusto') {
		endpoint = 'ccusto';
		filial = document.getElementById('codFilial').value;
	} else if (id == 'filial')
		endpoint = 'filial';
	else if (id.indexOf('item') == 0)
		endpoint = 'produto';

	const tipoFiltro = isNaN(filtro) ? 'desc' : 'cod';
	const constraints = [
		DatasetFactory.createConstraint('endpoint', endpoint, null, ConstraintType.MUST),
		DatasetFactory.createConstraint('filtro', filtro, null, ConstraintType.MUST),
		DatasetFactory.createConstraint('tipoFiltro', tipoFiltro, null, ConstraintType.MUST),
		DatasetFactory.createConstraint('filial', filial, null, ConstraintType.MUST),
	];
	const dsWsProtheus = DatasetFactory.getDataset('dsWsProtheus', null, constraints, null);

	if (dsWsProtheus != null && dsWsProtheus.values.length > 0 && !dsWsProtheus.values[0].erro) {
		dsWsProtheus.values.forEach(dado => {
			if (id == 'centroCusto') {
				CENTROSCUSTO.forEach(centroCusto => {
					if (centroCusto == dado.codigo) {
						dados.push({
							value: dado.codigo + ' - ' + dado.descricao,
							codigo: dado.codigo,
							descricao: dado.descricao,
							dados: dado
						});
					}
				});
			} else if (id == 'filial') {
				FILIAIS.forEach(filial => {
					if (filial == dado.codigo) {
						dados.push({
							value: dado.codigo + ' - ' + dado.descricao,
							codigo: dado.codigo,
							descricao: dado.descricao,
							dados: dado
						});
					}
				});
			} else {
				dados.push({
					value: dado.codigo + ' - ' + dado.descricao,
					codigo: dado.codigo,
					descricao: dado.descricao,
					dados: dado
				});
			}
		});

		if (id = 'filial')
			mostrarLabelErro(id, false, '');

	} else {
		if (id == 'centroCusto')
			mostrarLabelErro(id, true, `Não existem centros de custos para a filial: ${$('#filial').val()}.`);
		else if (id == 'filial')
			mostrarLabelErro(id, true, 'Nenhuma filial encontrada.');
	}

	return dados;
}

/**
 * Esconde o último elemento hr do pai filho.
 *
 * @param {String} id Id da tag hr no pai filho com underscore sem a posição. Exemplo: 'item___'.
 * @param {String} ultimaPosicao Última posição do pai filho.
 */
const esconderUltimaHr = (id) => {
	$('[id^=' + id + ']').each(function () {
		$(this).show();
	});
	$('[id^=' + id + ']:last').hide();
}

/**
 * Instancia um autocomplete em um input do tipo text de acordo com o id informado.
 *
 * @param {String} id Id do input onde deve ser instanciado um autocomplete.
 */
const instanciarAutocomplete = (id) => {
	const elemento = $('#' + id);

	if (elemento != null) {
		elemento.autocomplete({
			minlength: 0,
			source: (req, res) => {
				res(buscarDados(id, req.term == ' ' ? '' : req.term));
			},
			select: (evento, dado) => {
				elemento.val(dado.item.descricao);
				setInputCodigo(id, dado.item.codigo);
				mostrarLabelErro(id, false, '');

				if (id.indexOf('item') == 0) {
					const posicao = id.split('___')[1];
					$('#unMedida___' + posicao).val(dado.item.dados.unMedida);
				} else if (id == 'filial') {
					$('#centroCusto').val('');
				}

				return false;
			},
			close: (evento) => {
				if (evento.handleObj.type != 'menuselect') {
					let label = 'label[for=' + id + ']';

					if (id.indexOf('item') == 0) label = 'label[for=item]';

					const campo = $(label)[0].innerText.toLowerCase();

					elemento.val('');
					setInputCodigo(id, '');
					elemento.blur();

					if (evento.handleObj.type != 'input')
						mostrarLabelErro(id, true, `Uma opção de ${campo} deve ser selecionada.`, id.indexOf('item') == 0 ? 'id' : 'class');
				} else {
					mostrarLabelErro(id, false, '', id.indexOf('item') == 0 ? 'id' : 'class');
				}
			},
		}).click(() => {
			const filial = document.getElementById('codFilial').value;

			if (id == 'centroCusto' && filial == '') {
				mostrarLabelErro('filial', true, 'Selecione uma filial.');
			} else {
				const valorElemento = elemento.val();
				elemento.autocomplete('search', valorElemento == '' ? ' ' : valorElemento);
			}
		});
	}
}

/**
 * Função responsável pela representação da mensagem de erro no momento da validação.
 *
 * @param {string} elemento identificador do campo
 * @param {string} bool true: apresenta erro, false: remove erro.
 * @param {string} text texto apresentado na tag <p>
 */
function mostrarLabelErro(elemento, bool, text, tipo = 'class') {
	if (tipo == 'class') {
		if (bool) {
			$(`.help-block-${elemento}`).text(text)
			$(`#${elemento}`).parent().addClass('has-error');
			$(`.help-block-${elemento}`).show();
		} else {
			$(`#${elemento}`).parent().removeClass('has-error');
			$(`.help-block-${elemento}`).hide();
		}
	} else {
		if (bool) {
			$(`#hb_${elemento}`).text(text)
			$(`#${elemento}`).parent().addClass('has-error');
			$(`#hb_${elemento}`).show();
		} else {
			$(`#${elemento}`).parent().removeClass('has-error');
			$(`#hb_${elemento}`).hide();
		}
	}
}

/**
 * Remove uma linha da tabela pai e filho.
 *
 * @param {Object} elemento Elemento do DOM com o botão de remover.
 */
const removerItem = (elemento) => {
	if (ATIVIDADE == 0 || ATIVIDADE == 4) {
		fnWdkRemoveChild(elemento);
		esconderUltimaHr('hrItens');
	} else {
		FLUIGC.toast({
			title: 'Atenção!',
			message: 'Não é possível excluir um item nesta atividade.',
			type: 'warning'
		});
	}
}

/**
 * Atribui valor do código de um item de acordo com seu idPai
 *
 * @param {String} idPai Id do campo que responsável pelo código
 * @param {String} codigo Valor do código
 */
const setInputCodigo = (idPai, codigo) => {
	if (idPai == 'centroCusto')
		document.getElementById('codCentroCusto').value = codigo;
	else if (idPai == 'filial')
		document.getElementById('codFilial').value = codigo;
	else if (idPai.indexOf('item') == 0) {
		const posicao = idPai.split('___')[1];
		document.getElementById('codItem___' + posicao).value = codigo;
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
 * Verifica se um item foi removido e limpa os campos relacionados caso tenha sido.
 *
 * @param {Object} elemento Input que possui o item que havia sido selecionado.
 */
const verificarItem = (elemento) => {
	const posicao = elemento.id.split('___')[1];

	if (isEmpty(elemento.value)) {
		$('#codItem___' + posicao).val('');
		$('#unMedida___' + posicao).val('');
		mostrarLabelErro(elemento.id, true, 'Um produto deve ser selecionado.', 'id');
	} else {
		const codigo = $('#codItem___' + posicao);
		const elemCodigos = document.querySelectorAll('[id^="codItem___"]');
		let encontrou = false;

		elemCodigos.forEach(elemCodigo => {
			const posicaoCodigo = elemCodigo.id.split('___')[1];

			if (elemCodigo.value === codigo.val() && posicao !== posicaoCodigo)
				encontrou = true;
		});

		if (encontrou) {
			const item = document.getElementById('item___' + posicao);
			mostrarLabelErro(elemento.id, true, item.value + ' já está na lista.', 'id');
			codigo.val('');
			item.value = '';
			document.getElementById('unMedida___' + posicao).value = '';
		} else
			mostrarLabelErro(elemento.id, false, '', 'id');
	}
}

/**
 * Verifica se a quantidade de itens é maior que 0.
 *
 * @param {Object} elemento Input que possui a quantidade de itens.
 */
const verificarQuantidade = (elemento) => {
	if (elemento.value <= 0) {
		elemento.value = '';
		mostrarLabelErro(elemento.id, true, 'A quantidade deve ser maior do que 0.', 'id');
	} else
		mostrarLabelErro(elemento.id, false, '', 'id');
}