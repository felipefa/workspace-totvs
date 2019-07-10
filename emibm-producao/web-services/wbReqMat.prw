#Include 'Protheus.ch'
#Include 'FWMVCDEF.ch'
#Include 'RestFul.CH'
#Include 'parmtype.ch'

//Funcao Fantasma do Web service de requisicao de materiais
User Function wsReqMaT()
Return

/* ----------------------------------------------------------------------------- */
/* ------------------------------- Produtos ------------------------------------ */
/* ----------------------------------------------------------------------------- */
//Inicio da Declaracao do Web Service PRODUTO
WSRESTFUL PRODUTO DESCRIPTION "Servico REST para cadastro de Produtos"
	WSDATA CODPRODUTO As String

	WSMETHOD GET DESCRIPTION "Retorna os produtos cadastrados" WSSYNTAX "/PRODUTO || /PRODUTO/{CODPRODUTO}"
	WSMETHOD POST DESCRIPTION "Cadastrar produto" WSSYNTAX "/PRODUTO"
END WSRESTFUL

//Inicio do Mitodo GET do Web Service de PRODUTO
WSMETHOD GET WSRECEIVE CODPRODUTO WSSERVICE PRODUTO
	Local cCodProduto := Self:CODPRODUTO
	Local aArea := GetArea()
	Local cNextAlias := GetNextAlias()
	Local oProduto := PROD():New() //Objeto da classe produto
	Local oResponse := PROD_FULL():New() //Objeto que sera serializado
	Local cJSON	:= ""
	Local lRet := .T.

	::SetContentType("application/json")

	//Caso nao seja informado codigo do produto no parametro, ira retornar todos os produtos
	IF (EMPTY(cCodProduto))
		BeginSQL Alias cNextAlias
			SELECT B1_COD, B1_DESC, B1_UM, B1_TIPO
			FROM %table:SB1% SB1
		EndSQL
	ELSE
		BeginSQL Alias cNextAlias
			SELECT B1_COD, B1_DESC, B1_UM, B1_TIPO
			FROM %table:SB1% SB1
			WHERE B1_COD = %exp:cCodProduto%
		EndSQL
	ENDIF

	(cNextAlias)->(DbGoTop())

	If (cNextAlias)->(!Eof())
		While (cNextAlias)->(!Eof())
			oProduto:SetCodigo(AllTrim((cNextAlias)->B1_COD))
			oProduto:SetDesc(EncodeUTF8(AllTrim((cNextAlias)->B1_DESC)), "cp1252")
			oProduto:SetUm(AllTrim((cNextAlias)->B1_UM))
			oProduto:SetTipo(AllTrim((cNextAlias)->B1_TIPO))
			oResponse:Add(oProduto)
			oProduto := PROD():New()
			(cNextAlias)->(DbSkip())
		EndDo

		cJSON := FWJsonSerialize(oResponse, .T., .T.,,.F.)
		::SetResponse(cJSON)
	Else
		SetRestFault(400, "Nao existem produtos cadastrados.")
		lRet := .F.
	EndIf

	RestArea(aArea)
	(cNextAlias)->(DbcloseArea())
Return(lRet)

//Declaracao de Classes Utilizadas no Web Service PRODUTO
Class PROD
	Data codigo	As String
	Data desc As String
	Data um As String
	Data tipo As String

	Method New() Constructor
	Method SetCodigo(cCodigo)
	Method SetDesc(cDesc)
	Method SetUm(cUm)
	Method SetTipo(cTipo)
EndClass

Class PROD_FULL
	Data Produtos

	Method New() Constructor
	Method Add()
EndClass

//Inicio dos Metodos Utilizados Pelas Classes
Method New() Class PROD
	::codigo := ""
	::desc := ""
	::um := ""
	::tipo := ""
Return(Self)

Method SetCodigo(cCodigo) Class PROD
Return(::codigo := cCodigo)

Method SetDesc(cDesc) Class PROD
Return(::desc := cDesc)

Method SetUm(cUm) Class PROD
Return(::um := cUm)

Method SetTipo(cTipo) Class PROD
Return(::tipo := cTipo)

Method New() Class PROD_FULL
	::Produtos := {}
Return(Self)

Method Add(oProduto) Class PROD_FULL
	Aadd(::Produtos, oProduto)
Return
//Fim dos Metodos Utilizados Pelas Classes

//Inicio do Metodo POST do Web Service de PRODUTO
WSMETHOD POST WSRECEIVE PRODUTO WSSERVICE PRODUTO
	Local cJSON := Self:GetContent() // Pega a string do JSON
	Local oParseJSON := Nil
	Local aDadosProd := {} //--> Array para ExecAuto do MATA010
	Local cJsonRet := ""
	Local cArqLog := ""
	Local cErro	:= ""
	Local cCodSB1 := ""
	Local lRet := .T.
	Local aArea := GetArea()
	Local cCodResp := ""
	Private lMsErroAuto := .F.

	// --> Cria o diretorio para salvar os arquivos de log
	If !ExistDir("\log_prod")
		MakeDir("\log_prod")
	EndIf

	::SetContentType("application/json")
	FWJsonDeserialize(cJson, @oParseJSON)
	SB1->(DbSetOrder(3))

	If !(SB1->( DbSeek( xFilial("SB1") + oParseJSON:PRODUTO:COD ) ))
		cCodSB1 := GetNewCod()
		Aadd(aDadosProd, {"B1_COD", oParseJSON:PRODUTO:COD, Nil} )
		Aadd(aDadosProd, {"B1_DESC", DecodeUTF8(oParseJSON:PRODUTO:DESC, "cp1252"), Nil} )
		Aadd(aDadosProd, {"B1_TIPO", oParseJSON:PRODUTO:TIPO, Nil} )
		Aadd(aDadosProd, {"B1_UM", oParseJSON:PRODUTO:UM, Nil} )
		Aadd(aDadosProd, {"B1_LOCPAD", oParseJSON:PRODUTO:LOCPAD, Nil} )

		MsExecAuto({|x,y| MATA010(x,y)}, aDadosProd, 3)

		If lMsErroAuto
			cArqLog := oParseJSON:PRODUTO:COD + " - " + SubStr(Time(), 1, 5) + ".log"
			RollBackSX8()
			cErro := MostraErro("\log_prod", cArqLog)
			cErro := TrataErro(cErro)
			SetRestFault(400, cErro)
			lRet := .F.
		Else
			ConfirmSX8()
			cJSONRet := '{"cod": "200"';
						+ ', "cod_produto":"' + SB1->B1_COD	+ '"';
						+ ', "desc":"' + SB1->B1_DESC + '"';
						+ ', "sucesso":"TRUE"';
						+ ', "msg":"Produto cadastrado com sucesso!"';
						+'}'

			::SetResponse(cJSONRet)
		EndIf
	Else
		SetRestFault(400, "Ja existe produto cadastrado com este codigo: " + SB1->B1_COD + " - " + SB1->B1_DESC)
		lRet := .F.
	EndIf

	RestArea(aArea)
Return(lRet)

/*
	{Protheus.doc} GetNewCod
*/
Static Function GetNewCod()
	Local cCod := GetSX8Num("SB1", "B1_COD")
	Local aArea := GetArea()

	SB1->( DbSetOrder(1) )

	While SB1->(DbSeek(xFilial("SB1") + cCod ))
		cCod := GetSX8Num("SB1", "B1_COD")
	EndDo

	RestArea(aArea)
Return(cCod)

/*
	{Protheus.doc} TrataErro
/*/
Static Function TrataErro(cErroAuto)
	Local nLines := MLCount(cErroAuto)
	Local cNewErro := ""
	Local nErr := 0

	For nErr := 1 To nLines
		cNewErro += AllTrim(MemoLine(cErroAuto, , nErr)) + " - "
	Next nErr
Return(cNewErro)

/* ----------------------------------------------------------------------------- */
/* ------------------------------ CENTRO DE CUSTO ------------------------------ */
/* ----------------------------------------------------------------------------- */
//Inicio da Declaracao do Web Service Centro de Custo
WSRESTFUL CCUSTO DESCRIPTION "Servico REST - Centro de Custos"
	WSMETHOD GET DESCRIPTION "Retorna os Centros de Custos cadastrados" WSSYNTAX "/CCUSTO"
END WSRESTFUL

//Inicio do Metodo GET do Web Service de Centro de Custo
WSMETHOD GET WSSERVICE CCUSTO
	Local aArea := GetArea()
	Local cNextAlias := GetNextAlias()
	Local oCentroC := CC():New() //Objeto da classe centro de custo
	Local oResponse := CC_FULL():New() //Objeto que sera serializado
	Local cJSON	:= ""
	Local lRet := .T.

	::SetContentType("application/json")

	BeginSQL Alias cNextAlias
		SELECT CTT_CUSTO, CTT_DESC01
		FROM %table:CTT% CTT
	EndSQL

	(cNextAlias)->(DbGoTop())

	If (cNextAlias)->(!Eof())
		While (cNextAlias)->(!Eof())
			oCentroC:SetCusto(AllTrim((cNextAlias)->CTT_CUSTO))
			oCentroC:SetDesc01(EncodeUTF8(AllTrim((cNextAlias)->CTT_DESC01), "cp1252"))
			oResponse:Add(oCentroC)
			oCentroC := CC():New()
			(cNextAlias)->(DbSkip())
		EndDo

		cJSON := FWJsonSerialize(oResponse, .T., .T.,,.F.)
		::SetResponse(cJSON)
	Else
		SetRestFault(400, "Nao existem centro de custos cadastrados.")
		lRet := .F.
	EndIf

	RestArea(aArea)
	(cNextAlias)->(DbcloseArea())
Return(lRet)

//Declaracao de Classes Utilizadas no Web Service Centro de Custo
Class CC
	Data custo As String
	Data desc01 As String

	Method New() Constructor
	Method SetCusto(cCusto)
	Method SetDesc01(cDesc01)
EndClass

Class CC_FULL
	Data Custos

	Method New() Constructor
	Method Add()
EndClass

//Inicio dos Metodos Utilizados Pelas Classes do Centro de Custos
Method New() Class CC
	::custo := ""
	::desc01 := ""
Return(Self)

Method SetCusto(cCusto) Class CC
Return(::custo := cCusto)

Method SetDesc01(cDesc01) Class CC
Return(::desc01 := cDesc01)

Method New() Class CC_FULL
	::Custos := {}
Return(Self)

Method Add(oCentroC) Class CC_FULL
	Aadd(::Custos, oCentroC)
Return

/* ----------------------------------------------------------------------------- */
/* ---------------------------------- Armazem ---------------------------------- */
/* ----------------------------------------------------------------------------- */
//Inicio da Declaracao do Web Service Armazem
WSRESTFUL ARMAZEM DESCRIPTION "Servico REST - Armazem"
	WSMETHOD GET DESCRIPTION "Retorna os Centros de Custos cadastrados" WSSYNTAX "/ARMAZEM"
END WSRESTFUL

//Inicio do Metodo GET do Web Service de Armazem
WSMETHOD GET WSSERVICE ARMAZEM
	Local aArea := GetArea()
	Local cNextAlias := GetNextAlias()
	Local oArma := Arma():New() //Objeto da classe armazem
	Local oResponse := Arma_FULL():New() //Objeto que sera serializado
	Local cJSON	:= ""
	Local lRet := .T.

	::SetContentType("application/json")

	BeginSQL Alias cNextAlias
		SELECT NNR_CODIGO, NNR_DESCRI
		FROM %table:NNR% NNR
	EndSQL

	(cNextAlias)->(DbGoTop())

	If (cNextAlias)->(!Eof())
		While (cNextAlias)->(!Eof())
			oArma:SetCod(AllTrim((cNextAlias)->NNR_CODIGO))
			oArma:SetDesc(EncodeUTF8(AllTrim((cNextAlias)->NNR_DESCRI), "cp1252"))
			oResponse:Add(oArma)
			oArma := Arma():New()
			(cNextAlias)->(DbSkip())
		EndDo

		cJSON := FWJsonSerialize(oResponse, .T., .T.,,.F.)
		::SetResponse(cJSON)
	Else
		SetRestFault(400, "Nao existem armazem cadastrado.")
		lRet := .F.
	EndIf

	RestArea(aArea)
	(cNextAlias)->(DbcloseArea())
Return(lRet)

//Declaracao de Classes Utilizadas no Web Service Armazem
Class Arma
	Data cod As String
	Data desc As String

	Method New() Constructor
	Method SetCod(cCod)
	Method SetDesc(cDesc)
EndClass

Class Arma_FULL
	Data Armas

	Method New() Constructor
	Method Add()
EndClass

//Inicio dos Metodos Utilizados Pelas Classes Armazem
Method New() Class Arma
	::cod := ""
	::desc := ""
Return(Self)

Method SetCod(cCod) Class Arma
Return(::cod := cCod)

Method SetDesc(cDesc) Class Arma
Return(::desc := cDesc)

Method New() Class Arma_FULL
	::Armas := {}
Return(Self)

Method Add(oArma) Class Arma_FULL
	Aadd(::Armas, oArma)
Return

/* ------------------------------------------------------------------------------- */
/* ------------------------------ UNIDADE DE MEDIDA ------------------------------ */
/* ------------------------------------------------------------------------------- */
//Inicio da Declaracao do Web Service Unidade de Medida
WSRESTFUL UNIMED DESCRIPTION "Servico REST - Unidades de Medida"
	WSMETHOD GET DESCRIPTION "Retorna as Unidades de Medida cadastradoas" WSSYNTAX "/UNIMED"
END WSRESTFUL

//Inicio do Metodo GET do Web Service de Unidade de Medida
WSMETHOD GET WSSERVICE UNIMED
	Local aArea := GetArea()
	Local cNextAlias := GetNextAlias()
	Local oUM := UM():New() //Objeto da classe Unidade de Medida
	Local oResponse := UM_FULL():New() //Objeto que sera serializado
	Local cJSON	:= ""
	Local lRet := .T.

	::SetContentType("application/json")

	BeginSQL Alias cNextAlias
		SELECT AH_UNIMED, AH_UMRES
		FROM %table:SAH% SAH
	EndSQL

	(cNextAlias)->(DbGoTop())

	If (cNextAlias)->(!Eof())
		While (cNextAlias)->(!Eof())
			oUM:SetUniMed(AllTrim((cNextAlias)->AH_UNIMED))
			oUM:SetUmRes(EncodeUTF8(AllTrim((cNextAlias)->AH_UMRES), "cp1252"))
			oResponse:Add(oUM)
			oUM := UM():New()
			(cNextAlias)->(DbSkip())
		EndDo

		cJSON := FWJsonSerialize(oResponse, .T., .T.,,.F.)
		::SetResponse(cJSON)
	Else
		SetRestFault(400, "Nao existe unidade de medida cadastrados.")
		lRet := .F.
	EndIf

	RestArea(aArea)
	(cNextAlias)->(DbcloseArea())
Return(lRet)

//Declaracao de Classes Utilizadas no Web Service Unidade de Medida
Class UM
	Data unimed As String
	Data umres As String

	Method New() Constructor
	Method SetUniMed(cUniMed)
	Method SetUmRes(cUmRes)
EndClass

Class UM_FULL
	Data UniMeds

	Method New() Constructor
	Method Add()
EndClass

//Inicio dos Metodos Utilizados Pelas Classes Unidade de Medida
Method New() Class UM
	::unimed := ""
	::umres := ""
Return(Self)

Method SetUniMed(cUniMed) Class UM
Return(::unimed := cUniMed)

Method SetUmRes(cUmRes) Class UM
Return(::umres := cUmRes)

Method New() Class UM_FULL
	::UniMeds := {}
Return(Self)

Method Add(oUniMed) Class UM_FULL
	Aadd(::UniMeds, oUniMed)
Return

/* -------------------------------------------------------------------------------------- */
/* ----------------------------------- TIPO DE PRODUTO ---------------------------------- */
/* -------------------------------------------------------------------------------------- */
//Inicio da Declaracao do Web Service
WSRESTFUL TIPOPROD DESCRIPTION "Servico REST - Tipos de Produto"
	WSMETHOD GET DESCRIPTION "Retorna os Tipo de Produtos cadastrados" WSSYNTAX "/TIPOPROD"
END WSRESTFUL
//Fim da Declaracao do Web Service

//Inicio do Metodo GET do Web Service de Tipo de Produto
WSMETHOD GET WSSERVICE TIPOPROD
	Local aArea := GetArea()
	Local cNextAlias := GetNextAlias()
	Local oTipo := TIPO():New() //Objeto da classe tipo
	Local oResponse := TIPO_FULL():New() //Objeto que sera serializado
	Local cJSON	:= ""
	Local lRet := .T.

	::SetContentType("application/json")

	BeginSQL Alias cNextAlias
		SELECT X5_CHAVE, X5_DESCRI
		FROM  %Table:SX5% SX5
		WHERE SX5.%NotDel% AND X5_TABELA = '02' ORDER BY X5_CHAVE
	EndSQL

	(cNextAlias)->(DbGoTop())

	If (cNextAlias)->(!Eof())
		While (cNextAlias)->(!Eof())
			oTipo:SetChave(AllTrim((cNextAlias)->X5_CHAVE))
			oTipo:SetDesc(EncodeUTF8(AllTrim((cNextAlias)->X5_DESCRI), "cp1252"))
			oResponse:Add(oTipo)
			oTipo := TIPO():New()
			(cNextAlias)->(DbSkip())
		EndDo

		cJSON := FWJsonSerialize(oResponse, .T., .T.,,.F.)
		::SetResponse(cJSON)
	Else
		SetRestFault(400, "Nao existe tipo de produto cadastrados.")
		lRet := .F.
	EndIf

	RestArea(aArea)
	(cNextAlias)->(DbcloseArea())
Return(lRet)

//Declaracao de Classes Utilizadas no Web Service Tipo de Produto
Class TIPO
	Data chave	As String
	Data desc As String

	Method New() Constructor
	Method SetChave(cChave)
	Method SetDesc(cDesc)
EndClass

Class TIPO_FULL
	Data Tipos

	Method New() Constructor
	Method Add()
EndClass

//Inicio dos Metodos Utilizados Pelas Classes Tipo
Method New() Class TIPO
	::chave := ""
	::desc := ""
Return(Self)

Method SetChave(cChave) Class TIPO
Return(::chave := cChave)

Method SetDesc(cDesc) Class TIPO
Return(::desc := cDesc)

Method New() Class TIPO_FULL
	::Tipos := {}
Return(Self)

Method Add(oTipo) Class TIPO_FULL
	Aadd(::Tipos, oTipo)
Return
//Fim dos Metodos Utilizados Pelas Classes

/* ------------------------------------------------------------------------------------------- */
/* ------------------------------- Solicitação ao Armazem ------------------------------------ */
/* ------------------------------------------------------------------------------------------- */
//Inicio da Declaracao do Web Service Solicitaco ao Armazem
WSRESTFUL SOLARMA DESCRIPTION "Servico REST para cadastro de Solicitacao Ao Armazem"
	WSDATA OBJETO As String

	WSMETHOD POST DESCRIPTION "Cadastrar solicitacao ao armazem" WSSYNTAX "/SOLARMA"
END WSRESTFUL
//Fim da Declaracao do Web Service

//Inicio do Metodo POST do Web Service de Solicitacao Ao Armazem
WSMETHOD POST WSRECEIVE OBJETO WSSERVICE SOLARMA
	Local cJSON := Self:GetContent() // Pega a string do JSON
	Local oParseJSON := Nil
	Local aDados := {} //--> Array para ExecAuto do MATA0105
	Local cJsonRet := ""
	Local cArqLog := ""
	Local cErro	:= ""
	Local cCodSCP := ""
	Local lRet := .T.
	Local aArea := GetArea()
	Local cCodResp := ""
	local aArray := {}
	Private lMsErroAuto := .F.

	//Cria o diretorio para salvar os arquivos de log
	If !ExistDir("\log_solarm")
		MakeDir("\log_solarm")
	EndIf

	::SetContentType("application/json")
	FWJsonDeserialize(cJson, @oParseJSON)
	SCP->(DbSetOrder(3))

	//Dado da solicitacao
	Aadd(aDados, {"CP_EMISSAO", dDataBase, Nil})
	Aadd(aDados, {"CP_DATPRF", oParseJSON:OBJETO:MOTIVO, Nil})

	//Monta itens da solicitacao
	For nI := 1 to len(oParseJSON:OBJETO:ITENS)
		Aadd(aArray, {})
		Aadd(aArray[Len(aArray)],{"CP_ITEM", oParseJSON:OBJETO:ITENS[nI]:ITEM, Nil})
		Aadd(aArray[Len(aArray)],{"CP_PRODUTO", oParseJSON:OBJETO:ITENS[nI]:PRODUTO, Nil})
		Aadd(aArray[Len(aArray)],{"CP_QUANT", VAL(oParseJSON:OBJETO:ITENS[nI]:QUANT), Nil})
		Aadd(aArray[Len(aArray)],{"CP_OBS", DecodeUTF8(oParseJSON:OBJETO:OBS, "cp1252"), Nil})
	Next

	MsExecAuto( { | x, y, z | Mata105( x, y , z) }, aDados, aArray, 3)

	If lMsErroAuto
		cArqLog := oParseJSON:OBJETO:NUM + " - " + SubStr(Time(), 1, 5) + ".log"
		RollBackSX8()
		cErro := MostraErro("\log_solarm", cArqLog)
		cErro := TrataErro(cErro)
		SetRestFault(400, cErro)
		lRet := .F.
	Else
		ConfirmSX8()
		cJSONRet := '{"cod": "200"';
					+ ', "sucesso":"TRUE"';
					+ ', "msg":"Produto cadastrado com sucesso!"';
					+'}'

		::SetResponse(cJSONRet)
	EndIf

	RestArea(aArea)
Return(lRet)
//Fim do Metodo POST do Web Service de Solicitacao ao Armazem