$(() => {
	$('#btnAdicionarItem').click(function () {
		wdkAddChild('itens');
	});

	$('#btnIncluirProduto').click(function () {
		FLUIGC.message.confirm({
			message: 'Deseja abrir uma nova solicitação para inclusão de um produto?',
			title: 'Incluir Produto?',
			labelYes: 'Confirmar',
			labelNo: 'Cancelar'
		}, function(result, el, ev) {
			if (result) parent.open(top.WCMAPI.tenantURL + '/pageworkflowview?processID=CadastroDeProduto');
		});
	});
});