const transformarDescricao = (elemento) => {
	elemento.value = elemento.value.toUpperCase();
}

const validarCodigo = (elemento) => {
	if (elemento.value != '') {
		const constraintProtheus = [
			DatasetFactory.createConstraint('endpoint', 'produto', null, ConstraintType.MUST),
			DatasetFactory.createConstraint('codigo', elemento.value, null, ConstraintType.MUST)
		];
		const dsWsProtheus = DatasetFactory.getDataset('dsWsProtheus', null, constraintProtheus, null);
		if (dsWsProtheus != null && dsWsProtheus.values.length > 0 && dsWsProtheus.values[0].codigo == elemento.value) {
			elemento.value = '';
			FLUIGC.toast({title: 'Atenção!', message: 'Já existente um produto com este código.', type: 'warning'});
		}
	}
}
