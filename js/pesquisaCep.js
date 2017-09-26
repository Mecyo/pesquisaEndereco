//Executa a pesquisa do endereço pelo CEP quando o input de CEP perde o foco
function buscarEndereco() {
    var cep = $('#cep').val().replace(/\D/g, '') || '';

    if(!cep) {
        limpaFormulario();
        return;
    }

    var url = 'http://viacep.com.br/ws/' + cep + '/json';

    $.getJSON(url)
      .done(function(data) {
        if(data.erro) {
            limpaFormulario();
            alert("Endereço não localizado para o CEP informado!");
        } else {
            preencheDados(data);
        }

      })
      .fail(function(text, textStatus, error) {
        limpaFormulario();
        alert("Falha ao carregar o endereço!");
    });
};

//Preenche os campos do formulário com os dados do JSON
function preencheDados(data) {

    $('input[name="rua"]').val(data.logradouro);
    $('input[name="bairro"]').val(data.bairro);
    $('input[name="cidade"]').val(data.localidade);
    $('input[name="uf"]').val(data.uf);
};

//Limpa os campos do formulário
function limpaFormulario() {

    $('input[name="cep"]').val("");
    $('input[name="rua"]').val("");
    $('input[name="bairro"]').val("");
    $('input[name="cidade"]').val("");
    $('input[name="uf"]').val("");
};