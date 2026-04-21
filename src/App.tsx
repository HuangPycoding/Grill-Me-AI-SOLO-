import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, ChevronRight, Target, Brain, ShieldAlert, Crosshair, Terminal, Send, ArrowLeft, Activity, Flame, AlertCircle, KeyRound, Eye, EyeOff, Settings, Cloud, Hexagon, Code2, Wind, ArrowRight, ChevronDown } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from './lib/utils';
import { analyzeResume, generateNextGrill, type AssessmentData } from './services/aiService';

type AppState = 'landing' | 'input' | 'analyzing' | 'assessment' | 'grill';

export interface ApiConfig {
  apiKey: string;
  baseUrl: string;
  modelName: string;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  
  // Cross-stage data
  const [role, setRole] = useState('字节跳动 - 前端开发实习生');
  const [resume, setResume] = useState('教育背景: XX大学 计算机科学与技术\n项目经验: 独立负责过百万级高并发抢购系统的前端重构，使用 React 和 Redux，将页面加载速度优化了50%。\n技能: 熟练掌握 JavaScript/TypeScript，熟悉 Vue/React，了解 Node.js。');
  
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    apiKey: localStorage.getItem('GRILL_ME_API_KEY') || '',
    baseUrl: localStorage.getItem('GRILL_ME_BASE_URL') || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    modelName: localStorage.getItem('GRILL_ME_MODEL_NAME') || 'qwen-flash'
  });

  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  const startAnalysis = (inputRole: string, inputResume: string, config: ApiConfig) => {
    setRole(inputRole);
    setResume(inputResume);
    setApiConfig(config);
    localStorage.setItem('GRILL_ME_API_KEY', config.apiKey);
    localStorage.setItem('GRILL_ME_BASE_URL', config.baseUrl);
    localStorage.setItem('GRILL_ME_MODEL_NAME', config.modelName);
    setAppState('analyzing');
  };

  const resetFlow = () => {
    setAppState('landing');
    setAssessmentData(null);
  };

  const clearConfig = () => {
    if (window.confirm('确定要清除浏览器中保存的 API 配置信息吗？')) {
      localStorage.removeItem('GRILL_ME_API_KEY');
      localStorage.removeItem('GRILL_ME_BASE_URL');
      localStorage.removeItem('GRILL_ME_MODEL_NAME');
      setApiConfig({
        apiKey: '',
        baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        modelName: 'qwen-flash'
      });
      resetFlow();
    }
  };

  const handleBack = () => {
    switch (appState) {
      case 'input':
        setAppState('landing');
        break;
      case 'analyzing':
        setAppState('input');
        break;
      case 'assessment':
        setAppState('input');
        break;
      case 'grill':
        setAppState('assessment');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans overflow-hidden hover:selection:bg-amber-500/30">
      <header className="border-b border-zinc-800/50 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 cursor-pointer transition-transform hover:scale-105" onClick={resetFlow}>
              <span className="font-black tracking-tight text-lg hidden sm:block text-zinc-100 italic">Grill-Me AI</span>
            </div>
            
            {appState !== 'landing' && (
              <button 
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 px-3 py-1.5 rounded-full font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                返回上一页
              </button>
            )}
          </div>
          
          {appState !== 'landing' && (
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
              {apiConfig.apiKey && (
                <button 
                  onClick={clearConfig}
                  className="text-zinc-500 hover:text-rose-400 transition-colors underline underline-offset-2 flex items-center gap-1"
                >
                  清除秘钥
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className={cn(
        "mx-auto h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar relative",
        appState === 'landing' ? "w-full" : "max-w-6xl px-4 py-8"
      )}>
        <AnimatePresence mode="wait">
          {appState === 'landing' && (
            <LandingStage key="landing" onStart={() => setAppState('input')} />
          )}
          {appState === 'input' && (
            <InputStage 
              key="input" 
              initialRole={role} 
              initialResume={resume} 
              initialConfig={apiConfig}
              onNext={startAnalysis} 
            />
          )}
          {appState === 'analyzing' && (
            <AnalyzingStage 
              key="analyzing" 
              role={role}
              resume={resume}
              config={apiConfig}
              onData={(data) => {
                setAssessmentData(data);
                setAppState('assessment');
              }}
              onBack={() => setAppState('input')}
            />
          )}
          {appState === 'assessment' && assessmentData && (
            <AssessmentStage 
              key="assessment" 
              data={assessmentData}
              onNext={() => setAppState('grill')} 
            />
          )}
          {appState === 'grill' && assessmentData && (
            <GrillStage 
              key="grill" 
              role={role}
              resume={resume}
              config={apiConfig}
              initialQuestion={assessmentData.firstGrillQuestion}
              onBack={() => setAppState('assessment')} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ==========================================
// STAGE 0: LANDING PAGE
// ==========================================
// Custom accurate SVG for Aliyun Bailian based on their brand identity
function BailianLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top-Left: Dark Purple */}
      <polygon points="12,12 12,2 3.34,7" fill="#6C3EFF" />
      {/* Top-Right: Light Purple */}
      <polygon points="12,12 20.66,7 12,2" fill="#A881FF" />
      {/* Bottom-Right: Bright Cyan */}
      <polygon points="12,12 12,22 20.66,17" fill="#14F1D9" />
      {/* Bottom-Left: Teal */}
      <polygon points="12,12 3.34,17 12,22" fill="#00C4AB" />
      {/* Left: Deep Blue */}
      <polygon points="12,12 3.34,7 3.34,17" fill="#153BFF" />
    </svg>
  );
}

// Custom accurate SVG for Trae IDE
function TraeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <g fill="#3EE593">
        {/* Frame parts */}
        <rect x="3" y="5" width="18" height="4" />
        <rect x="17" y="9" width="4" height="10" />
        <rect x="7" y="15" width="10" height="4" />
        <rect x="3" y="9" width="4" height="6" />
        {/* Left Diamond */}
        <path d="M 10 10.5 L 11.5 12 L 10 13.5 L 8.5 12 Z" />
        {/* Right Diamond */}
        <path d="M 14 10.5 L 15.5 12 L 14 13.5 L 12.5 12 Z" />
      </g>
    </svg>
  );
}

// Custom exact text SVG for Trae
function TraeTextLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* T */}
      <path d="M0,0 h18 v4.5 h-6.5 v19.5 h-5 V4.5 H0 Z" />
      {/* R */}
      <rect x="22" y="0" width="5" height="24" />
      <path d="M27,0 h8 a7,7 0 0,1 0,14 h-8 v-4.5 h8 a2.5,2.5 0 0,0 0,-5 h-8 Z" />
      <polygon points="33,14 39,14 45,24 38.5,24" />
      {/* A (Fixed precise geometry with properly filled crossbar and spacing) */}
      <path d="M58,0 h8 L75,24 h-5.5 L67.6,19 H56.4 L54.5,24 H49 Z M62,4 L58.2,14 h7.6 Z" fillRule="evenodd" clipRule="evenodd" />
      {/* E */}
      <rect x="79" y="0" width="16" height="4.5" />
      <rect x="79" y="4.5" width="5" height="15" />
      <rect x="79" y="19.5" width="16" height="4.5" />
      <polygon points="91,8 95,12 91,16 87,12" />
    </svg>
  );
}

function LandingStage({ onStart }: { onStart: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex flex-col items-center"
    >
      {/* Hero */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center relative w-full pt-16">
        <div className="absolute inset-0 bg-neutral-950 -z-10" />
        {/* subtle gradient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} 
          className="text-center z-10 px-4"
        >
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter bg-gradient-to-br from-white via-zinc-300 to-zinc-600 bg-clip-text text-transparent mb-6 pb-2">
            Grill-Me AI
          </h1>
          <h2 className="text-2xl md:text-3xl text-zinc-300 font-medium tracking-tight mb-4">
            企业级毒舌面试模拟器
          </h2>
          <p className="text-lg md:text-xl text-zinc-500 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            直面最残酷的拷问，撕碎简历里的每一滴水分。<br className="hidden md:block"/>
            训练你的抗压与临场反应能力。
          </p>
        </motion.div>
        
        <motion.div
           animate={{ y: [0, 8, 0] }}
           transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
           className="absolute bottom-16 flex flex-col items-center text-zinc-600 opacity-60 hover:opacity-100 transition-opacity"
        >
           <ChevronDown className="w-5 h-5" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="w-full max-w-5xl py-32 px-6 flex flex-col gap-40">
        {/* Feature 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row gap-12 lg:gap-24 items-center"
        >
          <div className="flex-1 space-y-6">
            <div className="text-emerald-400 font-mono text-sm tracking-widest">FEATURE 01</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 leading-tight">简历刺客<br/>无处遁形</h2>
            <p className="text-zinc-400 text-lg leading-relaxed font-light">
              基于大模型深度语义剖析简历描述。精准定位你“精通”背后掩藏的不足，找出那些经不起推敲的夸大其词，让简历挤干水分。
            </p>
          </div>
          <div className="flex-1 w-full aspect-square md:aspect-auto md:h-80 bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
              <Target className="w-24 h-24 text-emerald-500/20" />
              <div className="absolute bottom-6 left-6 right-6 h-1/2 bg-gradient-to-t from-zinc-900 via-zinc-900 to-transparent" />
          </div>
        </motion.div>

        {/* Feature 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row-reverse gap-12 lg:gap-24 items-center"
        >
          <div className="flex-1 space-y-6">
            <div className="text-rose-400 font-mono text-sm tracking-widest">FEATURE 02</div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 leading-tight">高压环境<br/>毒舌拷问</h2>
            <p className="text-zinc-400 text-lg leading-relaxed font-light">
              抛弃传统的八股文对答，还原真实一线大厂极高压面试场景。每一个追问都直击技术盲区，训练你的临场抗压与结构化表达能力。
            </p>
          </div>
          <div className="flex-1 w-full aspect-square md:aspect-auto md:h-80 bg-zinc-900 border border-zinc-800 rounded-3xl relative overflow-hidden flex items-center justify-center shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent" />
              <Crosshair className="w-24 h-24 text-rose-500/20 z-0" />
              <div className="absolute bottom-6 bg-zinc-950 border border-zinc-800 rounded-xl p-4 w-4/5 text-sm font-mono text-zinc-300 shadow-xl overflow-hidden">
                 <span className="text-rose-400 font-bold">Interviewer: </span>你说你负责了高并发架构，但实际上你们系统的 QPS 峰值才多少？别绕弯子。
                 <div className="mt-3 w-full h-2 bg-zinc-800 rounded-full overflow-hidden flex">
                    <div className="h-full bg-rose-500 w-1/4"></div>
                 </div>
              </div>
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-32 w-full flex flex-col items-center border-t border-zinc-900 bg-zinc-950/50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center px-4"
        >
           <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-100 mb-8">准备好被扒皮了吗？</h2>
           <button 
             onClick={onStart} 
             className="relative group px-10 py-5 bg-zinc-100 hover:bg-white text-zinc-950 text-lg font-bold rounded-full overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)]"
           >
              <span className="relative z-10 flex items-center gap-3">
                进入拷问配置室 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
           </button>
        </motion.div>
      </section>

      {/* Footer: Powered By */}
      <footer className="w-full py-20 flex flex-col items-center bg-black border-t border-zinc-950 relative overflow-hidden">
         <span className="text-[11px] font-mono uppercase tracking-[0.3em] mb-16 text-zinc-500">Powered by cutting-edge intelligence</span>
         
         <style>{`
           @keyframes custom-marquee {
             0% { transform: translateX(0%); }
             100% { transform: translateX(-50%); }
           }
           .animate-custom-marquee {
             animation: custom-marquee 30s linear infinite;
           }
           .animate-custom-marquee:hover {
             animation-play-state: paused;
           }
         `}</style>
         
         <div 
           className="relative flex w-full max-w-full overflow-hidden" 
           style={{ 
             maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)", 
             WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)" 
           }}
         >
           <div className="flex w-max animate-custom-marquee items-center pl-8">
             {/* 
                We repeat the sequence 8 times (total 32 blocks) to ensure seamless infinite 
                scrolling even on 4K Ultrawide screens where 50% translateX covers a massive distance.
              */}
             { [0,1,2,3, 0,1,2,3, 0,1,2,3, 0,1,2,3, 0,1,2,3, 0,1,2,3, 0,1,2,3, 0,1,2,3].map((type, idx) => {
               if (type === 0) return (
                 <div key={`bailian-${idx}`} className="flex flex-col items-center justify-center gap-4 transition-all opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 w-64 h-[112px] flex-shrink-0 cursor-pointer">
                   <BailianLogo className="w-16 h-16" /> 
                   <span className="font-bold tracking-tighter text-2xl">阿里云百炼</span>
                 </div>
               );
               if (type === 1) return (
                 <div key={`trae-${idx}`} className="flex flex-col items-center justify-center transition-all hover:text-[#3EE593] opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 w-64 h-[112px] flex-shrink-0 cursor-pointer">
                   <TraeTextLogo className="h-12" />
                 </div>
               );
               if (type === 2) return (
                 <div key={`react-${idx}`} className="flex flex-col items-center justify-center gap-4 hover:text-blue-400 transition-all opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 w-64 h-[112px] flex-shrink-0 cursor-pointer">
                   <Code2 className="w-16 h-16" /> 
                   <span className="font-bold tracking-tight text-2xl">React</span>
                 </div>
               );
               if (type === 3) return (
                 <div key={`tailwind-${idx}`} className="flex flex-col items-center justify-center gap-4 hover:text-sky-400 transition-all opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-110 w-64 h-[112px] flex-shrink-0 cursor-pointer">
                   <Wind className="w-16 h-16" /> 
                   <span className="font-bold tracking-tight text-2xl">Tailwind</span>
                 </div>
               );
               return null;
             })}
           </div>
         </div>
      </footer>
    </motion.div>
  );
}

// ==========================================
// STAGE 1: INPUT
// ==========================================
function InputStage({ initialRole, initialResume, initialConfig, onNext }: { initialRole: string, initialResume: string, initialConfig: ApiConfig, onNext: (role: string, resume: string, config: ApiConfig) => void }) {
  const [role, setRole] = useState(initialRole);
  const [resume, setResume] = useState(initialResume);
  const [config, setConfig] = useState<ApiConfig>(initialConfig);
  const [showKey, setShowKey] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto mt-4 space-y-8 pb-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-zinc-100 to-zinc-500 bg-clip-text text-transparent">
           准备好被拷问了吗？
        </h1>
        <p className="text-zinc-400 text-lg">
          输入目标岗位和简历，任何 OpenAI 兼容大模型都可化身最毒舌的面试官。
        </p>
      </div>

      <div className="space-y-6 bg-zinc-900/50 p-6 md:p-8 rounded-2xl border border-zinc-800">
        
        {/* API Config Section */}
        <div className="p-5 bg-zinc-950/80 border border-emerald-500/30 rounded-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            大模型基座配置 (OpenAI 兼容模式)
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            支持阿里云百炼 (qwen-flash)、DeepSeek 或任何硅基流动等兼容接口。密钥仅保存在本地。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Base URL</label>
              <input 
                type="text" 
                value={config.baseUrl}
                onChange={e => setConfig({...config, baseUrl: e.target.value})}
                placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1" 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-zinc-400">Model Name</label>
              <input 
                type="text" 
                value={config.modelName}
                onChange={e => setConfig({...config, modelName: e.target.value})}
                placeholder="例: qwen-flash 或 deepseek-chat" 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5 border-t border-zinc-800/50 pt-3">
            <label className="text-xs font-mono text-zinc-400 flex items-center gap-1">
              <KeyRound className="w-3 h-3" /> API Key
            </label>
            <div className="relative">
              <input 
                type={showKey ? "text" : "password"} 
                value={config.apiKey}
                onChange={e => setConfig({...config, apiKey: e.target.value})}
                placeholder="sk-..." 
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-mono text-xs pr-10"
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-[10px] text-zinc-500 hover:text-zinc-300"
              >
                {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-500" />
              目标公司及岗位
            </label>
            <input 
              type="text" 
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="例如：字节跳动 - 前端开发工程师" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Upload className="w-4 h-4 text-rose-500" />
              粘贴你的简历内容
            </label>
            <textarea 
              rows={8}
              value={resume}
              onChange={e => setResume(e.target.value)}
              placeholder="贴入你的简历描述..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all resize-none font-mono text-sm custom-scrollbar"
            />
          </div>
        </div>

        <button 
          onClick={() => onNext(role, resume, config)}
          disabled={!role.trim() || !resume.trim() || !config.apiKey.trim() || !config.baseUrl.trim() || !config.modelName.trim()}
          className="w-full py-4 bg-zinc-100 hover:bg-white disabled:opacity-50 disabled:hover:bg-zinc-100 text-zinc-950 font-bold rounded-lg transition-all flex items-center justify-center gap-2 group hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] mt-4"
        >
          {config.apiKey.trim() ? "提交并生成受虐分析" : "请先补全 API 配置"}
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}

// ==========================================
// STAGE 2: ANALYZING (Wait for API)
// ==========================================
function AnalyzingStage({ role, resume, config, onData, onBack }: { role: string, resume: string, config: ApiConfig, onData: (data: AssessmentData) => void, onBack: () => void }) {
  const [textIndex, setTextIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loadingTexts = [
    `[${config.modelName}] 正在提取简历水分...`,
    "发现满篇的 '精通'，正在大幅调低信用评级...",
    "正在对比目标大厂岗位真实要求...",
    "分析业务产出的真实含金量...",
    "即将生成真实的求职竞争力报告...",
  ];

  useEffect(() => {
    const startAnalysis = async () => {
      try {
        const [data] = await Promise.all([
          analyzeResume(role, resume, config.apiKey, config.baseUrl, config.modelName),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);
        onData(data);
      } catch (err: any) {
        if (err.message?.includes('InvalidApiKey') || err.message?.includes('401')) {
          setError("API 密钥无效或配置错误，请检查后重试。");
        } else {
          setError(err?.message || "分析异常，请检查网络、BaseURL 或模型名称是否正确。");
        }
      }
    };
    startAnalysis();
  }, [role, resume, config, onData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex(prev => (prev === loadingTexts.length - 1 ? prev : prev + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [loadingTexts.length]);

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center space-y-6">
        <AlertCircle className="w-16 h-16 text-rose-500" />
        <p className="text-rose-400 font-mono text-sm leading-relaxed bg-rose-500/10 p-4 border border-rose-500/20 rounded-xl break-all">{error}</p>
        <button onClick={onBack} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm text-white transition-colors">返回修改配置</button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col items-center justify-center"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-20 rounded-full animate-pulse" />
        <Brain className="w-24 h-24 text-blue-500 animate-bounce relative z-10" />
      </div>
      <div className="mt-8 font-mono text-zinc-400 h-6 text-sm">
        {loadingTexts[textIndex]}
        <span className="animate-ping">_</span>
      </div>
      
      <div className="w-64 h-1 bg-zinc-900 rounded-full mt-6 overflow-hidden">
        <motion.div 
          className="h-full bg-blue-500"
          initial={{ width: "20%" }}
          animate={{ width: "95%" }}
          transition={{ duration: 5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}

// ==========================================
// STAGE 3: ASSESSMENT (竞争力实测台)
// ==========================================
function AssessmentStage({ data, onNext }: { data: AssessmentData, onNext: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
      className="max-w-5xl mx-auto h-full flex flex-col pb-12 pt-4"
    >
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">竞争力实测台 (Reality Check)</h2>
          <p className="text-zinc-400">你以为的自己 vs 大厂实际的期望。深呼吸。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        {/* Radar Chart */}
        <div className="bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 border-b border-l border-zinc-800/80 bg-zinc-900/80 rounded-bl-xl z-10 flex gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-zinc-300">目前水平</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-zinc-300">目标要求</span>
            </div>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.radarData}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '14px' }}
                />
                <Radar name="目标要求" dataKey="requirement" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                <Radar name="目前水平" dataKey="student" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Brutal Truth */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-zinc-900/40 rounded-2xl border border-rose-900/50 p-6 relative overflow-hidden shrink-0">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
            <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5" />
              AI 毒舌短评 (Brutal Truth)
            </h3>
            <div className="space-y-4 font-mono text-sm leading-relaxed text-zinc-300">
              {data.truthItems.map((item, idx) => (
                <p key={idx}>
                  <span className="text-white font-bold bg-zinc-800 px-1 border border-zinc-700 mr-2">
                    {item.emoji} {item.title}
                  </span>
                  {item.content}
                </p>
              ))}
              <p className="text-rose-500 mt-4 text-xs font-bold pt-4 border-t border-rose-900/30">
                总结：{data.summary}
              </p>
            </div>
          </div>

          <button 
            onClick={onNext}
            className="w-full py-5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl transition-all shadow-[0_0_30px_rgba(225,29,72,0.2)] hover:shadow-[0_0_40px_rgba(225,29,72,0.4)] flex items-center justify-center gap-3 group shrink-0"
          >
            <Crosshair className="w-5 h-5 group-hover:scale-110 transition-transform" />
            接受现实，进入灵魂拷问
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// STAGE 4: GRILL MODE (沉浸式拷问)
// ==========================================
interface ChatMessage {
  role: 'ai' | 'user' | 'system';
  content: string;
  feedback?: { score: number; logic: string; suggestion: string };
}

function GrillStage({ role, resume, config, initialQuestion, onBack }: { role: string, resume: string, config: ApiConfig, initialQuestion: string, onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'system',
      content: `进入压力测试模式。面试官极度挑剔、完全由 [${config.modelName}] 驱动。`
    },
    {
      role: 'ai',
      content: initialQuestion
    }
  ]);
  const [inputBox, setInputBox] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputBox.trim() || isTyping) return;
    
    const userMsg = inputBox;
    const currentMessages = [...messages];
    setMessages([...currentMessages, { role: 'user', content: userMsg }]);
    setInputBox('');
    setIsTyping(true);

    try {
      const historyForAI = currentMessages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role as 'ai'|'user', content: m.content }));

      const response = await generateNextGrill(role, resume, historyForAI, userMsg, config.apiKey, config.baseUrl, config.modelName);

      setIsTyping(false);
      setMessages(prev => {
        const updated = [...prev];
        // The last element is the user's message we just appended
        updated[updated.length - 1].feedback = response.feedback;
        // Append the AI's new grill question
        updated.push({
          role: 'ai',
          content: response.interviewerResponse
        });
        return updated;
      });
    } catch (error: any) {
      console.error(error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev, 
        { role: 'system', content: `警告：API 调用失败 (${error.message || '网络异常'})，请检查 API Key 余额或网络连接后重试。` }
      ]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[calc(100vh-8rem)] flex flex-col bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative"
    >
      {/* Header */}
      <div className="h-14 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </div>
            <span className="font-mono text-sm text-zinc-300 font-bold items-center flex gap-2">
              HR_Bot ({config.modelName})
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-rose-500 text-xs font-mono bg-rose-500/10 px-2 py-1 rounded">
          <Activity className="w-4 h-4" />
          <span>STRESS LEVEL: CRITICAL</span>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={cn(
               "flex flex-col",
               msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start",
               msg.role === 'ai' && "max-w-[85%]",
               msg.role === 'user' && msg.feedback ? "max-w-full lg:max-w-[85%]" : "max-w-[70%]",
               msg.role === 'system' && "mx-auto items-center text-center max-w-full my-4"
            )}
          >
            {msg.role === 'system' ? (
              <div className="text-xs font-mono text-rose-500/70 border border-rose-500/20 bg-rose-500/5 px-4 py-1 rounded-full uppercase tracking-wider">
                {msg.content}
              </div>
            ) : (
              <>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xs font-mono text-zinc-500">
                    {msg.role === 'ai' ? 'HR Director' : 'You'}
                  </span>
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'ai' 
                    ? "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-sm relative"
                    : "bg-blue-600 text-white rounded-tr-sm w-full"
                )}>
                  {msg.role === 'ai' && <Terminal className="absolute -left-2 -top-2 w-4 h-4 text-zinc-500 bg-zinc-900" />}
                  {msg.content}
                </div>

                {/* Instant Feedback Block for User Messages */}
                {msg.feedback && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 w-full bg-zinc-900 border-l-4 border-rose-500 p-4 rounded-r-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-400">🚨 表现复盘分析</span>
                      <span className={cn(
                        "text-xs font-bold px-2 py-0.5 rounded-sm",
                        msg.feedback.score < 60 ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"
                      )}>
                        得分: {msg.feedback.score}/100
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300 font-mono">{msg.feedback.logic}</p>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg mt-2">
                      <p className="text-xs font-bold text-emerald-400 mb-1">✅ 高分回答示范：</p>
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap">{msg.feedback.suggestion}</p>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 items-center p-4">
            <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '300ms' }} />
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-800 shrink-0">
        <div className="relative">
          <textarea 
            value={inputBox}
            onChange={e => {
              setInputBox(e.target.value);
              e.target.style.height = '56px';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
                e.currentTarget.style.height = '56px';
              }
            }}
            placeholder="为自己辩护... (按 Enter 发送, Shift+Enter 换行)"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 pr-12 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all resize-none min-h-[56px] overflow-y-auto custom-scrollbar"
            style={{ height: '56px' }}
          />
          <button 
            onClick={handleSend}
            disabled={!inputBox.trim() || isTyping}
            className="absolute right-2 top-2 p-2 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
