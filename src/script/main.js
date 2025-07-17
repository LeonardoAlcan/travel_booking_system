// Destinos em destaque //
document.addEventListener("DOMContentLoaded", () => {
    const pacotesContainer = document.querySelector("#pacotes .row");
    const destinosContainer = document.querySelector("#destinos .row");
    const formBusca = document.querySelector("#form-busca");
    const inputDestino = document.querySelector("#input-destino");
    const inputData = document.querySelector("#input-data");
    const inputPessoas = document.querySelector("#input-pessoas");
    const btnLimpar = document.querySelector("#btn-limpar");
    const inputPrecoMin = document.querySelector("#preco-min");
    const inputPrecoMax = document.querySelector("#preco-max");
    const inputCategoria = document.querySelector("#input-categoria");
    const inputContinente = document.querySelector("#input-continente");

    // Renderizar pacotes (já existia)
    pacotes.forEach(pacote => {
        const card = document.createElement("div");
        card.className = "col-md-4";
        card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${pacote.imagem}" class="card-img-top" alt="${pacote.destino}">
                <div class="card-body">
                    <h5 class="card-title">${pacote.destino}</h5>
                    <p class="card-text">${pacote.descricao}</p>
                    <p class="fw-bold text-success">${pacote.preco}</p>
                    <a href="#" class="btn btn-success w-100">Reservar agora</a>
                </div>
            </div>
        `;
        pacotesContainer.appendChild(card);
    });

    // Função para renderizar destinos
    const renderDestinos = (lista) => {
        destinosContainer.innerHTML = "";

        if (lista.length === 0) {
            destinosContainer.innerHTML = `
                <div class="col-12 text-center text-muted">
                    <p>Nenhum destino encontrado com "${inputDestino.value}"</p>
                </div>
            `;
            return;
        }

        lista.forEach(destino => {
            // Define a animação com base na categoria

            let animacao = "fade-up"; // padrão
            const categoria = destino.categoria?.toLowerCase();

            if (categoria === "cidade") animacao = "fade-right";
            else if (categoria === "praia") animacao = "zoom-in";
            else if (categoria === "histórico") animacao = "flip-left";

            const card = document.createElement("div");
            card.className = "col-md-4";
            card.innerHTML = `
                <div class="card h-100 shadow-sm" data-aos="fade-up">
                    <img src="${destino.imagem}" class="card-img-top" alt="${destino.nome}">
                    <div class="card-body">
                        <h5 class="card-title">${destino.nome}</h5>
                        <p class="card-text">A partir de <strong>${destino.preco}</strong></p>
                        <a href="#" class="btn btn-outline-primary w-100">Ver mais</a>
                    </div>
                </div>
            `;
            destinosContainer.appendChild(card);
        });
        // Reinicia o AOS após inserir os novos elementos
        AOS.refresh();
    };

    // Renderiza todos os destinos no início
    renderDestinos(destinos);

    // Filtro de busca
    formBusca.addEventListener("submit", (e) => {
        e.preventDefault();

        const termo = inputDestino.value.trim().toLowerCase();
        const precoMin = parseFloat(inputPrecoMin.value);
        const precoMax = parseFloat(inputPrecoMax.value);
        const categoriaSelecionada = inputCategoria.value.toLowerCase();
        const continenteSelecionado = inputContinente.value.toLowerCase();

        const resultados = destinos.filter(destino => {
            const nomeMatch = destino.nome.toLowerCase().includes(termo);

            // Extrai o número da string de preço (ex: R$ 3.200 => 3200)
            const precoNumerico = parseFloat(
                destino.preco.replace("R$", "").replace(/\./g, "").replace(",", ".")
            );

            const dentroFaixaMin = isNaN(precoMin) || precoNumerico >= precoMin;
            const dentroFaixaMax = isNaN(precoMax) || precoNumerico <= precoMax;

            const categoriaMatch = categoriaSelecionada === "" || destino.categoria.toLowerCase() === categoriaSelecionada;
            const continenteMatch = continenteSelecionado === "" || destino.continente.toLowerCase() === continenteSelecionado;

            return nomeMatch && dentroFaixaMin && dentroFaixaMax && categoriaMatch && continenteMatch;
        });

        renderDestinos(resultados);
    });

    btnLimpar.addEventListener("click", () => {
        // Limpar campos
        inputDestino.value = "";
        inputPrecoMin.value = "";
        inputPrecoMax.value = "";
        inputCategoria.value = "";
        inputContinente.value = "";
        if (inputData) inputData.value = "";
        if (inputPessoas) inputPessoas.value = "";

        // Mostrar todos os destinos novamente
        renderDestinos(destinos);
    })
});