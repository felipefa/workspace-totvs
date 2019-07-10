function displayFields(form, customHTML) {

    var usuarioWKUser = getValue('WKUser');
    var atividade = getValue('WKNumState');
	var numeroSolicitacao = getValue('WKNumProces');
    var nomeUsuarioWKUser = '';
    var constraintColleague = DatasetFactory.createConstraint('colleaguePK.colleagueId', usuarioWKUser, usuarioWKUser, ConstraintType.MUST);

    // Exibir Data
    var today = new Date();
    var year = today.getFullYear();
    var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
    var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
    var currentDate = day + '/' + month + '/' + year;

    var colleague = DatasetFactory.getDataset('colleague', null, [constraintColleague], null);
    if (colleague.rowsCount > 0) {
        nomeUsuarioWKUser = colleague.getValue(0, 'colleagueName');
    }

    if (atividade == 0) {
        form.setValue('dtSolicitacao', currentDate);
        form.setValue('solicitante', nomeUsuarioWKUser);
        form.setValue('matSolicitante', usuarioWKUser);

        if (form.getValue('decisao') != '') {
            form.setVisibleById('painelAprovacao', true);
        } else {
            form.setVisibleById('painelAprovacao', false);
        }
    } else {
		form.setValue('solicitacaoFluig', numeroSolicitacao);
	}

    if (atividade == 5) {
        form.setValue('dtAprov', currentDate);
        form.setValue('responsavelAprov', nomeUsuarioWKUser);
        form.setValue('matGestor', usuarioWKUser);
    }

}