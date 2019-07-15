function enableFields(form) {
	var atividade = getValue('WKNumState');

	// ATIVIDADE 'INÍCIO'
	if (atividade == 4) {
		// PAINEL 'APROVAÇÃO'
		form.setEnabled('decisao', false);
		form.setEnabled('obsAprov', false);
	}

	// ATIVIDADE 'APROVAR REQUISIÇÃO'
	if (atividade == 5) {
		// PAINEL 'DADOS DA SOLICITAÇÃO'
		form.setEnabled('dtNecessidade', false);
		form.setEnabled('localNecessidade', false);
		form.setEnabled('centroCusto', false);
		form.setEnabled('motivo', false);

		// PAINEL 'ITENS'
		var itens = form.getChildrenIndexes('itens');
		for (var index = 0; index < itens.length; index++) {
			form.setEnabled('item___' + itens[index], false);
			form.setEnabled('quantidade___' + itens[index], false);
		}
	}
}