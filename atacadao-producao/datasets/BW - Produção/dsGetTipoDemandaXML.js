function defineStructure() {

}
function onSync(lastSyncDate) {

}
function createDataset(fields, constraints, sortFields) {

    // Cria dataset
    var dataset = DatasetBuilder.newDataset();

    // Adiciona coluna
    dataset.addColumn("tipoDemanda");

    // Composição dos dados
    var arrayTipoDemanda = [
        "Quantidade",
        "Fornecedor",
        "Nota Rejeitada / Denegada",//"Rejeitar ou Denegar NF?",
        "Ajuste Tributação",//"Ajuste Tributação-Contábil",
        "Sem Pedido",
        "Item Fora de linha",
        "Pendências Notas de Devolução",
        "Tributação Produtos Novos",//"Tributação produtos novos-Contábil",
        "Preço",
        "Cadastro",
        "Cadastro Serviços Uso/Consumo",//"Cadastro Serviços/Uso consumo-Contábil",
        "Demais Pendências"//"Demais pendências-Contábil"
    ];

    // Criação de linhas no dataset
    for (var i = 0; i < arrayTipoDemanda.length; i++) {
        dataset.addRow(new Array(arrayTipoDemanda[i]));
    }

    // Retorno
    return dataset;

} function onMobileSync(user) {

}