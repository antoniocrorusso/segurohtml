var enderecoContrato = "0x9786345C697849A39b930a866E75304c62932496";
var provedor = new ethers.providers.Web3Provider(web3.currentProvider);
ethereum.enable();
var signatario = provedor.getSigner();
var contrato = new ethers.Contract(enderecoContrato, abiContrato, signatario);

function registrarMudancaStatus() {
    var textoCampo = document.frmStatus.txtStatusPagamentoAluguel.value;
    var caixaStatusTx = document.getElementById("caixaStatusTx");
    if (textoCampo.length === 8) {
        caixaStatusTx.innerHTML = "Enviando transação...";
        contrato.mudaStatusPagamento(textoCampo)
        .then( (transacao) => {
            console.log("registrarMudancaStatus - Transacao ", transacao);   
            caixaStatusTx.innerHTML = "Transação enviada. Aguardando processamento...";
            transacao.wait()
            .then( (resultado) => {
                buscaStatusContrato();
                caixaStatusTx.innerHTML = "Transação realizada.";
            })        
            .catch( (err) => {
                console.error("registrarMudancaStatus - Aguardando tx ser minerada");
                console.error(err);
                caixaStatusTx.innerHTML = "Algo saiu errado: " + err.message;
            })
        })
        .catch( (err) => {
            console.error("registrarMudancaStatus");
            console.error(err);
            caixaStatusTx.innerHTML = "Algo saiu errado: " + err.message;
        })
    }
}

function finalizaContrato() {
    var textoFinaliza = document.getElementById("finishStatus");
    textoFinaliza.innerHTML = "Conectando ao contrato para finaliza...";
    contrato.fimDoContrato()
    .then( (transaction) => {
        console.log("Encerrar Contrato - Transação", transaction);
        textoFinaliza.innerHTML = "Encerrando o contrato...";
        transaction.wait()
        .then( (resultado) => {
            buscaFimContrato();
            textoFinaliza.innerHTML = "Contrato encerrado.";
        })
        .catch( (err) => {
            console.error("Encerrar Contrato - Esperando a transação ser minerada.");
            console.error(err);
            textoFinaliza.innerHTML="erro ao transacionar." + err.message;
        })
    })
    .catch( (err) => {
        console.error("Encerrar Contrato - Esperando a transação ser minerada.");
        console.error(err);
        textoFinaliza.innerHTML="erro ao transacionar." + err.message;  
    })
}

function buscaStatusContrato() {
    var status;
    var campoStatus = document.getElementById("campoStatus");     
    contrato.statusPagamentoAluguel()
    .then( (resultado) => {
        campoStatus.innerHTML = resultado;
    })
    .catch( (err) => {
        console.error(err);
        campoStatus.innerHTML = err;
    });
}

function buscaFimContrato() {
    var status;
    var campoStatus = document.getElementById("encerrarContratoTxt");     
    contrato.contratoAtivo()
    .then( (resultado) => {
        campoStatus.innerHTML = resultado;
    })
    .catch( (err) => {
        console.error(err);
        campoStatus.innerHTML = err;
    });
}