const setSelectedZoomItem = (selectedItem) => {
    const id = selectedItem.inputId;

    if (id === 'tipo') {
        document.getElementById('codTipo').value = selectedItem.chave;
    } else if (id === 'unMedida') {
        document.getElementById('codUnMedida').value = selectedItem.chave;
    } else if (id === 'armazem') {
        document.getElementById('codArmazemPad').value = selectedItem.codigo;
    }
}

const removedZoomItem = (removedItem) => {
    const id = removedItem.inputId;

    if (id === 'tipo') {
        document.getElementById('codTipo').value = '';
    } else if (id === 'unMedida') {
        document.getElementById('codUnMedida').value = '';
    } else if (id === 'armazem') {
        document.getElementById('codArmazemPad').value = '';
    }
}