<div id="StatusReport_${instanceId}" class="super-widget wcm-widget-class fluig-style-guide" data-params="StatusReport.instance()">
	<link rel="stylesheet" type="text/css" href="/style-guide/css/fluig-style-guide-filter.min.css">
	<script src="/style-guide/js/fluig-style-guide-filter.min.js"></script>
	<link type="text/css" rel="stylesheet" href="/portal/resources/style-guide/css/fluig-style-guide.min.css" />
	<script type="text/javascript" src="/portal/resources/js/jquery/jquery.js"></script>
	<script type="text/javascript" src="/portal/resources/js/jquery/jquery-ui.min.js"></script>
	<script type="text/javascript" src="/portal/resources/js/mustache/mustache-min.js"></script>
	<script type="text/javascript" src="/portal/resources/style-guide/js/fluig-style-guide.min.js" charset="utf-8"></script>
	<script type="text/javascript" src="/webdesk/vcXMLRPC.js"></script>

	<div class="panel-group" id="accordion">
	</div>

	<script type="text/template" class="templateProjeto">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title">
					<a class="collapse-icon" data-toggle="collapse" data-parent="#accordion" href="#projeto___{{INDICE}}">
						<b>{{CDESCPROJTO}}</b>
					</a>
				</h4>
			</div>
			<div class="panel-collapse collapse" id="projeto___{{INDICE}}">
				<div class="panel-body">
					<div class="row">
						<div class="col-md-1 form-group">
							<label for="CCODCLIENTE___{{INDICE}}">Cliente</label>
							<input id="CCODCLIENTE___{{INDICE}}" class="form-control" type="text" readonly value="{{CCODCLIENTE}}">
						</div>	
						<div class="col-md-3 form-group">
							<label for="CDESCPROJTO___{{INDICE}}">Descrição do Projeto</label>
							<input id="CDESCPROJTO___{{INDICE}}" class="form-control" type="text" readonly value="{{CDESCPROJTO}}">
						</div>	
						<div class="col-md-1 form-group">
							<label for="CFILIALS___{{INDICE}}">Filial</label>
							<input id="CFILIALS___{{INDICE}}" class="form-control" type="text" readonly value="{{CFILIALS}}">
						</div>	
						<div class="col-md-1 form-group">
							<label for="CLOJACLIENTE___{{INDICE}}">Loja</label>
							<input id="CLOJACLIENTE___{{INDICE}}" class="form-control" type="text" readonly value="{{CLOJACLIENTE}}">
						</div>	
						<div class="col-md-4 form-group">
							<label for="CNOMECLIENTE___{{INDICE}}">Nome</label>
							<input id="CNOMECLIENTE___{{INDICE}}" class="form-control" type="text" readonly value="{{CNOMECLIENTE}}">
						</div>	
						<div class="col-md-2 form-group">
							<label for="CPROJETO___{{INDICE}}">Projeto</label>
							<input id="CPROJETO___{{INDICE}}" class="form-control" type="text" readonly value="{{CPROJETO}}">
						</div>	
					</div>
				</div>
			</div>
		</div>
	</script>
</div>