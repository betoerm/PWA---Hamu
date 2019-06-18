$(document).ready(function () {
    telainicial();
});

function telainicial() {
    $('input').val("");
    $('textarea').val("");
    $(".modal").modal("hide");
    $("#validacao").html("");
    visualizar();
}

function visualizar() {
    var cards = "";
    var comentarios = localStorage.getItem('comentarios');

    if (!comentarios) { return false }

    comentarios = JSON.parse(localStorage.getItem('comentarios'));

    comentarios.forEach(function (value) {
        cards +=
            `
            <div class="row cards dicas" >
                <div  data-id="` + value['id'] + `" class="col">            
                    <div class="card">                
                        <div class="card-body">
                            <h5 class="card-title" >` + value['nomeCerveja'] + `</h5>
                            <p class="card-text">` + value['tipoCerveja'] + `</p>
                            <p class="card-text">` + value['comentario'] + `</p>
                            <a href='javascript:void(0)' data-id="`+ value['id'] + `" class="editar"><i class="fas fa-edit"></i></a>
                            <a href='javascript:void(0)' data-id="`+ value['id'] + `" class="remover"><i class="fas fa-trash"></i></a>
                        </div>                
                        <div class="card-footer text-muted">` + value['email'] + `</div>                        
                    </div>
                </div>
            </div>
            
            `;
    })

    $(".cards").html(cards);
}


$("#adicionar").click(function () {
    id = $("#id").val();
    nomeCerveja = $("#nomeCerveja").val();
    email = $("#email").val();
    tipoCerveja = $("#tipoCerveja").val();
    comentario = $("#comentario").val();

    if (!id) {
        id = buscarUltimoId();
        id++;
    }

    comentarios = {
        id: id,
        email: email,
        nomeCerveja: nomeCerveja,
        tipoCerveja: tipoCerveja,
        comentario: comentario
    }

      resposta = validar(comentarios);
  
      if (!resposta.status) {  
          validacao = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                      <strong>`+ resposta.campo + `</strong> ` + resposta.mensagem + `
                      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                      </button>
                      </div>`;
          $("#validacao").html(validacao);
  
          return false;
      }

    adicionar(comentarios);
});

function buscarUltimoId() {
    let id = 0;
    dados = localStorage.getItem('comentarios');

    if (dados == null) { return id }
    
    dados = JSON.parse(localStorage.getItem('comentarios'));

    dados.forEach(function (value) { id = value['id'] });

    return id;
}

function adicionar(comentarios) {
    var id = $("#id").val();

    if (!id) {
        inserir(comentarios);
    } else {
        update(comentarios);
    }

    telainicial()
}

function inserir(comentarios) {
    let array = [];

    if (localStorage.getItem('comentarios')) {
        array = JSON.parse(localStorage.getItem('comentarios'));
        array.push(comentarios);
        localStorage.setItem('comentarios', JSON.stringify(array));
    } else {
        array.push(comentarios);
        localStorage.setItem('comentarios', JSON.stringify(array));
    }
}

function update(comentarios) {
    id = comentarios.id;
    let array = [];
    array = JSON.parse(localStorage.getItem('comentarios'));

    for (a in array) {
        if (id == array[a].id) {
            array[a].email = comentarios.email;
            array[a].nomeCerveja = comentarios.nomeCerveja;
            array[a].tipoCerveja = comentarios.tipoCerveja;
            array[a].comentario = comentarios.comentario;
        }
    }

    localStorage.setItem('comentarios', JSON.stringify(array));
}

$(document).on('click', '.editar', function () {
    id = $(this).data('id');
    $('#id').val(id);
    linha = editar(id);
    $(".modal").modal("show");
    preencher(linha);
})

function editar(id) {
    var comentarios = JSON.parse(localStorage.getItem('comentarios'));

    for (d in comentarios) {
        if (id == comentarios[d].id) {
            return comentarios[d];
        }
    }
}

function preencher(comentario) {
    $('#id').val(comentario.id);
    $('#email').val(comentario.email);
    $('#nomeCerveja').val(comentario.nomeCerveja);
    $('#tipoCerveja').val(comentario.tipoCerveja);
    $('#comentario').val(comentario.comentario);
}

$(document).on('click', '.remover', function () {
    var id = $(this).data('id');
    remover(id);
})

function remover(id) {
    comentarios = JSON.parse(localStorage.getItem('comentarios'));

    for (d in comentarios) {
        if (id == comentarios[d].id) {
            comentarios.splice(d, 1);
        }
    }

    localStorage.setItem('comentarios', JSON.stringify(comentarios));
    telainicial()
}

function validar(comentarios) {

    resposta = validarEmail(comentarios.email);

    if (!resposta.status) {
        return resposta;
    }

    resposta = validarNomeCerveja(comentarios.nomeCerveja);
    if (!resposta.status) {
        return resposta;
    }

    resposta = validarTipoCerveja(comentarios.tipoCerveja);
    if (!resposta.status) {
        return resposta;
    }

    resposta = validarComentario(comentarios.comentario);
    if (!resposta.status) {
        return resposta;
    }

    return resposta;
}

// VALIDAÇÕES
function verificarVazio(valor) {
    resposta = {
        status: true,
        mensagem: "",
        campo: ""
    }

    if (valor == "") {

        resposta = {
            status: false,
            mensagem: "Não pode ser vazio",
            campo: ""
        }
    }

    return resposta;
}

function validarEmail(email) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (filter.test(email)){
        return resposta = {
            status: true,
            mensagem: "",
            campo: ""  
        };  
    } else {
        resposta = {
            status: false,
            mensagem: " Inválido!",
            campo: "Email"
        }

        return resposta;
    }

}

function validarNomeCerveja(nomeCerveja) {
    resposta = verificarVazio(nomeCerveja);

    if (!resposta.status) {
        resposta.campo = "Nome da Cerveja"
        return resposta;
    }

    return resposta;
}

function validarTipoCerveja(tipoCerveja) {
    resposta = verificarVazio(tipoCerveja);

    if (!resposta.status) {
        resposta.campo = "Tipo da Cerveja"
        return resposta;
    }

    return resposta;
}

function validarComentario(comentario) {
    resposta = verificarVazio(comentario);

    if (!resposta.status) {
        resposta.campo = "Dica/Opinião";
        return resposta;
    }

    return resposta;
}
// VALIDAÇÕES FIM

$('.modal').on('hidden.bs.modal', function (e) {
    telainicial();
})
