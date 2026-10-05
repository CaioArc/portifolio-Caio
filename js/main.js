'use strict';
// 'use strict' ativa o "modo estrito" do JavaScript: erros que normalmente
// seriam ignorados silenciosamente (como criar uma variável sem declarar)
// passam a gerar erro de verdade, ajudando a pegar bugs mais cedo.

// Tudo é colocado dentro desta função autoexecutável (IIFE = Immediately
// Invoked Function Expression). Isso evita que as variáveis/funções daqui
// "vazem" para o escopo global do navegador e entrem em conflito com
// outros scripts que você venha a adicionar no futuro.
(function(){

  // ============================================================
  // 1) FUNDO ANIMADO — CAMPO DE ESTRELAS
  // ============================================================

  // Pega a tag <canvas id="starfield"> do HTML
  const canvas = document.getElementById('starfield');
  // Se por algum motivo o canvas não existir na página, encerra o script
  // aqui mesmo, evitando erros nas linhas seguintes.
  if(!canvas){ return; }

  // "ctx" é o contexto 2D do canvas: o "pincel" usado para desenhar nele
  const ctx = canvas.getContext('2d');

  let stars = [];   // array que vai guardar todas as estrelas de fundo
  let w, h;         // largura e altura atuais do canvas

  // Verifica se o visitante pediu ao sistema operacional para reduzir
  // animações (opção de acessibilidade). Se sim, o site desenha tudo
  // parado, sem movimento.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ajusta o tamanho do canvas para acompanhar o tamanho da janela/página
  // e recria as estrelas do zero (senão elas ficariam posicionadas erradas)
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = document.body.scrollHeight;  // altura da página inteira, não só da tela visível
    initStars();
  }

  // Cria o array de estrelas com posição e propriedades aleatórias
  function initStars(){
    // Quantidade de estrelas proporcional à área da tela (telas maiores = mais estrelas)
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({length: count}, () => ({
      x: Math.random() * w,                      // posição horizontal aleatória
      y: Math.random() * h,                       // posição vertical aleatória
      r: Math.random() * 1.3 + 0.3,                // raio (tamanho) da estrela
      baseAlpha: Math.random() * 0.6 + 0.3,        // transparência "de base"
      twinkleSpeed: Math.random() * 0.02 + 0.005,  // velocidade do piscar (twinkle)
      phase: Math.random() * Math.PI * 2,          // ponto de partida do piscar (evita todas piscarem juntas)
      driftX: (Math.random() - 0.5) * 0.05,        // velocidade de deslocamento horizontal (bem lenta)
      driftY: (Math.random() - 0.5) * 0.05         // velocidade de deslocamento vertical (bem lenta)
    }));
  }

  // Guarda a posição de rolagem da página, usada para dar um leve efeito
  // de paralaxe (estrelas se movem um pouco mais devagar que o scroll)
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  // ============================================================
  // 2) ESTRELAS CADENTES
  // ============================================================

  let shootingStars = [];      // lista das estrelas cadentes "vivas" no momento
  let lastShootTime = 0;       // timestamp da última estrela cadente criada
  // Tempo aleatório (em milissegundos) até a próxima estrela cadente aparecer
  let nextShootDelay = 600 + Math.random() * 1200;

  // Cria uma nova estrela cadente com posição/ângulo/velocidade aleatórios
  function spawnShootingStar(){
    // Nasce em algum ponto da faixa horizontal central e no terço superior da tela
    const startX = Math.random() * w * 0.6 + w * 0.2;
    const startY = Math.random() * h * 0.35;
    // Ângulo de aproximadamente 45°, com uma pequena variação para não ficar repetitivo
    const angle = (Math.PI / 4) + (Math.random() * 0.3 - 0.15);
    const speed = 11 + Math.random() * 7;   // velocidade de deslocamento por quadro
    shootingStars.push({
      x: startX,
      y: startY - scrollY * 0.06,           // já aplica o mesmo efeito de paralaxe das estrelas normais
      vx: Math.cos(angle) * speed,          // velocidade no eixo X (calculada a partir do ângulo)
      vy: Math.sin(angle) * speed,          // velocidade no eixo Y
      len: 150 + Math.random() * 90,        // comprimento do rastro
      width: 2.6 + Math.random() * 1.4,     // espessura do traço
      life: 1                                // "vida" da estrela: começa em 1 (100%) e vai diminuindo
    });
  }

  // Atualiza a posição e desenha cada estrela cadente ativa
  function drawShootingStars(dt){
    // Percorre de trás para frente: assim dá para remover itens do array
    // no meio do loop sem bagunçar os índices dos que ainda faltam visitar
    for(let i = shootingStars.length - 1; i >= 0; i--){
      const s = shootingStars[i];
      s.x += s.vx;         // avança a posição conforme a velocidade
      s.y += s.vy;
      s.life -= 0.012;      // vai "morrendo" aos poucos (efeito de desaparecer)

      // Remove a estrela cadente se ela já sumiu ou saiu da tela
      if(s.life <= 0 || s.x > w + 100 || s.y > h + 100){
        shootingStars.splice(i, 1);
        continue;   // pula para a próxima iteração do loop
      }

      // Calcula o ponto final do rastro (atrás da "cabeça" da estrela)
      const tailX = s.x - s.vx * (s.len / 12);
      const tailY = s.y - s.vy * (s.len / 12);

      // Cria um gradiente que vai de branco brilhante (cabeça) até transparente (fim do rastro)
      const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
      grad.addColorStop(0.4, `rgba(220,230,255,${s.life * 0.6})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');

      ctx.save();
      ctx.shadowColor = 'rgba(255,255,255,0.9)';
      ctx.shadowBlur = 14;             // desfoque ao redor da linha, criando um brilho (glow)
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';           // pontas arredondadas na linha do rastro
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();                    // desenha a linha do rastro

      // Desenha um pontinho branco na "cabeça" da estrela cadente, mais brilhante que o rastro
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.width * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.life})`;
      ctx.fill();
      ctx.restore();  // devolve o canvas ao estado salvo antes (desfaz shadowBlur etc.)
    }
  }

  // ============================================================
  // 3) LOOP PRINCIPAL DE DESENHO (estrelas normais)
  // ============================================================

  // "t" é o tempo (em milissegundos) desde que a página carregou,
  // fornecido automaticamente pelo requestAnimationFrame
  function draw(t){
    ctx.clearRect(0, 0, w, h);   // limpa o canvas inteiro antes de redesenhar (senão as estrelas "arrastariam")
    for(const s of stars){
      // Calcula o brilho da estrela neste instante: se reducedMotion estiver
      // ativo, não pisca (twinkle = 0); senão, usa uma onda seno para oscilar suavemente
      const twinkle = reducedMotion ? 0 : Math.sin(t * s.twinkleSpeed + s.phase) * 0.35;
      // Garante que o valor final de transparência fique sempre entre 0 e 1
      const alpha = Math.max(0, Math.min(1, s.baseAlpha + twinkle));

      ctx.beginPath();
      const parallaxY = s.y - scrollY * 0.06;   // aplica o deslocamento de paralaxe conforme o scroll
      ctx.arc(s.x, parallaxY, s.r, 0, Math.PI * 2);  // desenha um círculo (a estrela)
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();

      // Move a estrela lentamente e a "teleporta" para o lado oposto
      // quando ela sai da tela, criando um campo infinito
      if(!reducedMotion){
        s.x += s.driftX;
        s.y += s.driftY;
        if(s.x < 0) s.x = w;
        if(s.x > w) s.x = 0;
        if(s.y < 0) s.y = h;
        if(s.y > h) s.y = 0;
      }
    }
  }

  // Função chamada a cada quadro de animação: desenha as estrelas normais
  // e, além disso, decide se é hora de criar uma nova estrela cadente
  function drawFrame(t){
    draw(t);
    if(!reducedMotion){
      // Se já passou tempo suficiente desde a última estrela cadente, cria outra
      if(t - lastShootTime > nextShootDelay){
        spawnShootingStar();
        lastShootTime = t;
        nextShootDelay = 700 + Math.random() * 1500;  // sorteia o próximo intervalo
      }
      drawShootingStars();
    }
    // Agenda a próxima execução deste mesmo loop (a "mágica" da animação)
    requestAnimationFrame(drawFrame);
  }

  // Sempre que a janela for redimensionada, recalcula tudo
  window.addEventListener('resize', resize);
  resize();                        // chamada inicial, ao carregar a página
  requestAnimationFrame(drawFrame); // inicia o loop de animação

  // ============================================================
  // 4) LINHA "DE TERMINAL" DIGITADA NO HERO
  // ============================================================

  const typedEl = document.getElementById('typed');
  // Textos da linha digitada, um para cada idioma
  const typedLines = {
    pt: '$ automatizando processos desde 2021',
    en: '$ automating processes since 2021'
  };
  let currentLang = 'pt';   // idioma atual da página (começa em português)

  // Escreve o texto letra por letra, simulando alguém digitando
  function typeLine(text){
    if(!typedEl){ return; }   // proteção: se o elemento não existir, não faz nada
    if(reducedMotion){
      // Sem animação: mostra o texto inteiro de uma vez
      typedEl.textContent = text;
      return;
    }
    let i = 0;
    typedEl.textContent = '';
    // Função recursiva que vai adicionando uma letra a cada 45 milissegundos
    (function typeChar(){
      if(i <= text.length){
        typedEl.textContent = text.slice(0, i);
        i++;
        setTimeout(typeChar, 45);
      }
    })();
  }
  typeLine(typedLines.pt);   // ao carregar a página, digita a frase em português

  // ============================================================
  // 5) BOTÃO DE TROCA DE IDIOMA (PT / EN)
  // ============================================================

  const langToggle = document.getElementById('langToggle');
  // Só configura o botão de idioma se ele realmente existir na página
  if(langToggle){
    const toggleSpans = langToggle.querySelectorAll('span');   // os dois <span> "PT" e "EN"

    // Aplica o idioma escolhido em toda a página
    function applyLang(lang){
      currentLang = lang;
      // Atualiza o atributo lang do <html>, importante para acessibilidade e SEO
      document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
      // Atualiza o título da aba do navegador
      document.title = lang === 'pt'
        ? 'Caio Rangel — Desenvolvedor Backend & Automação'
        : 'Caio Rangel — Backend Developer & Automation';

      // Troca o texto simples de todos os elementos que têm data-pt e data-en
      document.querySelectorAll('[data-pt][data-en]').forEach(el => {
        el.textContent = el.getAttribute('data-' + lang);
      });
      // Troca o HTML interno dos elementos que têm data-pt-html e data-en-html
      // (usado quando o texto tem tags dentro, como <strong> e <br>)
      document.querySelectorAll('[data-pt-html][data-en-html]').forEach(el => {
        el.innerHTML = el.getAttribute('data-' + lang + '-html');
      });

      // Reinicia a animação de digitação com a frase no novo idioma
      typeLine(typedLines[lang]);

      // Destaca visualmente qual opção (PT ou EN) está ativa no botão
      toggleSpans.forEach(s => s.classList.toggle('active', s.dataset.lang === lang));
    }

    // Ao clicar no botão, alterna entre "pt" e "en"
    langToggle.addEventListener('click', () => {
      applyLang(currentLang === 'pt' ? 'en' : 'pt');
    });
  }

  const navToggle = document.getElementById('navToggle');
  const navLinksMenu = document.getElementById('navLinks');
  if(navToggle && navLinksMenu){
    navToggle.addEventListener('click', () => {
      const open = navLinksMenu.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinksMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinksMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ============================================================
  // 6) ANIMAÇÃO "APARECER AO ROLAR" (scroll reveal)
  // ============================================================

  // Pega todos os elementos marcados com a classe .reveal
  const revealEls = document.querySelectorAll('.reveal');

  // IntersectionObserver é uma API do navegador que avisa quando um
  // elemento entra ou sai da área visível da tela — muito mais
  // eficiente do que ficar checando a posição de scroll manualmente
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){       // elemento entrou na tela
        entry.target.classList.add('visible');  // ativa o CSS de fade-in
        observer.unobserve(entry.target);        // já apareceu, não precisa checar de novo
      }
    });
  }, { threshold: 0.15 });   // dispara quando 15% do elemento já está visível

  revealEls.forEach(el => observer.observe(el));  // começa a "vigiar" cada elemento

  // ============================================================
  // 7) EFEITOS NOS BOTÕES: BRILHO QUE SEGUE O MOUSE + ONDA AO CLICAR
  // ============================================================

  document.querySelectorAll('.btn').forEach(btn => {
    // A cada movimento do mouse sobre o botão, atualiza duas variáveis
    // CSS (--mx e --my) com a posição do cursor DENTRO do botão.
    // O CSS usa essas variáveis no gradiente radial (.btn::before)
    // para o brilho seguir exatamente onde está o mouse.
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();          // posição/tamanho do botão na tela
      btn.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      btn.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });

    // A cada clique, cria um elemento <span class="ripple"> na posição
    // exata do clique, que se expande e desaparece (efeito "onda")
    btn.addEventListener('click', function(e){
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);   // tamanho grande o suficiente para cobrir o botão
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      btn.appendChild(ripple);
      // Remove o elemento depois que a animação CSS (0.6s) já terminou,
      // para não acumular dezenas de <span> escondidos no botão
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // ============================================================
  // 8) DESTACAR O LINK DO MENU CONFORME A SEÇÃO VISÍVEL
  // ============================================================

  const sections = document.querySelectorAll('section[id]');   // todas as seções com id (sobre, projetos...)
  const navLinks = document.querySelectorAll('.nav-links a');  // os links correspondentes no menu

  window.addEventListener('scroll', () => {
    let current = '';
    // Descobre qual é a última seção cujo topo já passou da posição de rolagem atual
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;   // -120 dá uma margem para trocar um pouco antes de chegar exatamente na seção
      if(window.scrollY >= top) current = sec.getAttribute('id');
    });
    // Colore de branco o link do menu que corresponde à seção atual; os outros voltam à cor padrão do CSS
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current ? 'var(--text-primary)' : '';
    });
  });

})();
// Fim da função autoexecutável — nenhuma dessas variáveis/funções
// existe fora deste bloco, mantendo o escopo global do navegador limpo.
