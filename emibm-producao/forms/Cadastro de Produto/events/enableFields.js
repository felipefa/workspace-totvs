function enableFields(form) {
    var atividade = getValue('WKNumState');

    // ATIVIDADE 'INÍCIO'
    if (atividade == 0 || atividade == 4) {
        // PAINEL 'APROVAÇÃO'
        form.setEnabled('decisao', false);
        form.setEnabled('obsAprov', false);
    }

    // ATIVIDADE 'APROVAR REQUISIÇÃO'
    if (atividade == 5) {
        // PAINEL 'DADOS DA SOLICITAÇÃO'
        form.setEnabled('motivo', false);

		// PAINEL 'PRODUTO'
        // form.setEnabled('codigo', false);
        form.setEnabled('grupo', false);
        form.setEnabled('tipo', false);
        form.setEnabled('descricao', false);
        form.setEnabled('unMedida', false);
        form.setEnabled('armazem', false);
        form.setEnabled('posIpiNcm', false);
        form.setEnabled('origem', false);
    }
}