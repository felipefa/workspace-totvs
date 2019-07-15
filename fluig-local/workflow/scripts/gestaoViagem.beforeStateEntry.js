function beforeStateEntry(sequenceId){
	log.warn("--Debug gestaoViagem.beforeStateEntry.js")
	log.warn("--Debug sequenceId: " +sequenceId)

	var ATIVIDADE_NECESSITA_APROVACAO = 52;

	if (sequenceId == ATIVIDADE_NECESSITA_APROVACAO) {
		var numProcess = getValue("WKNumProces");
		log.warn("--Debug numProcess: " + numProcess);

		var tipoSolicitacao = hAPI.getCardValue("tipoSolicitacao");
		log.warn("--Debug tipoSolicitacao: " + tipoSolicitacao);

		var colaboradorMatricula = hAPI.getCardValue("colaboradorMatricula");
		log.warn("--Debug colaboradorMatricula: " + colaboradorMatricula);

		var aprovadorViagem = hAPI.getCardValue("aprovadorViagem");
		log.warn("--Debug aprovadorViagem: " + aprovadorViagem);

		if (tipoSolicitacao != "terceiros" && colaboradorMatricula == aprovadorViagem) {
			log.warn("--Debug solicitante aprovador");
			hAPI.setCardValue("dataAprov", today());
			hAPI.setCardValue("nomeAprov", "Aprovação automática.");
			hAPI.setCardValue("radioAprov", "Sim");
			hAPI.setCardValue("obsAprov", "Aprovação automática.");
		}
	}
}

function today() {
	var today = new Date();
	var dd = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
	var mm = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
	var yyyy = today.getFullYear();

	return today = dd + '/' + mm + '/' + yyyy;
}