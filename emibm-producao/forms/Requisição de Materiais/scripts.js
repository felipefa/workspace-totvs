$(() => {
	document.getElementById('btnAdicionarItem').onclick = () => {
		wdkAddChild('itens');
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
});

const verificarQuantidade = (elemento) => {
	if (elemento.value <= 0) {
		elemento.value = '';
		FLUIGC.toast({title: 'Atenção!', message: 'A quantidade deve ser maior do que 0.', type: 'warning'});
	}
}