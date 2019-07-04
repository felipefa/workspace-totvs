var StatusReport = SuperWidget.extend({
    //variáveis da widget
    init: function () {
		buscarProjetos();
	}
});

function buscarProjetos() {
	// const email = top.WCMAPI.userEmail;
	// const constraint = [DatasetFactory.createConstraint('email', email, email, ConstraintType.MUST)];
	const dsGetProjetosTBC = {
		values: [
			{
				CCODCLIENTE: 'T11481',
				CDESCPROJTO: '888676 - (L) - MIGRAÇÃO DE VERSAO - DF1',
				CFILIALS: '01',
				CLOJACLIENTE: '00',
				CNOMECLIENTE: 'DINAMICA ADMINISTRACAO SERVICOS E OBRAS LTDA 1',
				CPROJETO: '0000030267'
			},
			{
				CCODCLIENTE: 'T11482',
				CDESCPROJTO: '888676 - (L) - MIGRAÇÃO DE VERSAO - DF2',
				CFILIALS: '02',
				CLOJACLIENTE: '00',
				CNOMECLIENTE: 'DINAMICA ADMINISTRACAO SERVICOS E OBRAS LTDA 2',
				CPROJETO: '0000030267'
			},
			{
				CCODCLIENTE: 'T11483',
				CDESCPROJTO: '888676 - (L) - MIGRAÇÃO DE VERSAO - DF3',
				CFILIALS: '03',
				CLOJACLIENTE: '00',
				CNOMECLIENTE: 'DINAMICA ADMINISTRACAO SERVICOS E OBRAS LTDA 3',
				CPROJETO: '0000030267'
			}
		]
	}; //DatasetFactory.getDataset('dsGetProjetosTBC', null, constraint, null);]

	if (dsGetProjetosTBC !== null && dsGetProjetosTBC.values.length > 0) {
		const html = $('.templateProjeto').html();
		let template = '';

		dsGetProjetosTBC.values.forEach((projeto, indice) => {
			let dados = projeto;
			dados['INDICE'] = indice;
			template += Mustache.render(html, dados);
		});

		$('#accordion').html(template);
	} else {
		const html = '<p>Você ainda não possui um projeto.</p>'
		$('#accordion').html(html);
	}
}