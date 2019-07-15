function createDataset(fields, constraints, sortFields) {
	var newDataset = DatasetBuilder.newDataset();

	newDataset.addColumn("codigo");
	newDataset.addColumn("codigoFilial");
	newDataset.addColumn("descFilial");
	newDataset.addColumn("CNPJ");
	
	newDataset.addRow(['01', '01', 'TBC - Totvs Brasil Central', '53.113.791/0001-22']);
	return newDataset;
}