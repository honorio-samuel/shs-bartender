/**
 * SHS Bartender - Scripts de Interatividade e Lógica de Negócio
 */

// --- 1. CONFIGURAÇÃO DO SLIDESHOW DO HERO ---
function startSlideshow() {
    const slides = document.querySelectorAll('.slideshow-background img');
    let currentSlide = 0;

    if (slides.length === 0) return;

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000); // Troca a cada 5 segundos
}

// --- 2. ANIMAÇÃO DE REVELAR AO ROLAR (SCROLL REVEAL) ---
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    const windowHeight = window.innerHeight;
    const revealPoint = 100; // Sensibilidade da ativação

    reveals.forEach(element => {
        const revealTop = element.getBoundingClientRect().top;

        if (revealTop < windowHeight - revealPoint) {
            element.classList.add('visible');
        }
    });
}

// --- 3. CÁLCULO DE DURAÇÃO DO EVENTO ---
function calcularDuracao() {
    const inicio = document.getElementById('hora-inicio').value;
    const fim = document.getElementById('hora-fim').value;

    if (!inicio || !fim) return 0;

    const [hIni, mIni] = inicio.split(':').map(Number);
    const [hFim, mFim] = fim.split(':').map(Number);

    let minutosInicio = hIni * 60 + mIni;
    let minutosFim = hFim * 60 + mFim;

    // Lógica para eventos que atravessam a meia-noite
    if (minutosFim <= minutosInicio) {
        minutosFim += 24 * 60;
    }

    return (minutosFim - minutosInicio) / 60; // Retorna em horas decimais
}

// --- 4. SIMULADOR DE ORÇAMENTO (REGRAS DE NEGÓCIO) ---
const formOrcamento = document.getElementById('form-orcamento');
const valorTotalDisplay = document.getElementById('valor-total');

function calcularOrcamento() {
    // Regra 1: Valor Fixo
    let total = 300; 
    
    // Captura de dados
    const convidados = parseInt(document.getElementById('convidados').value) || 0;
    const drinksSelecionados = document.querySelectorAll('input[name="drinks"]:checked').length;
    const duracao = calcularDuracao();
    
    // Regra 2: Adicional por Drinks (R$ 50 por drink que exceder o 3º)
    if (drinksSelecionados > 3) {
        total += (drinksSelecionados - 3) * 50;
    }
    
    // Regra 3: Escala de Convidados (R$ 100 a cada 50 pessoas excedentes)
    if (convidados > 50) {
        const excesso = convidados - 50;
        const blocosExtras = Math.ceil((excesso - 50) / 50);
        total += blocosExtras * 100;
    }

    // Regra Extra: Adicional de Hora Extra (R$ 50/h após a 6ª hora de evento)
    if (duracao > 6) {
        total += (duracao - 6) * 50;
    }
    
    // Atualiza o valor na interface formatado em Real (BRL)
    valorTotalDisplay.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- 5. CONTROLE DO MODAL E FINALIZAÇÃO ---
const modal = document.getElementById('modal-login');
const btnFecharModal = document.querySelector('.close-button');

// Evento de envio do formulário principal
formOrcamento.addEventListener('submit', (e) => {
    e.preventDefault();

    const duracao = calcularDuracao();

    // Validação de segurança: Duração Mínima
    if (duracao < 4) {
        alert("Atenção: A duração mínima para contratação do serviço é de 4 horas.");
        return;
    }

    // Abre o modal de identificação
    modal.style.display = 'flex';
});

// Fechar modal ao clicar no 'X' ou fora da caixa branca
btnFecharModal.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = 'none';
};

// Evento de envio do formulário de identificação (Modal)
document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    
    alert(`Parabéns, ${nome}! Sua solicitação foi recebida. Entraremos em contato em breve.`);
    
    modal.style.display = 'none';
    formOrcamento.reset(); // Limpa o simulador
    calcularOrcamento(); // Reseta o valor visual
});

// --- 6. LISTENERS (ESCUTADORES) ---
// Escuta qualquer mudança no formulário para atualizar o preço em tempo real
formOrcamento.addEventListener('input', calcularOrcamento);

// Inicializa as funções ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    startSlideshow();
    revealOnScroll();
});

// Atualiza animações de revelação conforme o scroll
window.addEventListener('scroll', revealOnScroll);