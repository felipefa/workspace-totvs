<div id="MyDataTable_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="MyDataTable.instance()">

<link rel="stylesheet" type="text/css" href="/style-guide/css/fluig-style-guide-filter.min.css">
<script src="/style-guide/js/fluig-style-guide-filter.min.js"></script>
<link type="text/css" rel="stylesheet" href="/portal/resources/style-guide/css/fluig-style-guide.min.css" />
<script type="text/javascript" src="/portal/resources/js/jquery/jquery.js"></script>
<script type="text/javascript" src="/portal/resources/js/jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="/portal/resources/js/mustache/mustache-min.js"></script>
<script type="text/javascript" src="/portal/resources/style-guide/js/fluig-style-guide.min.js" charset="utf-8"></script>
<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>
<script type="text/template" id="templateTable">
  <tr >
    <td >{{solicitacao}} </td>   
    <td >{{tipoSolicitacao}}</td>
    <td >{{tipoDemanda}}</td>
    <td >{{dataInicio}}</td>
    <td >{{responsavel}}</td>
    <td >{{fornecedor}}</td>
    <td >{{atividade}}</td>
    <td >{{noPrazo}}</td>
    <td >{{emAndamento}}</td>
    <td >{{dataConclusao}}</td>
    <td >{{contabil}}</td>
</tr>
</script>
  <!-- Início Accordion -->
  <div class="panel-group" id="accordion">
    <!-- Painel de Filtros -->
    <div class="panel panel-primary" id="panel_dadosdasolicitacao">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a class="collapse-icon up" data-toggle="collapse" data-parent="#accordion" href="#collapseFiltros">
            Filtros
          </a>
        </h4>
      </div>
      <div id="collapseFiltros" class="panel-collapse collapse in">
        <div class="panel-body">
          <div class="row">
            <div class="form-group col-md-4 col-xs-12">
              <label for="atividade">Atividade</label>
              <input type="text" class="form-control" name="atividade" id="atividade">
            </div>
            <div class="form-group col-md-4 col-xs-12" style="display: none">
              <label for="tipo">Tipo</label>
              <select class="form-control" name="tipo" id="tipo">
                <option value="">Selecione</option>
                <option value="Contábil">Contábil</option>
                <option value="Quantidade">Quantidade</option>
              </select>
            </div>
            <div class="form-group col-md-4 col-xs-12">
              <label for="noPrazo">No Prazo</label>
              <select class="form-control" name="noPrazo" id="noPrazo">
                <option value="">Selecione</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
            <div class="form-group col-md-4 col-xs-12">
              <label for="demanda">Tipo de Demanda</label>
              <input type="text" class="form-control" name="demanda" id="demanda">
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-4 col-xs-12">
              <label for="dataInicio" style="margin-bottom: 5%;">Data Início</label>
              <div class="input-group enable-calendar">
                <input type="date" class="form-control" name="dataInicio" id="dataInicio">
                <input type="hidden" class="form-control" name="convDataIncio" id="convDataIncio">
                <span class="input-group-addon fs-cursor-pointer">
                  <span class="fluigicon fluigicon-calendar"></span>
                </span>
              </div>
            </div>
            <div class="form-group col-md-4 col-xs-12">
              <label for="dataConclusao" style="margin-bottom: 5%;">Data Conclusão</label>
              <div class="input-group enable-calendar">
                <input type="date" class="form-control" name="dataConclusao" id="dataConclusao">
                <input type="hidden" class="form-control" name="convDataConclusao" id="convDataConclusao">
                <span class="input-group-addon fs-cursor-pointer">
                  <span class="fluigicon fluigicon-calendar"></span>
                </span>
              </div>
            </div>
            <div class="form-group col-md-2 col-xs-12">
              <label for="solicitacao">Tipo de Solicitação</label>
              <br>
              <div class="checkbox">
                <label>
                  <input name="antecipacao" value="" type="checkbox" id="antecipacao">
                  <span class="">Antecipação NF</span>
                </label>
              </div>
              <div class="checkbox">
                <label>
                  <input name="naPorta" value="" type="checkbox" id="naPorta">
                  <span class="">Na Porta</span>
                </label>
              </div>
            </div>
            <div class="form-group col-md-2 col-xs-12">
              <label>Status</label>
              <br>
              <div class="checkbox">
                <label>
                  <input name="emAndamento" value="" type="checkbox" id="emAndamento">
                  <span class="">Em Andamento</span>
                </label>
              </div>
              <div class="checkbox">
                <label>
                  <input name="contabil" value="" type="checkbox" id="contabil">
                  <span class="">Finalizado</span>
                </label>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-4 col-xs-12">
              <label for="fornecedor">Fornecedor</label>
              <input type="text" class="form-control" name="fornecedor" id="fornecedor">
            </div>
            <div class="form-group col-md-4 col-xs-12">
              <label for="responsavel">Responsável</label>
              <input type="text" class="form-control" name="responsavel" id="responsavel">
            </div>
            <div class="form-group col-md-2 col-md-offset-2 col-xs-12">
              <br>
              <input type="button" class="form-control btn btn-info" value="Pesquisar" onclick="myLoading('Carregando...', 'Por favor, aguarde...', 'loadTable', true, true)" style="margin-top: 3%;">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Painel de Resultados da Pesquisa -->
    <div class="panel panel-primary" id="Totais">
      <div class="panel-heading">
        <h4 class="panel-title">
          <a class="collapse-icon up" data-toggle="collapse" data-parent="#accordion" href="#collapseResultados" aria-expanded="false">
            Resultados
          </a>
        </h4>
      </div>
      <div id="collapseResultados" class="panel-collapse collapse in">
        <div class="panel-body">
          <div class="row">
            <div class="form-group col-md-10">
              <h2>
                <a id="totalSolicitacoes"></a>
                Solicitações
              </h2>
            </div>
            <div class="form-group col-md-2">
              <br>
              <button class="form-control btn btn-info" onclick="abrirModalImprimir();/*PrintElem();*/">
                <i class="fluigicon fluigicon-print icon-sm"></i>
                Imprimir
              </button>
            </div>
          </div>
          <br>
          <div class="row">
            <div id="tableXML" class="form-group col-md-12"></div>
          </div>
        </div>

        <!-- Layout da Página de Impressão -->
        <div id="impressao" style="display: none">
          <div class="page-header">
            <div class="row">
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td><img src="http://nossaempresatst.fluig.com/portal/api/servlet/image/1/custom/logo_image.png" alt="Logo" id="logo" style="max-height: 60px; max-width: 140px;"></td>
                    <td>
                      <h1>Relatório de Atendimento XML</h1>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="panel panel-default">
            <div class="panel-heading ">
              <h3 class="panel-title"><b>Solicitação</b></h3>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="form-group col-md-11">
                  <h3>
                    Emitido em
                    <a id="vlrdataEmissao"></a>
                    <a id="ExibirDataIniConc">
                      de
                      <i id="vlrFiltroDataInicio">
                        22/04
                      </i>
                      à
                      <i id="vlrFiltroDataConclusao">
                        23/05
                      </i>
                    </a>
                  </h3>
                  <p>
                    <h4><a id="vlrrowsCountSolicitacoes"></a> Solicitações</h4>
                  </p>
                </div>
                <div class="form-group col-md-1">
                  <button onclick="window.print()"><img src="https://img.icons8.com/plasticine/30/000000/print.png"></button>
                </div>
              </div>
            </div>
          </div>
          <div class="panel panel-default">
            <div class="panel-heading ">
              <h3 class="panel-title"><b>Filtros Utilizados</b></h3>
            </div>
            <div class="panel-body">
              <div class="row">
                <div class="form-group col-md-4">
                  <p><b>Atividade: </b><a id="vlrFiltroAtividade"></a></p>
                  <p><b>Tipo: </b><a id="vlrFiltroTipo"></a></p>
                  <p><b>No Prazo: </b><a id="vlrFiltroPrazo"></a></p>
                </div>
                <div class="form-group col-md-4">
                  <p><b>Fornecedor: </b> <a id="vlrFiltroFornecedor"></a></p>
                  <p><b>Responsável: </b><a id="vlrFiltroResponsavel"></a></p>
                  <p><b>Em Andamento?: </b><a id="vlrFiltroAndamento"></a></p>
                </div>
                <div class="form-group col-md-4">
                  <p><b>Solicitação: </b><a id="vlrFiltroSolicitacao"></a></p>
                  <p><b>demanda: </b><a id="vlrFiltroDemanda"></a></p>
                  <p><b>demanda Contábil?: </b><a id="vlrFiltroDemandaCot"></a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Acima -->
<script type="text/template" class="template_datatable_edit">
  <tr id="area-edit" class="{{classSelected}}">
        <td>{{id}}<input type="hidden" value="{{id}}" id="datatable-input-id"></td>
        <td><input type="text" class="datatable-edit form-control" value="{{name}}" id="datatable-input-name"></td>
        <td><input type="text" class="datatable-edit form-control" value="{{email}}" id="datatable-input-email"></td>
        <td><input type="text" class="datatable-edit form-control" value="{{idLogin}}" id="datatable-input-idLogin"></td>
		<td><button class="btn btn-default" data-update-row>update</button></td>
    </tr>
</script>
<script type="text/template" class="modalImprimir">
	<div class="row">
		<div class="form-group col-md-6 col-xs-12">
			<label for="ordenarPorFiltro">Deseja Agrupar Por Filtro?</label>
			<select class="form-control" name="ordenarPorFiltro" id="ordenarPorFiltro">
				<option value="" selected disabled>Selecione</option>
				<option value="Sim">Sim</option>
				<option value="Não">Não</option>
			</select>
		</div>
		<div class="form-group col-md-6 col-xs-12" id="campoFiltroOrdenacao" hidden>
			<label for="filtroOrdenacao">Filtro Agrupador</label>
			<select class="form-control" name="filtroOrdenacao" id="filtroOrdenacao">
				<option value="" selected disabled>Selecione</option>
				<option value="atividade">Atividade</option>
				<option value="contabil">Contábil</option>
				<option value="dataConclusao">Data Conclusão</option>
				<option value="dataInicio">Data Início</option>
				<option value="emAndamento">Em Andamento</option>
				<option value="fornecedor">Fornecedor</option>
				<option value="noPrazo">No Prazo</option>
				<option value="responsavel">Responsável</option>
				<option value="tipoDemanda">Tipo de Demanda</option>
				<option value="tipoSolicitacao">Tipo de Solicitação</option>
			</select>
		</div>
	</div>
</script> 
</div>


