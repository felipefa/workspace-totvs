function createDataset(fields, constraints, sortFields) {

	var dataset = DatasetBuilder.newDataset();
	dataset.addColumn("CODIGO");
	dataset.addColumn("ATIVIDADE");

	dataset.addRow(new Array("4", "Início"));
	dataset.addRow(new Array("56", "Analisar Solução da Demanda Contábil"));
	dataset.addRow(new Array("43", "Atender a Demanda Contábil"));
	dataset.addRow(new Array("15", "Atender a Demanda Comercial"));
	dataset.addRow(new Array("17", "Atender a Demanda Comercial Atrasada"));
	dataset.addRow(new Array("21", "Verificar a Demanda Comercial Atrasada"));
	dataset.addRow(new Array("23", "Cobrar a Demanda Comercial Atrasada"));
	dataset.addRow(new Array("29", "Analisar Solução da Demanda Comercial"));

	return dataset;
}