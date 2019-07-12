function validateForm(form) {
	var atividade = getValue('WKNumState');
	var msg = '';

	if (atividade == 0 || atividade == 4) {
		// PAINEL 'DADOS DA SOLICITAÇÃO'
		if (form.getValue('motivo') == '')
			msg += '<br/>Informe o motivo do cadastro';

		// PAINEL 'PRODUTO'
		// if (form.getValue('codigo') == '')
		// 	msg += '<br/>Informe o código do produto';
		if (form.getValue('grupo') == null)
			msg += '<br/>Informe o grupo do produto';
		if (form.getValue('tipo') == null)
			msg += '<br/>Informe o tipo do produto';
		if (form.getValue('descricao') == '')
			msg += '<br/>Informe a descrição do produto';
		if (form.getValue('unMedida') == null)
			msg += '<br/>Informe a unidade de medida do produto';
		if (form.getValue('armazem') == null)
			msg += '<br/>Informe o armazém do produto';
		if (form.getValue('posIpiNcm') == null)
			msg += '<br/>Informe o pos. IPI/NCM';
		if (form.getValue('origem') == null)
			msg += '<br/>Informe a origem';
	}

	// ATIVIDADE APROVAR REQUISIÇÃO
	if (atividade == 5) {
		// PAINEL 'APROVAÇÃO'
		if (form.getValue('decisao') == '' || form.getValue('decisao') == null)
			msg += '<br/>Informe a decisão';
		else if (form.getValue('decisao') != 'Aprovado' && form.getValue('obsAprov') == '')
			msg += '<br/>Informe a observação da decisão';
	}

	if (msg != '')
		throw msg;
}