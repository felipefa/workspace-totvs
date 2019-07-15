function somaDiaria(tag) {

	var indexSelectedTipoDiaria = getIndex(tag);
	var quant = $('input#dsQuantidade___' + indexSelectedTipoDiaria);
	checkAmount(quant);

	var valor = parseFloat(document.getElementById("dsValor___" + indexSelectedTipoDiaria).value);
	var quantidade = parseFloat(document.getElementById("dsQuantidade___" + indexSelectedTipoDiaria).value);
	var total = valor * quantidade;
	total = total.toFixed(2);
	$('input#dsTotal___' + indexSelectedTipoDiaria).val(total);

}

function checkAmount(amountEl) {
	if (amountEl.val() == "" || amountEl.val() == "0") {
		amountEl.val(1);
	}
}


function mascaraValue(o, f) {
	v_obj = o;
	v_fun = f;
	setTimeout("execmascara()", 1);
}
function execmascara() {
	v_obj.value = v_fun(v_obj.value);
}

function mvalor(v) {
	va = v.value;
	na = v.name;

	//va=va.replace(/\D/g,"");//Remove tudo o que não é dígito
	va = va.replace(/\d|,/g, "");//Remove tudo o que não é dígito
	va = va.replace(/(\d)(\d{1})$/, "$1.$2");
	return document.getElementById(v.name).value = va;
}

function mnum(v) {
	v = v.replace(/\D/g, "");//Remove tudo o que não é dígito
	return v;
}

/**
 *	Se a data da retirada do carro for antes da ida da viagem VVVVVV
 *	Se a data da retirada do carro for depois da volta da viagem VVVVVVV
 *
 * 	Se a data da devolução do carro for antes da data de ida da viagem VVVVVVV
 *	Se a data da devolução do carro for depois da data da volta da viagem VVVVVV
 *
 *	Se a data da retirada do  carro for depois da data da devolução do carro
 */
const calculeDiferencaDatas = (tipo) => {
	const dtInicial = $("#dataIda").val();
	const hrInicial = $("#horaChegada").val();
	const dtFinal = $("#dataVolta").val();
	const hrFinal = $("#horaRetorno").val();
	const valorData = $(`#data${tipo}`).val();
	const valorHora = $(`#hora${tipo}`).val();
	const valorDataEHora = moment(valorData + ' ' + valorHora, 'DD/MM/YYYY HH:mm');
	tipo = tipo == 'Devolucao' ? 'devolução' : 'retirada';

	if (dtInicial !== undefined && dtFinal !== undefined
		&& hrInicial !== undefined && hrFinal !== undefined
		&& valorData !== undefined &&  valorHora !== undefined
		&& dtInicial !== '' && dtFinal !== '' && hrInicial !== ''
		&& hrFinal !== '' && valorData !== '' && valorHora !== '') {
		const dataEHoraInicial = moment(dtInicial + ' ' + hrInicial, 'DD/MM/YYYY HH:mm');
		const dataEHoraFinal = moment(dtFinal + ' ' + hrFinal, 'DD/MM/YYYY HH:mm');

		if (valorDataEHora.isBefore(dataEHoraInicial))
			toast('Atenção', 'A data e hora de ' + tipo + ' do carro está anterior à data de saída da viagem.', 'warning');

		if (valorDataEHora.isAfter(dataEHoraFinal))
			toast('Atenção!', 'A data e hora de ' + tipo + ' do carro está posterior à data de retorno da viagem.', 'warning');

		const outroTipo = tipo == 'retirada' ? 'Devolucao' : 'Retirada';
		const valorOutraData = $(`#data${outroTipo}`).val();
		const valorOutraHora = $(`#hora${outroTipo}`).val();

		if (valorOutraData !== undefined && valorOutraHora !== undefined && valorOutraData !== '' && valorOutraHora !== '') {
			const valorOutraDataEHora = moment(valorOutraData + ' ' + valorOutraHora, 'DD/MM/YYYY HH:mm');
			if (outroTipo == 'Retirada') {
				if (valorOutraDataEHora.isAfter(valorDataEHora))
					toast('Atenção!', 'A data e hora de retirada do carro deve ser anterior a sua data de devolução.', 'warning');
			} else {
				if (valorOutraDataEHora.isBefore(valorDataEHora))
					toast('Atenção!', 'A data e hora de retirada do carro deve ser anterior a sua data de devolução.', 'warning');
			}
		}
	}
}

function toast(title, message, type, timeout = 4000) {
	FLUIGC.toast({
		title: title,
		message: message,
		type: type,
		timeout: timeout
	});
}

function calculeDiaria() {
	//libs();

	var dtInicial = $("#dataIda").val();
	var dtFinal = $("#dataVolta").val();
	var hrInicial = $("#horaChegada").val();
	var hrFinal = $("#horaRetorno").val();
	var m1 = dtInicial + ' ' + hrInicial;
	var m2 = dtFinal + ' ' + hrFinal;

	if (dtInicial !== undefined && dtFinal !== undefined && hrInicial !== undefined && hrFinal !== undefined
		&& dtInicial !== '' && dtFinal !== '' && hrInicial !== '' && hrFinal !== '') {
		mI = moment(m1, 'DD/MM/YYYY HH:mm');
		mII = moment(m2, 'DD/MM/YYYY HH:mm');
		var diff = moment.preciseDiff(mI, mII, true);
		if (diff.firstDateWasLater == false) {
			console.log(diff);
			if (diff.days == 0 && diff.hours < 4) {
				toast('Atenção!','A quantidade de horas informada não gera diária, pois é menor que 4 horas dentro do mesmo dia.', 'warning');
				$("#hrEntrada").val('');
				$("#qtDiaria").val('');
			} else if (diff.days == 0 && diff.hours >= 4) {
				$("#qtDiaria").val(parseFloat(0.5));
				atualizaSomaTotal();
			} else if (diff.days > 0) {
				$("#qtDiaria").val(parseFloat(diff.days) + parseFloat(0.5));
				atualizaSomaTotal();
			}
			$("#hrPositivo").val('positivo');
		} else {
			toast('Atenção!',"Valide a data/hora informada, pois a data/hora de saída é maior ou igual que a data/hora de entrada.", 'warning');
			$("#hrEntrada").val('');
			$("#dtEntrada").val('');
			$("#qtDiaria").val('')
			$("#hrPositivo").val('negativo');
		}
	}
}

function atualizaSomaTotal() {
	var quantDiaria = $("#qtDiaria").val();
	var valAdiantamento = $("#qtDiaria").val();
	var somaKm = 0;
	var totalSoma = 0;
	var somaDiaria = 0;
	if ($("table[tablename='tabPercurso'] tbody tr").length > 1) {
		$("input[id^='percursoKm']").each(function (index) {
			var id = $(this).attr("id").split("___")[1];
			if ($("#percursoKm___" + id).val() != '' && $("#percursoKm___" + id).val() != null) {
				//console.log(parseFloat($("#percursoKm___" + id).val()));
				somaKm += parseFloat($("#percursoKm___" + id).val());
			}
		});


	}

	if ($("#tpTranslado").val() == "CP") {
		var resultKm = 0

		resultKm = somaKm * 1.20;
		$("#vlKm").val(resultKm.toFixed(2));
		$("#qtKm").val(somaKm);
		somaDiaria = $("#qtDiaria").val() * 176;
		$("#vlDiaria").val(somaDiaria.toFixed(2));
		totalSoma = (somaDiaria) + resultKm;


	} else {
		var adiantamento = 0

		if ($("#dsAdiantamento").val() != "" && $("#dsAdiantamento").val() != null) {
			adiantamento = parseFloat($("#dsAdiantamento").val());
		}
		somaDiaria = $("#qtDiaria").val() * 176;
		$("#vlDiaria").val(somaDiaria.toFixed(2));
		totalSoma = (somaDiaria) + adiantamento;
	}
	$("#dsTotalGasto").val(totalSoma.toFixed(2));
}

function calculeDiariaAc() {

	libs();

	var dtInicial = $("#dtSaidaAc").val();
	var dtFinal = $("#dtEntradaAc").val();
	var hrInicial = $("#hrSaidaAc").val();
	var hrFinal = $("#hrEntradaAc").val();
	var m1 = dtInicial + ' ' + hrInicial;
	var m2 = dtFinal + ' ' + hrFinal;

	if (dtInicial !== undefined && dtFinal !== undefined && hrInicial !== undefined && hrFinal !== undefined
		&& dtInicial !== '' && dtFinal !== '' && hrInicial !== '' && hrFinal !== '') {
		mI = moment(m1, 'YYYY-MM-DD HH:mm');
		mII = moment(m2, 'YYYY-MM-DD HH:mm');
		var diff = moment.preciseDiff(mI, mII, true);
		if (diff.firstDateWasLater == false) {
			console.log(diff);
			if (diff.days == 0 && diff.hours < 4) {
				toast('Atenção!','A quantidade de horas informada não gera diária, pois é menor que 4 horas dentro do mesmo dia.', 'warning');
				$("#hrEntradaAc").val('');
				$("#qtDiariaAc").val('');
			} else if (diff.days == 0 && diff.hours >= 4) {
				$("#qtDiariaAc").val(parseFloat(0.5));
				atualizaSomaTotalAc();
			} else if (diff.days > 0) {
				$("#qtDiariaAc").val(parseFloat(diff.days) + parseFloat(0.5));
				atualizaSomaTotalAc();
			}
			$("#hrPositivoAc").val('positivo');
		} else {
			toast('Atenção!',"Valide a data/hora informada, pois a data/hora de saída é maior ou igual que a data/hora de entrada.", 'warning');
			$("#hrEntradaAc").val('');
			$("#dtEntradaAc").val('');
			$("#qtDiariaAc").val('')
			$("#hrPositivoAc").val('negativo');
		}
	}
}

function atualizaSomaTotalAc() {
	var quantDiaria = $("#qtDiariaAc").val();
	var valAdiantamento = $("#qtDiariaAc").val();
	var somaKm = 0;
	var totalSoma = 0;
	var somaDiaria = 0;
	if ($("table[tablename='tabPercursoAc'] tbody tr").length > 1) {
		$("input[id^='percursoKmAc']").each(function (index) {
			var id = $(this).attr("id").split("___")[1];
			if ($("#percursoKmAc___" + id).val() != '' && $("#percursoKmAc___" + id).val() != null) {
				//console.log(parseFloat($("#percursoKm___" + id).val()));
				somaKm += parseFloat($("#percursoKmAc___" + id).val());
			}
		});


	}

	if ($("#tpTransladoAc").val() == "CP") {
		var resultKm = 0

		resultKm = somaKm * 1.20;
		$("#vlKmAc").val(resultKm.toFixed(2));
		$("#qtKmAc").val(somaKm);
		somaDiaria = $("#qtDiariaAc").val() * 176;
		$("#vlDiariaAc").val(somaDiaria.toFixed(2));
		totalSoma = (somaDiaria) + resultKm;


	} else {
		var adiantamento = 0

		if ($("#dsAdiantamentoAc").val() != "" && $("#dsAdiantamentoAc").val() != null) {
			adiantamento = parseFloat($("#dsAdiantamento").val());
		}
		somaDiaria = $("#qtDiariaAc").val() * 176;
		$("#vlDiariaAc").val(somaDiaria.toFixed(2));
		totalSoma = (somaDiaria) + adiantamento;
	}
	$("#dsTotalGastoAc").val(totalSoma.toFixed(2));
}

function diasUteis() {
	fnHashFuncoes(arguments.callee.name);

	var dtInicial = $("#dtInicial").val();
	var dtFinal = $("#dtFinal").val();
	var m1 = moment(dtInicial, 'DD-MM-YYYY');
	var m2 = moment(dtFinal, 'DD-MM-YYYY');
	var diff = moment.preciseDiff(m1, m2, true);
	var qtd = diff.days;
	if (diff == '') {
		qtd = 0;
	}
	var diaSemana = new Array();
	var turno = '2';
	var data1;
	for (var i = 0; i <= qtd; i++) {
		data1 = moment(m1, 'DD/MM/YYYY').format('E');
		diaSemana[i] = data1;
		m1 = moment(m1, 'DD/MM/YYYY').add(1, 'day');
	}
	console.log('diaSemana', diaSemana);
	return diaSemana;
}


function pegaIndex(campo) {
	var id = campo.id.split("___")[1];
	return id;
};

function somaOutraDespesa(indexId) {

	var campoId = pegaIndex(indexId);
	var qtd = $('#qtdValorAc___' + campoId).val();
	var val = $("#dsValorUnitarioAc___" + campoId).val();
	var total = parseFloat(val) * parseFloat(qtd);

	$("#totalValorAc___" + campoId).val(total)
	somaTotalGastosAc()

}

function somaTotalGastosAc() {
	var tudo = 0;
	var kilometro = $("#vlDiariaAc").val()
	if (kilometro == "") { kilometro = 0 }

	$("input[id^='totalValorAc___']").each(function () {
		if ($(this).val()) {
			tudo += parseFloat($(this).val());
		}
	});

	$("#acertoTotalGastos").val(tudo + parseFloat(kilometro).toFixed(2));
}