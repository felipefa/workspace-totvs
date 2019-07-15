$(() => {
	const today = new Date();
	const year = today.getFullYear();
	const month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
	const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
	const currentDate = `${year}-${month}-${day}`;

	if (ATIVIDADE == 0) {
		document.getElementById('dtSolicitacao').value = currentDate;
	}

	if (ATIVIDADE == 5) {
		document.getElementById('dtAprov').value = currentDate;
		const decisao = document.getElementById('decisao');
		setTimeout(() => verificarDecisao(decisao), 1000);
	}
});

const transformarDescricao = (elemento) => {
	elemento.value = elemento.value.toUpperCase();
}

const verificarDecisao = (elemento) => {
	if (elemento.value == 'Aprovado') {
		window['armazem'].disable(false);
		window['posIpiNcm'].disable(false);
		window['origem'].disable(false);
	} else {
		window['armazem'].clear();
		window['armazem'].disable(true);
		window['posIpiNcm'].clear();
		window['posIpiNcm'].disable(true);
		window['origem'].clear();
		window['origem'].disable(true);
	}
}