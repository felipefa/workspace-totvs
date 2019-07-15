/*-------------------------------------------------
  Arquivo 'scripts.js'
------------------------------------------------- */

// Document Ready jQuery
$(document).ready(function (obj) {
    showHiddenFields();

    var fluigCalendar = ["#dataIda", "#dataVolta", "#dataReembolso", "#dataRetirada", "#dataDevolucao"];
    for (var a = 0; a < fluigCalendar.length; a++) {
        FLUIGC.calendar(fluigCalendar[a]);
    };

    $("#checkboxAdian").click(function () {
        if ($("#checkboxAdian").is(':checked')) {
            $("#idValorDesejado").attr("style", "display: block");
        } else {
            $("#idValorDesejado").attr("style", "display: none");
        }
    });

    $("#idRadioMeioTransp").click(function () {
        if ($("#radioOnibus").prop("checked")) {
            $("#radioCarroAlugado, #radioCarroFrota, #radioCarroColabor").attr('checked', false);
            $("#idRadioOpcaoCarro").attr("style", "display: none");
            $("#idDataRetirada").attr("style", "display: none");
            $("#idDataDevolucao").attr("style", "display: none");
            $("#idHoraRetirada").attr("style", "display: none");
            $("#idHoraDevolucao").attr("style", "display: none");
        }
        if ($("#radioAereo").prop("checked")) {
            $("#radioCarroAlugado, #radioCarroFrota, #radioCarroColabor").attr('checked', false);
            $("#idRadioOpcaoCarro").attr("style", "display: none");
            $("#idDataRetirada").attr("style", "display: none");
            $("#idDataDevolucao").attr("style", "display: none");
            $("#idHoraRetirada").attr("style", "display: none");
            $("#idHoraDevolucao").attr("style", "display: none");
        }
        if ($("#radioCarro").prop("checked")) {
            $("#idRadioOpcaoCarro").attr("style", "display: block");
        }
    });

    $("#idRadioOpcaoCarro").click(function () {
        if ($("#radioCarroAlugado").prop("checked") || $("#radioCarroFrota").prop("checked")) {
            $("#idDataRetirada").attr("style", "display: block");
            $("#idDataDevolucao").attr("style", "display: block");
            $("#idHoraRetirada").attr("style", "display: block");
            $("#idHoraDevolucao").attr("style", "display: block");
        }
        if ($("#radioCarroColabor").prop("checked")) {
            $("#idDataRetirada").attr("style", "display: none");
            $("#idDataDevolucao").attr("style", "display: none");
            $("#idHoraRetirada").attr("style", "display: none");
            $("#idHoraDevolucao").attr("style", "display: none");
        }
    });

    $('#checkboxAdian').on('click change', function () {
        if (this.checked === true) {
            $('#idCheckboxAdian').val('S');
        } else {
            $('#idCheckboxAdian').val('N');
            $('#valorDesejado').val('0,00');
            fillAcerto();
        }
        this.checked == true ? $('#idCheckboxAdian').val('S') : $('#idCheckboxAdian').val('N');
    });

    // WKNumState Fluig
    var activity = getWKNumState();

    // Oculta o painel 'Aprovar Viagem' na atividade 0
    if (activity == 0) {
        $("#painelAprovViagem").hide();
        $("#painelAprovCotacao").hide();
        setTimeout(() => {
            window["zoomMunChegada"].disable(true);
            window["zoomMunSaida"].disable(true);
            window["zoomMunChegada"].clear();
            window["zoomMunSaida"].clear();
        }, 500);
    }

    if (activity != 0 && activity != 7) {
        document.getElementById("accordionTwo").style.display = "block";
        verificaMostraDadosViajante();
    }

    // Deixa visivel o painel 'Aprovar Viagem' na atividade 7 caso seja marcada na atividade 8 a opção 'Revisar'
    if (activity == 7 && document.getElementById("_radioAprovR").checked) {
        $("#painelAprovViagem").show();
        verificaMostraDadosViajante();
    }

    
    if (activity != 56 && document.getElementById('_radioAprovCotacaoR').checked) {
        $("#accordionNine").show();
    }

    // Deixa visivel o painel 'Aprovar Cotação' na atividade 7 caso seja marcada na atividade 56 a opção 'Revisar'
    if (activity == 7 && document.getElementById("_radioAprovCotacaoR").checked) {
        setTimeout(() => {
            $('#tipoSolicitacao').val($('#tipoSolicitacao').val()).trigger('change');
        }, 500);
    }

    // Deixa visivel o painel 'Aprovar Cotação' na atividade 7 caso seja marcada na atividade 56 a opção 'Revisar'
    if (activity == 56) {
        $("#accordionNine").show();
    } else {
        document.getElementsByName('_radioAprovCotacao').forEach(radio => {
            if (radio.checked)
                $("#accordionNine").show();
        });
    }

    // Quando escolhida a opção 'Revisão Solicitante' no painel de Aprovar Reembolso/Baixa Financeira,
    // os campos necessarios para edição retornam disponiveis para o solicitante no painel Acerto/Reembolso Financeiro.
    if (activity == 31 && document.getElementById("_radioAprovReembReS").checked) {
        showHiddenFields();

        $("#painelAprovReemb").show();
        $("*#procurarComprovante").prop('disabled', false);
        $("*#fotoInicial").prop('disabled', false);
        $("*#fotoFinal").prop('disabled', false);
        $("[id^=valorDespesa___]").attr('readonly', false);
        $("[id^=kmInicial___]").attr('readonly', false);
        $("[id^=kmFinal___]").attr('readonly', false);
        $("[id^=valorLiberado___]").attr('readonly', true);
        $("[id^=liberadoKM___]").attr('readonly', true);
    }

    if (activity == 31) {
        if ($("#obsAdiant").val() == "" || $("#obsAdiant").val() == null) {
            $("#painelObsAdiant").hide();
        }
        if ($("#obsVeiculo").val() == "" || $("#obsVeiculo").val() == null) {
            $("#painelObsVeiculo").hide();
        }
    }

    // Quando as atividades forem Reembolsar/Baixa Financeira e Aprovar Reembolso
    // os botões de adicionar despesa, excluir despesa, procurar comprovante, foto inicial e final do KM estarão bloqueados para edição.
    if (activity == 33) {
        showHiddenFields();

        document.getElementsByName('_radioAprovReemb').forEach(radio => {
		    if (radio.checked && (radio.value == 'RevisarF' || radio.value == 'RevisarS'))
                $("#painelAprovReemb").show();
        });

        $("*#procurarComprovante").prop('disabled', true);
        $("*#fotoInicial").prop('disabled', true);
        $("*#fotoFinal").prop('disabled', true);

        if ($("#obsAdiant").val() == "" || $("#obsAdiant").val() == null) {
            $("#painelObsAdiant").hide();
        }
        if ($("#obsVeiculo").val() == "" || $("#obsVeiculo").val() == null) {
            $("#painelObsVeiculo").hide();
        }
    }

    if (activity == 39) {
        showHiddenFields();

        $("*#procurarComprovante").prop('disabled', true);
        $("*#fotoInicial").prop('disabled', true);
        $("*#fotoFinal").prop('disabled', true);
        $("[id^=valorLiberado___]").attr('readonly', true);
        $("[id^=liberadoKM___]").attr('readonly', true);

        if ($("#obsAdiant").val() == "" || $("#obsAdiant").val() == null) {
            $("#painelObsAdiant").hide();
        }
        if ($("#obsVeiculo").val() == "" || $("#obsVeiculo").val() == null) {
            $("#painelObsVeiculo").hide();
        }
    }

    if (activity == 46) {
        $("*#procurarComprovante").prop('disabled', true);
        $("*#fotoInicial").prop('disabled', true);
        $("*#fotoFinal").prop('disabled', true);
        $("[id^=valorLiberado___]").attr('readonly', true);
        $("[id^=liberadoKM___]").attr('readonly', true);

        if ($("#obsAdiant").val() == "" || $("#obsAdiant").val() == null) {
            $("#painelObsAdiant").hide();
        }
        if ($("#obsVeiculo").val() == "" || $("#obsVeiculo").val() == null) {
            $("#painelObsVeiculo").hide();
        }
    }

    // Chama função no modo de visualização ou na atividade fim em especifico
    if (activity == 48 || FORM_MODE == 'VIEW') {
        showHiddenFields();
    }
});

function verificaMostraDadosViajante() {
    setTimeout(() => {
        if ($('#tipoSolicitacao').val() == 'outroColobaborado') {
            const divOutroColaborador = document.getElementById("divOutroColaborador");
            divOutroColaborador.style.display = "block";   
        }
        if ($('#tipoSolicitacao').val() == 'terceiros') {
            const divColaboradorTerceiro = document.getElementById("divColaboradorTerceiro");
            divColaboradorTerceiro.style.display = "block";
            const divDadosAprovador = document.getElementById("divDadosAprovador");
            divDadosAprovador.style.display = "block";
        }
    }, 500);
}

/**
 * Abre a barra de anexos ao clicar no botão 'Visualizar/Remover Anexos'
 */
function btnViewDocuments(id) {
    top.document.getElementsByClassName("topBtn")[0].click()
    top.document.getElementById("attachments").className += " active"
}

/**
 * -  Seta as cidades conforme a UF selecionada;
 * -  Seta Centros de Custo conforme unidade selecionada;
 * -  Seta nome e matrícula do aprovador do colaborador;
 * -  Informa se o colaborador selecionado não possui aprovador cadastrado.
 * 
 * @param {InputZoom} selectedItem zoomSelecionado.
 */
function setSelectedZoomItem(selectedItem) {
    if (selectedItem.inputId === "zoomUFPartida") {
        window["zoomMunSaida"].disable(false);
        reloadZoomFilterValues("zoomMunSaida", "codEstado," + selectedItem.idEstado);
    } else if (selectedItem.inputId === "zoomUFChegada") {
        window["zoomMunChegada"].disable(false);
        reloadZoomFilterValues("zoomMunChegada", "codEstado," + selectedItem.idEstado);
    } else if (selectedItem.inputId === "unidadeFilial") {
        const { empresaCodigo } = selectedItem;
        document.getElementById("unidadeFilialCodigo").value = empresaCodigo;
        document.getElementById("codFilial").value = empresaCodigo;
        window["centroCustoFilial"].disable(false);
        reloadZoomFilterValues("centroCustoFilial", "paiEmpresaCodigo," + empresaCodigo);
    } else if (selectedItem.inputId === "centroCustoFilial") {
        const { centroDeCustoCodigo } = selectedItem;
        const unidadeFilialCodigo = document.getElementById("unidadeFilialCodigo").value;
        document.getElementById("centroCustoFilialCodigo").value = centroDeCustoCodigo;
        getAndSetAprovador(unidadeFilialCodigo, centroDeCustoCodigo);
    } else if (selectedItem.inputId === "zoomColaborador") {
        const aprovador = getAprovadorFromGestaoDeHierarquia(selectedItem.colleagueId);
        document.getElementById("colaboradorMatricula").value = selectedItem.colleagueId;
        if (aprovador) {
            accordionTwo.style.display = "block";
            document.getElementById("aprovadorViagem").value = aprovador.colaboradorMatricula;
            document.getElementById("aprovadorNome").value = aprovador.zoomColaborador;
            const constraintCentroCusto = DatasetFactory.createConstraint("centroCustoCodigo", aprovador.centroCustoHierarquia, aprovador.centroCustoHierarquia, ConstraintType.MUST);
            const dataset = DatasetFactory.getDataset('datasetCentroDeCusto', null, new Array(constraintCentroCusto), null);
            document.getElementById("aprovadorCentroDeCusto").value = dataset.values[0].centroDeCustoDescricao;
            $("#codGestorAprov").val(aprovador.colaboradorMatricula);
        } else {
            accordionTwo.style.display = "none";
            toast('Atenção!', 'O colaborador selecionado não possui aprovador cadastrado.', 'warning');
        }
    }
}

/**
 * - Consulta o dataset do centro de custo, pega o aprovador de nível mais
 *   alto e seta as informações no formulário.
 * 
 * @param {String} unidadeFilialCodigo 
 * @param {String} centroDeCustoCodigo 
 */
function getAndSetAprovador(unidadeFilialCodigo, centroDeCustoCodigo) {
    if (unidadeFilialCodigo) {
        const aprovador = getAprovadorFromGestaoDeHierarquiaByCentroDeCusto(unidadeFilialCodigo, centroDeCustoCodigo);
        const accordionTwo = document.getElementById("accordionTwo");
        if (aprovador) {
            document.getElementById("aprovadorViagem").value = aprovador.colaboradorMatricula;
            document.getElementById("aprovadorNome").value = aprovador.zoomColaborador;
            const constraintCentroCusto = DatasetFactory.createConstraint("centroCustoCodigo", aprovador.centroCustoHierarquia, aprovador.centroCustoHierarquia, ConstraintType.MUST);
            const dataset = DatasetFactory.getDataset('datasetCentroDeCusto', null, new Array(constraintCentroCusto), null);
            document.getElementById("aprovadorCentroDeCusto").value = dataset.values[0].centroDeCustoDescricao;
            accordionTwo.style.display = "block";
            $("#codGestorAprov").val(aprovador.colaboradorMatricula);
        } else {
            accordionTwo.style.display = "none";
            toast('Atenção!', 'O colaborador selecionado não possui aprovador cadastrado.', 'warning');
        }
    }
}

// Adiciona filho
function addDespesa() {
    wdkAddChild('adicionarDespesa');

    // Carrega funções ao adicionar uma nova despesa
    valorTotal();
    totalKmRodado();
    liberarValor();
    totalLiberadoKm();
    var indexAtual = document.getElementById("qtDespesas").value;
    var indexYet = document.getElementById("indexTmp").value;
    var indexNow = parseInt(indexAtual);
    var indexGo = parseInt(indexYet);
    indexNow = indexNow + 1;
    indexGo = indexGo + 1;
    document.getElementById("qtDespesas").value = indexNow;
    document.getElementById("indexTmp").value = indexGo;
}

// Remove filho
function delDespesa(oElement) {
    var activity = getWKNumState();

    if (activity != 33) {
        fnWdkRemoveChild(oElement);

        var indexAtual = document.getElementById("qtDespesas").value;
        var indexNow = parseInt(indexAtual);

        indexAtual = indexAtual - 1;
        document.getElementById("qtDespesas").value = indexAtual;
    }

    // Carrega funções ao deletar despesa adicionada
    valorTotal();
    totalKmRodado();
    liberarValor();
    totalLiberadoKm();
    fillAcerto();
}

function valorTotal() {
    var total = 0;
    $("input[id^='valorDespesa___']").each(function () {
        if ($(this).val()) {
            total += parseFloat($(this).val());
        }
    });
    $("#totalSol").val(total.toFixed(2));
}

function resultadoKM(obj) {
    var idObj = $(obj).attr('id');
    var partes = idObj.split("___");
    var kmInicio = $("#kmInicial___" + partes[1]).val();
    var kmFinal = $("#kmFinal___" + partes[1]).val();
    var diferencaKm = kmInicio - kmFinal;
    var resultadoKm = - diferencaKm;
    if (resultadoKm >= 0) {
        $("#totalKM___" + partes[1]).val(resultadoKm);
    } else {
        $("#totalKM___" + partes[1]).val(0);
    }
    valorTotalPorKM(obj);
}

function totalKmRodado() {
    var totalKm = 0;
    $("input[id^='totalKM___']").each(function () {
        if ($(this).val()) {
            totalKm += parseInt($(this).val());
        }
    });
    $("#kmRodado").val(totalKm);
}

function liberarValor() {
    var totalLiberado = 0;
    $("input[id^='valorLiberado___']").each(function () {
        if ($(this).val()) {
            totalLiberado += parseFloat($(this).val());
        }
    });
    $("#totalLib").val(totalLiberado.toFixed(2));
}

function totalLiberadoKm() {
    var totalKmLiberado = 0;
    $("input[id^='liberadoKM___']").each(function () {
        if ($(this).val()) {
            totalKmLiberado += parseInt($(this).val());
        }
    });
    $("#kmLiberado").val(totalKmLiberado);
}

function ativarDesativarCampos(obj) {
    var idx = obj.id.split('___')[1];
    if (obj.value == "" || obj.value == null) {
        document.getElementById('idValorDespesa___' + idx).style.display = 'none';
        document.getElementById('idValorLiberado___' + idx).style.display = 'none';
        document.getElementById('idProcurarComprovante___' + idx).style.display = 'none';
        document.getElementById('idKMInicial___' + idx).style.display = 'none';
        document.getElementById('idFotoInicial___' + idx).style.display = 'none';
        document.getElementById('idKMFinal___' + idx).style.display = 'none';
        document.getElementById('idFotoFinal___' + idx).style.display = 'none';
        document.getElementById('idTotalKM___' + idx).style.display = 'none';
        document.getElementById('idLiberadoKM___' + idx).style.display = 'none';
    } else if (obj.value == "km") {
        document.getElementById('idKMInicial___' + idx).style.display = 'block';
        document.getElementById('idFotoInicial___' + idx).style.display = 'block';
        document.getElementById('idKMFinal___' + idx).style.display = 'block';
        document.getElementById('idFotoFinal___' + idx).style.display = 'block';
        document.getElementById('idTotalKM___' + idx).style.display = 'block';
        document.getElementById('idLiberadoKM___' + idx).style.display = 'block';
        document.getElementById('idValorDespesa___' + idx).style.display = 'none';
        document.getElementById('idValorLiberado___' + idx).style.display = 'none';
        document.getElementById('idProcurarComprovante___' + idx).style.display = 'none';
    } else {
        document.getElementById('idValorDespesa___' + idx).style.display = 'block';
        document.getElementById('idValorLiberado___' + idx).style.display = 'block';
        document.getElementById('idProcurarComprovante___' + idx).style.display = 'block';
        document.getElementById('idKMInicial___' + idx).style.display = 'none';
        document.getElementById('idFotoInicial___' + idx).style.display = 'none';
        document.getElementById('idKMFinal___' + idx).style.display = 'none';
        document.getElementById('idFotoFinal___' + idx).style.display = 'none';
        document.getElementById('idTotalKM___' + idx).style.display = 'none';
        document.getElementById('idLiberadoKM___' + idx).style.display = 'none';
    }
}

function showHiddenFields() {
    var count = ($('table#tableItens >tbody').find('tr').length - 1);
    document.getElementById("qtDespesas").value = count

    $('table#tableItens >tbody').find('tr').each(function () {
        $(this).find('td.fs-v-align-middle').find('input, select, textarea, button').each(function () {
            var id = $(this).attr('id');
            if (id.indexOf('_') !== -1) {
                var idx_ = id.indexOf('_');
                var idx = id.replace(id.substring(0, (idx_ + 3)), '');
                console.log('id:', id, 'index:', idx);
                obj = new Object({
                    value: $('#tipoDespesa___' + idx).val()
                });
                //var idx = obj.id.split('_')[1];
                //$('#procurarComprovante').closest('div[id^=idProcurarComprovante]').css({'display': 'none'});

                if (obj.value == "") {
                    $('#valorDespesa___' + idx).closest('div[id^=idValorDespesa]').css({ 'display': 'none' });
                    $('#valorLiberado___' + idx).closest('div[id^=idValorLiberado]').css({ 'display': 'none' });
                    $('#kmInicial___' + idx).closest('div[id^=idKMInicial]').css({ 'display': 'none' });
                    $('#fotoInicial___' + idx).closest('div[id^=idFotoInicial]').css({ 'display': 'none' });//Botão anexo
                    $('#kmFinal___' + idx).closest('div[id^=idKMFinal]').css({ 'display': 'none' });
                    $('#fotoFinal___' + idx).closest('div[id^=idFotoFinal]').css({ 'display': 'none' });//Botão anexo
                    $('#totalKM___' + idx).closest('div[id^=idTotalKM]').css({ 'display': 'none' });
                    $('#liberadoKM___' + idx).closest('div[id^=idLiberadoKM]').css({ 'display': 'none' });
                    $('#kmInicial___' + idx).closest('div.row').find('div[id^=idFotoInicial]').css({ 'display': 'none' });
                    $('#kmInicial___' + idx).closest('div.row').find('div[id^=idFotoFinal]').css({ 'display': 'none' });
                    $('#procurarComprovante').closest('div[id^=idProcurarComprovante]').css({ 'display': 'none' });
                } else if (obj.value == "total") {
                    $('#dataReembolso___' + idx).prop('readonly', true);
                    $('#tipoDespesa___' + idx).attr('readonly', true);
                    $('#tipoDespesa___' + idx).css({ 'pointer-events': 'none', 'touch-action': 'none' }).closest('div.input-group').css({ 'cursor': 'not-allowed' });
                    $('#valorDespesa___' + idx).prop('readonly', true).closest('div[id^=idValorDespesa]').css({ 'display': 'block' });
                    $('#valorLiberado___' + idx).prop('readonly', false).closest('div[id^=idValorLiberado]').css({ 'display': 'block' });
                    $('#kmInicial___' + idx).closest('div[id^=idKMInicial]').css({ 'display': 'none' });
                    $('#fotoInicial___' + idx).closest('div[id^=idFotoInicial]').css({ 'display': 'none' }); //Botão anexo
                    $('#kmFinal___' + idx).closest('div[id^=idKMFinal]').css({ 'display': 'none' });
                    $('#fotoFinal___' + idx).closest('div[id^=idFotoFinal]').css({ 'display': 'none' }); //Botão anexo
                    $('#totalKM___' + idx).closest('div[id^=idTotalKM]').css({ 'display': 'none' });
                    $('#liberadoKM___' + idx).closest('div[id^=idLiberadoKM]').css({ 'display': 'none' });
                    $('#kmInicial___' + idx).closest('div.row').find('div[id^=idFotoInicial]').css({ 'display': 'none' });
                    $('#kmInicial___' + idx).closest('div.row').find('div[id^=idFotoFinal]').css({ 'display': 'none' });
                    $('#valorLiberado___' + idx).closest('div.row').find('div[id^=idProcurarComprovante]').css({ 'display': 'block' });
                } else if (obj.value == "km") {
                    $('#dataReembolso___' + idx).prop('readonly', true);
                    $('#tipoDespesa___' + idx).attr('readonly', true);
                    $('#tipoDespesa___' + idx).css({ 'pointer-events': 'none', 'touch-action': 'none' }).closest('div.input-group').css({ 'cursor': 'not-allowed' });
                    $('#valorDespesa___' + idx).closest('div[id^=idValorDespesa]').css({ 'display': 'none' });
                    $('#valorLiberado___' + idx).closest('div[id^=idValorLiberado]').css({ 'display': 'none' });
                    $('#kmInicial___' + idx).prop('readonly', true).closest('div[id^=idKMInicial]').css({ 'display': 'block' });
                    $('#kmFinal___' + idx).prop('readonly', true).closest('div[id^=idKMFinal]').css({ 'display': 'block' });
                    $('#totalKM___' + idx).closest('div[id^=idTotalKM]').css({ 'display': 'block' });
                    $('#liberadoKM___' + idx).prop('readonly', false).closest('div[id^=idLiberadoKM]').css({ 'display': 'block' });
                    $('#kmInicial___' + idx).closest('div.row').find('div[id^=idFotoInicial]').css({ 'display': 'block' });
                    $('#kmInicial___' + idx).closest('div.row').find('div[id^=idFotoFinal]').css({ 'display': 'block' });
                    $('#valorLiberado___' + idx).closest('div.row').find('div[id^=idProcurarComprovante]').css({ 'display': 'none' });
                } else {
                    $('#dataReembolso___' + idx).prop('readonly', true);
                    $('#tipoDespesa___' + idx).attr('readonly', true);
                    $('#tipoDespesa___' + idx).css({ 'pointer-events': 'none', 'touch-action': 'none' }).closest('div.input-group').css({ 'cursor': 'not-allowed' });
                    $('#valorDespesa___' + idx).prop('readonly', true).closest('div[id^=idValorDespesa]').css({ 'display': 'block' });
                    $('#valorLiberado___' + idx).prop('readonly', false).closest('div[id^=idValorLiberado]').css({ 'display': 'block' });
                    $('#kmInicial___' + idx).closest('div[id^=idKMInicial]').css({ 'display': 'none' });
                    $('#fotoInicial___' + idx).closest('div[id^=idFotoInicial]').css({ 'display': 'none' }); //Botão anexo
                    $('#kmFinal___' + idx).closest('div[id^=idKMFinal]').css({ 'display': 'none' });
                    $('#fotoFinal___' + idx).closest('div[id^=idFotoFinal]').css({ 'display': 'none' }); //Botão anexo
                    $('#totalKM___' + idx).closest('div[id^=idTotalKM]').css({ 'display': 'none' });
                    $('#liberadoKM___' + idx).closest('div[id^=idLiberadoKM]').css({ 'display': 'none' });
                    $('#kmInicial___' + idx).closest('div.row').find('div[id^=idFotoInicial]').css({ 'display': 'none' });
                    $('#kmInicial___' + idx).closest('div.row').find('div[id^=idFotoFinal]').css({ 'display': 'none' });
                    $('#valorLiberado___' + idx).closest('div.row').find('div[id^=idProcurarComprovante]').css({ 'display': 'block' });
                }
            }
        });
    });
}

// ShowCamera (botão de procurar comprovante de alimentação)
function comprovanteAlimentacao(obj) {
    var idObj = $(obj).attr('id'); // pega o atributo id do campo e armazena na variavel idObj
    var partes = idObj.split("_"); // Quebra em partes
    var data = "dataReembolso___" + partes[3]; // pega o id do campo junto com o parte 3, o index do id
    var tipo = "tipoDespesa___" + partes[3];
    var valor = "valorDespesa___" + partes[3];
    var idData = $('#' + data).val();
    var idTipo = $('#' + tipo).val();
    var idValor = $('#' + valor).val();

    if (idData != undefined && idData != "" && idTipo != undefined && idTipo != "" && idValor != undefined && idValor != "") {
        var nomeDocumento = idData + " - " + idTipo + " - " + idValor;
        new Promise((res, rej) => {
            JSInterface.showCamera(nomeDocumento);
            res('done', 500);
        }).then(() => {
            window.scrollTo(0, 0);
        });
    } else {
        // Mensagem de alerta
        FLUIGC.message.alert({
            title: 'ERRO',
            message: 'Os campos Data, Tipo Despesa e Valor Despesa devem ser preenchidos primeiramente!',
            label: 'Ok'
        });
    }
}

// ShowCamera (Anexar comprovante de km inicial)
function comprovanteKMInicial(obj) {
    var idObj = $(obj).attr('id'); // pega o atributo id do campo e armazena na variavel idObj
    var partes = idObj.split("_"); // Quebra em partes
    var data = "dataReembolso___" + partes[3]; // pega o id do campo junto com o parte 3, o index do id
    var tipo = "tipoDespesa___" + partes[3];
    var inicial = "kmInicial___" + partes[3];
    var idData = $('#' + data).val();
    var idTipo = $('#' + tipo).val();
    var idInicial = $('#' + inicial).val();

    if (idData != undefined && idData != "" && idTipo != undefined && idTipo != "" && idInicial != undefined && idInicial != "") {
        var nomeDocumento = idData + " - " + idTipo + " - " + idInicial;
        new Promise((res, rej) => {
            JSInterface.showCamera(nomeDocumento);
            res('done', 500);
        }).then(() => {
            window.scrollTo(0, 0);
        });
    } else {
        // Mensagem de alerta
        FLUIGC.message.alert({
            title: 'ERRO',
            message: 'O campo KM Inicial deve ser preenchido primeiramente!!',
            label: 'Ok'
        });
    }
}

// ShowCamera (Anexar comprovante de km final)
function comprovanteKMFinal(obj) {
    var idObj = $(obj).attr('id'); // pega o atributo id do campo e armazena na variavel idObj
    var partes = idObj.split("_"); // Quebra em partes
    var data = "dataReembolso___" + partes[3]; // pega o id do campo junto com o parte 3, o index do id
    var tipo = "tipoDespesa___" + partes[3];
    var final = "kmFinal___" + partes[3];
    var idData = $('#' + data).val();
    var idTipo = $('#' + tipo).val();
    var idFinal = $('#' + final).val();

    if (idData != undefined && idData != "" && idTipo != undefined && idTipo != "" && idFinal != undefined && idFinal != "") {
        var nomeDocumento = idData + " - " + idTipo + " - " + idFinal;
        new Promise((res, rej) => {
            JSInterface.showCamera(nomeDocumento);
            res('done', 500);
        }).then(() => {
            window.scrollTo(0, 0);
        });
    } else {
        // Mensagem de alerta
        FLUIGC.message.alert({
            title: 'ERRO',
            message: 'O campo KM Final deve ser preenchido primeiramente!!',
            label: 'Ok'
        });
    }
}

//Mascara de 'moeda' para o campos de valor
function mascaraMoeda(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execMascaraMoeda()", 1)
}

function execMascaraMoeda() {
    v_obj.value = v_fun(v_obj.value)
}

function valorMask(v) {
    v = v.replace(/\D/g, "");               //Remove tudo o que não é dígito
    v = v.replace(/(\d)(\d{8})$/, "$1.$2"); //coloca o ponto dos milhões
    v = v.replace(/(\d)(\d{5})$/, "$1.$2"); //coloca o ponto dos milhares
    v = v.replace(/(\d)(\d{2})$/, "$1,$2"); //coloca a virgula antes dos 2 últimos dígitos
    return v;
}

// Carregamemto padrão de Elementos do Fluig
function loadDefault() {
    //permite digitar somente numeros
    $('body').on('keypress', '[data-only-numbers]', function (ev) {
        var k = ev.keyCode || ev.which;
        //Permite apagar o conteúdodo do campo usando as teclas 'backspace' ou 'delete' no firefox.
        //Nos outros navegadores o keypress não gera evento.
        if (k == 8 || k == 46) {
            return true;
        }
        k = String.fromCharCode(k);
        if (isNaN(k)) {
            return false;
        }
        return true;
    });
    $('.create-form-components').on('keyup', 'input[required="required"][type="text"], input[required="required"][type="number"], input[required="required"][type="date"], textarea[required="required"]', function () {
        validationFieldsForm($(this), $(this).parents('.form-field').data('type'));
    });
    $('.create-form-components').on('change', 'input[required="required"][type="checkbox"], input[required="required"][type="radio"], select[required="required"]',
        function () {
            validationFieldsForm($(this), $(this).parents('.form-field').data('type'));
        });
    function validationFieldsForm(field, type) {
        if (type === "checkbox" || type === "radio") {
            if (!field.is(':checked')) {
                field.parents('.form-field').addClass('required');
            } else {
                field.parents('.form-field').removeClass('required');
            }
        } else {
            if (!field.val().trim()) {
                field.parents('.form-field').addClass('required');
            } else {
                field.parents('.form-field').removeClass('required');
            }
        }
    }
    var $zoomPreview = $(".zoom-preview");
    if ($zoomPreview.length) {
        $zoomPreview.parent().removeClass("input-group");
        $zoomPreview.remove();
    }
    var ratings = $(".rating");
    if (ratings.length > 0)
        ratingStars(ratings);
    function ratingStars(stars) {
        $.each(stars, function (i, obj) {
            var field = $(this).closest(".form-group").find(
                ".rating-value");
            var tgt = $(obj);
            tgt.html("");
            var rating = FLUIGC.stars(tgt, {
                value: field.val()
            });
            rating.on("click", function (o) {
                field.val($(this).index() + 1);
            });
        });
    }
    $.each($("[data-date]"), function (i, o) {
        var id = $(o).attr("id");
        FLUIGC.calendar("#" + id);
    });
}


function selecionarTipoSolicitacao(element) {

    const divColaboradorTerceiro = document.getElementById("divColaboradorTerceiro");
    const divOutroColaborador = document.getElementById("divOutroColaborador");
    const divDadosAprovador = document.getElementById("divDadosAprovador");
    const divCheckboxAdian = document.getElementById("divCheckboxAdian");
    const idValorDesejado = document.getElementById("idValorDesejado");

    if (element.value === "terceiros") {
        divColaboradorTerceiro.style.display = "block";
        divDadosAprovador.style.display = "block";
        window["unidadeFilial"].disable(false);
        divCheckboxAdian.classList.add("hidden");
        idValorDesejado.classList.add("hidden");
        divOutroColaborador.style.display = "none";
        document.getElementById("bancoDescricao").value = "";
        document.getElementById("bancoContaCorrente").value = "";
        document.getElementById("bancoAgencia").value = "";
        document.getElementById("valorDesejado").value = "";
        document.getElementById("aprovadorViagem").value = "";
        document.getElementById("aprovadorNome").value = "";
        document.getElementById("aprovadorCentroDeCusto").value = "";
        accordionTwo.style.display = "none";
        if (!document.getElementById("centroCustoFilial").value) {
            window["centroCustoFilial"].disable(true);
        }
        window["zoomColaborador"].clear();
        document.getElementById("colaboradorMatricula").value = "";
    } else {
        divColaboradorTerceiro.style.display = "none";
        divDadosAprovador.style.display = "none";
        window["unidadeFilial"].disable(true);
        window["centroCustoFilial"].clear();
        window["centroCustoFilial"].disable(true);
        window["unidadeFilial"].clear();
        divCheckboxAdian.classList.remove("hidden");
        idValorDesejado.classList.remove("hidden");
        if (element.value === "propria") {
            const nomeSolic = document.getElementById("nomeSolic");
            const datasetColleague = getColleagueByName(nomeSolic.value);
            divOutroColaborador.style.display = "none";
            const aprovador = getAprovadorFromGestaoDeHierarquia(datasetColleague.values[0]["colleaguePK.colleagueId"]);
            if (aprovador) {
                accordionTwo.style.display = "block";
                document.getElementById("aprovadorViagem").value = aprovador.colaboradorMatricula;
                document.getElementById("aprovadorNome").value = aprovador.zoomColaborador;
                const constraintCentroCusto = DatasetFactory.createConstraint("centroCustoCodigo", aprovador.centroCustoHierarquia, aprovador.centroCustoHierarquia, ConstraintType.MUST);
                const dataset = DatasetFactory.getDataset('datasetCentroDeCusto', null, new Array(constraintCentroCusto), null);
                document.getElementById("aprovadorCentroDeCusto").value = dataset.values[0].centroDeCustoDescricao;
            } else {
                accordionTwo.style.display = "none";
                toast('Atenção!', 'O centro de custo selecionado não possui colaborador cadastrado como aprovador.', 'warning');
            }
            window["zoomColaborador"].clear();
            document.getElementById("colaboradorMatricula").value = datasetColleague.values["0"]["colleaguePK.colleagueId"];
        } else if (element.value === "outroColobaborado") {
            divOutroColaborador.style.display = "block"
            accordionTwo.style.display = "none";
            document.getElementById("aprovadorViagem").value = "";
            document.getElementById("aprovadorNome").value = "";
            document.getElementById("aprovadorCentroDeCusto").value = "";
        }
    }

}

function getColleagueByName(name) {

    const constraintColleague1 = DatasetFactory.createConstraint('colleagueName', name, name, ConstraintType.MUST);
    const datasetColleague = DatasetFactory.getDataset('colleague', null, new Array(constraintColleague1), null);
    return datasetColleague;
}

function getAprovadorFromGestaoDeHierarquia(userId) {

    const c1 = DatasetFactory.createConstraint("tablename", 'tabelaGestaoHierarquia', 'tabelaGestaoHierarquia', ConstraintType.MUST);
    const c2 = DatasetFactory.createConstraint('colaboradorAtivo', 'on', 'on', ConstraintType.MUST);
    const dataset = DatasetFactory.getDataset('formularioGestaoDeHierarquiaEOrcamento', null, new Array(c1,c2), null);
    let retorno = false;

    if (dataset && dataset.values && dataset.values.length) {
        const rowUser = dataset.values
            .find(ds => ds.colaboradorMatricula === userId && ds.processoHierarquia === "gestaoViagem");
        if (rowUser) {
            retorno = dataset.values
                .filter(ds => ds.colaboradorNivel > rowUser.colaboradorNivel && ds.grupo === rowUser.grupo && ds.centroCustoHierarquia)
                .sort((a, b) => (a.colaboradorNivel > b.colaboradorNivel) ? 1 : ((b.colaboradorNivel > a.colaboradorNivel) ? -1 : 0))
                .find(ds => ds.processoHierarquia === "gestaoViagem" && ds.grupo === rowUser.grupo) || rowUser;
        }
    }

    return retorno;
}

function getAprovadorFromGestaoDeHierarquiaByCentroDeCusto(unidade, centroDeCusto) {
    const c1 = DatasetFactory.createConstraint("tablename", 'tabelaGestaoHierarquia', 'tabelaGestaoHierarquia', ConstraintType.MUST);
    const c2 = DatasetFactory.createConstraint('colaboradorAtivo', 'on', 'on', ConstraintType.MUST);
    const dataset = DatasetFactory.getDataset('formularioGestaoDeHierarquiaEOrcamento', null, new Array(c1,c2), null);
    let retorno = false;
    if (dataset && dataset.values && dataset.values.length) {
        retorno = dataset.values
            .filter(ds => ds.processoHierarquia === "gestaoViagem" && ds.centroCustoHierarquia === centroDeCusto && ds.unidadeFilialHierarquia === unidade && ds.colaboradorNivel > "1")
            .sort((a, b) => (a.colaboradorNivel > b.colaboradorNivel) ? 1 : ((b.colaboradorNivel > a.colaboradorNivel) ? -1 : 0))
            .shift() || false;
    }
    return retorno;
}

function removedZoomItem(removedItem) {

    const { inputId: zoomId } = removedItem;

    if (zoomId.includes("zoomColaborador")) {
        document.getElementById("aprovadorViagem").value = "";
        document.getElementById("aprovadorNome").value = "";
        document.getElementById("aprovadorCentroDeCusto").value = "";
        document.getElementById("colaboradorMatricula").value = "";
        window["centroCustoFilial"].clear();
        window["unidadeFilial"].clear();
    } else if (zoomId.includes("unidadeFilial")) {
        window["centroCustoFilial"].clear();
        window["centroCustoFilial"].disable(true);
        document.getElementById("aprovadorViagem").value = "";
        document.getElementById("aprovadorNome").value = "";
        document.getElementById("aprovadorCentroDeCusto").value = "";
        document.getElementById("unidadeFilialCodigo").value = "";
        document.getElementById("accordionTwo").style.display = "none";
    } else if (zoomId.includes("centroCustoFilial")) {
        document.getElementById("aprovadorViagem").value = "";
        document.getElementById("aprovadorNome").value = "";
        document.getElementById("aprovadorCentroDeCusto").value = "";
        document.getElementById("centroCustoFilialCodigo").value = "";
        document.getElementById("accordionTwo").style.display = "none";
    } else if (zoomId.includes("zoomUFPartida")) {
        window["zoomMunSaida"].clear();
        window["zoomMunSaida"].disable(true);
    } else if (zoomId.includes("zoomUFChegada")) {
        window["zoomMunChegada"].clear();
        window["zoomMunChegada"].disable(true);
    }
}

function dblclickRadioMeioTransp() {
    deselectRadio("radioMeioTransp");
    deselectRadio("radioCarros");
    disaplyInput("none", ["idRadioOpcaoCarro", "idDataRetirada", "idDataDevolucao", "idHoraRetirada", "idHoraDevolucao", "idRadioOpcaoCarro"]);
}

function deselectRadio(inputName) {
    document.getElementsByName(inputName).forEach(radio => radio.checked = false)
}

function disaplyInput(display, inputs) {
    inputs.forEach(input => document.getElementById(input).style.display = display);
}

function valorTotalPorKM(element) {
    if (element && element.id) {
        const { id, value } = element;
        const row = id.split("___")[1];
        if (value) {
            document.getElementById("liberadoKM___" + row).value = parseInt(value) * 0.70;
        }
    }
}

function changeValorDesejado() {
    const valorDesejado = document.getElementById("valorDesejado").value;
    //if (valorDesejado) {
    document.getElementById("valorSolicitado").value = valorDesejado;
    //}
}

function getTotalGasto() {
    const inputs = document.querySelectorAll("[id*='tipoDespesa___']");
    return Array.prototype.slice.call(inputs).reduce((acc, arr) => {
        const { id, value } = arr;
        const row = id.split("___")[1];
        if (value && value === "km") {
            const liberadoKM = document.getElementById("liberadoKM___" + row).value;
            return acc = (liberadoKM ? parseFloat(liberadoKM.replace(",", ".")) : 0) + parseFloat(acc);
        } else {
            const valorDespesa = document.getElementById("valorDespesa___" + row).value;
            return acc = (valorDespesa ? parseFloat(valorDespesa.replace(",", ".")) : 0) + parseFloat(acc);
        }
    }, 0.00).toFixed(2).replace(".", ",");
}

function getSaldo() {
    const valorSolicitado = document.getElementById("valorSolicitado").value;
    const totalGasto = getTotalGasto();
    let retorno = "0,00";
    if (valorSolicitado && totalGasto && valorSolicitado !== "NaN" && totalGasto !== "NaN") {
        const saldo = (parseFloat(totalGasto) - parseFloat(valorSolicitado));
        retorno = saldo.toFixed(2).replace(".", ",");
    }
    return retorno;
}

function fillAcerto() {
    changeValorDesejado();
    const totalGasto = getTotalGasto();
    const saldo = getSaldo();
    document.getElementById("totalGasto").value = totalGasto && totalGasto !== "NaN" ? totalGasto : "0,00";
    document.getElementById("saldo").value = saldo && saldo !== "NaN" ? saldo : "0,00";
}