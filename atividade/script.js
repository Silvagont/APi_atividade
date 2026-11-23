const URL = "https://jsonplaceholder.typicode.com/posts?_limit=6";

const botao = document.querySelector("#btn-carregar");
const filtro = document.querySelector("#filtro");
const mensagem = document.querySelector("#mensagem");
const painel = document.querySelector("#lista-posts");

let publicacoes = [];
let carregado = false;

function renderizarPublicacoes(lista) {
    painel.replaceChildren();

    lista.forEach((publicacao) => {
        const cartao = document.createElement("article");
        const titulo = document.createElement("h2");
        const texto = document.createElement("p");
        const id = document.createElement("p");

        cartao.classList.add("cartao");

        titulo.textContent = publicacao.title;
        texto.textContent = publicacao.body;
        id.textContent = `Publicação #${publicacao.id}`;

        cartao.append(id, titulo, texto);
        painel.append(cartao);
    });
}

function carregarPublicacoes() {
    mensagem.textContent = "Carregando publicações...";
    botao.disabled = true;

    fetch(URL)
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            return resposta.json();
        })
        .then((dados) => {
            publicacoes = dados;
            carregado = true;

            const termo = filtro.value.trim().toLowerCase();

            const encontradas = publicacoes.filter((item) => {
                return item.title.toLowerCase().includes(termo);
            });

            renderizarPublicacoes(encontradas);

            mensagem.textContent = encontradas.length === 0
                ? "Nenhuma publicação encontrada."
                : `${encontradas.length} publicação(ões) carregada(s).`;
        })
        .catch((erro) => {
            console.error(erro);

            mensagem.textContent =
                "Não foi possível carregar as publicações.";

            painel.replaceChildren();
        })
        .finally(() => {
            botao.disabled = false;
        });
}

botao.addEventListener("click", () => {
    carregarPublicacoes();
});

filtro.addEventListener("input", () => {
    if (!carregado) {
        mensagem.textContent =
            "Clique em Carregar publicações primeiro.";
        return;
    }

    const termo = filtro.value.trim().toLowerCase();

    const encontradas = publicacoes.filter((item) => {
        return item.title.toLowerCase().includes(termo);
    });

    renderizarPublicacoes(encontradas);

    mensagem.textContent = encontradas.length === 0
        ? "Nenhuma publicação encontrada."
        : `${encontradas.length} publicação(ões) encontrada(s).`;
});