function displayFields(form, customHTML) {
	var atividade = getValue('WKNumState');
	var numeroSolicitacao = getValue('WKNumProces');
	var formMobile = form.getMobile();
	var formMode = form.getFormMode();

	customHTML.append('<script>var ATIVIDADE = ' + atividade + ';</script>');
	customHTML.append('<script>var FORM_MODE = "' + formMode + '";</script>');
	customHTML.append('<script>var MOBILE = ' + formMobile + ';</script>');

	// Atribui o nome do usuário logado aos campos necessários
	var usuarioWKUser = getValue('WKUser');
	var nomeUsuarioWKUser = '';
	var constraintColleague = DatasetFactory.createConstraint('colleaguePK.colleagueId', usuarioWKUser, usuarioWKUser, ConstraintType.MUST);
	var colleague = DatasetFactory.getDataset('colleague', null, [constraintColleague], null);
	if (colleague.rowsCount > 0)
		nomeUsuarioWKUser = colleague.getValue(0, 'colleagueName');

	if (atividade == 0) {
		form.setValue('solicitante', nomeUsuarioWKUser);
		form.setValue('matSolicitante', usuarioWKUser);
	} else
		form.setValue('solicitacaoFluig', numeroSolicitacao);

	if (atividade == 0 || atividade == 4) {
		if (form.getValue('decisao') != '')
			form.setVisibleById('painelAprovacao', true);
		else
			form.setVisibleById('painelAprovacao', false);

		if (formMode == 'VIEW') {
			customHTML.append('<script>');
			customHTML.append('  $(".bpm-mobile-trash-column").hide();');
			customHTML.append('  $("#btnAdicionarItem").hide();');
			customHTML.append('  $("#btnIncluirProduto").hide();');
			customHTML.append('</script>');
		}
	}

	if (atividade == 5) {
		form.setValue('responsavelAprov', nomeUsuarioWKUser);
		form.setValue('matGestor', usuarioWKUser);

		if (formMode == 'VIEW' && form.getValue('decisao') == '')
			form.setVisibleById('painelAprovacao', false);
	}

	if (atividade != 0 && atividade != 4) {
		customHTML.append('<script>');
		customHTML.append('  $(".bpm-mobile-trash-column").hide();');
		customHTML.append('  $("#btnAdicionarItem").hide();');
		customHTML.append('  $("#btnIncluirProduto").hide();');
		customHTML.append('</script>');
	}

	if (atividade == 11) {
		form.setVisibleById('protheus', true);
	}
}