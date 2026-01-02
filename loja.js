const produtosLoja = [
    {
        id: 1,
        nome: "Kit Moscow Mule Experience",
        preco: 189.90,
        categoria: "kits",
        descricao: "Contém: 1 Garrafa de Vodka (500ml), 2 Canecas de Cobre, 1 Xarope de Gengibre artesanal e 1 Espuma de Gengibre (200ml). Serve até 10 drinks.",
        imgs: {
            pronto: "assets/MoscowMule.jpg",
            ingredientes: "assets/lemonGinger.jpg",
            logo: "assets/logoBartender.png"
        }
    },
    {
        id: 2,
        nome: "Xarope de Frutas Vermelhas",
        preco: 45.00,
        categoria: "xaropes",
        descricao: "250 mL de Xarope artesanal de frutas vermelhas, produzido com essência natural de framboesa, morango e amora.",
        imgs: {
            pronto: "assets/frutasVermelhas.jpg",
            ingredientes: "assets/ingredientesFrutas.jpg",
            logo: "assets/logoBartender.png"
        }
    }
];

function toggleCarrinho() {
    document.getElementById('carrinho-lateral').classList.toggle('open');
}

function trocarFoto(id, tipo) {
    console.log("Tentando trocar foto do produto:", id, "para o tipo", tipo);
    const produto = produtosLoja.find(p => p.id === id);
    const imgPrincipal = document.getElementById(`main-img-${id}`);

    if (!imgPrincipal) {
        console.error(`Erro: Não encontrei o elemento com id main-img-${id}`);
        return;
    }

    imgPrincipal.src = produto.imgs[tipo];
}

function renderizarLoja(lista = produtosLoja) {
    const vitrine = document.getElementById('vitrine');
    vitrine.innerHTML = "";
    const fragmento = document.createDocumentFragment();

    lista.forEach(produto => {
        const cardContainer = document.createElement('article');
        cardContainer.className = 'produto-card';
        cardContainer.innerHTML = `
            <div class="produto-imagens">
                <img src="${produto.imgs.pronto}" id="main-img-${produto.id}" class="img-vitrine">
                <div class="thumbnails">
                    <img src="${produto.imgs.pronto}" onclick="trocarFoto(${produto.id}, 'pronto')">
                    <img src="${produto.imgs.ingredientes}" onclick="trocarFoto(${produto.id}, 'ingredientes')">
                    <img src="${produto.imgs.logo}" onclick="trocarFoto(${produto.id}, 'logo')">
                </div>
            </div>
            <div class="produto-info">
                <h4>${produto.nome}</h4>
                <p class="descricao-curta">${produto.descricao}</p>

                <p class="preco-loja">R$ ${produto.preco.toFixed(2)}</p>
                <button class="btn-comprar" onclick="adicionarAoCarrinho(${produto.id})">Adicionar</button>
            </div>
        `;
        fragmento.appendChild(cardContainer);
    });
    vitrine.appendChild(fragmento);
}

// Funções de Filtro (Placeholder para o Dia 3)
// --- LÓGICA DE BUSCA E SELEÇÃO ---

// Função para filtrar por botões de categoria
function filtrar(categoria, event) { // Adicione 'event' aqui
    const botoes = document.querySelectorAll('.btn-filtro');
    botoes.forEach(btn => btn.classList.remove('active'));

    // Agora o 'event' é local e não global
    if (event && event.target) {
        event.target.classList.add('active');
    }

    if (categoria === 'todos') {
        renderizarLoja(produtosLoja);
    } else {
        const produtosFiltrados = produtosLoja.filter(p => p.categoria === categoria);
        renderizarLoja(produtosFiltrados);
    }
}
// No final do arquivo, mantenha apenas UMA inicialização:
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia a vitrine
    renderizarLoja(produtosLoja);
    
    // 2. Tenta recuperar o carrinho salvo
    carregarCarrinhoDoStorage();

    // 3. Configura a busca com o ID CORRETO (com hífen)
    const buscaElemento = document.getElementById('input-busca');

    if (buscaElemento) {
        buscaElemento.addEventListener('input', (e) => {
            const termoBusca = e.target.value.toLowerCase().trim();

            const produtosFiltrados = produtosLoja.filter(produto => {
                const nome = produto.nome.toLowerCase();
                const desc = produto.descricao ? produto.descricao.toLowerCase() : "";
                return nome.includes(termoBusca) || desc.includes(termoBusca);
            });

            renderizarLoja(produtosFiltrados);
        });
    }
});

// --- ESTADO DO CARRINHO ---
let carrinho = [];

// 1. Adicionar ao Carrinho
function adicionarAoCarrinho(id) {
    // Busca o produto original na sua base de dados
    const produto = produtosLoja.find(p => p.id === id);

    // Verifica se o item já está no carrinho
    const itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        // Adiciona um novo objeto com quantidade inicial 1
        carrinho.push({ ...produto, quantidade: 1 });
    }

    // Atualiza a visualização
    atualizarInterfaceCarrinho();
    salvarCarrinhoNoStorage();

    // Abre o carrinho automaticamente para dar feedback ao usuário
    const carrinhoLateral = document.getElementById('carrinho-lateral');
    if (!carrinhoLateral.classList.contains('open')) {
        toggleCarrinho();
    }
}

// 2. Renderizar Itens no Carrinho Lateral
function atualizarInterfaceCarrinho() {
    const containerItens = document.getElementById('itens-carrinho');
    const totalElemento = document.getElementById('cart-total');
    const contadorFlutuante = document.getElementById('cart-count');

    containerItens.innerHTML = ""; // Limpa para redesenhar
    let totalGeral = 0;
    let totalItens = 0;

    carrinho.forEach(item => {
        totalGeral += item.preco * item.quantidade;
        totalItens += item.quantidade;

        const divItem = document.createElement('div');
        divItem.className = 'cart-item'; // Precisaremos de CSS para isso
        divItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #222; padding-bottom: 10px;">
                <div>
                    <p style="margin: 0; font-weight: bold;">${item.nome}</p>
                    <small>${item.quantidade}x R$ ${item.preco.toFixed(2)}</small>
                </div>
                <button onclick="removerDoCarrinho(${item.id})" style="background: none; border: none; color: #ff4444; cursor: pointer;">Remover</button>
            </div>
        `;
        containerItens.appendChild(divItem);
    });

    // Se o carrinho estiver vazio
    if (carrinho.length === 0) {
        containerItens.innerHTML = '<p style="text-align:center; color: #888; margin-top: 20px;">Seu carrinho está vazio.</p>';
    }

    // Atualiza valores na tela
    totalElemento.innerText = `R$ ${totalGeral.toFixed(2)}`;
    contadorFlutuante.innerText = totalItens;
}

// 3. Remover do Carrinho
function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarInterfaceCarrinho();
    salvarCarrinhoNoStorage();
}

// Salva o estado atual do array 'carrinho' no navegador
function salvarCarrinhoNoStorage() {
    localStorage.setItem('carrinho_shs', JSON.stringify(carrinho));
}

// Recupera os dados salvos ao abrir a página
function carregarCarrinhoDoStorage() {
    const salvo = localStorage.getItem('carrinho_shs');
    if (salvo) {
        carrinho = JSON.parse(salvo);
        atualizarInterfaceCarrinho();
    }
}

function confirmarIdade(maior) {
    if (maior) {
        // Salva que o usuário confirmou a idade
        sessionStorage.setItem('idade_confirmada', 'true');
        document.getElementById('modal-idade').style.display = 'none';
    } else {
        // Redireciona para o Google ou outra página segura
        window.location.href = "https://www.google.com.br";
    }
}

// Verifica ao carregar a página se já houve confirmação
document.addEventListener('DOMContentLoaded', () => {
    const confirmada = sessionStorage.getItem('idade_confirmada');
    if (confirmada === 'true') {
        document.getElementById('modal-idade').style.display = 'none';
    }
});

function abrirPoliticas() {
    document.getElementById('modal-politicas').style.display = 'flex';
}

function fecharPoliticas() {
    document.getElementById('modal-politicas').style.display = 'none';
}

function irParaCheckout() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }
    // Abre o modal de pagamento que vamos criar no HTML
    document.getElementById('modal-pagamento').style.display = 'flex';
    renderizarResumoPedido();
}

let valorFrete = 0; // Variável global para armazenar o frete

function calcularFrete() {
    const cep = document.getElementById('cep-input').value;
    const resultado = document.getElementById('frete-resultado');
    
    if (cep.length < 8) {
        resultado.innerText = "CEP inválido.";
        return;
    }
    
    // Simulação: se o CEP começa com "3", o frete é mais barato (Ex: MG)
    valorFrete = cep.startsWith('3') ? 15.00 : 25.00;
    
    resultado.innerText = `Frete para sua região: R$ ${valorFrete.toFixed(2)}`;
    
    // Atualiza o total do checkout somando o frete
    renderizarResumoPedido();
}

function renderizarResumoPedido() {
    const resumoContainer = document.getElementById('resumo-itens');
    let subtotal = 0;
    
    resumoContainer.innerHTML = carrinho.map(item => {
        subtotal += item.preco * item.quantidade;
        return `<p>${item.quantidade}x ${item.nome} - R$ ${(item.preco * item.quantidade).toFixed(2)}</p>`;
    }).join('');
    
    // Soma o subtotal com o valor do frete
    const totalComFrete = subtotal + valorFrete;
    
    document.getElementById('total-checkout').innerText = totalComFrete.toFixed(2);
    
    // Atualiza o parcelamento considerando o frete [cite: 41]
    const parcela = (totalComFrete / 3).toFixed(2);
    document.getElementById('info-parcelas').innerText = `Ou em até 3x de R$ ${parcela} sem juros`;
}

function processarPagamento(event) {
    const nome = document.getElementById('nome-cliente').value;
    const email = document.getElementById('email-cliente').value;

    // Validação de Cadastro Obrigatório (Requisito 9)
    if (!nome || !email) {
        alert("Por favor, preencha seu nome e e-mail para processar a compra.");
        return;
    }

    const botao = event ? event.target : null;
    if (botao) {
        botao.innerText = "Validando Dados... 🛡️";
        botao.disabled = true;
    }

    setTimeout(() => {
        // Mensagem de sucesso personalizada com o nome do cliente (Requisito 14)
        alert(`Procedimento realizado com sucesso, ${nome}! Um e-mail com os detalhes do pedido e código de rastreio foi encaminhado para: ${email}.`);
        
        // Reset do sistema
        carrinho = [];
        valorFrete = 0;
        salvarCarrinhoNoStorage();
        atualizarInterfaceCarrinho();
        document.getElementById('modal-pagamento').style.display = 'none';
        
        if (botao) {
            botao.innerText = "Confirmar Pagamento";
            botao.disabled = false;
        }
    }, 2000);
}