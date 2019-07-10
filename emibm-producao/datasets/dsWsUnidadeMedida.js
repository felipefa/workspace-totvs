function createDataset(fields, constraints, sortFields) {
	try {
		var dsWsUniMed = DatasetBuilder.newDataset();
		var dados = JSON.parse(getUniMed()); // getUniMedTeste();

		dsWsUniMed.addColumn('chave');
		dsWsUniMed.addColumn('descricao');

		if (dados != null && dados.UNIMEDS != undefined) {
			var uniMed = dados.UNIMEDS;

			for (var indexDados = 0; indexDados < uniMed.length; indexDados++) {
				dsWsUniMed.addRow([uniMed[indexDados].UNIMED, uniMed[indexDados].UMRES]);
			}
		} else {
			dsWsUniMed.addColumn('erro');
			dsWsUniMed.addRow(['', '', 'Erro ao buscar unidades de medida']);
		}

		return dsWsUniMed;
	} catch (e) {
		log.warn('--Debug dsWsUniMed-- Erro: ' + e + '; Linha: ' + e.lineNumber);
		var dataset = DatasetBuilder.newDataset();
		dataset.addColumn('Erro');
		dataset.addColumn('Linha');
		dataset.addRow([e, e.lineNumber]);
		return dataset;
	}
}

function getUniMed() {
	try {
		var clientService = fluigAPI.getAuthorizeClientService();
		var data = {
			companyId: getValue('WKCompany') + '',
			serviceCode: 'rest_protheus',
			endpoint: 'UNIMED',
			method: 'get',
			timeoutService: '100',
			options: {
				encoding: 'UTF-8',
				mediaType: 'application/json'
			}
		}
		var vo = clientService.invoke(JSON.stringify(data));

		if (vo.getResult() == null || vo.getResult().isEmpty())
			throw new Exception('O retorno está vazio');
		else
			return vo.getResult();
	} catch (e) {
		log.warn('Erro ao enviar requisição: ' + e);
	}
}

function getUniMedTeste() {
	return {
		"_classname": "UM_FULL",
		"UNIMEDS": [{
				"_classname": "UM",
				"UMRES": "ARROBA",
				"UNIMED": "AR"
			},
			{
				"_classname": "UM",
				"UMRES": "BALDE",
				"UNIMED": "BD"
			},
			{
				"_classname": "UM",
				"UMRES": "CENTIMETR",
				"UNIMED": "CC"
			},
			{
				"_classname": "UM",
				"UMRES": "CENTIMETR",
				"UNIMED": "CM"
			},
			{
				"_classname": "UM",
				"UMRES": "CENTO",
				"UNIMED": "CT"
			},
			{
				"_classname": "UM",
				"UMRES": "CAIXA",
				"UNIMED": "CX"
			},
			{
				"_classname": "UM",
				"UMRES": "DECIMETRO",
				"UNIMED": "DM"
			},
			{
				"_classname": "UM",
				"UMRES": "DUZIA",
				"UNIMED": "DZ"
			},
			{
				"_classname": "UM",
				"UMRES": "FOLHAS",
				"UNIMED": "FL"
			},
			{
				"_classname": "UM",
				"UMRES": "PES",
				"UNIMED": "FT"
			},
			{
				"_classname": "UM",
				"UMRES": "GRAMA",
				"UNIMED": "G"
			},
			{
				"_classname": "UM",
				"UMRES": "GALAO",
				"UNIMED": "GL"
			},
			{
				"_classname": "UM",
				"UMRES": "GROZA",
				"UNIMED": "GZ"
			},
			{
				"_classname": "UM",
				"UMRES": "HORA",
				"UNIMED": "HR"
			},
			{
				"_classname": "UM",
				"UMRES": "JOGO",
				"UNIMED": "JG"
			},
			{
				"_classname": "UM",
				"UMRES": "QUILOGRAM",
				"UNIMED": "KG"
			},
			{
				"_classname": "UM",
				"UMRES": "KIT",
				"UNIMED": "KT"
			},
			{
				"_classname": "UM",
				"UMRES": "LITRO",
				"UNIMED": "L"
			},
			{
				"_classname": "UM",
				"UMRES": "LIBRA",
				"UNIMED": "LB"
			},
			{
				"_classname": "UM",
				"UMRES": "LATA",
				"UNIMED": "LT"
			},
			{
				"_classname": "UM",
				"UMRES": "METRO QUA",
				"UNIMED": "M2"
			},
			{
				"_classname": "UM",
				"UMRES": "METRO CUB",
				"UNIMED": "M3"
			},
			{
				"_classname": "UM",
				"UMRES": "MILILITRO",
				"UNIMED": "ML"
			},
			{
				"_classname": "UM",
				"UMRES": "MILIMETRO",
				"UNIMED": "MM"
			},
			{
				"_classname": "UM",
				"UMRES": "METRO",
				"UNIMED": "MT"
			},
			{
				"_classname": "UM",
				"UMRES": "ONCA",
				"UNIMED": "OZ"
			},
			{
				"_classname": "UM",
				"UMRES": "PAR",
				"UNIMED": "P"
			},
			{
				"_classname": "UM",
				"UMRES": "PECA",
				"UNIMED": "PC"
			},
			{
				"_classname": "UM",
				"UMRES": "POLEGADAS",
				"UNIMED": "PL"
			},
			{
				"_classname": "UM",
				"UMRES": "TONELADA",
				"UNIMED": "TL"
			},
			{
				"_classname": "UM",
				"UMRES": "UNIDADE",
				"UNIMED": "UN"
			},
			{
				"_classname": "UM",
				"UMRES": "JARDA",
				"UNIMED": "YD"
			}
		]
	}
}