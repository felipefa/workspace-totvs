function validateForm(form) {
	var atividade = getValue('WKNumState');
	var msg = '';

	// ATIVIDADE 'INÍCIO'
	if (atividade == 0 || atividade == 4) {
		// PAINEL 'DADOS DA SOLICITAÇÃO'
		if (form.getValue('motivo') == '')
			msg += '<br/>Informe o motivo do cadastro';

		// PAINEL 'PRODUTO'
		if (form.getValue('grupo') == '' || form.getValue('grupo') == null)
			msg += '<br/>Informe o grupo do produto';
		if (form.getValue('tipo') == '' || form.getValue('tipo') == null)
			msg += '<br/>Informe o tipo do produto';
		if (form.getValue('descricao') == '')
			msg += '<br/>Informe a descrição do produto';
		if (form.getValue('unMedida') == '' || form.getValue('unMedida') == null)
			msg += '<br/>Informe a unidade de medida do produto';
	}

	// ATIVIDADE 'APROVAR SOLICITAÇÃO'
	if (atividade == 5) {
		// PAINEL 'APROVAÇÃO'
		if (form.getValue('decisao') == '' || form.getValue('decisao') == null)
			msg += '<br/>Informe a decisão';
		else {
			if (form.getValue('decisao') != 'Aprovado' && form.getValue('obsAprov') == '')
				msg += '<br/>Informe a observação da decisão';
			else if (form.getValue('decisao') == 'Aprovado') {
				if (form.getValue('armazem') == '' || form.getValue('armazem') == null)
					msg += '<br/>Informe o armazém do produto';
				if (form.getValue('posIpiNcm') == '' || form.getValue('posIpiNcm') == null)
					msg += '<br/>Informe o pos. IPI/NCM';
				if (form.getValue('origem') == '' || form.getValue('origem') == null)
					msg += '<br/>Informe a origem';
			}
		}
	}

	if (msg != '')
		throw msg;
}