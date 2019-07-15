function enableFields(form){
	var activity = getValue('WKNumState');

	form.setValue("qtDespesas", 0);
    form.setValue("indexTmp", 0);

    if (activity == 0 || activity == 7){
    	form.setEnabled('obsAprov', false);
		form.setEnabled('radioAprov', false);
		form.setEnabled('radioAprovCotacao', false);
		form.setEnabled('obsAprovCotacao', false);
    }

    if (activity != 0 && activity != 7) {
		form.setEnabled('zoomColaborador', false);
    	form.setEnabled('tipoSolicitacao', false);
    	form.setEnabled('obsSolicitante', false);
    }

	// Atividade Aprovar Viagem
	if (activity == 8){
		form.setEnabled('colaboradorNome', false);
		form.setEnabled('colaboradorCPF', false);
		form.setEnabled('colaboradorRG', false);
		form.setEnabled('unidadeFilial', false);
		form.setEnabled('centroCustoFilial', false);
		form.setEnabled('dataIda', false);
		form.setEnabled('horaChegada', false);
		form.setEnabled('dataVolta', false);
		form.setEnabled('horaRetorno', false);
		form.setEnabled('zoomUFPartida', false);
		form.setEnabled('zoomMunSaida', false);
		form.setEnabled('zoomUFChegada', false);
		form.setEnabled('zoomMunChegada', false);
		form.setEnabled('checkboxCarro', false);
		form.setEnabled('checkboxHotel', false);
		form.setEnabled('checkboxAdian', false);
		form.setEnabled('bancoDescricao', false);
		form.setEnabled('bancoContaCorrente', false);
		form.setEnabled('bancoAgencia', false);
		form.setEnabled('valorDesejado', false);
		form.setEnabled('bancoDescricao', false);
		form.setEnabled('bancoContaCorrente', false);
		form.setEnabled('bancoAgencia', false);
		form.setEnabled('radioMeioTransp', false);
		form.setEnabled('radioCarros', false);
		form.setEnabled('dataRetirada', false);
		form.setEnabled('horaRetirada', false);
		form.setEnabled('dataDevolucao', false);
		form.setEnabled('horaDevolucao', false);
		form.setEnabled('radioAprovCotacao', false);
		form.setEnabled('obsAprovCotacao', false);
	}

	if(activity == 17){
		form.setEnabled('colaboradorNome', false);
		form.setEnabled('colaboradorCPF', false);
		form.setEnabled('colaboradorRG', false);
		form.setEnabled('unidadeFilial', false);
		form.setEnabled('centroCustoFilial', false);
		form.setEnabled('dataIda', false);
		form.setEnabled('horaChegada', false);
		form.setEnabled('dataVolta', false);
		form.setEnabled('horaRetorno', false);
		form.setEnabled('zoomUFPartida', false);
		form.setEnabled('zoomMunSaida', false);
		form.setEnabled('zoomUFChegada', false);
		form.setEnabled('zoomMunChegada', false);
		form.setEnabled('checkboxCarro', false);
		form.setEnabled('checkboxHotel', false);
		form.setEnabled('checkboxAdian', false);
		form.setEnabled('valorDesejado', false);
		form.setEnabled('bancoDescricao', false);
		form.setEnabled('bancoContaCorrente', false);
		form.setEnabled('bancoAgencia', false);
		form.setEnabled('radioMeioTransp', false);
		form.setEnabled('radioCarros', false);
		form.setEnabled('radioAprov', false);
		form.setEnabled('obsAprov', false);
		form.setEnabled('dataRetirada', false);
		form.setEnabled('horaRetirada', false);
		form.setEnabled('dataDevolucao', false);
		form.setEnabled('horaDevolucao', false);
		form.setEnabled('nomeAprovCotacao', false);
		form.setEnabled('radioAprovCotacao', false);
		form.setEnabled('obsAprovCotacao', false);
	}

	if(activity == 23){
		form.setEnabled('colaboradorNome', false);
		form.setEnabled('colaboradorCPF', false);
		form.setEnabled('colaboradorRG', false);
		form.setEnabled('unidadeFilial', false);
		form.setEnabled('centroCustoFilial', false);
		form.setEnabled('dataIda', false);
		form.setEnabled('horaChegada', false);
		form.setEnabled('dataVolta', false);
		form.setEnabled('horaRetorno', false);
		form.setEnabled('zoomUFPartida', false);
		form.setEnabled('zoomMunSaida', false);
		form.setEnabled('zoomUFChegada', false);
		form.setEnabled('zoomMunChegada', false);
		form.setEnabled('checkboxCarro', false);
		form.setEnabled('checkboxHotel', false);
		form.setEnabled('checkboxAdian', false);
		form.setEnabled('valorDesejado', false);
		form.setEnabled('bancoDescricao', false);
		form.setEnabled('bancoContaCorrente', false);
		form.setEnabled('bancoAgencia', false);
		form.setEnabled('radioMeioTransp', false);
		form.setEnabled('radioCarros', false);
		form.setEnabled('radioAprov', false);
		form.setEnabled('obsAprov', false);
		form.setEnabled('dataRetirada', false);
		form.setEnabled('horaRetirada', false);
		form.setEnabled('dataDevolucao', false);
		form.setEnabled('horaDevolucao', false);
		form.setEnabled('radioAprovCotacao', false);
		form.setEnabled('obsAprovCotacao', false);

	}

	if(activity == 25){
		form.setEnabled('colaboradorNome', false);
		form.setEnabled('colaboradorCPF', false);
		form.setEnabled('colaboradorRG', false);
		form.setEnabled('unidadeFilial', false);
		form.setEnabled('centroCustoFilial', false);
		form.setEnabled('dataIda', false);
		form.setEnabled('horaChegada', false);
		form.setEnabled('dataVolta', false);
		form.setEnabled('horaRetorno', false);
		form.setEnabled('zoomUFPartida', false);
		form.setEnabled('zoomMunSaida', false);
		form.setEnabled('zoomUFChegada', false);
		form.setEnabled('zoomMunChegada', false);
		form.setEnabled('checkboxCarro', false);
		form.setEnabled('checkboxHotel', false);
		form.setEnabled('checkboxAdian', false);
		form.setEnabled('valorDesejado', false);
		form.setEnabled('bancoDescricao', false);
		form.setEnabled('bancoContaCorrente', false);
		form.setEnabled('bancoAgencia', false);
		form.setEnabled('radioMeioTransp', false);
		form.setEnabled('radioCarros', false);
		form.setEnabled('radioAprov', false);
		form.setEnabled('obsAprov', false);
		form.setEnabled('dataRetirada', false);
		form.setEnabled('horaRetirada', false);
		form.setEnabled('dataDevolucao', false);
		form.setEnabled('horaDevolucao', false);
		form.setEnabled('radioAprovCotacao', false);
		form.setEnabled('obsAprovCotacao', false);

	}

	if(activity == 31){
		form.setEnabled('colaboradorNome', false);
		form.setEnabled('colaboradorCPF', false);
		form.setEnabled('colaboradorRG', false);
		form.setEnabled('unidadeFilial', false);
		form.setEnabled('centroCustoFilial', false);
		form.setEnabled('dataIda', false);
		form.setEnabled('horaChegada', false);
		form.setEnabled('dataVolta', false);
		form.setEnabled('horaRetorno', false);
		form.setEnabled('zoomUFPartida', false);
		form.setEnabled('zoomMunSaida', false);
		form.setEnabled('zoomUFChegada', false);
		form.setEnabled('zoomMunChegada', false);
		form.setEnabled('checkboxCarro', false);
		form.setEnabled('checkboxHotel', false);
		form.setEnabled('checkboxAdian', false);
		form.setEnabled('valorDesejado', false);
		form.setEnabled('bancoDescricao', false);
		form.setEnabled('bancoContaCorrente', false);
		form.setEnabled('bancoAgencia', false);
		form.setEnabled('radioMeioTransp', false);
		form.setEnabled('radioCarros', false);
		form.setEnabled('radioAprov', false);
		form.setEnabled('obsAprov', false);
		form.setEnabled('obsReserva', false);
		form.setEnabled('obsAdiant', false);
		form.setEnabled('obsVeiculo', false);
		form.setEnabled('radioAprovReemb', false);
		form.setEnabled('obsAprovReemb', false);
		form.setEnabled('dataRetirada', false);
		form.setEnabled('horaRetirada', false);
		form.setEnabled('dataDevolucao', false);
		form.setEnabled('horaDevolucao', false);
		form.setEnabled('radioAprovCotacao', false);
		form.setEnabled('obsAprovCotacao', false);


	}

	if(activity == 33){
		form.setEnabled('colaboradorNome', false);
		form.setEnabled('colaboradorCPF', false);
		form.setEnabled('colaboradorRG', false);
		form.setEnabled('unidadeFilial', false);
		form.setEnabled('centroCustoFilial', false);
		form.setEnabled('dataIda', false);
		form.setEnabled('horaChegada', false);
		form.setEnabled('dataVolta', false);
		form.setEnabled('horaRetorno', false);
		form.setEnabled('zoomUFPartida', false);
		form.setEnabled('zoomMunSaida', false);
		form.setEnabled('zoomUFChegada', false);
		form.setEnabled('zoomMunChegada', false);
		form.setEnabled('checkboxCarro', false);
		form.setEnabled('checkboxHotel', false);
		form.setEnabled('checkboxAdian', false);
		form.setEnabled('valorDesejado', false);
		form.setEnabled('bancoDescricao', false);
		form.setEnabled('bancoContaCorrente', false);
		form.setEnabled('bancoAgencia', false);
		form.setEnabled('radioMeioTransp', false);
		form.setEnabled('radioCarros', false);
		form.setEnabled('radioAprov', false);
		form.setEnabled('obsAprov', false);
		form.setEnabled('obsReserva', false);
		form.setEnabled('obsAdiant', false);
		form.setEnabled('obsVeiculo', false);
		form.setEnabled('fimViagem', false);
		form.setEnabled('dataRetirada', false);
		form.setEnabled('horaRetirada', false);
		form.setEnabled('dataDevolucao', false);
		form.setEnabled('horaDevolucao', false);
		form.setEnabled('radioAprovCotacao', false);
		form.setEnabled('obsAprovCotacao', false);
		form.setEnabled('radioAprovReemb', false);
		form.setEnabled('obsAprovReemb', false);
	}

	if(activity == 39){
		form.setEnabled('colaboradorNome', false);
		form.setEnabled('colaboradorCPF', false);
		form.setEnabled('colaboradorRG', false);
		form.setEnabled('unidadeFilial', false);
		form.setEnabled('centroCustoFilial', false);
		form.setEnabled('dataIda', false);
		form.setEnabled('horaChegada', false);
		form.setEnabled('dataVolta', false);
		form.setEnabled('horaRetorno', false);
		form.setEnabled('zoomUFPartida', false);
		form.setEnabled('zoomMunSaida', false);
		form.setEnabled('zoomUFChegada', false);
		form.setEnabled('zoomMunChegada', false);
		form.setEnabled('checkboxCarro', false);
		form.setEnabled('checkboxHotel', false);
		form.setEnabled('checkboxAdian', false);
		form.setEnabled('valorDesejado', false);
		form.setEnabled('bancoDescricao', false);
		form.setEnabled('bancoContaCorrente', false);
		form.setEnabled('bancoAgencia', false);
		form.setEnabled('radioMeioTransp', false);
		form.setEnabled('radioCarros', false);
		form.setEnabled('radioAprov', false);
		form.setEnabled('obsAprov', false);
		form.setEnabled('obsReserva', false);
		form.setEnabled('obsAdiant', false);
		form.setEnabled('obsVeiculo', false);
		form.setEnabled('fimViagem', false);
		form.setEnabled('dataRetirada', false);
		form.setEnabled('horaRetirada', false);
		form.setEnabled('dataDevolucao', false);
		form.setEnabled('horaDevolucao', false);
		form.setEnabled('radioAprovCotacao', false);
		form.setEnabled('obsAprovCotacao', false);

	}

	if(activity == 46){
		form.setEnabled('colaboradorNome', false);
		form.setEnabled('colaboradorCPF', false);
		form.setEnabled('colaboradorRG', false);
		form.setEnabled('unidadeFilial', false);
		form.setEnabled('centroCustoFilial', false);
		form.setEnabled('dataIda', false);
		form.setEnabled('horaChegada', false);
		form.setEnabled('dataVolta', false);
		form.setEnabled('horaRetorno', false);
		form.setEnabled('zoomUFPartida', false);
		form.setEnabled('zoomMunSaida', false);
		form.setEnabled('zoomUFChegada', false);
		form.setEnabled('zoomMunChegada', false);
		form.setEnabled('checkboxCarro', false);
		form.setEnabled('checkboxHotel', false);
		form.setEnabled('checkboxAdian', false);
		form.setEnabled('valorDesejado', false);
		form.setEnabled('bancoDescricao', false);
		form.setEnabled('bancoContaCorrente', false);
		form.setEnabled('bancoAgencia', false);
		form.setEnabled('radioMeioTransp', false);
		form.setEnabled('radioCarros', false);
		form.setEnabled('radioAprov', false);
		form.setEnabled('obsAprov', false);
		form.setEnabled('obsReserva', false);
		form.setEnabled('obsAdiant', false);
		form.setEnabled('obsVeiculo', false);
		form.setEnabled('fimViagem', false);
		form.setEnabled('radioAprovReemb', false);
		form.setEnabled('obsAprovReemb', false);
		form.setEnabled('dataRetirada', false);
		form.setEnabled('horaRetirada', false);
		form.setEnabled('dataDevolucao', false);
		form.setEnabled('horaDevolucao', false);
		form.setEnabled('radioAprovCotacao', false);
		form.setEnabled('obsAprovCotacao', false);

	}

	if(activity == 56){
		form.setEnabled('colaboradorNome', false);
		form.setEnabled('colaboradorCPF', false);
		form.setEnabled('colaboradorRG', false);
		form.setEnabled('unidadeFilial', false);
		form.setEnabled('centroCustoFilial', false);
		form.setEnabled('dataIda', false);
		form.setEnabled('horaChegada', false);
		form.setEnabled('dataVolta', false);
		form.setEnabled('horaRetorno', false);
		form.setEnabled('zoomUFPartida', false);
		form.setEnabled('zoomMunSaida', false);
		form.setEnabled('zoomUFChegada', false);
		form.setEnabled('zoomMunChegada', false);
		form.setEnabled('checkboxCarro', false);
		form.setEnabled('checkboxHotel', false);
		form.setEnabled('checkboxAdian', false);
		form.setEnabled('valorDesejado', false);
		form.setEnabled('bancoDescricao', false);
		form.setEnabled('bancoContaCorrente', false);
		form.setEnabled('bancoAgencia', false);
		form.setEnabled('radioMeioTransp', false);
		form.setEnabled('radioCarros', false);
		form.setEnabled('radioAprov', false);
		form.setEnabled('obsAprov', false);
		form.setEnabled('obsReserva', false);
		form.setEnabled('obsAdiant', false);
		form.setEnabled('obsVeiculo', false);
		form.setEnabled('fimViagem', false);
		form.setEnabled('radioAprovReemb', false);
		form.setEnabled('obsAprovReemb', false);
		form.setEnabled('dataRetirada', false);
		form.setEnabled('horaRetirada', false);
		form.setEnabled('dataDevolucao', false);
		form.setEnabled('horaDevolucao', false);
	}
}