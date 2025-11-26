import React, { useEffect, useRef, useState } from 'react';
import { 
  Sparkles, Code, Rocket, Globe, Mail, Github, Linkedin, 
  ChevronDown, Menu, X, BookOpen, GraduationCap, 
  Cpu, Briefcase, Award, PenTool, Database 
} from 'lucide-react';

/* --- Constellation Canvas Component (Fundo Animado com Constelações Reais) --- */
const ConstellationCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let time = 0;

    // Definição das Constelações (Coordenadas relativas 0.0 a 1.0 da tela)
    const constellations = [
      {
        name: 'Orion', // O Caçador (Lado Esquerdo)
        offsetX: 0.1, offsetY: 0.2, scale: 120,
        stars: [
          { x: 0.0, y: 0.0, size: 2.5, color: '#ffcc99' }, // Betelgeuse
          { x: 1.0, y: 0.2, size: 2.0, color: '#99ccff' }, // Bellatrix
          { x: 0.4, y: 0.8, size: 2.0, color: '#99ccff' }, // Alnitak
          { x: 0.5, y: 0.75, size: 2.0, color: '#ffffff' }, // Alnilam
          { x: 0.6, y: 0.7, size: 2.0, color: '#ffffff' }, // Mintaka
          { x: 0.2, y: 1.8, size: 2.0, color: '#ffffff' }, // Saiph
          { x: 0.9, y: 1.7, size: 2.5, color: '#99ccff' }, // Rigel
        ],
        connections: [[0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]]
      },
      {
        name: 'Taurus', // O Touro (Canto Superior Direito)
        offsetX: 0.8, offsetY: 0.15, scale: 100,
        stars: [
          { x: 0.0, y: 0.0, size: 2.5, color: '#ffcc00' }, // Aldebaran
          { x: -0.5, y: -0.8, size: 1.8, color: '#ffffff' }, // Ponta Chifre 1
          { x: 0.8, y: -0.6, size: 1.8, color: '#ffffff' }, // Ponta Chifre 2
          { x: 0.2, y: 0.2, size: 1.5, color: '#ffffff' }, // Híades 1
          { x: 0.4, y: 0.1, size: 1.5, color: '#ffffff' }, // Híades 2
          { x: 0.6, y: -0.1, size: 1.5, color: '#ffffff' }, // Cabeça topo
        ],
        connections: [[0, 3], [3, 4], [4, 5], [5, 2], [5, 1], [0, 4]]
      },
      {
        name: 'Centaurus', // O Centauro (Canto Inferior Direito)
        offsetX: 0.75, offsetY: 0.7, scale: 110,
        stars: [
          { x: 0.0, y: 0.0, size: 2.5, color: '#ffffcc' }, // Rigil Kentaurus
          { x: -0.3, y: 0.2, size: 2.3, color: '#99ccff' }, // Hadar
          { x: -0.8, y: -0.5, size: 1.8, color: '#ffffff' }, // Menkent
          { x: -0.6, y: -0.2, size: 1.8, color: '#ffffff' }, // Corpo
          { x: -1.2, y: -0.3, size: 1.5, color: '#ffffff' }, // Braço
        ],
        connections: [[0, 1], [1, 3], [3, 2], [3, 4]]
      }
    ];

    const particleCount = 50; 
    const connectionDistance = 150; 
    const mouseDistance = 200; 

    let mouse = { x: null, y: null };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        const colors = ['#a855f7', '#3b82f6', '#ffffff']; 
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        if (mouse.x != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const direction = -1; 
            this.vx += forceDirectionX * force * 0.05 * direction;
            this.vy += forceDirectionY * force * 0.05 * direction;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawConstellations = () => {
      constellations.forEach(constellation => {
        const { offsetX, offsetY, scale, stars, connections } = constellation;
        
        const baseX = width * offsetX;
        const baseY = height * offsetY;

        // Desenhar Conexões
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        connections.forEach(([startIndex, endIndex]) => {
          const start = stars[startIndex];
          const end = stars[endIndex];
          ctx.moveTo(baseX + start.x * scale, baseY + start.y * scale);
          ctx.lineTo(baseX + end.x * scale, baseY + end.y * scale);
        });
        ctx.stroke();

        // Desenhar Estrelas
        stars.forEach((star, index) => {
          const x = baseX + star.x * scale;
          const y = baseY + star.y * scale;
          
          // Efeito de Cintilação
          const flicker = Math.sin(time * 0.05 + index * 10) * 0.3 + 0.7; 
          const currentSize = star.size * (1 + Math.sin(time * 0.1 + index) * 0.2);

          ctx.shadowBlur = 15 * flicker;
          ctx.shadowColor = star.color;
          
          ctx.beginPath();
          ctx.arc(x, y, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = flicker;
          ctx.fill();
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 0;
        });
      });
    };

    const animate = () => {
      time++;
      ctx.clearRect(0, 0, width, height);
      
      // Partículas de fundo
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Conexões próximas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          let dx = particles[i].x - particles[j].x;
          let dy = particles[i].y - particles[j].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(168, 85, 247, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Constelações
      drawConstellations();

      requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 opacity-100" />;
};

/* --- Componente da Lua (Fase Real) --- */
const Moon = () => {
  const getPhaseStyle = () => {
    const date = new Date();
    const synodic = 29.53058867;
    const msPerDay = 86400000;
    const baseDate = new Date('2000-01-06T18:14:00Z');
    
    const diff = date.getTime() - baseDate.getTime();
    const daysTotal = diff / msPerDay;
    const phaseCycle = (daysTotal % synodic); 
    const phase = phaseCycle / synodic; 

    let name = '';
    if (phase < 0.03 || phase > 0.97) name = 'Lua Nova';
    else if (phase < 0.22) name = 'Lua Crescente';
    else if (phase < 0.28) name = 'Quarto Crescente';
    else if (phase < 0.47) name = 'Crescente Gibosa';
    else if (phase < 0.53) name = 'Lua Cheia';
    else if (phase < 0.72) name = 'Minguante Gibosa';
    else if (phase < 0.78) name = 'Quarto Minguante';
    else name = 'Lua Minguante';

    return { phase, phaseName: name };
  };

  const { phase, phaseName } = getPhaseStyle();

  return (
    <div className="absolute top-10 right-4 md:right-20 z-20 flex flex-col items-center group cursor-help animate-float-slow">
      <div className="relative w-20 h-20 md:w-24 md:h-24 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
        <svg viewBox="0 0 100 100" className="w-full h-full">
           <defs>
             <radialGradient id="moonGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="80%" stopColor="#fdf4ff" />
                <stop offset="100%" stopColor="#e9d5ff" />
             </radialGradient>
           </defs>
           
           <circle cx="50" cy="50" r="45" fill="#1e1b4b" opacity="0.9" />
           <path d={getMoonPolygon(phase)} fill="url(#moonGrad)" filter="drop-shadow(0 0 5px white)" />
        </svg>
      </div>
      <div className="mt-2 text-xs text-purple-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded border border-purple-500/30">
        Fase: {phaseName}
      </div>
    </div>
  );
};

function getMoonPolygon(phase) {
  const r = 45;
  const cx = 50;
  const cy = 50;
  
  if (Math.abs(phase - 0.5) < 0.02) {
      return `M ${cx} ${cy-r} A ${r} ${r} 0 1 1 ${cx} ${cy+r} A ${r} ${r} 0 1 1 ${cx} ${cy-r}`;
  }
  
  if (phase < 0.02 || phase > 0.98) {
      return `M ${cx} ${cy} Z`; 
  }
  
  if (phase <= 0.5) {
      const arcOuter = `A ${r} ${r} 0 0 1 ${cx} ${cy+r}`; 
      const rx = Math.abs(r * Math.cos(phase * 2 * Math.PI));
      const sweepInner = phase < 0.25 ? 0 : 1;
      
      return `M ${cx} ${cy-r} ${arcOuter} A ${rx} ${r} 0 0 ${sweepInner} ${cx} ${cy-r}`;
  } else {
      const arcOuter = `A ${r} ${r} 0 0 0 ${cx} ${cy+r}`; 
      const rx = Math.abs(r * Math.cos(phase * 2 * Math.PI));
      const sweepInner = phase > 0.75 ? 1 : 0;
       
      return `M ${cx} ${cy-r} ${arcOuter} A ${rx} ${r} 0 0 ${sweepInner} ${cx} ${cy-r}`;
  }
}

/* --- Componentes de UI --- */

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [language, setLanguage] = useState('pt');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Sobre', 'Habilidades', 'Experiência', 'Formação', 'Cursos', 'Contato'];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0B15]/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 text-white font-bold text-xl tracking-wider flex items-center gap-2">
            <Sparkles className="text-purple-500" />
            <span className="uppercase">Emanuella<span className="text-purple-500">Melo</span></span>
          </div>
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navLinks.map((item) => (
                <a key={item} href={`#${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`} className="text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  {item}
                </a>
              ))}
                            <select 
                              value={language} 
                              onChange={(e) => setLanguage(e.target.value)}
                              className="bg-white/5 border border-white/20 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 cursor-pointer"
                            >
                              <option value="pt" className="bg-[#0B0B15] text-white">🇧🇷 PT</option>
                              <option value="en" className="bg-[#0B0B15] text-white">🇺🇸 EN</option>
                              <option value="es" className="bg-[#0B0B15] text-white">🇪🇸 ES</option>
                            </select>
              <a href="https://wa.me/5582999093075" target="_blank" rel="noreferrer" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-5 py-2 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]">
                Fale Comigo
              </a>
            </div>
          </div>
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-[#0B0B15] border-b border-white/10 shadow-2xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
             {navLinks.map((item) => (
                <a key={item} href={`#${item.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "")}`} onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                               <div className="px-3 py-2">
                                 <select 
                                   value={language} 
                                   onChange={(e) => setLanguage(e.target.value)}
                                   className="w-full bg-white/5 border border-white/20 text-white px-3 py-2 rounded-md text-sm font-medium"
                                 >
                                   <option value="pt" className="bg-[#0B0B15] text-white">🇧🇷 Português</option>
                                   <option value="en" className="bg-[#0B0B15] text-white">🇺🇸 English</option>
                                   <option value="es" className="bg-[#0B0B15] text-white">🇪🇸 Español</option>
                                 </select>
                               </div>
                  {item}
                </a>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Componente da Lua */}
      <Moon />

      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-block mb-4 px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-semibold tracking-wide uppercase backdrop-blur-sm">
          Assistente Administrativo & Graduanda em 2 Engenharias
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Emanuella de Cássia <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 animate-gradient bg-300%">
            Fragoso de Melo Amorim
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          Unindo 4 anos de experiência em gestão administrativa com a inovação das Engenharias Elétrica e da Computação. 
          Especialista em organização, análise de dados e robótica autônoma.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <a href="#contato" className="px-8 py-3 bg-white text-[#0B0B15] font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 w-full sm:w-auto text-center">
            Entrar em Contato
          </a>
          <a href="https://github.com/emanuellamelo-f" target="_blank" rel="noopener" className="px-8 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2 w-full sm:w-auto">
            <Github size={20} /> GitHub
          </a>
        </div>
        
        {/* Stats Grid Mini */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { label: "Experiência Admin", val: "4 Anos" },
              { label: "Engenharias", val: "2 Cursos" },
              { label: "Robótica", val: "Competidora" },
              { label: "Inglês", val: "Leitura Avançada" }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{stat.val}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-500">
        <ChevronDown size={32} />
      </div>
    </section>
  );
};

const SectionTitle = ({ title, subtitle }) => (
  <div className="text-center mb-16">
    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
    <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mb-4"></div>
    {subtitle && <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

const About = () => {
    return (
        <section id="sobre" className="py-24 relative z-10 bg-[#0B0B15]/50">
            <div className="max-w-4xl mx-auto px-4">
                <SectionTitle title="Sobre Mim" />
                <div className="bg-[#131320] p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[40px]" />
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
                        <p>
                            Sou Emanuella, tenho 31 anos. Atuo como <strong>Assistente Administrativo</strong> com 4 anos de experiência, focada em organização, suporte operacional e otimização de rotinas de escritório. Possuo habilidade comprovada na gestão de agendas, controle de documentos e elaboração de relatórios, com domínio avançado do Pacote Office, especialmente Excel.
                        </p>
                        <p>
                            Minha trajetória é marcada pela multidisciplinaridade. Além da gestão, sou estudante de <strong>Engenharia Elétrica (UFAL)</strong> e <strong>Engenharia da Computação (UFBRA)</strong>, e faço parte do projeto de robótica <strong>Cyber Dragon (IEEE RAS)</strong>, onde atuo no desenvolvimento de robôs de sumô autônomos.
                        </p>
                        <p>
                            Também tenho um forte viés social e educacional, tendo atuado como professora de violino no Projeto Albatroz e atualmente como assistente no projeto comunitário Conexões de Saberes.
                        </p>
                        <div className="p-4 bg-purple-900/20 border-l-4 border-purple-500 rounded-r-lg mt-6">
                            <h4 className="text-white font-bold mb-1">Meu Objetivo</h4>
                            <p className="text-sm text-gray-400 italic">
                                Busco uma oportunidade desafiadora onde possa aplicar minha sólida experiência administrativa e meu conhecimento técnico em desenvolvimento e análise de dados para contribuir significativamente para a eficiência da equipe.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const SkillCard = ({ icon: Icon, title, skills }) => (
  <div className="p-6 rounded-2xl bg-[#131320] border border-white/5 hover:border-purple-500/50 transition-all hover:-translate-y-1 h-full">
    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 text-purple-400">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
    <ul className="space-y-2">
      {skills.map((skill, idx) => (
        <li key={idx} className="flex items-center text-gray-400 text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
          {skill}
        </li>
      ))}
    </ul>
  </div>
);

const Skills = () => {
  return (
    <section id="habilidades" className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <SectionTitle title="Habilidades & Ferramentas" subtitle="Onde o administrativo encontra a tecnologia." />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkillCard 
          icon={Code} 
          title="Desenvolvimento" 
          skills={['React', 'JavaScript (Lógica)', 'Python (POO & Dados)', 'HTML', 'GitHub']} 
        />
        <SkillCard 
          icon={Database} 
          title="Dados & Office" 
          skills={['Excel Avançado', 'Análise de Dados', 'Pacote Office Avançado', 'Relatórios Gerenciais']} 
        />
        <SkillCard 
          icon={PenTool} 
          title="Ferramentas & Design" 
          skills={['AutoCAD (Intermediário)', 'Canva (Intermediário)', 'Leitura de Projetos', 'Edição Básica']} 
        />
        <SkillCard 
          icon={Globe} 
          title="Idiomas & Soft Skills" 
          skills={['Inglês (Leitura Avançada)', 'Espanhol (Básico)', 'Gestão de Projetos', 'Organização']} 
        />
      </div>
    </section>
  );
};

const ExperienceItem = ({ role, company, period, description, type }) => (
    <div className="relative pl-8 pb-12 border-l border-white/10 last:pb-0">
        <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${type === 'tech' ? 'border-blue-500 bg-blue-900' : 'border-purple-500 bg-purple-900'}`}></div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h3 className="text-xl font-bold text-white">{role}</h3>
            <span className="text-sm text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">{period}</span>
        </div>
        <div className="text-purple-400 font-medium mb-3">{company}</div>
        <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{description}</p>
    </div>
);

const Experience = () => {
    return (
        <section id="experiencia" className="py-24 bg-[#0B0B15]/50 relative z-10">
            <div className="max-w-4xl mx-auto px-4">
                <SectionTitle title="Trajetória Profissional" subtitle="Uma carreira construída com dedicação e evolução constante." />
                
                <div className="space-y-2">
                    <ExperienceItem 
                        role="Assistente Administrativo"
                        company="UFAL - Conexões de Saberes (Bolsista de Extensão)"
                        period="2021 – Atualmente"
                        description="Atuação focada em organização, suporte operacional e otimização de rotinas de escritório. Gestão de agendas, controle de documentos e elaboração de relatórios gerenciais."
                        type="admin"
                    />
                    <ExperienceItem 
                        role="Engenharia de Robótica (Sumô)"
                        company="Equipe Cyber Dragon (IEEE RAS UFAL)"
                        period="Atualmente"
                        description="Concepção e engenharia completa do robô de sumô. Responsável desde o projeto mecânico e seleção de eletrônicos até o desenvolvimento da inteligência autônoma (lógica de busca, ataque e evasão). Na competição, garanto a calibração e execução estratégica."
                        type="tech"
                    />
                    <ExperienceItem 
                        role="Professora de Violino"
                        company="Projeto Albatroz"
                        period="Voluntariado"
                        description="Aulas de violino para a comunidade residente nas proximidades da Escola Ovídio Edgar de Albuquerque."
                        type="admin"
                    />
                    <ExperienceItem 
                        role="Estagiária Técnica em Edificações"
                        company="Camila Santos Arquitetura"
                        period="2018"
                        description="Leitura de plantas baixas, elétricas, hidráulicas e estruturais. Criação e aprimoramento de projetos utilizando AutoCAD."
                        type="tech"
                    />
                </div>
            </div>
        </section>
    );
};

const Education = () => {
    return (
        <section id="formacao" className="py-24 relative z-10">
            <div className="max-w-7xl mx-auto px-4">
                <SectionTitle title="Formação Acadêmica" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a162e] to-[#131320] border border-white/5">
                        <GraduationCap className="text-blue-500 mb-4" size={32} />
                        <h3 className="text-lg font-bold text-white">Engenharia Elétrica</h3>
                        <p className="text-gray-400 text-sm mt-2">Universidade Federal de Alagoas</p>
                        <p className="text-purple-400 text-xs mt-2 font-mono">2022 - 2027 (Cursando)</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a162e] to-[#131320] border border-white/5">
                        <Code className="text-blue-500 mb-4" size={32} />
                        <h3 className="text-lg font-bold text-white">Engenharia da Computação</h3>
                        <p className="text-gray-400 text-sm mt-2">Centro Universitário UFBRA</p>
                        <p className="text-purple-400 text-xs mt-2 font-mono">Previsão 2025</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a162e] to-[#131320] border border-white/5">
                        <Briefcase className="text-blue-500 mb-4" size={32} />
                        <h3 className="text-lg font-bold text-white">Técnico em Edificações</h3>
                        <p className="text-gray-400 text-sm mt-2">SENAI / IFAL</p>
                        <p className="text-purple-400 text-xs mt-2 font-mono">2011 - 2013 (Concluído)</p>
                    </div>
                     <div className="p-6 rounded-2xl bg-gradient-to-br from-[#1a162e] to-[#131320] border border-white/5">
                        <BookOpen className="text-blue-500 mb-4" size={32} />
                        <h3 className="text-lg font-bold text-white">Ensino Médio</h3>
                        <p className="text-gray-400 text-sm mt-2">Escola Estadual Ovídio Edgar</p>
                        <p className="text-purple-400 text-xs mt-2 font-mono">2011 - 2013 (Concluído)</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-10" />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
        const isSelected = selectedDate === day;
        days.push(
            <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className={`h-10 rounded-lg flex items-center justify-center text-sm transition-all ${
                    isToday ? 'bg-purple-600 text-white font-bold' :
                    isSelected ? 'bg-blue-600 text-white' :
                    'text-gray-300 hover:bg-white/10'
                }`}
            >
                {day}
            </button>
        );
    }

    return (
        <div className="bg-[#131320] p-6 rounded-2xl border border-white/5 max-w-sm">
            <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <ChevronDown size={20} className="rotate-90 text-gray-400" />
                </button>
                <h3 className="text-white font-bold">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
                <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <ChevronDown size={20} className="-rotate-90 text-gray-400" />
                </button>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-semibold text-gray-500">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {days}
            </div>
        </div>
    );
};

const Courses = () => {
    const coursesList = [
        { name: "Cientista de Dados Associado em Python", inst: "DataCamp / Outros", hours: "90h", status: "Cursando" },
        { name: "Análise de Dados", inst: "Google + CIEE", hours: "60h", status: "Cursando" },
        { name: "Lógica de Programação JavaScript", inst: "Alura", hours: "6h", status: "Concluído Out/2025" },
        { name: "Gestão de Projetos", inst: "Oxetech - Gov Alagoas", hours: "40h", status: "Concluído Set/2025" },
        { name: "Administração Financeira", inst: "IFRS", hours: "40h", status: "Concluído Abr/2025" },
        { name: "Javascript / HTML / POO Python", inst: "FreeCodeCamp", hours: "900h Total", status: "Cursando" },
        { name: "Inglês Básico", inst: "Instituto Tecnológico Brasileiro", hours: "60h", status: "Concluído 2018" },
    ];

    return (
        <section id="cursos" className="py-24 bg-[#0B0B15]/50 relative z-10">
            <div className="max-w-5xl mx-auto px-4">
                <SectionTitle title="Cursos & Certificações" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {coursesList.map((course, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                            <div>
                                <h4 className="font-bold text-white text-sm md:text-base">{course.name}</h4>
                                <p className="text-gray-400 text-xs">{course.inst}</p>
                            </div>
                            <div className="text-right">
                                <span className="block text-purple-400 text-xs font-mono">{course.status}</span>
                                <span className="block text-gray-500 text-xs">{course.hours}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-12">
                    <Calendar />
                </div>
            </div>
        </section>
    );
};

const Footer = () => {
  return (
    <footer id="contato" className="relative bg-[#050508] pt-20 pb-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                <div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
                         <Sparkles className="text-purple-500" />
                         <span>EMANUELLA MELO</span>
                    </div>
                    <p className="text-gray-400 max-w-sm">
                        Pronta para transformar desafios administrativos e técnicos em soluções eficientes.
                    </p>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-6">Informações de Contato</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500"><Mail size={16} /></div>
                            manu.fragoso.melo@gmail.com
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500"><Briefcase size={16} /></div>
                            (82) 99909-3075
                        </li>
                    </ul>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-6">Redes</h4>
                    <div className="flex gap-4">
                        <a href="https://github.com/emanuellamelo-f" target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white transition-all border border-white/5">
                            <Github size={24} />
                        </a>
                        <a href="#" className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all border border-white/5">
                            <Linkedin size={24} />
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                <p>&copy; 2025 Emanuella Melo. Todos os direitos reservados.</p>
                <p>Desenvolvido com React & Tailwind</p>
            </div>
        </div>
    </footer>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-[#0B0B15] text-white selection:bg-purple-500/30 font-sans overflow-x-hidden">
      <ConstellationCanvas />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Education />
      <Courses />
      <Footer />
      
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .bg-300% {
          background-size: 300% 300%;
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
        html {
            scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default App;
