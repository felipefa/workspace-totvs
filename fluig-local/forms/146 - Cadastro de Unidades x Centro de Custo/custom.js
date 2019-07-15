(function () {
	const btnAdicionar = document.getElementById("btnAdicionar");

	btnAdicionar.addEventListener('click', function (e) {
		wdkAddChild('tabelaUnidadeXCentroDeCusto');
		populaTabelaFilhoComDadosPai();
	})

	window.addEventListener("load", function () {
		if (formMode === "ADD") {
			wdkAddChild('tabelaUnidadeXCentroDeCusto');
		} else if (formMode === "VIEW") {
			btnAdicionar.disabled = true;
		}
	});

})();

function existeCentroDeCusto(element){
	const { id, placeholder, value } = element;
	const elements = document.querySelectorAll("[id^='" + id.split('___')[0] + "___']");

	for (let el of elements) {
		if (el.value === value && el.id !== id) {
			el.value = "";
			mensagemAlerta("Atenção", `${placeholder} já faz parte da Unidade.`);
			return;
		}
	}

}

function setSelectedZoomItem(selectedItem) {
	const { inputId: zoomId } = selectedItem;
	const row = zoomId.split("___") ? zoomId.split("___")[1] : undefined;

	if (zoomId.includes("zoomUnidade")) {
		const { CNPJ, codigoFilial, descFilial } = selectedItem;

		if (!existeUnidade(codigoFilial)) {
			document.getElementById("empresaCodigo").value = codigoFilial;
			document.getElementById("empresaCNPJ").value = CNPJ;
			document.getElementById("empresaNome").value = descFilial;
			populaTabelaFilhoComDadosPai();
		} else {
			mensagemAlerta('Atenção', 'A unidade selecionada já está cadastrada. Favor selecionar outra.', false);
			window[zoomId].clear();
		}

	} else if (zoomId.includes("zoomCentroDeCusto")) {
		const { CODI_CCU, DESC_CCU } = selectedItem;

		if (!existeCentroDeCusto(CODI_CCU)) {
			document.getElementById("centroDeCustoCodigo___" + row).value = CODI_CCU;
			document.getElementById("centroDeCustoDescricao___" + row).value = DESC_CCU;
		} else {
			mensagemAlerta('Atenção', 'O centro de custo selecionado já faz parte desta Unidade. Favor selecionar outro.', false);
			window[zoomId].clear();
		}
	}
}

function removedZoomItem(removedItem) {
	const { inputId: zoomId } = removedItem;
	const row = zoomId.split("___") ? zoomId.split("___")[1] : undefined;

	if (zoomId.includes("zoomCentroDeCusto")) {
		document.getElementById("centroDeCustoCodigo___" + row).value = "";
		document.getElementById("centroDeCustoDescricao___" + row).value = "";
	} else if (zoomId.includes("zoomUnidade")) {
		document.getElementById("empresaCodigo").value = "";
		document.getElementById("empresaCNPJ").value = "";
		document.getElementById("empresaNome").value = "";
		populaTabelaFilhoComDadosPai();
	}
}

function populaTabelaFilhoComDadosPai() {
	const empresaCodigo = document.getElementById("empresaCodigo");
	const paiEmpresaCodigo = document.querySelectorAll("[id^='paiEmpresaCodigo___']");
	const empresaCNPJ = document.getElementById("empresaCNPJ");
	const paiEmpresaCNPJ = document.querySelectorAll("[id^='paiEmpresaCNPJ___']");
	const empresaNome = document.getElementById("empresaNome");
	const paiEmpresaNome = document.querySelectorAll("[id^='paiEmpresaNome___']");

	paiEmpresaCodigo.forEach(p => p.value = empresaCodigo.value);
	paiEmpresaCNPJ.forEach(g => g.value = empresaCNPJ.value);
	paiEmpresaNome.forEach(g => g.value = empresaNome.value);
}

function existeCentroDeCusto(codigo){
	const centroDeCustoCodigo = document.querySelectorAll("[id^='centroDeCustoCodigo___']");
	for (let zoom of centroDeCustoCodigo) {
		if (zoom.value === codigo) {
			return true;
		}
	}
	return false;
}

function existeUnidade(empresaCodigo) {
	const constraintTabelaUnidadeXCentroDeCusto1 = DatasetFactory.createConstraint('empresaCodigo', empresaCodigo, empresaCodigo, ConstraintType.MUST);
	const datasetTabelaUnidadeXCentroDeCusto = DatasetFactory.getDataset('fsUnidadeCentroCusto', null, new Array(constraintTabelaUnidadeXCentroDeCusto1), null);
	return datasetTabelaUnidadeXCentroDeCusto && datasetTabelaUnidadeXCentroDeCusto.values && datasetTabelaUnidadeXCentroDeCusto.values.length;
}

function mensagemAlerta(title, content) {
	modalMyLoading = FLUIGC.modal({
		title,
		content,
		id:  'fluig-modal',
		size:  'larger',
		actions: [{
			'label':  'Ok',
			'bind':  'data-open-modal',
			'autoClose': true
		}]
	});
}