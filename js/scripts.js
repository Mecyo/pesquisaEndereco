var estados;

$.getJSON('estados.json', function(dataJson) {

    estados = dataJson.estados;

});

function printResponse() {
  console.log(this.responseText);
}

function buscar() {
    var url = "http://localhost:8181/itens";
    var req = new XMLHttpRequest();
    req.addEventListener("load", printResponse);
    req.open("GET", url);

    req.send();
    /*$.getJSON(url).done(function(data) {
        arr = preencherTable(url);
    });*/
    
    var url;
    
    if($('#divBuscaCep').is(':visible')) {
        var cep = $("#cep").val();
        url = 'http://viacep.com.br/ws/' + cep + '/json';
    } else {
        var cidade = $("#cidade option:selected").text();
        var estado = $("#estado option:selected").val();
        var logradouro = $("#logradouro").val();

        url = "http://viacep.com.br/ws/" + estado + "/" + cidade + "/" + logradouro + "/json";
    }

    $.getJSON(url).done(function(data) {

        if(!$('#divTable').is(':visible'))
            $('#divTable').toggle();
        
        if($.isArray(data)) {
            preencherTable(data);
        }
        else {
            addTableRow(data);
        }

    });

}

function carregaEstados() {
    var options = '<option value="">Selecione o estado</option>';    

        $.each(estados, function (key, val) {
            options += '<option value="' + val.sigla + '">' + val.nome + '</option>';
        });

        $("#estado").html(options);                

        $("#estado").change(function () {                
            var str = "";

            $("#estado option:selected").each(function () {
                str += $(this).text();
            });
            options = '<option value="">Selecione a cidade</option>'; 
            $.each(estados, function (key, val) {
                if(val.nome == str) {
                    $.each(val.cidades, function (key, city) {
                        options += '<option value="' + key + '">' + city + '</option>';
                    });
                    $("#cidade").html(options);   
                }
            });
            $("#cidade").html(options); 
        });
}

function exibeGridBusca(radio) {
    if(radio.id == "radioCep") {
        $('#divBuscaCep').toggle();
        if($('#divBuscaLogradouro').is(':visible'))
            $('#divBuscaLogradouro').toggle();
    } else {
        $('#divBuscaLogradouro').toggle();
        if($('#divBuscaCep').is(':visible'))
            $('#divBuscaCep').toggle();
        carregaEstados();
    }
}

function preencherTable(dataArray) {
    limparTabela();
    $.each( dataArray, function( key, value ) {
            addTableRow(value);
        });
}

function limparTabela() {
    while(1 < $('table tbody tr').length)
        $('table tbody tr').eq(1).remove();
}

function removeTableRow(handler) {
    var tr = $(handler).closest('tr');

    tr.fadeOut(400, function(){ 
      tr.remove(); 
    }); 

    return false;
}

function addTableRow(item) {
    var newRow = $("<tr>");
    var cols = "";
    /*cols += '<td>' + item.id + '</td>';
    cols += '<td>' + item.etiqueta + '</td>';
    cols += '<td>' + item.descricao + '</td>';
    cols += '<td>' + item.dataAquisicao + '</td>';*/
    cols += '<td>' + item.cep + '</td>';
    cols += '<td>' + item.uf + '</td>';
    cols += '<td>' + item.localidade + '</td>';
    cols += '<td>' + item.bairro + '</td>';
    cols += '<td>' + item.logradouro + '</td>';
    cols += '<td>';
    cols += '<button onclick="selecionar(this)" type="button">Selecionar</button>';
    cols += '</td>';
    newRow.append(cols);
    $("#products-table").append(newRow);
    return false;
}

function selecionar(handler) {
    var tr = $(handler).closest('tr');

    var obj = {
        cep : tr.children()[0].textContent,
        uf : tr.children()[1].textContent,
        localidade : tr.children()[2].textContent,
        bairro : tr.children()[3].textContent,
        logradouro : tr.children()[4].textContent
    }
    
    sessionStorage.cep = JSON.stringify(obj);
    
    window.location = "index.html";
    //return false;
}
