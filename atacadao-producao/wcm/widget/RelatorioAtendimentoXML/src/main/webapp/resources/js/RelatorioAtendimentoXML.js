var MyDataTable = SuperWidget.extend({

	bindings: {
		local: {},
		global: {}
	},

	init: function () {
		dataSol();
		initFilters();
		//myLoading("Carregando...", "Por favor, aguarde...", "charge", true, true);
	}

});

var dadosDatasetXML = null;

function charge() {
	dsXML = DatasetFactory.getDataset("dsPainelXML", null, null, null);
	var v = dsXML.values;
	var fornecedor = unicos(v, "fornecedor").map(a => a.fornecedor);
	var responsavel = unicos(v, "responsavel").map(a => a.responsavel);
}

function initFilters() {
	var dsFornecedores = DatasetFactory.getDataset("dsGetFornecedoresXML", null, null, null);

	var settingsFornecedor = {
		source: dsFornecedores.values,
		displayKey: 'fornecedor',
		multiSelect: true,
		style: {
			autocompleteTagClass: 'tag-gray',
			tableSelectedLineClass: 'info'
		},
		table: {
			header: [{
				'title': 'Fornecedor',
				'standard': true
			}],
			renderContent: ['fornecedor']
		}
	};

	var dsAtividades = DatasetFactory.getDataset("dsGetAtividadesXML", null, null, null);

	var settingsAtividade = {
		source: dsAtividades.values,
		displayKey: 'ATIVIDADE',
		multiSelect: true,
		style: {
			autocompleteTagClass: 'tag-gray',
			tableSelectedLineClass: 'info'
		},
		table: {
			header: [{
				'title': 'Atividade',
				'standard': true
			}],
			renderContent: ["ATIVIDADE"]
		}
	};

	var dsTipoDemanda = DatasetFactory.getDataset("dsGetTipoDemandaXML", null, null, null);

	var settingsDemanda = {
		source: dsTipoDemanda.values,
		displayKey: 'tipoDemanda',
		multiSelect: true,
		style: {
			autocompleteTagClass: 'tag-gray',
			tableSelectedLineClass: 'info'
		},
		table: {
			header: [{
				'title': 'Tipo de Demanda',
				'standard': true
			}],
			renderContent: ["tipoDemanda"]
		}
	};

	var dsResponsaveis = DatasetFactory.getDataset("dsGetResponsaveisXML", null, null, null);

	var settingsResponsavel = {
		source: dsResponsaveis.values,
		displayKey: 'responsavel',
		multiSelect: true,
		style: {
			autocompleteTagClass: 'tag-gray',
			tableSelectedLineClass: 'info'
		},
		table: {
			header: [{
				'title': 'Responsável',
				'standard': true
			}],
			renderContent: ["responsavel"]
		}
	};

	FLUIGC.filter('#atividade', settingsAtividade);
	FLUIGC.filter('#fornecedor', settingsFornecedor);
	FLUIGC.filter('#demanda', settingsDemanda);
	FLUIGC.filter('#responsavel', settingsResponsavel);
}


function dataSol() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();

	if (dd < 10)
		dd = '0' + dd;
	
	if (mm < 10)
		mm = '0' + mm;
	
	var dataCurrent = dd + '/' + mm + '/' + yyyy;
	document.getElementById("vlrdataEmissao").innerHTML = dataCurrent;
	setTimeout(contaSolicitacoes, 3000);
}

function loadTable() {
	const mydata = new Array();
	const constraints = new Array();

	// Captura os valores dos filtros
	const atividade = $("#atividade").val();
	const noPrazo = $("#noPrazo").val();
	const demanda = $("#demanda").val();
	const dataInicio = $("#dataInicio").val();
	const dataConclusao = $("#dataConclusao").val();
	const antecipacao = $("#antecipacao")[0].checked;
	const naPorta = $("#naPorta")[0].checked;
	const emAndamento = $("#emAndamento")[0].checked;
	const contabil = $("#contabil")[0].checked;
	const fornecedor = $("#fornecedor").val();
	const responsavel = $("#responsavel").val();
	let tipoSolicitacao = "";

	if (!isEmpty(dataInicio) && !isEmpty(dataConclusao)) {
		const dataInicioConvertida = transformaTimestamp(dataInicio, 'yyyy/mm/dd');
		const dataConclusaoConvertida = transformaTimestamp(dataConclusao, 'yyyy/mm/dd');

		if (dataInicioConvertida > dataConclusaoConvertida) 
			return FLUIGC.toast({
				title: 'Atenção!',
				message: 'A data de conclusão deve ser posterior a data de início.',
				type: 'warning'
			});
	}

	// Cria as constraints de acordo com os valores
	if (atividade != "")
		constraints.push(DatasetFactory.createConstraint("atividade", atividade, atividade, ConstraintType.MUST));
	
	if (noPrazo != "")
		constraints.push(DatasetFactory.createConstraint("noPrazo", noPrazo, noPrazo, ConstraintType.MUST));
	
	if (demanda != "")
		constraints.push(DatasetFactory.createConstraint("demanda", demanda, demanda, ConstraintType.MUST));
	
	if (dataInicio != "")
		constraints.push(DatasetFactory.createConstraint("dataInicio", dataInicio, dataInicio, ConstraintType.MUST));
	
	if (dataConclusao != "")
		constraints.push(DatasetFactory.createConstraint("dataConclusao", dataConclusao, dataConclusao, ConstraintType.MUST));
	
	if (antecipacao)
		tipoSolicitacao = "Antecipação NF";
	
	if (naPorta)
		tipoSolicitacao += antecipacao ? ",Na porta" : "Na porta";
	
	if (antecipacao || naPorta)
		constraints.push(DatasetFactory.createConstraint("tipoSolicitacao", tipoSolicitacao, tipoSolicitacao, ConstraintType.MUST));
	
	if (emAndamento)
		constraints.push(DatasetFactory.createConstraint("emAndamento", "Sim", "Sim", ConstraintType.MUST));
	
	if (contabil)
		constraints.push(DatasetFactory.createConstraint("contabil", "Sim", "Sim", ConstraintType.MUST));
	
	if (fornecedor != "")
		constraints.push(DatasetFactory.createConstraint("fornecedor", fornecedor, fornecedor, ConstraintType.MUST));
	
	if (responsavel != "") 
		constraints.push(DatasetFactory.createConstraint("responsavel", responsavel, responsavel, ConstraintType.MUST));

	//Carrega o Dataset
	const datasetXML = DatasetFactory.getDataset("dsPainelXML", null, constraints, null);
	dadosDatasetXML = [];

	if (!isEmpty(datasetXML)) 
		dadosDatasetXML = datasetXML.values;

	const myTable = FLUIGC.datatable("#tableXML", {
		dataRequest: dadosDatasetXML,
		renderContent: "#templateTable",
		header: [{
				'title': 'ID'
			}, {
				'title': 'Solicitação'
			}, {
				'title': 'Tipo de Demanda'
			},{
				'title': 'Início'
			}, {
				'title': 'Responsável'
			},{
				'title': 'Fornecedor'
			}, {
				'title': 'Atividade'
			}, {
				'title': 'No Prazo'
			}, {
				'title': 'Andamento'
			}, {
				'title': 'Conclusão'
			}, {
				'title': 'Contábil'
			}
		],
		search: {
			enabled: false
		},
		navButtons: {
			enabled: false,
		}
	}, function (err, data) {});

	$("#totalSolicitacoes").html(dadosDatasetXML.length);
}

function reduzidos(array) {
	return [...new Set(array)]
}

function unicos(arr, predicate) {
	const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];

	return [...arr.reduce((map, item) => {
		const key = (item === null || item === undefined) ?
			item : cb(item);

		map.has(key) || map.set(key, item);

		return map;
	}, new Map()).values()];
}

//Conta solicitacoes 
function contaSolicitacoes() {
	var TotalLinhas = $($("table")[0]).find("tr").not("[style='display: none;']").not(":first").length

	document.getElementById("totalSolicitacoes").innerHTML = TotalLinhas;
	document.getElementById("vlrrowsCountSolicitacoes").innerHTML = TotalLinhas;

	console.log("contaSolicitacoes " + TotalLinhas)
}

//FUNCAO IMPRESSAO
function PrintElem() {
	var idTabela = document.getElementById("valorTable").value;
	var mywindow = window.open('', 'PRINT', 'height=auto,width=auto');

	mywindow.document.write('<html><head><title></title>');
	mywindow.document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">');
	mywindow.document.write('</head><body>');
	mywindow.document.write('<div class="container col-md-12">');
	mywindow.document.write(document.getElementById("impressao").innerHTML);
	mywindow.document.write('<div class="panel panel-default" id="Totais">');
	mywindow.document.write('<div class="panel-heading ">');
	mywindow.document.write('<h3 class="panel-title"><b>Totais</b></h3>');
	mywindow.document.write('</div>');
	mywindow.document.write('<div class="panel-body">');
	mywindow.document.write('<div class="row">');
	mywindow.document.write('<div class="form-group col-md-12">');
	mywindow.document.write(document.getElementById(idTabela).innerHTML);
	mywindow.document.write('</div>');
	mywindow.document.write('</div>');
	mywindow.document.write('</div>');
	mywindow.document.write('</div>');
	mywindow.document.write('</div>');
	mywindow.document.write('</body></html>');
	mywindow.document.close(); // necessary for IE >= 10
	mywindow.focus(); // necessary for IE >= 10*/

	// mywindow.print();
	return true;
}

function substringMatcher(strs) {
	return function findMatches(q, cb) {
		var matches, substrRegex;

		matches = [];

		substrRegex = new RegExp(q, 'i');

		$.each(strs, function (i, str) {
			if (substrRegex.test(str)) {
				matches.push({
					description: str
				});
			}
		});
		
		cb(matches);
	};
}

function myLoading(title, content, func, disable, close) {
	mensagemTeste(title, content, close);

	if (disable) 
		$(".modal-footer").find("button").attr("disabled", true);

	var i = 0, _busy = false;
	var _processor = setInterval(function () {
		if (!_busy) {
			_busy = true;

			if (i == 0) {
				i++;
				window[func]()
			}

			if (!modalMyLoading.isOpen() || autoClose) {
				modalMyLoading.remove();
				clearInterval(_processor);
			}
			_busy = false;
		}
	}, 100);
}

function mensagemTeste(titulo, mensagem, fechar) {
	autoClose = fechar;

	modalMyLoading = FLUIGC.modal({
		title: titulo,
		content: mensagem,
		id: 'fluig-modal',
		size: 'larger',
		actions: [{
			'label': 'Ok',
			'bind': 'data-open-modal',
			'autoClose': fechar
		}]
	});
}

/**
 * Transforma datas em timestamp.
 * 
 * @param {data} data -> Data padrão a ser transformada em timestamp
 */
function transformaTimestamp(data, formato) {
	switch (formato) {
		case 'dd/mm/yyyy':
			var dataSplit = data.split('/');
			var novaData = dataSplit[1] + '/' + dataSplit[0] + '/' + dataSplit[2];
			return new Date(novaData).getTime();
	
		case 'yyyy/mm/dd':
			var dataSplit = data.split('/');
			var novaData = dataSplit[1] + '/' + dataSplit[2] + '/' + dataSplit[0];
			return new Date(novaData).getTime();

		default:
			console.log('transformaTimestamp: Formato não encontrado');
			break;
	}	
}