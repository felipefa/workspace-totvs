function validateForm(form){
	
	var indexes = form.getChildrenIndexes("tabelaGestaoHierarquia");
	var tabelaGestaoOrcamento = form.getChildrenIndexes("tabelaGestaoOrcamento");

	/*if( form.getValue("grupoHierarquico") == ""){
		throw "Atenção, favor preencher o campo Grupo Hierárquico.";
	}*/
	if( form.getValue("processId") == ""){
		throw "Atenção, favor preencher o campo Processo.";
	} else if( form.getValue("empresaCodigo") == ""){
		throw "Atenção, favor preencher o campo Unidade.";
	} else if( form.getValue("centroDeCustoCodigo") == ""){
		throw "Atenção, favor preencher o campo Centro de Custo.";
	} else if(indexes.length == 0){
		throw "Atenção, favor adicionar pelo menos um colaborador.";
	}
	
	
    for (var i = 0 , iLen = indexes.length; i < iLen; i++) {    	
		var colaboradorMatricula = form.getValue("colaboradorMatricula___" + indexes[i].toString());
		var colaboradorNivel = form.getValue("colaboradorNivel___" + indexes[i].toString());
		
		if (colaboradorMatricula == "") {
			throw "Atenção, o campo Colaborador da linha: " + (i + 1) + " não foi preenchido.";
		} else if (colaboradorNivel == "") {
			throw "Atenção, o campo Nível da linha: " + (i + 1) + " não foi preenchido.";
		}
	}
	

	for (var i = 0 , iLen = tabelaGestaoOrcamento.length; i < iLen; i++) {    	
		var ano = form.getValue("ano___" + tabelaGestaoOrcamento[i].toString());
		if (ano == "") {
			throw "Atenção, o campo Ano da linha: " + (i + 1) + " não foi preenchido.";
		}
	}
	
}