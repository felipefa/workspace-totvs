function createDataset(fields, constraints, sortFields) {
    try {
        var dsWsArmazem = DatasetBuilder.newDataset();
        var dados = getArmazens(); // JSON.Parse(getArmazens());
        var armazens = [];

        if (dados != null && dados.ARMAZENS != undefined) {
            armazens = dados.ARMAZENS;
        }

        dsWsArmazem.addColumn('codigo');
        dsWsArmazem.addColumn('descricao');

        for (var indexDados = 0; indexDados < armazens.length; indexDados++) {
            dsWsArmazem.addRow([armazens[indexDados].COD, armazens[indexDados].DESC]);
        }

        return dsWsArmazem;
    } catch (e) {
        log.warn('--Debug dsWsArmazem-- Erro: ' + e + '; Linha: ' + e.lineNumber);
        var dataset = DatasetBuilder.newDataset();
        dataset.addColumn('Erro');
        dataset.addColumn('Linha');
        dataset.addRow([e, e.lineNumber]);
        return dataset;
    }
}

function getArmazens() {
    return {
        "_classname": "ARMAZEM_FULL",
        "ARMAZENS": [
            {
                "_classname": "ARMAZEM",
                "COD": "01",
                "DESC": "Armazém 001"
            },
            {
                "_classname": "ARMAZEM",
                "COD": "05",
                "DESC": "Armazém 002"
            }
        ]
    }
}