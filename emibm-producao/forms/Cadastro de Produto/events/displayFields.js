function displayFields(form, customHTML) {
	var usuarioWKUser = getValue('WKUser');
	var atividade = getValue('WKNumState');
	var numeroSolicitacao = getValue('WKNumProces');
	var formMobile = form.getMobile();
	var formMode = form.getFormMode();
	var nomeUsuarioWKUser = '';
	var constraintColleague = DatasetFactory.createConstraint('colleaguePK.colleagueId', usuarioWKUser, usuarioWKUser, ConstraintType.MUST);
	var colleague = DatasetFactory.getDataset('colleague', null, [constraintColleague], null);

	customHTML.append('<script>var ATIVIDADE = ' + atividade + ';</script>');
	customHTML.append('<script>var FORM_MODE = "' + formMode + '";</script>');
	customHTML.append('<script>var MOBILE = ' + formMobile + ';</script>');

	if (colleague.rowsCount > 0)
		nomeUsuarioWKUser = colleague.getValue(0, 'colleagueName');

	// ATIVIDADE 'INÍCIO'
	if (atividade == 0) {
		form.setValue('solicitante', nomeUsuarioWKUser);
		form.setValue('matSolicitante', usuarioWKUser);

		if (form.getValue('decisao') != '')
			form.setVisibleById('painelAprovacao', true);
		else
			form.setVisibleById('painelAprovacao', false);
	} else
		form.setValue('solicitacaoFluig', numeroSolicitacao);

	// ATIVIDADE 'APROVAR CADASTRO'
	if (atividade == 5) {
		form.setValue('responsavelAprov', nomeUsuarioWKUser);
		form.setValue('matGestor', usuarioWKUser);

		if (formMode == 'VIEW' && form.getValue('decisao') == '')
			form.setVisibleById('painelAprovacao', false);
	}
}