const setSelectedZoomItem = (selectedItem) => {
	const id = selectedItem.inputId;

	if (id === 'centroCusto') {
		document.getElementById('codCentroCusto').value = selectedItem.codigo;
	} else if (id.indexOf('item') === 0) {
		const numLinha = id.split('___')[1];
		document.getElementById('codItem___'+numLinha).value = selectedItem.codigo;
		document.getElementById('unMedida___'+numLinha).value = selectedItem.unMedida;
	}
}

const removedZoomItem = (removedItem) => {
	const id = removedItem.inputId;

	if (id === 'centroCusto') {
		document.getElementById('codCentroCusto').value = '';
	} else if (id.indexOf('item') === 0) {
		const numLinha = id.split('___')[1];
		document.getElementById('codItem___'+numLinha).value = '';
		document.getElementById('unMedida___'+numLinha).value = '';
		document.getElementById('quantidade___'+numLinha).value = '';
	}
}