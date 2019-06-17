$(document).ready(function () {
    inicializar();
});

function inicializar(){
    $(".modal").modal("hide");
    $('input').val = "";
    $('textarea').val("");
    //$("#validacao").html("");

    visualizar();
}

function visualizar() {
    var cards = "";
    dados = localStorage.getItem('comentarios');

    if (!dados) { 
        alert('vazio')
        return false; 
    };   

    dados = JSON.parse(localStorage.getItem('comentarios'));

    dados.forEach(function (value) {
        cards +=
            `<div class="col-sm-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">` + value['tipoCerveja'] + `</h5>
                        <p class="card-text">` + value['comentario'] + `</p>
                        <a href='javascript:void(0)' data-id="`+ value['id'] + `" class="editar"><i class="fas fa-edit"></i></a>
                        <a href='javascript:void(0)' data-id="`+ value['id'] + `" class="remover"><i class="fas fa-trash"></i></a>
                    </div>
                    <div class="card-footer text-muted">` + value['email'] + `</div>                        
                </div>
            </div>`;
    })

    $(".cards").html(cards);
}

$("#adicionar").click(function () {
    id = $("#id").val();
    email = $("#email").val();
    tipoCerveja = $("#tipoCerveja").val();
    comentario = $("#comentario").val();

    if (!id) {
        id = buscarUltimoId();
        id++;
    }

    dados = {
        id: id,
        email: email,
        tipoCerveja: tipoCerveja,
        comentario: comentario
    }

    /*resp = validar(dados);

    if (!resp.status) {

        validacao = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>`+ resp.campo + `</strong> ` + resp.mensagem + `
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                    </div>`;
        $("#validacao").html(validacao);

        return false;
    }*/

    adicionar(dados);
});


function adicionar(dados) {
    id = $("#id").val();

    if (!id) { 
        alert(id);
        inserir(dados) } 
    else { 
        
        update(dados) }

    inicializar()
}

function buscarUltimoId() {
    let id = 0;
    dados = localStorage.getItem('comentarios');

    if (dados == null) { return id }

    dados = JSON.parse(localStorage.getItem('comentarios'));

    dados.forEach(function (value) {
        id = value['id'];
    });

    return id;
}


function inserir(dados) {
    let array = [];

    if (localStorage.getItem('comentarios')) {
        array = JSON.parse(localStorage.getItem('comentarios'));
        array.push(dados);
        localStorage.setItem('comentarios', JSON.stringify(array));
    } else {
        array.push(dados);
        localStorage.setItem('comentarios', JSON.stringify(array));
    }
}

function update(dado) {
    id = dado.id;
    let array = [];
    array = JSON.parse(localStorage.getItem('comentarios'));

    for (a in array) {
        if (id == array[a].id) {
            array[a].tipoCerveja = dado.tipoCerveja;
            array[a].comentario = dado.comentario;
        }
    }
    localStorage.setItem('comentarios', JSON.stringify(array));
}

function remover(id) {

    dados = JSON.parse(localStorage.getItem('comentarios'));

    for (d in dados) {
        if (id == dados[d].id) {
            dados.splice(d, 1);
        }
    }

    localStorage.setItem('comentarios', JSON.stringify(dados));    
    inicializar();
}

function editar(id) {
    dados = JSON.parse(localStorage.getItem('comentarios'));

    for (d in dados) {
        if (id == dados[d].id) {
            return dados[d];
        }
    }
}

$(document).on('click', '.editar', function (){
    id = $(this).data('id');
    comentario = editar(id);
    $(".modal").modal("show");
    preencher(comentario);
});

function preencher(comentario) {        
    $('id').val(comentario.id);
    $('#tipoCerveja').val(comentario.tipoCerveja);
    $('#comentario').val(comentario.comentario);
    $('#email').val(comentario.email);
}

$(document).on('click', '.remover', function (){
    id = $(this).data('id');
    remover(id);
});


$('.modal').on('hidden.bs.modal', function (e) {
    inicializar();
})



