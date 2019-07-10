function afterStateEntry(sequenceId) {
	// ATIVIDADE 'LANÇAR E FINALIZAR'
	// if (sequenceId == 11) {
	// 	var itens = [];
	// 	var itensPaiFilho = hAPI.getChildrenIndexes('itens');

	// 	for (var index = 0; index < itensPaiFilho.length; index++) {
	// 		itens.push({
	// 			'ITEM': index++,
	// 			'CODIGO': hAPI.getCardValue('codItem___' + itensPaiFilho[index]),
	// 			'QUANTIDADE': hAPI.getCardValue('quantidade___' + itensPaiFilho[index]),
	// 		});
	// 	}

	// 	var dados = {
	// 		'OBJETO': {
	// 			'MOTIVO': hAPI.getCardValue('dtNecessidade'),
	// 			'OBS': 'Solicitação fluig ID ',
	// 			'ITENS': itens,
	// 		},
	// 	}

	// 	var constraints = [DatasetFactory.createConstraint('', dados, dados, ConstraintType.MUST)];
	// 	var dsWsRequisicaoMateriais = DatasetFactory.getDataset('dsWsRequisicaoMateriais', null, constraints, null);
	// }
}