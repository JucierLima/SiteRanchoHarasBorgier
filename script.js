// ================================
// ATUALIZA ANO DO RODAPÉ
// ================================
const yearEl = document.getElementById("year");
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// ================================
// IMAGE CAROUSEL NOS CARDS
// ================================
document.querySelectorAll(".image-carousel").forEach(carousel => {
    const images = carousel.querySelectorAll("img");
    if (images.length > 1) {
        let currentIndex = 0;

        // Cria botões de navegação
        const prevBtn = document.createElement("button");
        prevBtn.className = "img-nav prev";
        prevBtn.innerHTML = "‹";
        prevBtn.setAttribute("aria-label", "Imagem anterior");

        const nextBtn = document.createElement("button");
        nextBtn.className = "img-nav next";
        nextBtn.innerHTML = "›";
        nextBtn.setAttribute("aria-label", "Próxima imagem");

        // Adiciona botões ao carousel
        carousel.appendChild(prevBtn);
        carousel.appendChild(nextBtn);

        // Cria thumbnails se não existirem
        let thumbnails = carousel.querySelector(".thumbnails");
        if (!thumbnails) {
            thumbnails = document.createElement("div");
            thumbnails.className = "thumbnails";
            carousel.appendChild(thumbnails);

            images.forEach((_, i) => {
                const thumbBtn = document.createElement("button");
                thumbBtn.className = "thumb-btn";
                thumbBtn.setAttribute("data-index", i);
                if (i === 0) thumbBtn.classList.add("active");
                thumbnails.appendChild(thumbBtn);
            });
        }

        const thumbBtns = thumbnails.querySelectorAll(".thumb-btn");

        // Função para mostrar imagem
        const showImage = (index) => {
            images.forEach((img, i) => {
                img.style.display = i === index ? "block" : "none";
            });
            // Atualiza thumbnails
            thumbBtns.forEach((btn, i) => {
                btn.classList.toggle("active", i === index);
            });
        };

        // Inicializa mostrando primeira imagem
        showImage(currentIndex);

        // Eventos dos botões prev/next
        prevBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });

        nextBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });

        // Eventos dos thumbnails
        thumbBtns.forEach((btn, index) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                currentIndex = index;
                showImage(currentIndex);
            });
        });
    }
});

// ================================
// FLIP DOS CARDS
// ================================
document.querySelectorAll(".card").forEach(card => {
    let isAnimating = false; // flag para impedir flips durante animação
    const flipBtns = card.querySelectorAll(".flip-btn");

    const performFlip = () => {
        if (isAnimating) return; // impede flip se já animando
        isAnimating = true;
        card.style.pointerEvents = 'none'; // desabilita cliques no card durante animação
        flipBtns.forEach(btn => btn.style.pointerEvents = 'none'); // desabilita botões também
        card.classList.toggle("flipped");
    };

    // reseta flag e reabilita cliques quando a transição termina
    card.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'transform') {
            isAnimating = false;
            card.style.pointerEvents = 'auto';
            flipBtns.forEach(btn => btn.style.pointerEvents = 'auto');
        }
    });

    flipBtns.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.stopPropagation(); // evita propagação para o click do card
            performFlip();
        });
    });

    card.addEventListener("click", () => {
        performFlip();
    });
});

// ================================
// CONTROLE DO CARROSSEL
// ================================
const carrossel = document.getElementById("carrossel");
const btnPrev = document.querySelector(".carousel-btn.prev");
const btnNext = document.querySelector(".carousel-btn.next");

let cards = document.querySelectorAll(".card-container");
let cardIndex = 0;

function getCardWidth() {
  return cards[0].offsetWidth + 16; // 16px = gap
}

function moveCarousel(direction) {
  cardIndex += direction;

  // Se passar do último, volta ao primeiro
  if (cardIndex >= cards.length) {
    cardIndex = 0;
  }

  // Se voltar antes do primeiro, vai para o último
  if (cardIndex < 0) {
    cardIndex = cards.length - 1;
  }

  const cardWidth = getCardWidth();
  carrossel.scrollTo({
    left: cardIndex * cardWidth,
    behavior: "smooth"
  });
}

if (btnNext) btnNext.addEventListener("click", () => moveCarousel(1));
if (btnPrev) btnPrev.addEventListener("click", () => moveCarousel(-1));

window.addEventListener("resize", () => {
  // recalcula posição ao redimensionar a tela
  const cardWidth = getCardWidth();
  carrossel.scrollTo({
    left: cardIndex * cardWidth,
    behavior: "instant"
  });
});

// ================================
// NAVEGAÇÃO INDIVIDUAL DOS CARDS
// ================================
document.querySelectorAll(".card").forEach((card, index) => {
  const prevBtn = card.querySelector(".card-nav.prev");
  const nextBtn = card.querySelector(".card-nav.next");

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // impede flip do card
      moveCarousel(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // impede flip do card
      moveCarousel(1);
    });
  }
});
// ================================
// MENU MOBILE E SIDEBAR
// ================================
const menuBtn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
const sidebar = document.getElementById('sidebar');
const menuLinks = document.querySelectorAll('.menu a');
const sidebarLinks = document.querySelectorAll('.sidebar-nav a');

// Quando clicar no botão hambúrguer:
menuBtn.addEventListener('click', () => {
  // Se for mobile/tablet (tela pequena)
  if (window.innerWidth <= 1024) {
    menu.classList.toggle('active'); // abre/fecha o menu mobile
    menuBtn.classList.toggle('active');
    document.body.classList.toggle('menu-open'); // trava fundo
  } else {
    // Se for desktop, controla a sidebar
    sidebar.classList.toggle('active');
  }
});

// Fecha o menu ao clicar em um link
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
});

// Fecha a sidebar ao clicar em um link
sidebarLinks.forEach(link => {
  link.addEventListener('click', () => {
    sidebar.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.classList.remove('menu-open');
  });
});

// Fecha o menu automaticamente ao virar horizontal
window.addEventListener("resize", () => {
  if (window.matchMedia("(orientation: landscape)").matches) {
    menu.classList.remove('active');
    menuBtn.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
});

// ================================
// FORMULÁRIO DE FEEDBACK (com integração ao servidor)
// ================================
document.getElementById('feedback-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    // Coletar os 4 campos
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const mensagem = document.getElementById('mensagem').value; 
    
    // Coletar a avaliação
    const avaliacaoElemento = document.querySelector('input[name="rating"]:checked');
    const avaliacao = avaliacaoElemento ? parseInt(avaliacaoElemento.value) : null; 

    // Criar o objeto JSON: 4 campos
    const dadosFeedback = { 
        nome: nome, 
        email: email, 
        mensagem: mensagem, 
        avaliacao: avaliacao 
    };

    // Use o endpoint CORRETO: /api/feedback
    fetch('http://localhost:4000/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosFeedback),
    })
    .then(response => {
        // Verifica se a resposta foi um sucesso (código 201)
        if (!response.ok) {
            // Lança um erro para cair no catch, mostrando o status HTTP
            throw new Error(`Falha no servidor. Status: ${response.status}`);
        }
        return response.json(); // Se a resposta for JSON
    })
    .then(data => {
        // SUCESSO!
        alert('Obrigado! Seu feedback foi salvo com sucesso.');
        document.getElementById('feedback-form').reset(); // Limpa o formulário
    })
    .catch((error) => {
        // ERRO: Erro de rede ou erro lançado pelo .then(response)
        console.error('Erro de envio:', error);
        alert(`Erro ao enviar o feedback. Verifique o console do Node.js. Detalhe: ${error.message}`);
    });
});