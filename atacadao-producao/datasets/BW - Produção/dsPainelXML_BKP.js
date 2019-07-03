function createDataset(fields, constraints, sortFields) {

	log.warn('===== Debug DsPainelXML =====');

	var tipoSolicitacao = '';

	try {

		if (constraints != null) {
			for (var c = 0; c < constraints.length; c++) {
			}
		}

		var dataset = DatasetBuilder.newDataset();

		dataset.addColumn('solicitacao');
		dataset.addColumn('tipoSolicitacao');
		dataset.addColumn('tipoDemanda');
		dataset.addColumn('dataInicio');
		dataset.addColumn('responsavel');
		dataset.addColumn('fornecedor');
		dataset.addColumn('atividade');
		dataset.addColumn('noPrazo');
		dataset.addColumn('emAndamento');
		dataset.addColumn('dataConclusao');
		dataset.addColumn('contabil');

		var consWP = new Array(
			DatasetFactory.createConstraint("processId", "AtendimentoXML", "AtendimentoXML", ConstraintType.MUST)
			//DatasetFactory.createConstraint("active",true,true,ConstraintType.MUST)
		);

		var dsWP = DatasetFactory.getDataset("workflowProcess", null, consWP, null);

		if (dsWP.rowsCount > 0) {

			for (var wp = 0; wp < dsWP.rowsCount; wp++) {

				var dtadsWP = dsWP.getValue(wp, "startDateProcess");
				var dtbWP = new java.lang.String(dtadsWP);
				var dtcWP = dtbWP.split(" ")[0].split("-").reverse().join("/");
				var dtdWP = dtbWP.split(" ")[1];

				var documentId = dsWP.getValue(wp, "cardDocumentId");
				var solicitacao = dsWP.getValue(wp, "workflowProcessPK.processInstanceId");
				var tipoSolicitacao = "";
				var tipoDemanda = "";
				var dataInicio = dtcWP + " as " + dtdWP.substr(0, dtdWP.indexOf("."));
				var responsavel = "";
				var fornecedor = "";
				var prazo = "";
				var atendimento = "";
				var atividade = new Array();
				var dataConclusao = "";
				var contabil = "";

				if (dsWP.getValue(wp, "active") + "" == "true") {
					atendimento = "Sim"
					dataConclusao = "Em Andamento"

					var consWH = new Array(
						DatasetFactory.createConstraint("processHistoryPK.processInstanceId", solicitacao, solicitacao, ConstraintType.MUST),
						DatasetFactory.createConstraint("active", true, true, ConstraintType.MUST)
					);
					var dsWH = DatasetFactory.getDataset("processHistory", null, consWH, null);

					if (dsWH.rowsCount > 0) {
						for (var wh = 0; wh < dsWH.rowsCount; wh++) {
							atividade.push(validaAtividade(dsWH.getValue(wh, "stateSequence")))
						}
					}
				} else {
					atendimento = "Não"
					atividade.push("Fim")
					var dta = dsWP.getValue(wp, "endDateProcess")
					var dtb = new java.lang.String(dta)
					var dtc = dtb.split(" ")[0].split("-").reverse().join("/")
					var dtd = dtb.split(" ")[1]
					dataConclusao = dtc + " as " + dtd.substr(0, dtd.indexOf("."))
				}

				var consWH2 = new Array(
					DatasetFactory.createConstraint("processHistoryPK.processInstanceId", solicitacao, solicitacao, ConstraintType.MUST),
					DatasetFactory.createConstraint("stateSequence", "17", "17", ConstraintType.MUST)
				);

				var dsWH2 = DatasetFactory.getDataset("processHistory", null, consWH2, null);

				if (dsWH2.rowsCount > 0) {
					prazo = "Não"
				} else {
					prazo = "Sim"
				}

				var consWH3 = new Array(
					DatasetFactory.createConstraint("processHistoryPK.processInstanceId", solicitacao, solicitacao, ConstraintType.MUST),
					DatasetFactory.createConstraint("stateSequence", "43", "43", ConstraintType.MUST)
				);

				var dsWH3 = DatasetFactory.getDataset("processHistory", null, consWH3, null);

				if (dsWH3.rowsCount > 0) {
					contabil = "Não"
				} else {
					contabil = "Sim"
				}

				var consForm = new Array(
					DatasetFactory.createConstraint("documentid", documentId, documentId, ConstraintType.MUST)
				)
				var dsForm = DatasetFactory.getDataset("dsAtendimentoXML", null, consForm, null)
				if (dsForm.rowsCount > 0) {
					tipoSolicitacao = validaTipo("" + dsForm.getValue(0, "radioTipo"))

					var arrayTipoDemanda = new Array();

					if ("" + dsForm.getValue(0, "checkQuantidade") == "on") {
						arrayTipoDemanda.push("Quantidade")
					}
					if ("" + dsForm.getValue(0, "checkFornecedor") == "on") {
						arrayTipoDemanda.push("Fornecedor")
					}
					if ("" + dsForm.getValue(0, "checkSemPedido") == "on") {
						arrayTipoDemanda.push("Sem Pedido")
					}
					if ("" + dsForm.getValue(0, "checkForaLinha") == "on") {
						arrayTipoDemanda.push("Item fora de Linha")
					}
					if ("" + dsForm.getValue(0, "checkContabil") == "on") {
						arrayTipoDemanda.push("Contábil")
					}
					if ("" + dsForm.getValue(0, "checkPreco") == "on") {
						arrayTipoDemanda.push("Preço")
					}
					if ("" + dsForm.getValue(0, "checkCadastro") == "on") {
						arrayTipoDemanda.push("Cadastro")
					}
					if ("" + dsForm.getValue(0, "checkNotaRejDen") == "on") {
						arrayTipoDemanda.push("Nota Rejeitada / Denegada")
					}
					if ("" + dsForm.getValue(0, "checkPendNotaDeneg") == "on") {
						arrayTipoDemanda.push("Pendencias Notas de Devolução")
					}
					if ("" + dsForm.getValue(0, "checkCadServUsoConsum") == "on") {
						arrayTipoDemanda.push("Cadastro Serviços Uso/Consumo")
					}
					if ("" + dsForm.getValue(0, "checkAjstTribut") == "on") {
						arrayTipoDemanda.push("Ajuste Tributação")
					}
					if ("" + dsForm.getValue(0, "checkTribNov") == "on") {
						arrayTipoDemanda.push("Tributação Produtos Novos")
					}
					if ("" + dsForm.getValue(0, "checkDemaisPendencias") == "on") {
						arrayTipoDemanda.push("Demais Pendencias")
					}

					tipoDemanda = arrayTipoDemanda.join(" / ")
					responsavel = dsForm.getValue(0, "zoomDemandaPara")
					fornecedor = dsForm.getValue(0, "fornecedor")

				}

				var descAtv = atividade.join(" / ")


				dataset.addRow([
					solicitacao,
					tipoSolicitacao,
					tipoDemanda,
					dataInicio,
					responsavel,
					fornecedor,
					descAtv,
					prazo,
					atendimento,
					dataConclusao,
					contabil
				]);

			}
		}

		return dataset

	} catch (e) {
		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn('erro');
		dataset.addRow([e.toString()])
		return dataset
	}
}

function validaAtividade(a) {
	var b = a + ""
	switch (b) {
		case "4":
			return "Início"
			break;
		case "56":
			return "Analisar Solução da Demanda Contábil";
			break;
		case "43":
			return "Atender a Demanda Contabil";
			break;
		case "15":
			return "Atender a Demanda Comercial";
			break;
		case "17":
			return "Atender a Demanda Comercial Atrasada";
			break;
		case "21":
			return "Verificar a Demanda Comercial Atrasada";
			break;
		case "23":
			return "Cobrar a Demanda Comercial Atrasada";
			break;
		case "29":
			return "Analisar Solução da Demanda Comercial";
	}
}

function validaData(time) {

	if (time != "" && time != "null") {
		return time.split(" ")[0].split("-").reverse().join("/")
	} else {
		return "Não Finalizado"
	}

}

function validaTipo(tipo) {
	switch (tipo) {
		case "naPorta":
			return "Na porta"
			break;
		case "antecipacao":
			return "Antecipação NF";
	}
}