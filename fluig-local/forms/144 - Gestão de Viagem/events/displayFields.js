function displayFields(form,customHTML){

	// WKNumState
	var atividade = getValue('WKNumState');
	log.info('atividade:'+ atividade);

	customHTML.append("<script>");
	customHTML.append("     function getWKNumState(){ return " + atividade + "};");
	customHTML.append("\n </script>");

	customHTML.append("<script>var FORM_MODE = '" + form.getFormMode() + "'</script>");

	// Atribui o nome do usuário logado aos campos necessários
	var usuarioWKUser = getValue("WKUser");
	var constraintColleague1 = DatasetFactory.createConstraint('colleaguePK.colleagueId', usuarioWKUser, usuarioWKUser, ConstraintType.MUST);
	var datasetColleague = DatasetFactory.getDataset('colleague', null, new Array(constraintColleague1), null);
	if (datasetColleague.rowsCount > 0){
		usuarioWKUser = datasetColleague.getValue(0, 'colleagueName');
	}

	// Exibir Data e Hora
	var today = new Date();
	var year = today.getFullYear();
	var month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1)	: (today.getMonth() + 1);
	var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
	var hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
	var minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
	var second = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds();
	var currentHour = hour + ":" + minute + ":" + second;
	var currentDate = day + '/' + month + '/' + year;
	var currentTime = currentDate + " - " + currentHour;

	// Atividade Inicio
	if(atividade == 0 || atividade == 7 ){
		form.setValue("nomeSolic", usuarioWKUser);
		form.setValue("dataSolic", currentTime);

		/*form.setVisibleById("painelAprovViagem", false); */
		form.setVisibleById("painelObsReserva", false);
		form.setVisibleById("painelObsAdiant", false);
		form.setVisibleById("painelObsVeiculo", false);
		form.setVisibleById("painelAcertoReemb", false);
		form.setVisibleById("painelAprovReemb", false);

		if (form.getValue("checkboxAdian") != "adiantamentoOk"){
			form.setVisibleById("idValorDesejado", false);
		}else{
			form.setVisibleById("idValorDesejado", true);
		}

		if (form.getValue("radioMeioTransp") == "carro"){
			form.setVisibleById("idRadioOpcaoCarro", true);
		}else{
			form.setVisibleById("idRadioOpcaoCarro", false);
		}

		// Mostrar/Ocultar data retirada e data devolução do veiculo
		if (form.getValue("radioCarros") == "alugado" || form.getValue("radioCarros") == "frota"){
			form.setVisibleById("idDataRetirada", true);
			form.setVisibleById("idHoraRetirada", true);
			form.setVisibleById("idDataDevolucao", true);
			form.setVisibleById("idHoraDevolucao", true);
		}else{
			form.setVisibleById("idDataRetirada", false);
			form.setVisibleById("idHoraRetirada", false);
			form.setVisibleById("idDataDevolucao", false);
			form.setVisibleById("idHoraDevolucao", false);
		}
	}
	// Atividade Aprovar Viagem
	if(atividade == 8){
		form.setValue("nomeAprov", usuarioWKUser);
		form.setValue("dataAprov", currentTime);

		form.setVisibleById("painelObsReserva", false);
		form.setVisibleById("painelObsAdiant", false);
		form.setVisibleById("painelObsVeiculo", false);
		form.setVisibleById("painelAcertoReemb", false);
		form.setVisibleById("painelAprovReemb", false);

		if (form.getValue("checkboxAdian") != "adiantamentoOk"){
			form.setVisibleById("idValorDesejado", false);
		}else{
			form.setVisibleById("idValorDesejado", true);
		}

		if (form.getValue("radioMeioTransp") == "carro"){
			form.setVisibleById("idRadioOpcaoCarro", true);
		}else{
			form.setVisibleById("idRadioOpcaoCarro", false);
		}

		// Mostrar/Ocultar data retirada e data devolução do veiculo
		if (form.getValue("radioCarros") == "alugado" || form.getValue("radioCarros") == "frota"){
			form.setVisibleById("idDataRetirada", true);
			form.setVisibleById("idHoraRetirada", true);
			form.setVisibleById("idDataDevolucao", true);
			form.setVisibleById("idHoraDevolucao", true);
		}else{
			form.setVisibleById("idDataRetirada", false);
			form.setVisibleById("idHoraRetirada", false);
			form.setVisibleById("idDataDevolucao", false);
			form.setVisibleById("idHoraDevolucao", false);
		}

	}

	// Atividade Reservar Viagem
	if(atividade == 17){
		form.setVisibleById("painelAcertoReemb", false);
		form.setVisibleById("painelObsAdiant", false);
		form.setVisibleById("painelObsVeiculo", false);
		form.setVisibleById("painelAprovReemb", false);
		form.setVisibleById("painelEfetuarReembBaixa", false);

		form.setVisibleById("idValorDesejado", true);

		if (form.getValue("checkboxAdian") != "adiantamentoOk"){
			form.setVisibleById("idValorDesejado", false);
		}else{
			form.setVisibleById("idValorDesejado", true);
		}
		if (form.getValue("radioMeioTransp") == "carro"){
			form.setVisibleById("idRadioOpcaoCarro", true);
		}else{
			form.setVisibleById("idRadioOpcaoCarro", false);
		}

		// Mostrar/Ocultar data retirada e data devolução do veiculo
		if (form.getValue("radioCarros") == "alugado" || form.getValue("radioCarros") == "frota"){
			form.setVisibleById("idDataRetirada", true);
			form.setVisibleById("idHoraRetirada", true);
			form.setVisibleById("idDataDevolucao", true);
			form.setVisibleById("idHoraDevolucao", true);
		}else{
			form.setVisibleById("idDataRetirada", false);
			form.setVisibleById("idHoraRetirada", false);
			form.setVisibleById("idDataDevolucao", false);
			form.setVisibleById("idHoraDevolucao", false);
		}

	}

	// Atividade Liberar Adiantamento
	if(atividade == 23){
		form.setVisibleById("painelAcertoReemb", false);
		form.setVisibleById("painelObsReserva", false);
		form.setVisibleById("painelObsVeiculo", false);
		form.setVisibleById("painelAprovReemb", false);

		form.setVisibleById("idValorDesejado", true);

		if (form.getValue("checkboxAdian") != "adiantamentoOk"){
			form.setVisibleById("idValorDesejado", false);
		}else{
			form.setVisibleById("idValorDesejado", true);
		}
		if (form.getValue("radioMeioTransp") == "carro"){
			form.setVisibleById("idRadioOpcaoCarro", true);
		}else{
			form.setVisibleById("idRadioOpcaoCarro", false);
		}

		// Mostrar/Ocultar data retirada e data devolução do veiculo
		if (form.getValue("radioCarros") == "alugado" || form.getValue("radioCarros") == "frota"){
			form.setVisibleById("idDataRetirada", true);
			form.setVisibleById("idHoraRetirada", true);
			form.setVisibleById("idDataDevolucao", true);
			form.setVisibleById("idHoraDevolucao", true);
		}else{
			form.setVisibleById("idDataRetirada", false);
			form.setVisibleById("idHoraRetirada", false);
			form.setVisibleById("idDataDevolucao", false);
			form.setVisibleById("idHoraDevolucao", false);
		}

	}

	// Atividade Liberar Veiculo
	if(atividade == 25){
		form.setVisibleById("painelAcertoReemb", false);
		form.setVisibleById("painelObsAdiant", false);
		form.setVisibleById("painelObsReserva", false);
		form.setVisibleById("painelAprovReemb", false);
		form.setVisibleById("painelEfetuarReembBaixa", false);

		form.setVisibleById("idValorDesejado", true);

		if (form.getValue("checkboxAdian") != "adiantamentoOk"){
			form.setVisibleById("idValorDesejado", false);
		}else{
			form.setVisibleById("idValorDesejado", true);
		}
		if (form.getValue("radioMeioTransp") == "carro"){
			form.setVisibleById("idRadioOpcaoCarro", true);
		}else{
			form.setVisibleById("idRadioOpcaoCarro", false);
		}

		// Mostrar/Ocultar data retirada e data devolução do veiculo
		if (form.getValue("radioCarros") == "alugado" || form.getValue("radioCarros") == "frota"){
			form.setVisibleById("idDataRetirada", true);
			form.setVisibleById("idHoraRetirada", true);
			form.setVisibleById("idDataDevolucao", true);
			form.setVisibleById("idHoraDevolucao", true);
		}else{
			form.setVisibleById("idDataRetirada", false);
			form.setVisibleById("idHoraRetirada", false);
			form.setVisibleById("idDataDevolucao", false);
			form.setVisibleById("idHoraDevolucao", false);
		}

	}

	// Atividade Gerar Acerto/Reembolso
	if(atividade == 31){
		/* form.setVisibleById("painelAcertoReemb", false); */

		form.setVisibleById("idReembEfe", false);
		form.setVisibleById("idBaixaFin", false);
		form.setVisibleById("painelObsReserva", true);
		form.setVisibleById("painelObsAdiant", true);
		form.setVisibleById("painelObsVeiculo", true);

		form.setVisibleById("painelAprovReemb", false);

		if (form.getValue("checkboxAdian") != "adiantamentoOk"){
			form.setVisibleById("idValorDesejado", false);
		}else{
			form.setVisibleById("idValorDesejado", true);
		}
		if (form.getValue("radioMeioTransp") == "carro"){
			form.setVisibleById("idRadioOpcaoCarro", true);
		}else{
			form.setVisibleById("idRadioOpcaoCarro", false);
		}

		// Mostrar/Ocultar data retirada e data devolução do veiculo
		if (form.getValue("radioCarros") == "alugado" || form.getValue("radioCarros") == "frota"){
			form.setVisibleById("idDataRetirada", true);
			form.setVisibleById("idHoraRetirada", true);
			form.setVisibleById("idDataDevolucao", true);
			form.setVisibleById("idHoraDevolucao", true);
		}else{
			form.setVisibleById("idDataRetirada", false);
			form.setVisibleById("idHoraRetirada", false);
			form.setVisibleById("idDataDevolucao", false);
			form.setVisibleById("idHoraDevolucao", false);
		}

	}

	// Atividade Reembolsar/Baixa Financeira
	if(atividade == 33){
		form.setVisibleById("idFimViagem", false);
		form.setVisibleById("idReembEfe", false);
		form.setVisibleById("idBaixaFin", false);
		form.setVisibleById("painelAprovReemb", false);

		if (form.getValue("checkboxAdian") != "adiantamentoOk"){
			form.setVisibleById("idValorDesejado", false);
		}else{
			form.setVisibleById("idValorDesejado", true);
		}
		if (form.getValue("radioMeioTransp") == "carro"){
			form.setVisibleById("idRadioOpcaoCarro", true);
		}else{
			form.setVisibleById("idRadioOpcaoCarro", false);
		}
		// Mostrar/Ocultar data retirada e data devolução do veiculo
		if (form.getValue("radioCarros") == "alugado" || form.getValue("radioCarros") == "frota"){
			form.setVisibleById("idDataRetirada", true);
			form.setVisibleById("idHoraRetirada", true);
			form.setVisibleById("idDataDevolucao", true);
			form.setVisibleById("idHoraDevolucao", true);
		}else{
			form.setVisibleById("idDataRetirada", false);
			form.setVisibleById("idHoraRetirada", false);
			form.setVisibleById("idDataDevolucao", false);
			form.setVisibleById("idHoraDevolucao", false);
		}
		customHTML.append("<script>");
	    customHTML.append(" $('.bpm-mobile-trash-column').hide();");
	    customHTML.append(" $('#buttonAddDespesa').hide();");
	    customHTML.append(" $('#buttonViewRemove').hide();");
		customHTML.append("</script>");
	}

	// Atividade Aprovar Reembolso
	if(atividade == 39){

		form.setValue("nomeAprovReemb", usuarioWKUser);
		form.setValue("dataAprovReemb", currentTime);

		form.setVisibleById("idFimViagem", false);
		form.setVisibleById("idReembEfe", false);
		form.setVisibleById("idBaixaFin", false);

		if (form.getValue("checkboxAdian") != "adiantamentoOk"){
			form.setVisibleById("idValorDesejado", false);
		}else{
			form.setVisibleById("idValorDesejado", true);
		}
		if (form.getValue("radioMeioTransp") == "carro"){
			form.setVisibleById("idRadioOpcaoCarro", true);
		}else{
			form.setVisibleById("idRadioOpcaoCarro", false);
		}
		// Mostrar/Ocultar data retirada e data devolução do veiculo
		if (form.getValue("radioCarros") == "alugado" || form.getValue("radioCarros") == "frota"){
			form.setVisibleById("idDataRetirada", true);
			form.setVisibleById("idHoraRetirada", true);
			form.setVisibleById("idDataDevolucao", true);
			form.setVisibleById("idHoraDevolucao", true);
		}else{
			form.setVisibleById("idDataRetirada", false);
			form.setVisibleById("idHoraRetirada", false);
			form.setVisibleById("idDataDevolucao", false);
			form.setVisibleById("idHoraDevolucao", false);
		}
		customHTML.append("<script>");
	    customHTML.append(" $('.bpm-mobile-trash-column').hide();");
	    customHTML.append(" $('#buttonAddDespesa').hide();");
	    customHTML.append(" $('#buttonViewRemove').hide();");
		customHTML.append("</script>");
	}

	if (atividade == 46){
		form.setVisibleById("idFimViagem", false);
		form.setVisibleById("idReembEfe", true);
		form.setVisibleById("idBaixaFin", true);
		form.setVisibleById("painelAcertoReemb", true);

		if (form.getValue("checkboxAdian") != "adiantamentoOk"){
			form.setVisibleById("idValorDesejado", false);
		}else{
			form.setVisibleById("idValorDesejado", true);
		}
		if (form.getValue("radioMeioTransp") == "carro"){
			form.setVisibleById("idRadioOpcaoCarro", true);
		}else{
			form.setVisibleById("idRadioOpcaoCarro", false);
		}
		// Mostrar/Ocultar data retirada e data devolução do veiculo
		if (form.getValue("radioCarros") == "alugado" || form.getValue("radioCarros") == "frota"){
			form.setVisibleById("idDataRetirada", true);
			form.setVisibleById("idHoraRetirada", true);
			form.setVisibleById("idDataDevolucao", true);
			form.setVisibleById("idHoraDevolucao", true);
		}else{
			form.setVisibleById("idDataRetirada", false);
			form.setVisibleById("idHoraRetirada", false);
			form.setVisibleById("idDataDevolucao", false);
			form.setVisibleById("idHoraDevolucao", false);
		}
		customHTML.append("<script>");
	    customHTML.append(" $('.bpm-mobile-trash-column').hide();");
	    customHTML.append(" $('#buttonAddDespesa').hide();");
	    customHTML.append(" $('#buttonViewRemove').hide();");
		customHTML.append("</script>");
	}

	if (atividade == 56 ) {
		form.setValue("nomeAprovCotacao", usuarioWKUser);
		form.setValue("dataAprovCotacao", currentTime);

		if (form.getValue("checkboxAdian") != "adiantamentoOk")
			form.setVisibleById("painelObsAdiant", false);

		if (form.getValue("radioCarros") != "alugado" || form.getValue("radioCarros") != "frota")
			form.setVisibleById("painelObsVeiculo", false);

		form.setVisibleById("painelAcertoReemb", false);
		form.setVisibleById("painelAprovReemb", false);

		if (form.getValue("checkboxAdian") != "adiantamentoOk"){
			form.setVisibleById("idValorDesejado", false);
		}else{
			form.setVisibleById("idValorDesejado", true);
		}

		if (form.getValue("radioMeioTransp") == "carro"){
			form.setVisibleById("idRadioOpcaoCarro", true);
		}else{
			form.setVisibleById("idRadioOpcaoCarro", false);
		}

		// Mostrar/Ocultar data retirada e data devolução do veiculo
		if (form.getValue("radioCarros") == "alugado" || form.getValue("radioCarros") == "frota"){
			form.setVisibleById("idDataRetirada", true);
			form.setVisibleById("idHoraRetirada", true);
			form.setVisibleById("idDataDevolucao", true);
			form.setVisibleById("idHoraDevolucao", true);
		}else{
			form.setVisibleById("idDataRetirada", false);
			form.setVisibleById("idHoraRetirada", false);
			form.setVisibleById("idDataDevolucao", false);
			form.setVisibleById("idHoraDevolucao", false);
		}
	}


	// Remove o icone da lixeira e o botão de adicionar item do painel 'Pai x Filho' nas atividades 33 e 39
	customHTML.append("<script>");
	customHTML.append("$(document).ready(function(){ ");
	if (atividade == 33 || atividade == 39) {
	    customHTML.append(" $('.bpm-mobile-trash-column').hide();");
	    customHTML.append(" $('#buttonAddDespesa').hide();");
	    customHTML.append(" $('#buttonViewRemove').hide();");
	}
	customHTML.append(" });");
	customHTML.append("</script>");


	// Remove o icone da lixeira e o botão de adicionar item do painel 'Pai x Filho' na atividade 'FIM' ou 'Modo de Exibição'
	var formMode = form.getFormMode();
	if (formMode == 'VIEW'){
		customHTML.append("<script>");
		customHTML.append(" $('.bpm-mobile-trash-column').hide();");
		customHTML.append(" $('#buttonAddDespesa').hide();");
		customHTML.append(" $('#buttonViewRemove').hide();");
		customHTML.append(" $('#accordionTwo').show();");
		customHTML.append("</script>");
	}
 }