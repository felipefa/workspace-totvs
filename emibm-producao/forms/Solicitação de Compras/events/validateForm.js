function validateForm(form) {
	var atividade = getValue('WKNumState');
	var msg = '';

	// ATIVIDADE INÍCIO
	if (atividade == 0 || atividade == 4) {
		// PAINEL 'DADOS DA SOLICITAÇÃO'
		var dtNecessidade = form.getValue('dtNecessidade');
		if (dtNecessidade == '')
			msg += '<br/>Informe a data da necessidade';
		else {
			var dtSolicitacao = form.getValue('dtSolicitacao');

			if (dtNecessidade < dtSolicitacao)
				msg += '<br/>A data da necessidade não pode ser anterior a hoje';
		}
		if (form.getValue('localNecessidade') == '')
			msg += '<br/>Informe o local da necessidade';
		if (form.getValue('centroCusto') == '' || form.getValue('centroCusto') == null)
			msg += '<br/>Informe o centro de custo';
		if (form.getValue('motivo') == '')
			msg += '<br/>Informe o motivo da requisição';

		// PAINEL 'ITENS'
		var itens = form.getChildrenIndexes('itens');
		if (itens.length < 1) {
			msg += '<br/>Informe pelo menos um item';
		} else {
			for (var index = 0; index < itens.length; index++) {
				if (form.getValue('item___' + itens[index]) == '' || form.getValue('item___' + itens[index]) == null)
					throw '<br/>Informe um item';
				var quantidade = form.getValue('quantidade___' + itens[index]);
				if (quantidade == '')
					throw '<br/>Informe uma quantidade';
				else if (quantidade < 1)
					throw '<br/>Informe uma quantidade maior do que 1';
				else if (quantidade.indexOf(',') != -1 || quantidade.indexOf('.') != -1)
					throw '<br/>Informe um número inteiro na quantidade';
			}
		}
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