const beforeSendValidate = (numState, nextState) => {
	// ATIVIDADE 'APROVAR CADASTRO'
	if (numState == 5) {
		const decisao = document.getElementById('decisao').value;

		if (decisao == 'Aprovado') {
			// Fazer integração com Protheus para gravar o produto
		}
	}
}