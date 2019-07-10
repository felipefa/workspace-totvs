function createDataset(fields, constraints, sortFields) {
    try {
        var dsWsTipo = DatasetBuilder.newDataset();
        var dados = getTipos(); // JSON.Parse(getTipos());
        var tipos = [];

        if (dados != null && dados.TIPOS != undefined) {
            tipos = dados.TIPOS;
        }

        dsWsTipo.addColumn('chave');
        dsWsTipo.addColumn('descricao');

        for (var indexDados = 0; indexDados < tipos.length; indexDados++) {
            dsWsTipo.addRow([tipos[indexDados].CHAVE, tipos[indexDados].DESC]);
        }

        return dsWsTipo;
    } catch (e) {
        log.warn('--Debug dsWsTipo-- Erro: ' + e + '; Linha: ' + e.lineNumber);
        var dataset = DatasetBuilder.newDataset();
        dataset.addColumn('Erro');
        dataset.addColumn('Linha');
        dataset.addRow([e, e.lineNumber]);
        return dataset;
    }
}

function getTipos() {
    return {
        "_classname": "TIPO_FULL",
        "TIPOS": [
            {
                "_classname": "TIPO",
                "CHAVE": "AI",
                "DESC": "ATIVO IMOBILIZADO"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "BN",
                "DESC": "BENEFICIAMENTO"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "EM",
                "DESC": "EMBALAGEM"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "GE",
                "DESC": "GARANTIA ESTENDIDA"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "GG",
                "DESC": "GASTOS GERAIS"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "GN",
                "DESC": "GENERICO"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "IA",
                "DESC": "INSUMO AGRICOLA"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "II",
                "DESC": "INSUMO INDUSTRIAIS"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "IN",
                "DESC": "PRODUTOS INDUSTRIAIS"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "KT",
                "DESC": "KIT"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "MC",
                "DESC": "MATERIAL DE CONSUMO"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "ME",
                "DESC": "MERCADORIA"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "MM",
                "DESC": "MATERIAIS MANFRO"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "MO",
                "DESC": "MAO DE OBRA"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "MP",
                "DESC": "MATERIA PRIMA"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "OI",
                "DESC": "OUTROS INSUMOS"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "PA",
                "DESC": "PRODUTO ACABADO"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "PI",
                "DESC": "PRODUTO INTERMEDIARIO"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "PP",
                "DESC": "PRODUTO EM PROCESSO"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "PV",
                "DESC": "PRODUTO VEICULO"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "SL",
                "DESC": "SELO DE CONTROLE"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "SM",
                "DESC": "SEMENTES"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "SP",
                "DESC": "SUBPRODUTO"
            },
            {
                "_classname": "TIPO",
                "CHAVE": "SV",
                "DESC": "SERVI\ufffdO"
            }
        ]
    }
}