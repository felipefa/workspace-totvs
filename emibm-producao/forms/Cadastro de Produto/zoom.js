const setSelectedZoomItem = (selectedItem) => {
    const id = selectedItem.inputId;

    if (id === 'grupo') {
        document.getElementById('codGrupo').value = selectedItem.chave;
    } else if (id === 'tipo') {
        document.getElementById('codTipo').value = selectedItem.chave;
    } else if (id === 'unMedida') {
        document.getElementById('codUnMedida').value = selectedItem.chave;
    } else if (id === 'armazem') {
        document.getElementById('codArmazemPad').value = selectedItem.codigo;
    } else if (id === 'posIpiNcm') {
        document.getElementById('codPosIpiNcm').value = selectedItem.chave;
    } else if (id === 'origem') {
        document.getElementById('codOrigem').value = selectedItem.chave;
    }
}

const removedZoomItem = (removedItem) => {
    const id = removedItem.inputId;

    if (id === 'grupo') {
        document.getElementById('codGrupo').value = '';
    } else if (id === 'tipo') {
        document.getElementById('codTipo').value = '';
    } else if (id === 'unMedida') {
        document.getElementById('codUnMedida').value = '';
    } else if (id === 'armazem') {
        document.getElementById('codArmazemPad').value = '';
    } else if (id === 'posIpiNcm') {
        document.getElementById('codPosIpiNcm').value = '';
    } else if (id === 'origem') {
        document.getElementById('codOrigem').value = '';
    }
}