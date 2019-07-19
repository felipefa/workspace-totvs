$(() => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
	const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
	const currentDate = `${year}-${month}-${day}`;

	esconderUltimaHr('hrItens');

	if (ATIVIDADE == 0) {
		document.getElementById('dtSolicitacao').value = currentDate;
	}

	if (ATIVIDADE == 0 || ATIVIDADE == 4) {
		instanciarAutocomplete('filial');
		instanciarAutocomplete('centroCusto');

		$('[id^=item___]').each(function () {
			const posicao = $(this).prop('id').split('___')[1];
			instanciarAutocomplete('item___' + posicao);
		});

		if (FORM_MODE == 'VIEW') {
			const decisao = document.getElementById('decisao').innerHTML;
			const dtSolicitacao = document.getElementById('dtSolicitacao').innerHTML;

			document.getElementById('dtSolicitacao').innerHTML = transformarDataEmBr(dtSolicitacao);

			if (decisao == 'Ajustar') {
				const dtAprov = document.getElementById('dtAprov').innerHTML;
				document.getElementById('dtAprov').innerHTML = transformarDataEmBr(dtAprov);
				$('#camposProtheusAprov').hide();
			}
		}

		setTimeout(() => {
			// Atribui a data da solicitação como data mínima para a data da necessidade
			document.getElementById('dtNecessidade').min = document.getElementById('dtSolicitacao').value;
		}, 500);

		if (MOBILE != null && MOBILE) {
			document.getElementById('btnIncluirProduto').style.display = 'none';
			document.getElementById('helpIncluirProduto').style.display = 'block';
		}

		$('#centroCusto').blur(function () {
			if ($('#filial').val() == '' || $('#codCentroCusto').val() == '' || $(this.val()) == '') {
				$(this).val('');
				$('#codCentroCusto').val('');
			}
		});

		$('#filial').blur(function () {
			if ($(this).val() == '') {
				$('#centroCusto').val('');
				$('#codCentroCusto').val('');
				$('#codFilial').val('');
			}
		});

		$('#localNecessidade').blur(function () {
			if ($(this).val() == '')
				mostrarLabelErro('localNecessidade', true, 'É necessário preencher este campo.', 'warning');
			else
				mostrarLabelErro('localNecessidade', false, '', 'warning');
		});
	}

	if (ATIVIDADE == 5) {
		document.getElementById('dtAprov').value = currentDate;

		if (FORM_MODE == 'VIEW') {
			const dtSolicitacao = document.getElementById('dtSolicitacao').innerHTML;
			document.getElementById('dtSolicitacao').innerHTML = transformarDataEmBr(dtSolicitacao);
			document.getElementById('dtAprov').innerHTML = `${day}/${month}/${year}`;
		}
	}

	document.getElementById('btnAdicionarItem').onclick = () => {
		const posicao = wdkAddChild('itens');

		esconderUltimaHr('hrItens');
		instanciarAutocomplete('item___' + posicao);

		$('#item___' + posicao).blur(function () {
			if ($(this).val() == '') {
				$('#codItem___' + posicao).val('');
				$('#unMedida___' + posicao).val('');
			}
		});
	};

	document.getElementById('btnIncluirProduto').onclick = () => {
		FLUIGC.message.confirm({
			message: 'Deseja abrir uma nova solicitação para inclusão de um produto?',
			title: 'Incluir Produto?',
			labelYes: 'Confirmar',
			labelNo: 'Cancelar'
		}, (confirmar) => {
			if (confirmar) parent.open(top.WCMAPI.tenantURL + '/pageworkflowview?processID=CadastroDeProduto');
		});
	};
});

const buscarDados = (id, filtro) => {
	const dados = [];
	let endpoint = '';
	let filial = '';

	if (id == 'centroCusto') {
		endpoint = 'ccusto';
		filial = document.getElementById('codFilial').value;
	} else if (id == 'filial') {
		endpoint = 'filial';
	} else if (id.indexOf('item') == 0) {
		endpoint = 'produto';
	}

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
			dados.push({
				value: dado.codigo + ' - ' + dado.descricao,
				codigo: dado.codigo,
				descricao: dado.descricao,
				dados: dado
			});
		});

		if (id = 'filial')
			mostrarLabelErro('filial', false, '', 'warning');

	} else {
		if (id == 'centroCusto') {
			FLUIGC.toast({
				title: 'Atenção!',
				message: `Não existem centros de custos para a filial: ${$('#filial').val()}.`,
				type: 'warning'
			});
		} else if (id == 'filial')
			mostrarLabelErro('filial', true, 'Nenhuma filial encontrada.', 'warning');
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
				if (id.indexOf('item') == 0) {
					const posicao = id.split('___')[1];
					$('#unMedida___' + posicao).val(dado.item.dados.unMedida);
				}
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
			const filial = document.getElementById('codFilial').value;

			if (id == 'centroCusto' && filial == '') {
				FLUIGC.toast({
					title: 'Atenção!',
					message: 'Selecione uma filial.',
					type: 'warning'
				});
			} else {
				const valorElemento = elemento.val();
				elemento.autocomplete('search', valorElemento == '' ? ' ' : valorElemento);
			}
		});
	}
}

const removerItem = (elemento) => {
	fnWdkRemoveChild(elemento);
	esconderUltimaHr('hrItens');
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
	else if (idPai.indexOf('item') == 0)
		document.getElementById('codItem').value = codigo;
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

const verificarQuantidade = (elemento) => {
	if (elemento.value <= 0) {
		elemento.value = '';
		FLUIGC.toast({
			title: 'Atenção!',
			message: 'A quantidade deve ser maior do que 0.',
			type: 'warning'
		});
	}
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