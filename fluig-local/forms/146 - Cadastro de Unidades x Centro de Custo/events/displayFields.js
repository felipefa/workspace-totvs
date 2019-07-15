function displayFields(form,customHTML){ 
	
	var formMode = form.getFormMode();
	var documentId = form.getDocumentId();
	var cardIndex = form.getCardIndex(); 
	
	customHTML.append("<script>");
	customHTML.append("\n   var formMode  = '" + formMode  + "';");
	customHTML.append("\n   var documentId  = '" + documentId  + "';");
	customHTML.append("\n   var cardIndex  = '" + cardIndex  + "';");
	customHTML.append("\n </script>");

}
