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

	if (ATIVIDADE == 5) {
		document.getElementById('dtAprov').value = currentDate;
	}

	document.getElementById('btnAdicionarItem').onclick = () => {
		wdkAddChild('itens');
		esconderUltimaHr('hrItens');
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

	setTimeout(() => {
		// Atribui a data da solicitação como data mínima para a data da necessidade
		document.getElementById('dtNecessidade').min = document.getElementById('dtSolicitacao').value;
	}, 500);

	if (MOBILE != null && MOBILE) {
		document.getElementById('btnIncluirProduto').style.display = 'none';
		document.getElementById('helpIncluirProduto').style.display = 'block';
	}
});

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

const removerItem = (elemento) => {
	fnWdkRemoveChild(elemento);
	esconderUltimaHr('hrItens');
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