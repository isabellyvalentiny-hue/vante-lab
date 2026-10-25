
/* =====================================
   1. DADOS DAS CATEGORIAS
===================================== */

const categorias = {
  saia: {
    titulo: "Saias",
    descricao: "Modelos, texturas e possibilidades de composição."
  },
  gravata: {
    titulo: "Gravatas",
    descricao: "Peças coringas e possibilidades de composição."
  },
  calca: {
    titulo: "Calças",
    descricao: "Modelagens, lavagens e inspirações."
  },
  blusa: {
    titulo: "Blusas",
    descricao: "Modelos essenciais e composições criativas."
  },
  acessorios: {
    titulo: "Acessórios",
    descricao: "Detalhes que transformam uma composição."
  },
  tenis: {
    titulo: "Tênis",
    descricao: "Calçados para diferentes estilos."
  },
  bota: {
    titulo: "Botas",
    descricao: "Modelos marcantes para completar seus looks."
  },
  sobreposicao: {
    titulo: "Sobreposições",
    descricao: "Camadas, volumes e novas possibilidades."
  },
  maquiagem: {
    titulo: "Maquiagem",
    descricao: "Referências de cores, acabamentos e estilos."
  },
  cabelo: {
    titulo: "Cabelo",
    descricao: "Penteados, cortes e referências para se inspirar."
  }
};


/* =====================================
   2. LER AS FOTOS DEFINIDAS NO HTML
===================================== */

const elementoFotos = document.getElementById("fotosAcervo");

const dadosFotos = JSON.parse(elementoFotos.textContent);


/* =====================================
   3. ELEMENTOS DO SITE
===================================== */

const inicio = document.getElementById("inicio");
const acervo = document.getElementById("acervo");

const tituloAcervo = document.getElementById("tituloAcervo");
const descricaoAcervo = document.getElementById("descricaoAcervo");
const listaPecas = document.getElementById("listaPecas");

const visualizador = document.getElementById("visualizador");
const imagemAmpliada = document.getElementById("imagemAmpliada");
const nomeLookGrande = document.getElementById("nomeLookGrande");


/* =====================================
   4. CRIAR UM ESPAÇO PARA CADA FOTO
===================================== */

function criarEspacoFoto(nomeArquivo, textoAlternativo, classe) {
  const area = document.createElement("div");
  area.className = classe;

  // Sem nome de arquivo: mostrar um espaço reservado.
  if (!nomeArquivo || !nomeArquivo.trim()) {
    area.classList.add("sem-foto");
    area.setAttribute("aria-label", "Espaço reservado para fotografia");

    const icone = document.createElement("span");
    icone.className = "icone-foto";
    icone.textContent = "＋";
    icone.setAttribute("aria-hidden", "true");

    area.appendChild(icone);
    return area;
  }

  // Com nome de arquivo: carregar a imagem da pasta imagens.
  const imagem = document.createElement("img");
  imagem.className = classe;
  imagem.alt = textoAlternativo;
  imagem.loading = "lazy";

  imagem.src = `imagens/${nomeArquivo}`;

  imagem.addEventListener("error", () => {
    area.replaceChildren();

    const aviso = document.createElement("span");
    aviso.textContent = "Foto não encontrada";
    aviso.className = "aviso-foto";

    area.classList.add("sem-foto");
    area.appendChild(aviso);
  }, { once: true });

  return imagem;
}


/* =====================================
   5. ABRIR UMA CATEGORIA
===================================== */

function abrirCategoria(chave) {
  const categoria = categorias[chave];

  if (!categoria) {
    return;
  }

  tituloAcervo.textContent = categoria.titulo;
  descricaoAcervo.textContent = categoria.descricao;

  // Apaga os cartões anteriores.
  listaPecas.replaceChildren();

  const pecas = dadosFotos[chave]?.pecas || [];

  pecas.forEach((item, indice) => {
    const cartao = document.createElement("article");
    cartao.className = "peca";

    /* Informações da peça */

    const informacao = document.createElement("div");
    informacao.className = "informacao-peca";

    const fotoPrincipal = criarEspacoFoto(
      item.foto,
      item.nome,
      "imagem-principal"
    );

    const textos = document.createElement("div");

    const identificacao = document.createElement("p");
    identificacao.className = "identificacao";
    identificacao.textContent =
      `PEÇA CORINGA ${String(indice + 1).padStart(2, "0")}`;

    const nome = document.createElement("h2");
    nome.className = "nome-peca";
    nome.textContent = item.nome;

    const descricao = document.createElement("p");
    descricao.className = "texto-peca";

    const descricoes = [
      "Uma peça, três possibilidades.",
      "Explore cores, padrões e contrastes.",
      "Experimente composições diferentes."
    ];

    descricao.textContent = descricoes[indice] ||
      "Descubra novas possibilidades de composição.";

    textos.append(identificacao, nome, descricao);
    informacao.append(fotoPrincipal, textos);

    /* Três espaços para looks */

    const gradeLooks = document.createElement("div");
    gradeLooks.className = "grade-looks";

    for (let numero = 0; numero < 3; numero++) {
      const nomeArquivo = item.looks?.[numero] || "";

      const botaoLook = document.createElement("button");
      botaoLook.className = "look";
      botaoLook.type = "button";

      const imagemLook = criarEspacoFoto(
        nomeArquivo,
        `${item.nome} - Look ${numero + 1}`,
        "imagem-look"
      );

      const legenda = document.createElement("span");
      legenda.className = "legenda-look";
      legenda.textContent = `Look 0${numero + 1}`;

      // Só permite ampliar quando existe uma foto preenchida.
      if (nomeArquivo.trim()) {
        botaoLook.addEventListener("click", () => {
          abrirVisualizador(
            `imagens/${nomeArquivo}`,
            `${item.nome} - Look ${numero + 1}`
          );
        });
      } else {
        botaoLook.disabled = true;
        botaoLook.setAttribute(
          "aria-label",
          `Espaço vazio para o Look ${numero + 1}`
        );
      }

      botaoLook.append(imagemLook, legenda);
      gradeLooks.appendChild(botaoLook);
    }

    cartao.append(informacao, gradeLooks);
    listaPecas.appendChild(cartao);
  });

  inicio.classList.remove("ativa");
  acervo.classList.add("ativa");

  window.scrollTo({ top: 0, behavior: "auto" });
}


/* =====================================
   6. CLICAR NAS CATEGORIAS
===================================== */

document.querySelectorAll(".opcao").forEach(botao => {
  botao.addEventListener("click", () => {
    abrirCategoria(botao.dataset.categoria);
  });
});


/* =====================================
   7. VOLTAR PARA A PÁGINA INICIAL
===================================== */

document.getElementById("botaoVoltar")
  .addEventListener("click", () => {
    fecharVisualizador();

    acervo.classList.remove("ativa");
    inicio.classList.add("ativa");

    window.scrollTo({ top: 0, behavior: "auto" });
  });


/* =====================================
   8. AMPLIAR AS FOTOS DOS LOOKS
===================================== */

function abrirVisualizador(caminho, nome) {
  imagemAmpliada.src = caminho;
  imagemAmpliada.alt = nome;

  nomeLookGrande.textContent = nome;

  visualizador.classList.add("aberto");

  document.getElementById("fecharVisualizador").focus();
}

function fecharVisualizador() {
  visualizador.classList.remove("aberto");

  imagemAmpliada.removeAttribute("src");
  imagemAmpliada.alt = "";
}

document.getElementById("fecharVisualizador")
  .addEventListener("click", fecharVisualizador);

visualizador.addEventListener("click", evento => {
  if (evento.target === visualizador) {
    fecharVisualizador();
  }
});

document.addEventListener("keydown", evento => {
  if (evento.key === "Escape") {
    fecharVisualizador();
  }
});
