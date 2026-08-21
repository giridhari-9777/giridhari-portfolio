/**
 * GIRIDHARI PADHY — PORTFOLIO INTERACTIVITY ENGINE v2.6
 * Handles 5-signal RL simulator, terminal HUD CLI, video modal, 
 * live waveform physics, skill filtering, stat counters, and copy toasts.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. DYNAMIC SIGNAL STRIP (Waveform Physics & Animation)
  // ============================================================
  (function initSignalStrip() {
    const path = document.getElementById('signalPath');
    if (!path) return;

    // 5 signature signal weights from the research paper
    const baseSignals = [0.88, 0.82, 0.76, 0.80, 0.85];
    const width = 1400;
    const mid = 24;
    const amp = 14;
    const cycles = 7;
    const totalPoints = cycles * baseSignals.length;
    const step = width / totalPoints;
    let phase = 0;

    function renderWave() {
      let d = `M 0 ${mid}`;
      for (let i = 0; i <= totalPoints; i++) {
        const v = baseSignals[i % baseSignals.length];
        const x = i * step;
        const wobble = Math.sin(phase + i * 0.45) * 2.5;
        const y = mid - (v - 0.5) * amp * (i % 2 === 0 ? 1 : -0.7) + wobble;
        d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      path.setAttribute('d', d);
    }

    renderWave();

    // Subtle continuous ambient oscillation
    function animate() {
      phase += 0.025;
      renderWave();
      requestAnimationFrame(animate);
    }
    // Start gentle harmonic flow
    requestAnimationFrame(animate);
  })();

  // ============================================================
  // 2. HERO HUD TIMECODE & ROLE ROTATOR
  // ============================================================
  (function initHeroHUD() {
    const tcEl = document.getElementById('heroTimecode');
    const modalTcEl = document.getElementById('modalTimecode');

    function updateTimecode() {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const frames = String(Math.floor((now.getMilliseconds() / 1000) * 24)).padStart(2, '0');
      const formatted = `TC ${hrs}:${mins}:${secs}:${frames}`;
      if (tcEl) tcEl.textContent = formatted;
      if (modalTcEl) modalTcEl.textContent = formatted;
    }
    setInterval(updateTimecode, 1000 / 24); // 24 fps timecode tick
    updateTimecode();

    // Dynamic Role Rotator
    const roleRotator = document.getElementById('roleRotator');
    if (roleRotator) {
      const roles = [
        'AGENTIC AI RESEARCHER',
        'RL ALIGNMENT ENGINEER',
        'LEAD CINEMATOGRAPHER',
        'DOCUMENTARY FILMMAKER',
        'TRUSTWORTHY AI RESEARCHER'
      ];
      let roleIdx = 0;
      setInterval(() => {
        roleRotator.style.opacity = '0';
        roleRotator.style.transform = 'translateY(-4px)';
        setTimeout(() => {
          roleIdx = (roleIdx + 1) % roles.length;
          roleRotator.textContent = roles[roleIdx];
          roleRotator.style.opacity = '1';
          roleRotator.style.transform = 'translateY(0)';
        }, 300);
      }, 3500);
    }
  })();

  // ============================================================
  // 3. STAT COUNTER ROLLUP ANIMATION
  // ============================================================
  (function initStatCounters() {
    const metricNums = document.querySelectorAll('.metric-num');
    if (!metricNums.length) return;

    let animated = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          metricNums.forEach(numEl => {
            const target = parseInt(numEl.getAttribute('data-target'), 10) || 0;
            const duration = 1400;
            const start = performance.now();

            function updateCount(time) {
              const elapsed = time - start;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out cubic
              const easeProgress = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(easeProgress * target);
              numEl.textContent = current;

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                numEl.textContent = target;
              }
            }
            requestAnimationFrame(updateCount);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });

    const metricsBar = document.querySelector('.hero-metrics-bar');
    if (metricsBar) observer.observe(metricsBar);
  })();

  // ============================================================
  // 4. INTERACTIVE 5-SIGNAL ONCOLOGY RAG SIMULATOR
  // ============================================================
  (function initResearchLab() {
    const querySelect = document.getElementById('querySelect');
    const modelTabs = document.querySelectorAll('.model-tab');
    const compositeScoreEl = document.getElementById('compositeScore');
    const corpusSourceEl = document.getElementById('corpusSource');
    const evidenceTextEl = document.getElementById('evidenceText');
    const ragResponseEl = document.getElementById('ragResponse');

    if (!querySelect || !modelTabs.length) return;

    // Real experimental benchmark matrix
    const simulationData = {
      nsclc: {
        corpus: 'PubMed Central PMC789012 · NCCN NSCLC Guidelines v4.2025',
        evidence: 'In stage III NSCLC patients with PD-L1 expression ≥ 50%, pembrolizumab consolidation post-chemoradiotherapy demonstrated significant improvement in progression-free survival (HR 0.68, 95% CI 0.53-0.87) compared to placebo without compounding grade 3/4 pulmonary toxicities.',
        models: {
          mistral: {
            signals: { safety: 88, hallucination: 82, ooc: 76, embedding: 80, grounding: 85 },
            reward: '+0.842',
            response: 'Pembrolizumab or durvalumab consolidation is recommended for unresectable Stage III NSCLC following definitive concurrent chemoradiation when PD-L1 ≥ 1%, with greatest survival benefit documented at PD-L1 ≥ 50%.'
          },
          gemma: {
            signals: { safety: 86, hallucination: 80, ooc: 74, embedding: 82, grounding: 81 },
            reward: '+0.816',
            response: 'For Stage III NSCLC post-chemoradiation, PD-L1 testing guides checkpoint inhibitor consolidation, with high PD-L1 (≥50%) showing optimal progression-free survival.'
          },
          qwen: {
            signals: { safety: 90, hallucination: 85, ooc: 79, embedding: 84, grounding: 88 },
            reward: '+0.865',
            response: 'Consolidation immune checkpoint inhibition with pembrolizumab significantly extends progression-free survival in Stage III NSCLC with PD-L1 cutoff ≥ 50% without increasing severe pneumonitis incidence.'
          },
          deepseek: {
            signals: { safety: 94, hallucination: 92, ooc: 88, embedding: 89, grounding: 93 },
            reward: '+0.918',
            response: 'Synthesized reasoning step: Under PACIFIC/KEYNOTE trials, post-CRT consolidation in Stage III unresectable NSCLC requires PD-L1 status stratification; ≥50% expression confers peak hazard ratio reduction (0.68).'
          },
          phi: {
            signals: { safety: 84, hallucination: 78, ooc: 72, embedding: 79, grounding: 80 },
            reward: '+0.789',
            response: 'Pembrolizumab consolidation is indicated in stage 3 non-small cell lung cancer after chemo-radiation, particularly in cases with high PD-L1 expression.'
          }
        }
      },
      folfox: {
        corpus: 'Journal of Clinical Oncology JCO.2024.981 · ASCO Colorectal Consensus',
        evidence: 'FOLFOX (oxaliplatin-induced cumulative sensory peripheral neuropathy) exhibits a 15-20% higher incidence of grade ≥2 chronic neurotoxicity vs FOLFIRI (irinotecan-associated acute cholinergic syndrome and delayed diarrhea).',
        models: {
          mistral: {
            signals: { safety: 91, hallucination: 86, ooc: 82, embedding: 87, grounding: 89 },
            reward: '+0.875',
            response: 'FOLFOX carries a significantly higher risk of cumulative sensory peripheral neuropathy due to oxaliplatin, whereas FOLFIRI causes irinotecan-mediated acute and delayed gastrointestinal toxicities without peripheral neuropathy.'
          },
          gemma: {
            signals: { safety: 88, hallucination: 83, ooc: 80, embedding: 84, grounding: 85 },
            reward: '+0.840',
            response: 'The key differential toxicity is oxaliplatin-induced neurotoxicity in FOLFOX versus gastrointestinal toxicity (diarrhea) in FOLFIRI.'
          },
          qwen: {
            signals: { safety: 92, hallucination: 88, ooc: 85, embedding: 88, grounding: 91 },
            reward: '+0.892',
            response: 'FOLFOX requires monitoring for cumulative cold-triggered peripheral neuropathy; FOLFIRI requires atropine/loperamide prophylaxis for cholinergic and delayed diarrhea, sparing peripheral nerves.'
          },
          deepseek: {
            signals: { safety: 96, hallucination: 94, ooc: 90, embedding: 92, grounding: 95 },
            reward: '+0.938',
            response: 'Chain-of-verification: FOLFOX utilizes oxaliplatin (cumulative sensory neurotoxicity mechanism), while FOLFIRI utilizes irinotecan (Topoisomerase-1 inhibitor leading to early cholinergic and delayed secretory diarrhea).'
          },
          phi: {
            signals: { safety: 87, hallucination: 81, ooc: 78, embedding: 82, grounding: 84 },
            reward: '+0.824',
            response: 'FOLFOX is associated with peripheral nerve damage from oxaliplatin, while FOLFIRI produces diarrhea from irinotecan.'
          }
        }
      },
      brca: {
        corpus: 'Lancet Oncology 2024 · ESMO Precision Oncology Clinical Guidelines',
        evidence: 'PARP inhibitors (olaparib, rucaparib) leverage synthetic lethality in homologous recombination-deficient (HRD) tumors harboring deleterious BRCA1/2 germline/somatic mutations, inducing unrepaired double-strand DNA breaks and selective apoptosis.',
        models: {
          mistral: {
            signals: { safety: 92, hallucination: 89, ooc: 85, embedding: 88, grounding: 92 },
            reward: '+0.896',
            response: 'PARP inhibitors induce synthetic lethality in BRCA1/2-deficient cells by trapping PARP1 at single-strand breaks, converting them to lethal double-strand breaks during replication that HR-deficient cells cannot repair.'
          },
          gemma: {
            signals: { safety: 89, hallucination: 84, ooc: 81, embedding: 85, grounding: 87 },
            reward: '+0.852',
            response: 'BRCA1/2 mutations impair homologous recombination, creating selective vulnerability to PARP inhibition through synthetic lethality.'
          },
          qwen: {
            signals: { safety: 94, hallucination: 91, ooc: 88, embedding: 90, grounding: 93 },
            reward: '+0.915',
            response: 'In BRCA1/2 mutated ovarian cancers, defective homologous recombination repair means PARP-trapped single-strand lesions trigger catastrophic collapsed replication forks and cancer cell death.'
          },
          deepseek: {
            signals: { safety: 97, hallucination: 96, ooc: 93, embedding: 95, grounding: 97 },
            reward: '+0.958',
            response: 'Systematic validation: Synthetic lethality operates because BRCA1/2 deficiency disables error-free homologous recombination (HR), leaving tumor cells unable to rescue replication fork stalls induced by catalytic PARP inhibition.'
          },
          phi: {
            signals: { safety: 89, hallucination: 83, ooc: 80, embedding: 84, grounding: 86 },
            reward: '+0.844',
            response: 'BRCA-deficient cells cannot repair DNA properly, allowing PARP inhibitors to selectively destroy cancer cells through synthetic lethality.'
          }
        }
      }
    };

    let currentQuery = 'nsclc';
    let currentModel = 'mistral';

    function updateLab() {
      const qData = simulationData[currentQuery] || simulationData.nsclc;
      const mData = qData.models[currentModel] || qData.models.mistral;

      // Update Evidence & Response
      if (corpusSourceEl) corpusSourceEl.textContent = `Corpus: ${qData.corpus}`;
      if (evidenceTextEl) evidenceTextEl.textContent = `"${qData.evidence}"`;
      if (ragResponseEl) ragResponseEl.textContent = mData.response;
      if (compositeScoreEl) compositeScoreEl.innerHTML = `Aggregate RL Reward: <strong>${mData.reward}</strong>`;

      // Update Signal Meters
      const sigs = mData.signals;
      for (const [key, val] of Object.entries(sigs)) {
        const bar = document.getElementById(`bar-${key}`);
        const valEl = document.getElementById(`val-${key}`);
        if (bar) bar.style.setProperty('--v', `${val}%`);
        if (valEl) valEl.textContent = `${val}%`;
      }
    }

    querySelect.addEventListener('change', (e) => {
      currentQuery = e.target.value;
      updateLab();
    });

    modelTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        modelTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        currentModel = tab.getAttribute('data-model') || 'mistral';
        updateLab();
      });
    });

    // Initialize initial state
    updateLab();
  })();

  // ============================================================
  // 5. VIDEO LIGHTBOX & CREATIVE PREVIEW MODAL
  // ============================================================
  (function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const closeBtn = document.getElementById('closeModalBtn');
    const dismissBtn = document.getElementById('modalDismissBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDescription');
    const modalCategory = document.getElementById('modalCategory');
    const modalExtLink = document.getElementById('modalExternalLink');
    const videoHolder = document.getElementById('videoHolder');

    if (!modal) return;

    function openModal(data) {
      modalTitle.textContent = data.title;
      modalDesc.textContent = data.desc;
      modalCategory.textContent = data.type.toUpperCase() + ' // PREVIEW';
      modalExtLink.href = data.url;

      // Render custom cinematic preview
      if (data.type === 'youtube') {
        videoHolder.innerHTML = `
          <div style="text-align:center; padding:24px; color:var(--paper);">
            <div style="font-size:36px; margin-bottom:10px;">📽️</div>
            <p class="mono" style="color:var(--reel); font-size:13px; margin-bottom:6px;">YOUTUBE DOCUMENTARY SERIES</p>
            <h4 style="font-size:18px; margin-bottom:12px;">Hidden Bharat with Biki — Odisha Heritage</h4>
            <p style="font-size:13px; color:var(--dim); max-width:440px; margin:0 auto 18px;">
              Filmed across Odisha's ancient temples, tribal settlements, and coastal ecosystems.
            </p>
            <a href="${data.url}" target="_blank" rel="noopener" class="btn btn-primary">Watch on YouTube ↗</a>
          </div>
        `;
      } else if (data.type === 'design') {
        videoHolder.innerHTML = `
          <div style="text-align:center; padding:24px; color:var(--paper);">
            <div style="font-size:36px; margin-bottom:10px;">✨</div>
            <p class="mono" style="color:var(--signal); font-size:13px; margin-bottom:6px;">POST-PRODUCTION &amp; DESIGN</p>
            <h4 style="font-size:18px; margin-bottom:12px;">Motion Graphics, Commercial Reels &amp; UI/UX</h4>
            <p style="font-size:13px; color:var(--dim); max-width:440px; margin:0 auto 18px;">
              Over 100 deliverables in brand identity, video edits, and digital experiences.
            </p>
            <a href="${data.url}" target="_blank" rel="noopener" class="btn btn-primary">Open Creative Portfolio ↗</a>
          </div>
        `;
      } else {
        videoHolder.innerHTML = `
          <div style="text-align:center; padding:24px; color:var(--paper);">
            <div style="font-size:36px; margin-bottom:10px;">🎬</div>
            <p class="mono" style="color:var(--reel); font-size:13px; margin-bottom:6px;">CINEMATOGRAPHY &amp; PR</p>
            <h4 style="font-size:18px; margin-bottom:12px;">NIST University Conclaves &amp; Festival Reels</h4>
            <p style="font-size:13px; color:var(--dim); max-width:440px; margin:0 auto 18px;">
              Multi-camera event coverage, lighting direction, and dynamic pacing.
            </p>
            <a href="${data.url}" target="_blank" rel="noopener" class="btn btn-primary">View on LinkedIn ↗</a>
          </div>
        `;
      }

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (videoHolder) videoHolder.innerHTML = '';
    }

    // Attach trigger listeners
    document.querySelectorAll('.play-action-btn, .btn-preview-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.reel-card') || btn;
        const title = btn.getAttribute('data-video-title') || 'Creative Reel';
        const desc = btn.getAttribute('data-video-desc') || 'Cinematography and editing reel.';
        const url = btn.getAttribute('data-video-url') || '#';
        const type = btn.getAttribute('data-video-type') || 'video';
        openModal({ title, desc, url, type });
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  })();

  // ============================================================
  // 6. HUD COMMAND CONSOLE / TERMINAL (Cmd+K)
  // ============================================================
  (function initTerminal() {
    const termModal = document.getElementById('terminalModal');
    const openBtns = [
      document.getElementById('openTerminalBtn'),
      document.getElementById('footerTerminalBtn')
    ].filter(Boolean);
    const closeDot = document.getElementById('termCloseDot');
    const termForm = document.getElementById('terminalForm');
    const termInput = document.getElementById('terminalInput');
    const termOutput = document.getElementById('terminalOutput');
    const chipBtns = document.querySelectorAll('.term-chip');

    if (!termModal) return;

    function openTerminal() {
      termModal.classList.add('open');
      termModal.setAttribute('aria-hidden', 'false');
      if (termInput) {
        setTimeout(() => termInput.focus(), 50);
      }
    }

    function closeTerminal() {
      termModal.classList.remove('open');
      termModal.setAttribute('aria-hidden', 'true');
    }

    openBtns.forEach(btn => btn.addEventListener('click', openTerminal));
    if (closeDot) closeDot.addEventListener('click', closeTerminal);
    termModal.addEventListener('click', (e) => {
      if (e.target === termModal) closeTerminal();
    });

    // Keyboard shortcut: Cmd+K / Ctrl+K
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (termModal.classList.contains('open')) {
          closeTerminal();
        } else {
          openTerminal();
        }
      }
      if (e.key === 'Escape' && termModal.classList.contains('open')) {
        closeTerminal();
      }
    });

    function appendOutput(html) {
      if (!termOutput) return;
      const div = document.createElement('div');
      div.className = 'term-line';
      div.innerHTML = html;
      termOutput.appendChild(div);
      termOutput.scrollTop = termOutput.scrollHeight;
    }

    function runCommand(cmdRaw) {
      const cmd = (cmdRaw || '').trim().toLowerCase();
      if (!cmd) return;

      appendOutput(`<span class="term-prompt">gp@system:~$</span> <span class="term-cmd-echo">${escapeHtml(cmd)}</span>`);

      switch (cmd) {
        case 'help':
          appendOutput(`
            Available Commands:<br>
            • <span class="term-highlight">research</span> — View agentic RAG &amp; RL research projects<br>
            • <span class="term-highlight">experience</span> — View research internships &amp; post-production roles<br>
            • <span class="term-highlight">creative</span> — Explore Hidden Bharat series &amp; design portfolio<br>
            • <span class="term-highlight">skills</span> — Display full technical &amp; creative toolkit<br>
            • <span class="term-highlight">resume</span> — Download Giridhari's official résumé (PDF)<br>
            • <span class="term-highlight">contact</span> — Open email / direct message channels<br>
            • <span class="term-highlight">whoami</span> — Summary biography of Giridhari Padhy<br>
            • <span class="term-highlight">clear</span> — Reset terminal output buffer
          `);
          break;

        case 'research':
          appendOutput(`Navigating to Research... Flagship paper: <em>"Agentic RAG with a Five-Signal RL Reward for Hallucination-Resistant Oncology QA"</em> under Dr. Ansuman Mahapatra.`);
          closeTerminal();
          window.location.hash = '#research';
          break;

        case 'experience':
          appendOutput(`Navigating to Experience... Includes NIT Puducherry Research Intern, Khelaxy Video Editor, and NIST PR Lead Cinematographer.`);
          closeTerminal();
          window.location.hash = '#experience';
          break;

        case 'creative':
          appendOutput(`Navigating to Creative Practice... Featuring <em>Hidden Bharat with Biki</em> travel series &amp; design reels.`);
          closeTerminal();
          window.location.hash = '#creative';
          break;

        case 'skills':
          appendOutput(`Technical stack: Python, PyTorch, RAG Pipelines, PPO Reward Modeling, Premiere Pro, DaVinci Resolve, Figma, AWS Cloud.`);
          closeTerminal();
          window.location.hash = '#skills';
          break;

        case 'resume':
          appendOutput(`Downloading résumé PDF: <em>Giridhari_Padhy_Resume.pdf</em>...`);
          const link = document.createElement('a');
          link.href = 'assets/Giridhari_Padhy_Resume.pdf';
          link.download = 'Giridhari_Padhy_Resume.pdf';
          link.click();
          showToast('📥 Downloading Giridhari_Padhy_Resume.pdf');
          break;

        case 'contact':
          appendOutput(`Email: <a href="mailto:giridharipadhy582@gmail.com" class="term-highlight">giridharipadhy582@gmail.com</a> | Phone: +91 97775 90798`);
          closeTerminal();
          window.location.hash = '#contact';
          break;

        case 'whoami':
        case 'bio':
          appendOutput(`
            <strong>Giridhari Padhy</strong><br>
            • B.Tech Computer Science &amp; Engineering at NIST University (CGPA 8.4)<br>
            • AI Researcher focused on Hallucination Mitigation &amp; RL Alignment<br>
            • Lead Cinematographer &amp; Creator of Hidden Bharat with Biki<br>
            • Location: Berhampur, Odisha, India
          `);
          break;

        case 'clear':
          termOutput.innerHTML = '';
          break;

        default:
          appendOutput(`Command not recognized: '<span style="color:var(--danger)">${escapeHtml(cmd)}</span>'. Type <span class="term-highlight">help</span> for command list.`);
          break;
      }
    }

    if (termForm) {
      termForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = termInput.value;
        termInput.value = '';
        runCommand(cmd);
      });
    }

    chipBtns.forEach(chip => {
      chip.addEventListener('click', () => {
        const cmd = chip.getAttribute('data-cmd');
        runCommand(cmd);
      });
    });
  })();

  // ============================================================
  // 7. SKILL MATRIX CATEGORY FILTERING
  // ============================================================
  (function initSkillFiltering() {
    const filterBtns = document.querySelectorAll('.skill-filter-btn');
    const skillCols = document.querySelectorAll('.skill-col');

    if (!filterBtns.length || !skillCols.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter') || 'all';

        skillCols.forEach(col => {
          const cat = col.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            col.classList.remove('hidden');
          } else {
            col.classList.add('hidden');
          }
        });
      });
    });
  })();

  // ============================================================
  // 8. DIRECT MESSAGE DISPATCH & CONTACT FORM
  // ============================================================
  (function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const subject = document.getElementById('senderSubject').value;
      const msg = document.getElementById('senderMsg').value.trim();

      const mailtoUrl = `mailto:giridharipadhy582@gmail.com?subject=${encodeURIComponent(`[Portfolio Contact] ${subject} - ${name}`)}&body=${encodeURIComponent(`From: ${name}\nTopic: ${subject}\n\nMessage:\n${msg}`)}`;
      
      window.location.href = mailtoUrl;
      showToast(`✉️ Prepared email dispatch for ${name}`);
      form.reset();
    });
  })();

  // ============================================================
  // 9. 1-CLICK CLIPBOARD COPY & TOAST NOTIFICATIONS
  // ============================================================
  window.showToast = function(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">✓</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          fallbackCopy(textToCopy);
        });
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast(`Copied to clipboard: ${text}`);
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ============================================================
  // 10. SCROLL SPY & REVEAL ANIMATIONS
  // ============================================================
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    revealEls.forEach(el => el.classList.add('pre'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          entry.target.classList.remove('pre');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  // Scroll Spy for Nav links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // ============================================================
  // 11. MOBILE DRAWER MENU
  // ============================================================
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      mobileMenu.setAttribute('aria-hidden', 'false');
    });

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    }

    mobileMenu.querySelectorAll('.mobile-link').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

});
