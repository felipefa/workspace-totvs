(function () {

	
	setTimeout(() => {
		if (formMode === "ADD") {
			window["zoomCentroDeCusto"].disable(true);
		}
	}, 1000);

	const btnAdicionarColaborador = document.getElementById("btnAdicionarColaborador");
	btnAdicionarColaborador.addEventListener('click', function (e) {
		addColaborador();
	})

	const btnAdicionarOrcamento = document.getElementById("btnAdicionarOrcamento");
	btnAdicionarOrcamento.addEventListener('click', function (e) {
		addOrcamento();
	})
	
	window.addEventListener("load", function () {
		if (formMode === "ADD") {
			addOrcamento();
			addColaborador();
		} else if (formMode === "VIEW") {
			btnAdicionarOrcamento.disabled = true;
			btnAdicionarColaborador.disabled = true;
		}
	});
	
})();

function addOrcamento() {
	const row = wdkAddChild('tabelaGestaoOrcamento');
	MaskEvent.init(); 
	/*
	const ano = document.getElementById("ano___" + row);
	ano.addEventListener('change', function (e) {
		if (existeRegistroTabela("ano", this.value)) {
			mensagemAlerta('Atenção', 'O ano digitado já faz parte deste Grupo de Orçamento.', false);
			row.value = "";
		}
	});
	*/
	populaTabelaFilhoComDadosPai();
}

function addColaborador() {
	const row = wdkAddChild('tabelaGestaoHierarquia');
	populaTabelaFilhoComDadosPai();
}

function removedZoomItem(removedItem) {
	const { inputId: zoomId } = removedItem;
	const row = zoomId.split("___") ? zoomId.split("___")[1] : undefined;

	if (zoomId.includes("zoomColaborador")) {
		const row = zoomId.split("___")[1];
		document.getElementById("colaboradorMatricula___" + row).value = "";
		document.getElementById("colaboradorEmail___" + row).value = "";
	} else if (zoomId.includes("zoomProcesso")) {
		document.getElementById("processId").value = "";
		populaTabelaFilhoComDadosPai();
	} else if (zoomId.includes("zoomUnidade")) { 
		const zoomCentroDeCusto = window["zoomCentroDeCusto"];
		document.getElementById("empresaCodigo").value = "";
		zoomCentroDeCusto.disable(true);
		zoomCentroDeCusto.clear();
		populaTabelaFilhoComDadosPai();
	} else if (zoomId.includes("zoomCentroDeCusto")) { 
		document.getElementById("centroDeCustoCodigo").value = "";
		populaTabelaFilhoComDadosPai();
	}
	
}

function setSelectedZoomItem(selectedItem) {
	const { inputId: zoomId } = selectedItem;
	const row = zoomId.split("___") ? zoomId.split("___")[1] : undefined;

	if (zoomId.includes("zoomColaborador")) {
		const { colleagueId, mail } = selectedItem;
		
		if (!existeRegistroTabela("colaboradorMatricula", colleagueId)) {
			document.getElementById("colaboradorMatricula___" + row).value = colleagueId;
			document.getElementById("colaboradorEmail___" + row).value = mail;
		} else {
			mensagemAlerta('Atenção', 'O colaborador selecionado já faz parte deste Grupo Hierárquico.', false);
			window[zoomId].clear();			
		}
	} else if (zoomId.includes("zoomProcesso")) {
		document.getElementById("processId").value = selectedItem.processId;
		populaTabelaFilhoComDadosPai();
	} else if (zoomId.includes("zoomUnidade")) {
		const { empresaCodigo } = selectedItem;
		document.getElementById("empresaCodigo").value = empresaCodigo;
		window["zoomCentroDeCusto"].disable(false);
		reloadZoomFilterValues("zoomCentroDeCusto", "paiEmpresaCodigo," + empresaCodigo);
		populaTabelaFilhoComDadosPai();
	} else if (zoomId.includes("zoomCentroDeCusto")) {
		const { centroDeCustoCodigo } = selectedItem;
		document.getElementById("centroDeCustoCodigo").value = centroDeCustoCodigo;
		populaTabelaFilhoComDadosPai();
		/*
		if (!existeRegistroTabela("centroDeCustoCodigo", centroDeCustoCodigo)) {
			document.getElementById("centroDeCustoCodigo").value = centroDeCustoCodigo;
		} else {
			mensagemAlerta('Atenção', 'O centro de custo selecionado já faz parte deste Grupo Hierárquico.', false);
			window[zoomId].clear();			
		}
		*/
	}
}

function existeRegistroTabela(inputId, valor) {
	const inputs = document.querySelectorAll("[id^='" + inputId + "___']");

	for (let input of inputs) {
		if (input.value === valor) {
			return true;
		}
	}
	return false;
}

function populaTabelaFilhoComDadosPai() {
	document.getElementById("grupoHierarquico").value = getGrupoOrcamentario();
	fillInput("processId", ["processoOrcamento", "processoHierarquia"]);
	fillInput("empresaCodigo", ["unidadeFilialOrcamento", "unidadeFilialHierarquia"]);
	fillInput("centroDeCustoCodigo", ["centroCustoOrcamento", "centroCustoHierarquia"]);
	fillInput("grupoHierarquico", ["grupoHierarquicoOrcamento", "grupoHierarquicoHierarquia"]);
}

function fillInput(inputHeader, inputTable) {
	
	const element = document.getElementById(inputHeader);

	inputTable.forEach((it) => {
		const elementIT = document.querySelectorAll("[id^='" + it + "___']");
		elementIT.forEach(inputIT => inputIT.value = element.value);
	});
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


function getGrupoOrcamentario() {
	return window["zoomProcesso"].getSelectedItems() && window["zoomUnidade"].getSelectedItems() && window["zoomCentroDeCusto"].getSelectedItems()
		? window["zoomProcesso"].getSelectedItems()[0] + " | " + window["zoomUnidade"].getSelectedItems()[0] + " | " + window["zoomCentroDeCusto"].getSelectedItems()[0]
		: "";
}