/**
 * CASA CANIDELO — VIRTUAL SCROLLYTELLING & REAL ESTATE EXPERIENCE
 * High-performance GSAP ScrollTrigger, HTML5 Canvas & Interactive UI
 */

document.addEventListener('DOMContentLoaded', () => {
  // Registo seguro de plugins GSAP
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);
  }

  /* ========================================================
     1. CONFIGURAÇÃO DAS 13 DIVISÕES, FRAMES DE REPOUSO & VÍDEO
     ======================================================== */
  // Os 13 frames ideais de repouso (último frame do vídeo anterior em cada divisão)
  // Garante 100% de continuidade sem qualquer salto visual entre pausa e movimento
  const RESTING_FRAMES = [
    "frames/transicao_01/frame_001.webp", // 01. Fachada & Lote de 1.679m² (Início do Vídeo 1)
    "frames/transicao_01/frame_078.webp", // 02. Sala de Estar (Último frame do Vídeo 1)
    "frames/transicao_02/frame_050.webp", // 03. Sala de Jantar (Último frame do Vídeo 2)
    "frames/transicao_03/frame_050.webp", // 04. Cozinha Gourmet (Último frame do Vídeo 3)
    "frames/transicao_04/frame_050.webp", // 05. Circulação Interna (Último frame do Vídeo 4)
    "frames/transicao_05/frame_062.webp", // 06. Primeiro Quarto (Último frame do Vídeo 5)
    "frames/transicao_06/frame_062.webp", // 07. Casa de Banho de Serviço (Último frame do Vídeo 6)
    "frames/transicao_07/frame_062.webp", // 08. Segundo Quarto Versátil (Último frame do Vídeo 7)
    "frames/transicao_08/frame_062.webp", // 09. Casa de Banho da Suite (Último frame do Vídeo 8)
    "frames/transicao_09/frame_062.webp", // 10. Closet da Suite (Último frame do Vídeo 9)
    "frames/transicao_10/frame_062.webp", // 11. Quarto da Suite Master (Último frame do Vídeo 10)
    "frames/transicao_11/frame_062.webp", // 12. Piscina Aquecida & Jardim (Último frame do Vídeo 11)
    "frames/transicao_12/frame_062.webp"  // 13. Sala Exterior & Anexos (Último frame do Vídeo 12)
  ];

  const TRANSITION_COUNTS = [78, 50, 50, 50, 62, 62, 62, 62, 62, 62, 62, 62];
  const transitionFrameLists = [];
  const criticalUrls = [];
  const backgroundUrls = [];

  // 1. Todos os frames de repouso das 13 divisões são carregados criticamente no arranque
  RESTING_FRAMES.forEach(imgUrl => {
    criticalUrls.push(imgUrl);
  });

  // 2. Transições em vídeo (frames WebP) entre cada divisão
  TRANSITION_COUNTS.forEach((count, tIdx) => {
    const tNum = String(tIdx + 1).padStart(2, '0');
    const list = [];
    for (let f = 1; f <= count; f++) {
      const fNum = String(f).padStart(3, '0');
      const url = `frames/transicao_${tNum}/frame_${fNum}.webp`;
      list.push(url);

      // Transição 01 e os primeiros frames de cada transição têm prioridade inicial
      if (tIdx === 0 && f <= 30) {
        criticalUrls.push(url);
      } else {
        backgroundUrls.push(url);
      }
    }
    transitionFrameLists.push(list);
  });

  const STAGES_CONFIG = [
    {
      id: 0,
      name: "FACHADA & LOTE DE 1.679M²",
      start: 0.00,
      end: 0.08,
      stillSrc: RESTING_FRAMES[0]
    },
    {
      id: 1,
      name: "SALA DE ESTAR (OPEN SPACE)",
      start: 0.08,
      end: 0.16,
      stillSrc: RESTING_FRAMES[1]
    },
    {
      id: 2,
      name: "SALA DE JANTAR",
      start: 0.16,
      end: 0.24,
      stillSrc: RESTING_FRAMES[2]
    },
    {
      id: 3,
      name: "COZINHA GOURMET",
      start: 0.24,
      end: 0.32,
      stillSrc: RESTING_FRAMES[3]
    },
    {
      id: 4,
      name: "CIRCULAÇÃO INTERNA",
      start: 0.32,
      end: 0.40,
      stillSrc: RESTING_FRAMES[4]
    },
    {
      id: 5,
      name: "PRIMEIRO QUARTO",
      start: 0.40,
      end: 0.48,
      stillSrc: RESTING_FRAMES[5]
    },
    {
      id: 6,
      name: "CASA DE BANHO DE SERVIÇO",
      start: 0.48,
      end: 0.56,
      stillSrc: RESTING_FRAMES[6]
    },
    {
      id: 7,
      name: "SEGUNDO QUARTO VERSÁTIL",
      start: 0.56,
      end: 0.64,
      stillSrc: RESTING_FRAMES[7]
    },
    {
      id: 8,
      name: "CASA DE BANHO DA SUÍTE",
      start: 0.64,
      end: 0.72,
      stillSrc: RESTING_FRAMES[8]
    },
    {
      id: 9,
      name: "CLOSET DA SUÍTE",
      start: 0.72,
      end: 0.80,
      stillSrc: RESTING_FRAMES[9]
    },
    {
      id: 10,
      name: "QUARTO DA SUÍTE (MASTER BEDROOM)",
      start: 0.80,
      end: 0.90,
      stillSrc: RESTING_FRAMES[10]
    },
    {
      id: 11,
      name: "PISCINA AQUECIDA & JARDIM",
      start: 0.90,
      end: 0.955,
      stillSrc: RESTING_FRAMES[11]
    },
    {
      id: 12,
      name: "SALA EXTERIOR & ANEXOS",
      start: 0.955,
      end: 1.00,
      stillSrc: RESTING_FRAMES[12]
    }
  ];

  /* ========================================================
     2. ELEMENTOS DO CANVAS & OVERLAYS
     ======================================================== */
  const canvas = document.getElementById('tour-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const fallbackImgEl = document.getElementById('tour-fallback-img');

  const overlayCards = document.querySelectorAll('.tour-card');
  const hudStageName = document.getElementById('hud-stage-name');
  const hudCurrentIndex = document.getElementById('hud-current-index');
  const tourProgressBar = document.getElementById('tour-progress-bar');
  const dotsNav = document.querySelectorAll('.tour-dot');

  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let currentScrollProgress = 0;
  let activeOverlayIndex = 0;

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderCanvasScene(currentScrollProgress);
  }

  window.addEventListener('resize', resizeCanvas);

  /**
   * Desenha imagem centrada e dimensionada (cover) sem distorção
   */
  function drawCoverImage(image, alpha = 1.0, scale = 1.0, panX = 0, panY = 0) {
    if (!ctx || !image || !image.complete || image.naturalWidth === 0) return;

    const imgRatio = image.naturalWidth / image.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawW, drawH, drawX, drawY;

    if (canvasRatio > imgRatio) {
      drawW = canvasWidth * scale;
      drawH = (canvasWidth / imgRatio) * scale;
    } else {
      drawH = canvasHeight * scale;
      drawW = (canvasHeight * imgRatio) * scale;
    }

    drawX = (canvasWidth - drawW) / 2 + panX;
    drawY = (canvasHeight - drawH) / 2 + panY;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.drawImage(image, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  // Proporções de visualização cinematográfica calibradas para a sensação autêntica de caminhar a pé:
  // REST_RATIO (0.03): Apenas 3% para estabilização ao pousar diretamente numa divisão.
  // 97% do percurso restante é dedicado ao movimento suave, contínuo e responsivo da câmara a caminhar.
  // SWITCH_RATIO (0.65): O cartão informativo e HUD mudam suavemente quando a câmara já entrou na próxima divisão.
  const REST_RATIO = 0.03;
  const SWITCH_RATIO = 0.65;

  /**
   * Renderiza a cena atual do Canvas com:
   * 1. Zona de Repouso / Leitura: Mostra a fotografia oficial cristalina em altíssima definição (zero blur)
   * 2. Zona de Transição: Toca o vídeo suavemente de divisão para divisão
   */
  function renderCanvasScene(progress) {
    if (!ctx) return;
    currentScrollProgress = Math.max(0, Math.min(1, progress));

    // Determina o intervalo da divisão base
    let baseStageIndex = 0;
    for (let i = 0; i < STAGES_CONFIG.length; i++) {
      const isLast = (i === STAGES_CONFIG.length - 1);
      if (currentScrollProgress >= STAGES_CONFIG[i].start && (isLast ? currentScrollProgress <= STAGES_CONFIG[i].end : currentScrollProgress < STAGES_CONFIG[i].end)) {
        baseStageIndex = i;
        break;
      }
    }
    if (currentScrollProgress >= STAGES_CONFIG[STAGES_CONFIG.length - 1].end) {
      baseStageIndex = STAGES_CONFIG.length - 1;
    }

    const currentStage = STAGES_CONFIG[baseStageIndex];
    const stageSpan = Math.max(0.0001, currentStage.end - currentStage.start);
    const localProgress = Math.max(0, Math.min(1, (currentScrollProgress - currentStage.start) / stageSpan));

    let imgToDraw = null;

    // Se estiver na última divisão (Ponto 13 - Sala Exterior & Anexos)
    if (baseStageIndex >= transitionFrameLists.length) {
      imgToDraw = loadedImagesMap.get(currentStage.stillSrc);
    } else {
      // Para o Ponto 11 (Master Suite), damos uma margem ligeiramente maior (5%)
      const currentRestRatio = (baseStageIndex === 10) ? 0.05 : REST_RATIO;

      // Divisões 0 a 11:
      if (localProgress <= currentRestRatio) {
        // --- ZONA DE ESTABILIDADE & FOTOGRAFIA OFICIAL ---
        // Ponto 6: Story/14.jpeg 100% focada e nítida
        // Ponto 7: Story/15.jpeg (Casa de Banho de Serviço)
        // Ponto 9: Story/17.jpeg (Casa de Banho da Suite)
        // Ponto 11: Story/1.jpeg (Master Bedroom em toda a sua amplitude e luz)
        imgToDraw = loadedImagesMap.get(currentStage.stillSrc);
      } else {
        // --- ZONA DE TRANSIÇÃO CINEMATOGRÁFICA ---
        // Transição de vídeo fluida que conduz fisicamente a câmara até à divisão seguinte
        const transProgress = (localProgress - currentRestRatio) / (1.0 - currentRestRatio);
        const frames = transitionFrameLists[baseStageIndex];
        const frameIdx = Math.min(frames.length - 1, Math.floor(transProgress * frames.length));
        const targetUrl = frames[frameIdx];

        imgToDraw = loadedImagesMap.get(targetUrl);

        // Se o frame exato ainda não estiver em memória, procura o frame mais próximo em cache
        if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
          for (let off = 1; off < 20; off++) {
            const testIdx = Math.max(0, frameIdx - off);
            const cand = loadedImagesMap.get(frames[testIdx]);
            if (cand && cand.complete && cand.naturalWidth > 0) {
              imgToDraw = cand;
              break;
            }
          }
        }
      }
    }

    // Fallback de segurança
    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      imgToDraw = loadedImagesMap.get(currentStage.stillSrc);
    }

    // Limpa e desenha a imagem centrada sem distorção (Cover)
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (imgToDraw && imgToDraw.naturalWidth > 0) {
      drawCoverImage(imgToDraw, 1.0, 1.0, 0, 0);
    }

    // Oculta a imagem de segurança quando o canvas está ativo
    if (fallbackImgEl && fallbackImgEl.style.display !== 'none') {
      fallbackImgEl.style.opacity = '0';
      fallbackImgEl.style.display = 'none';
    }
  }

  /**
   * Atualiza o cartão flutuante ativo e indicadores da interface com modo dinâmico de caminhada
   */
  function updateActiveOverlay(stageIndex, inTransit = false, nextStageName = '', targetDotIdx = -1) {
    activeOverlayIndex = stageIndex;

    // Atualiza cards flutuantes: em trânsito/caminhada, desvanece suavemente para deixar a vista da casa desimpedida
    overlayCards.forEach((card, idx) => {
      if (idx === stageIndex) {
        card.classList.add('active');
        if (inTransit) {
          card.classList.add('walking-fade');
        } else {
          card.classList.remove('walking-fade');
        }
      } else {
        card.classList.remove('active');
        card.classList.remove('walking-fade');
      }
    });

    // Atualiza HUD superior
    const currentConfig = STAGES_CONFIG[stageIndex];
    if (currentConfig) {
      if (hudStageName) hudStageName.textContent = currentConfig.name;
      if (hudCurrentIndex) hudCurrentIndex.textContent = String(stageIndex + 1).padStart(2, '0');
    }

    // Atualiza dots laterais com efeito visual de destino
    dotsNav.forEach((dot, idx) => {
      if (idx === stageIndex) {
        dot.classList.add('active');
        dot.classList.remove('walking-target');
      } else if (idx === targetDotIdx) {
        dot.classList.remove('active');
        dot.classList.add('walking-target');
      } else {
        dot.classList.remove('active');
        dot.classList.remove('walking-target');
      }
    });

    // Atualiza hint dinâmico de caminhada
    const hintTextEl = document.getElementById('tour-hint-text');
    if (hintTextEl) {
      if (inTransit && nextStageName) {
        let cleanName = nextStageName;
        if (cleanName.includes('(')) cleanName = cleanName.split('(')[0].trim();
        hintTextEl.innerHTML = `<i class="fa-solid fa-person-walking" style="color:var(--gold-primary);margin-right:6px;"></i> A caminhar para <strong>${cleanName}</strong>...`;
      } else {
        hintTextEl.innerHTML = `<i class="fa-solid fa-shoe-prints" style="color:var(--gold-primary);margin-right:6px;transform:rotate(-45deg);"></i> Deslize para caminhar pela moradia`;
      }
    }
  }

  /* ========================================================
     3. PRÉ-CARREGAMENTO INTELIGENTE EM DUAS ETAPAS (CRÍTICA + BACKGROUND)
     ======================================================== */
  const preloaderEl = document.getElementById('preloader');
  const progressBarEl = document.getElementById('preloader-progress-bar');
  const percentTextEl = document.getElementById('preloader-percent');
  const statusTextEl = document.getElementById('preloader-status');

  const loadedImagesMap = new Map();
  let criticalLoadedCount = 0;
  const totalCritical = criticalUrls.length;

  function updatePreloaderUI(percent) {
    const rounded = Math.min(100, Math.round(percent));
    if (progressBarEl) progressBarEl.style.width = `${rounded}%`;
    if (percentTextEl) percentTextEl.textContent = `${rounded}%`;

    if (statusTextEl) {
      if (rounded < 35) {
        statusTextEl.textContent = "A carregar fotografias de alta definição...";
      } else if (rounded < 75) {
        statusTextEl.textContent = "A calibrar sequência de transição...";
      } else if (rounded < 98) {
        statusTextEl.textContent = "A sincronizar percurso e usabilidade...";
      } else {
        statusTextEl.textContent = "Pronto para a visita.";
      }
    }
  }

  let experienceStarted = false;
  function startExperience() {
    if (experienceStarted) return;
    experienceStarted = true;

    if (preloaderEl) preloaderEl.classList.add('fade-out');
    document.body.classList.remove('loading');

    // Inicializa dimensões e primeira renderização
    resizeCanvas();
    renderCanvasScene(0);
    updateActiveOverlay(0);

    // Notifica o GSAP ScrollTrigger para recalcular as alturas
    if (typeof ScrollTrigger !== 'undefined') {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }

    // Animação suave de entrada dos elementos
    if (typeof gsap !== 'undefined') {
      gsap.from('.site-nav', { y: -30, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.tour-hud-top', { x: -20, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.from('.tour-dots-nav', { x: 20, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
      gsap.from('.tour-overlays-container', { y: 25, opacity: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' });
      gsap.from('.tour-scroll-hint', { y: 15, opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' });
    }

    // Despoleta o carregamento em streaming contínuo dos restantes frames
    loadBackgroundFrames();
  }

  function loadImage(url, onDone) {
    if (loadedImagesMap.has(url)) {
      if (onDone) onDone();
      return;
    }
    const img = new Image();
    const handleDone = () => {
      loadedImagesMap.set(url, img);
      if (onDone) onDone();
    };
    img.onload = handleDone;
    img.onerror = () => {
      loadedImagesMap.set(url, img);
      if (onDone) onDone();
    };
    img.src = url;
    if (img.complete && img.naturalWidth > 0) {
      handleDone();
    }
  }

  // 1. Carregamento prioritário de todas as 13 fotos oficiais e transição inicial
  criticalUrls.forEach(url => {
    loadImage(url, () => {
      criticalLoadedCount++;
      const percent = (criticalLoadedCount / totalCritical) * 100;
      updatePreloaderUI(percent);

      if (criticalLoadedCount === 1 || url === criticalUrls[0]) {
        renderCanvasScene(0);
      }

      if (criticalLoadedCount >= totalCritical) {
        startExperience();
      }
    });
  });

  // 2. Streaming contínuo e ordenado dos restantes frames em background
  function loadBackgroundFrames() {
    let bgIndex = 0;
    const batchSize = 6;

    function loadNextBatch() {
      if (bgIndex >= backgroundUrls.length) return;
      const end = Math.min(backgroundUrls.length, bgIndex + batchSize);
      for (let i = bgIndex; i < end; i++) {
        loadImage(backgroundUrls[i], null);
      }
      bgIndex = end;
      if (bgIndex < backgroundUrls.length) {
        setTimeout(loadNextBatch, 20);
      }
    }
    loadNextBatch();
  }

  // Fallback de segurança do Preloader (máximo 2.0s)
  setTimeout(() => {
    updatePreloaderUI(100);
    startExperience();
  }, 2000);

  // Render inicial imediato
  resizeCanvas();
  renderCanvasScene(0);

  /* ========================================================
     4. PINNING E SCROLLYTELLING COM GSAP SCROLLTRIGGER (FLUIDO, SEM ENTRAVES)
     ======================================================== */
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: "#hero-scroll",
      start: "top top",
      end: "bottom bottom",
      pin: "#hero-sticky",
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 1.4, // Scrub cinematográfico com amortecimento e inércia de caminhada humana
      // SEM snap forçado: a rolagem é 100% livre, fluida e natural para o utilizador
      onUpdate: (self) => {
        const progress = self.progress;

        // Barra de progresso superior do tour
        if (tourProgressBar) {
          tourProgressBar.style.width = `${progress * 100}%`;
        }

        // Renderização dinâmica no Canvas (garantindo que em progress >= 1.0 mantém o último frame limpo)
        renderCanvasScene(progress);

        // Identifica qual das 13 divisões está ativa sincronizada com a câmara
        let matchedIndex = 0;
        let baseIdx = 0;
        for (let i = 0; i < STAGES_CONFIG.length; i++) {
          const isLast = (i === STAGES_CONFIG.length - 1);
          if (progress >= STAGES_CONFIG[i].start && (isLast ? progress <= STAGES_CONFIG[i].end : progress < STAGES_CONFIG[i].end)) {
            baseIdx = i;
            break;
          }
        }
        if (progress >= STAGES_CONFIG[STAGES_CONFIG.length - 1].end) {
          baseIdx = STAGES_CONFIG.length - 1;
        }

        const bStage = STAGES_CONFIG[baseIdx];
        const bSpan = Math.max(0.0001, bStage.end - bStage.start);
        const bLocalProgress = (progress - bStage.start) / bSpan;

        // Sensação física de caminhar:
        // Enquanto nos deslocamos fisicamente pelo espaço (0.16 a 0.68), o cartão desvanece suavemente
        const inTransit = (baseIdx < STAGES_CONFIG.length - 1 && bLocalProgress > 0.16 && bLocalProgress < 0.68);

        let targetDotIdx = -1;
        let nextStageName = '';
        if (baseIdx < STAGES_CONFIG.length - 1) {
          nextStageName = STAGES_CONFIG[baseIdx + 1].name;
          if (inTransit) {
            targetDotIdx = baseIdx + 1;
          }
        }

        // Se a transição já conduziu a câmara para a próxima divisão (>= SWITCH_RATIO), ativa o cartão correspondente
        const currentSwitchRatio = (baseIdx === 10) ? 0.70 : SWITCH_RATIO;
        if (baseIdx < STAGES_CONFIG.length - 1 && bLocalProgress >= currentSwitchRatio) {
          matchedIndex = baseIdx + 1;
        } else {
          matchedIndex = baseIdx;
        }

        updateActiveOverlay(matchedIndex, inTransit, nextStageName, targetDotIdx);
      }
    });

    // Recalcula alturas e limites quando toda a página e imagens completam carregamento
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  /**
   * Navega suavemente para uma divisão específica do tour
   */
  function scrollToStage(stageIndex, smooth = true) {
    const targetStage = STAGES_CONFIG[stageIndex];
    if (!targetStage) return;

    const heroContainer = document.getElementById('hero-scroll');
    if (!heroContainer) return;

    const heroTop = heroContainer.offsetTop;
    const heroHeight = heroContainer.offsetHeight - window.innerHeight;

    // Pousa no início suave da divisão (3% do span) para exibir a divisão e permitir continuar o scroll
    const stageSpan = targetStage.end - targetStage.start;
    const targetProgress = targetStage.start + (stageSpan * 0.03);
    const targetScroll = heroTop + (heroHeight * targetProgress);

    if (smooth && typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
      gsap.to(window, {
        scrollTo: targetScroll,
        duration: 0.85,
        ease: "power2.out",
        overwrite: "auto"
      });
    } else {
      window.scrollTo({ top: targetScroll, behavior: smooth ? 'smooth' : 'auto' });
    }
  }

  // Navegação direta clicável pelos 13 dots laterais
  dotsNav.forEach((dot) => {
    dot.addEventListener('click', () => {
      const stepIndex = parseInt(dot.getAttribute('data-step'), 10);
      stopAutoTour();
      scrollToStage(stepIndex);
    });
  });

  /* ========================================================
     4.1. CONTROLOS RÁPIDOS DO TOUR (SETAS, VISITA AUTOMÁTICA & TECLADO)
     ======================================================== */
  const tourPrevBtn = document.getElementById('tour-prev-btn');
  const tourNextBtn = document.getElementById('tour-next-btn');
  const autoTourBtn = document.getElementById('auto-tour-btn');

  // Setas Anterior / Próxima
  if (tourPrevBtn) {
    tourPrevBtn.addEventListener('click', () => {
      stopAutoTour();
      const prevIdx = Math.max(0, activeOverlayIndex - 1);
      scrollToStage(prevIdx);
    });
  }

  if (tourNextBtn) {
    tourNextBtn.addEventListener('click', () => {
      stopAutoTour();
      const nextIdx = Math.min(STAGES_CONFIG.length - 1, activeOverlayIndex + 1);
      scrollToStage(nextIdx);
    });
  }

  // Visita Automática Guiada (Cine-Tour)
  let isAutoTouring = false;
  let autoTourTween = null;

  function startAutoTour() {
    const heroContainer = document.getElementById('hero-scroll');
    if (!heroContainer) return;

    isAutoTouring = true;
    if (autoTourBtn) {
      autoTourBtn.classList.add('playing');
      autoTourBtn.innerHTML = '<i class="fa-solid fa-pause"></i> <span>Pausar Visita</span>';
    }

    const heroTop = heroContainer.offsetTop;
    const heroHeight = heroContainer.offsetHeight - window.innerHeight;

    // Se já estiver no fim, reinicia no início
    if (currentScrollProgress >= 0.95) {
      window.scrollTo({ top: heroTop, behavior: 'instant' });
    }

    const remainingProgress = 1 - currentScrollProgress;
    const targetScroll = heroTop + heroHeight;
    const duration = Math.max(6, remainingProgress * 38);

    if (typeof gsap !== 'undefined') {
      if (autoTourTween) autoTourTween.kill();
      autoTourTween = gsap.to(window, {
        scrollTo: targetScroll,
        duration: duration,
        ease: "none",
        onComplete: () => {
          stopAutoTour();
        }
      });
    }
  }

  function stopAutoTour() {
    if (!isAutoTouring) return;
    isAutoTouring = false;
    if (autoTourTween) {
      autoTourTween.kill();
      autoTourTween = null;
    }
    if (autoTourBtn) {
      autoTourBtn.classList.remove('playing');
      autoTourBtn.innerHTML = '<i class="fa-solid fa-play"></i> <span>Visita Automática</span>';
    }
  }

  function toggleAutoTour() {
    if (isAutoTouring) {
      stopAutoTour();
    } else {
      startAutoTour();
    }
  }

  if (autoTourBtn) {
    autoTourBtn.addEventListener('click', toggleAutoTour);
  }

  // Interrompe visita automática se o utilizador interagir manualmente com scroll
  window.addEventListener('wheel', () => {
    if (isAutoTouring) stopAutoTour();
  }, { passive: true });

  window.addEventListener('touchmove', () => {
    if (isAutoTouring) stopAutoTour();
  }, { passive: true });

  // Navegação por teclado (Setas Esquerda / Direita e Espaço)
  window.addEventListener('keydown', (e) => {
    const lightboxEl = document.getElementById('lightbox');
    if (lightboxEl && lightboxEl.classList.contains('active')) return;

    const heroContainer = document.getElementById('hero-scroll');
    if (!heroContainer) return;
    const heroRect = heroContainer.getBoundingClientRect();
    const inHero = heroRect.top <= 100 && heroRect.bottom >= 100;

    if (!inHero) return;

    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      stopAutoTour();
      const nextIdx = Math.min(STAGES_CONFIG.length - 1, activeOverlayIndex + 1);
      scrollToStage(nextIdx);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      stopAutoTour();
      const prevIdx = Math.max(0, activeOverlayIndex - 1);
      scrollToStage(prevIdx);
    } else if (e.key === ' ' || e.code === 'Space') {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT')) return;
      e.preventDefault();
      toggleAutoTour();
    }
  });

  /* ========================================================
     5. NAVEGAÇÃO SUPERIOR FIXA & MENU MOBILE
     ======================================================== */
  const siteNav = document.getElementById('site-nav');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      siteNav.classList.add('scrolled');
    } else {
      siteNav.classList.remove('scrolled');
    }
  });

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isVisible = mobileNav.style.display === 'flex';
      mobileNav.style.display = isVisible ? 'none' : 'flex';
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.style.display = 'none';
      });
    });
  }

  // Smooth scroll para âncoras da página
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
          gsap.to(window, {
            scrollTo: targetEl,
            duration: 1.2,
            ease: "power2.inOut"
          });
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  /* ========================================================
     6. GALERIA OFICIAL & LIGHTBOX INTERATIVO
     ======================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          item.style.display = 'block';
          if (typeof gsap !== 'undefined') {
            gsap.fromTo(item, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 });
          } else {
            item.style.opacity = '1';
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const galleryData = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-item-title')?.textContent || 'CASA CANIDELO';
    const sub = item.querySelector('.gallery-item-sub')?.textContent || 'Fotografia Oficial';
    galleryData.push({
      src: img.getAttribute('src'),
      title: title,
      desc: sub
    });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = galleryData[currentGalleryIndex];
    if (!item) return;

    lightboxImg.src = item.src;
    lightboxTitle.textContent = item.title;
    lightboxDesc.textContent = item.desc;
    lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryData.length}`;
  }

  function prevLightbox() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  function nextLightbox() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);

  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevLightbox();
    if (e.key === 'ArrowRight') nextLightbox();
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ========================================================
     7. MAPA INTERATIVO (LEAFLET DARK COM MARCADORES DOURADOS)
     ======================================================== */
  const mapContainer = document.getElementById('property-map');
  if (mapContainer && typeof L !== 'undefined') {
    const propertyCoords = [41.1342, -8.6508];

    const map = L.map('property-map', {
      center: propertyCoords,
      zoom: 14,
      scrollWheelZoom: false,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    const goldHouseIcon = L.divIcon({
      className: 'custom-gold-marker',
      html: `
        <div style="
          width: 44px; height: 44px; 
          background: linear-gradient(135deg, #c8a97e, #9f835b); 
          border: 3px solid #fff; 
          border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; 
          box-shadow: 0 0 20px rgba(200, 169, 126, 0.8);
          color: #0b0d10; font-size: 18px; font-weight: bold;
        ">
          <i class="fa-solid fa-house"></i>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -24]
    });

    const poiIcon = L.divIcon({
      className: 'custom-poi-marker',
      html: `
        <div style="
          width: 32px; height: 32px; 
          background: #151921; 
          border: 2px solid #c8a97e; 
          border-radius: 50%; 
          display: flex; align-items: center; justify-content: center; 
          color: #c8a97e; font-size: 13px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        ">
          <i class="fa-solid fa-location-dot"></i>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });

    const propertyMarker = L.marker(propertyCoords, { icon: goldHouseIcon }).addTo(map);
    propertyMarker.bindPopup(`
      <div style="font-family: sans-serif; color: #fff; padding: 4px;">
        <strong style="color: #c8a97e; font-size: 14px; display: block; margin-bottom: 4px;">CASA CANIDELO &bull; 1.250.000 €</strong>
        <span style="font-size: 12px; color: #cbd5e1;">Beco Paniceiro, Canidelo, Gaia</span><br>
        <span style="font-size: 11px; color: #94a3b8;">Lote de 1.679 m² &bull; Piscina Aquecida</span>
      </div>
    `).openPopup();

    const pois = [
      { coords: [41.1325, -8.6695], title: "Praia de Lavadores (4 min)", desc: "Praia de bandeira azul e passadiços" },
      { coords: [41.1215, -8.6640], title: "Praia de Canidelo / Salgueiros (5 min)", desc: "Esplanadas e pôr do sol atlântico" },
      { coords: [41.1408, -8.6602], title: "Reserva Natural do Estuário do Douro (6 min)", desc: "Tranquilidade e observação de aves" },
      { coords: [41.1441, -8.6465], title: "Marina do Douro & Afurada (7 min)", desc: "Cultura marítima e restaurantes" },
      { coords: [41.1470, -8.6360], title: "Ponte da Arrábida & Porto (10 min)", desc: "Acesso rápido à cidade invicta" }
    ];

    pois.forEach(p => {
      L.marker(p.coords, { icon: poiIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family: sans-serif; color: #fff; padding: 4px;">
            <strong style="color: #dfc299; font-size: 13px;">${p.title}</strong><br>
            <span style="font-size: 11px; color: #94a3b8;">${p.desc}</span>
          </div>
        `);
    });
  }

  // 9. DOWNLOAD DO DOSSIER TÉCNICO (LINK DIRETO PARA O DOCUMENTO PDF NA PASTA DOC)

  /* ========================================================
     10. AMBIENTE SONORO DE LUXO (WEB AUDIO API)
     ======================================================== */
  const audioToggleBtn = document.getElementById('audio-toggle');
  let audioCtx = null;
  let isPlayingAudio = false;
  let masterGain = null;

  function initLuxuryAudio() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.04;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, audioCtx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      [216, 324, 432].forEach((freq) => {
        const osc = audioCtx.createOscillator();
        const oscGain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        oscGain.gain.setValueAtTime(0.012, audioCtx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
      });

      return true;
    } catch (e) {
      console.warn("Web Audio não inicializado.", e);
      return false;
    }
  }

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      if (!audioCtx) initLuxuryAudio();
      if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

      isPlayingAudio = !isPlayingAudio;

      if (isPlayingAudio) {
        if (masterGain) masterGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 1.2);
        audioToggleBtn.classList.add('active');
        audioToggleBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      } else {
        if (masterGain) masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
        audioToggleBtn.classList.remove('active');
        audioToggleBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
      }
    });
  }

  console.log("CASA CANIDELO — Experiência interativa inicializada com sucesso.");
});
