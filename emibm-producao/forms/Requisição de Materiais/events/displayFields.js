function displayFields(form, customHTML) {
	// WKNumState
	var atividade = getValue('WKNumState');
	customHTML.append('<script>var ATIVIDADE = ' + atividade + '; var FORM_MODE = "' + form.getFormMode() + '"</script>');

	// Atribui o nome do usuário logado aos campos necessários
	var usuarioWKUser = getValue('WKUser');
	var nomeUsuarioWKUser = '';
	var constraintColleague = DatasetFactory.createConstraint('colleaguePK.colleagueId', usuarioWKUser, usuarioWKUser, ConstraintType.MUST);
	var colleague = DatasetFactory.getDataset('colleague', null, [constraintColleague], null);
	if (colleague.rowsCount > 0) {
		nomeUsuarioWKUser = colleague.getValue(0, 'colleagueName');
	}

	// Exibir Data
	var today = new Date();
	var year = today.getFullYear();
	var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1)	: (today.getMonth() + 1);
	var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
	var currentDate = day + '/' + month + '/' + year;

	if (atividade == 0 || atividade == 4) {
		form.setValue('dtSolicitacao', currentDate);
		form.setValue('solicitante', nomeUsuarioWKUser);
		form.setValue('matSolicitante', usuarioWKUser);

		if (form.getValue('decisao') != '') {
			form.setVisibleById('painelAprovacao', true);
		} else {
			form.setVisibleById('painelAprovacao', false);
		}
	}

	if (atividade == 5) {
		form.setValue('dtAprov', currentDate);
		form.setValue('responsavelAprov', nomeUsuarioWKUser);
		form.setValue('matGestor', usuarioWKUser);

		customHTML.append('<script>');
	    customHTML.append('  $(".bpm-mobile-trash-column").hide();');
	    customHTML.append('  $("#btnAdicionarItem").hide();');
		customHTML.append('</script>');
	}
}