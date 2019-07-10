const validarCodigo = (elemento) => {
	const constraintProduto = [DatasetFactory.createConstraint('codigo', elemento.value, null, ConstraintType.MUST)];
	const dsWsProduto = DatasetFactory.getDataset('dsWsProduto', null, constraintProduto, null);
	if (dsWsProduto != null && dsWsProduto.values.length > 0) {
		elemento.value = '';
		FLUIGC.toast({title: 'Atenção!', message: 'Já existente um produto com este código.', type: 'warning'});
	}
};