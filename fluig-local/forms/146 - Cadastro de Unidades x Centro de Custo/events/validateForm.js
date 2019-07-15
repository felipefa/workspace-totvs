function validateForm(form){
	
	var indexes = form.getChildrenIndexes("tabelaUnidadeXCentroDeCusto");
	
	/* if( form.getValue("empresaCodigo") == ""){
		throw "Atenção, favor preencher o campo Código.";
	}

	if( form.getValue("empresaCNPJ") == ""){
		throw "Atenção, favor preencher o campo CNPJ.";
	}

	if( form.getValue("empresaNome") == ""){
		throw "Atenção, favor preencher o campo Descrição.";
	} */

	if( form.getValue("empresaCodigo") == ""){
		throw " Atenção, favor preencher o campo Unidade.";
	}
	
		
	if(indexes.length == 0){
		throw " Atenção, favor adicionar pelo menos um colaborador.";
	}
	
    for (var i = 0 , iLen = indexes.length; i < iLen; i++) {    	
		var centroDeCustoCodigo = form.getValue("centroDeCustoCodigo___" + indexes[i].toString());
				
		if (centroDeCustoCodigo == "") {
        	throw " Atenção, o campo Centro de Custo da linha: " + (i + 1) + " não foi preenchido.";
		} 
    }
	
}