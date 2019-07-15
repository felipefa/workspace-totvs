function validateForm(form){
	var atividade = getValue('WKNumState');
	var proximaAtiv = getValue('WKNextState');
	var completeAtiv = getValue('WKCompletTask');
	var msg = "";

	// Caso a opção selecionada seja diferente de Sim no painel Fim da Viagem, o usuario não conseguirá avançar o processo e será exibida a mensagem abaixo.
	if(completeAtiv == "true"){
		if(atividade == '31' && proximaAtiv == '33'){
			if(form.getValue("fimViagem") != 'Sim'){
				throw "\n Para concluir o envio, finalize o lançamento das despesas e informe 'Sim' na opção Fim da Viagem. Caso não tenha finalizado e deseja apenas salvar, utilize as opções do botão Enviar e clique em 'Salvar' para gravar o que foi lançado.";
			}
		}

		if(atividade == '46' && proximaAtiv == '48'){
			if(form.getValue("ReembEfe") != 'Sim'){
				throw "\n Para finalizar informe se o Reembolso e a Baixa Financeira foram efetuados!";
			}
		}

		if(atividade == '46' && proximaAtiv == '48'){
			if(form.getValue("BaixaFin") != 'Sim'){
				throw "\n Para finalizar informe se o Reembolso e a Baixa Financeira foram efetuados!";
			}
		}

	}

	// Validação de preenchimento dos campos
	if(atividade == 0 || atividade == 7){
		/* if(form.getValue("unidadeFilial") == null || form.getValue("unidadeFilial") == ""){
			msg += "Informe a unidade (filial)";
		}

		if(form.getValue("centroCustoFilial") == null || form.getValue("centroCustoFilial") == ""){
			msg += "<br />Informe o centro de custo";
		} */

		if(form.getValue("dataIda") == ""){
			msg += "<br />Informe a Data de Saída";
		}

		if(form.getValue("horaChegada") == ""){
			msg += "<br />Informe a Hora de Saída";
		}

		if(form.getValue("dataVolta") == ""){
			msg += "<br />Informe a Data de Retorno";
		}

		if(form.getValue("horaRetorno") == ""){
			msg += "<br />Informe a Hora de Retorno";
		}

		if(form.getValue("zoomUFPartida") == null || form.getValue("zoomUFPartida") == ""){
			msg += "<br />Informe a UF de partida";
		}

		if(form.getValue("zoomMunSaida") == null || form.getValue("zoomMunSaida") == ""){
			msg += "<br />Informe o município de partida";
		}

		if(form.getValue("zoomUFChegada") == null || form.getValue("zoomUFChegada") == ""){
			msg += "<br />Informe a UF de chegada";
		}

		if(form.getValue("zoomMunChegada") == null || form.getValue("zoomMunChegada") == ""){
			msg += "<br />Informe o município de chegada";
		}
		/*
		if(form.getValue("tipoSolicitacao") != "terceiros" && (form.getValue("radioMeioTransp") == null || form.getValue("radioMeioTransp") == "")) {
			msg += "<br />Informe o meio de transporte até o local";
		}
		*/
		if (form.getValue("radioMeioTransp") == "carro" && (form.getValue("radioCarros") == null || form.getValue("radioCarros") == "")) {
			msg += "<br />Informe opção para o carro";
		}
	}

	if(atividade == 8){
		if(form.getValue("obsAprov") == null || form.getValue("obsAprov") == ""){
			msg += "<br />Por favor preencha o campo de observações"
		}
	}

	if(atividade == 17){
		if(form.getValue("obsReserva") == null || form.getValue("obsReserva") == ""){
			msg += "<br />Por favor preencha o campo de observações (Reservar Viagem)";
		}
	}

	if(atividade == 23){
		if(form.getValue("obsAdiant") == null || form.getValue("obsAdiant") == ""){
			msg += "<br />Por favor preencha o campo de observações (Liberar Adiantamento)";
		}
	}

	if(atividade == 25){
		if(form.getValue("obsVeiculo") == null || form.getValue("obsVeiculo") == ""){
			msg += "<br />Por favor preencha o campo de observações (Liberar Veiculo)";
		}
	}

	if(atividade == 31){
		if (form.getValue("idCheckboxAdian") == "S") {
			const saldo = form.getValue("saldo");
			if (parseFloat(saldo) < 0.00) {
				msg += "<br />É necessário fazer o Reembolso.: R$" + saldo;
			}
		}
	}

	if(atividade == 39){
		if(form.getValue("obsAprovReemb") == null || form.getValue("obsAprovReemb") == ""){
			msg += "<br />Por favor preencha o campo de observações";
		}
	}

	if(atividade == 56){
		if(form.getValue("obsAprovCotacao") == null || form.getValue("obsAprovCotacao") == ""){
			msg += "<br />Por favor preencha o campo de observações"
		}
	}

	if(msg != ""){
		throw msg;
	}

	/*
	// Campos obrigatorios na tabela PaixFilho
	var indexes = form.getChildrenIndexes("adicionarDespesa");

	if (indexes.length < 1){
		throw ("Não foram informados produtos");
	} else{
		for (var 1=0; i<indexes.length; i++){
			if(form.getValue("dataReembolso___" +indexes[i]) == ""){
				throw ("Data de reembolso não informada");
			}
		}
	} */
}