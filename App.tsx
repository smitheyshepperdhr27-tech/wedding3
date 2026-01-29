import React, { useState, useEffect, useRef, useCallback } from 'react';
import { STORY_DATA, WEDDING_DETAILS, CREDITS, BG_MUSIC_URL } from './constants';
import { MusicPlayer } from './components/MusicPlayer';

const App: React.FC = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isCounting, setIsCounting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpName, setRsvpName] = useState('');
  
  const requestRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const autoScroll = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // 只有在放映开始、未暂停、且没有弹窗时滚动
    if (hasStarted && !isPaused && !showRSVP) {
      const move = (deltaTime * 0.045); 
      window.scrollBy(0, move);
    }
    requestRef.current = requestAnimationFrame(autoScroll);
  }, [hasStarted, isPaused, showRSVP]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(autoScroll);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [autoScroll]);

  // 处理电影开始：倒计时逻辑
  const startPremiere = () => {
    setIsCounting(true);
    let count = 5;
    const timer = setInterval(() => {
      count -= 1;
      if (count === 0) {
        clearInterval(timer);
        setHasStarted(true);
        setIsCounting(false);
        if (audioRef.current) {
          audioRef.current.volume = 0;
          audioRef.current.play().then(() => {
              // 音乐平滑淡入
              let vol = 0;
              const fade = setInterval(() => {
                  vol += 0.05;
                  if (audioRef.current) audioRef.current.volume = Math.min(vol, 0.7);
                  if (vol >= 0.7) clearInterval(fade);
              }, 100);
          });
        }
      } else {
        setCountdown(count);
      }
    }, 1000);
  };

  const handleInteractionStart = () => setIsPaused(true);
  const handleInteractionEnd = () => setIsPaused(false);

  return (
    <div 
      className="relative min-h-screen bg-black select-none overflow-x-hidden"
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      onMouseDown={handleInteractionStart}
      onMouseUp={handleInteractionEnd}
    >
      <audio ref={audioRef} src={BG_MUSIC_URL} loop playsInline />
      
      {hasStarted && <MusicPlayer audioRef={audioRef} />}

      {/* --- 片头加载 & 倒计时 --- */}
      {!hasStarted && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center bg-black">
          {!isCounting ? (
            <div className="text-center p-8 max-w-xs w-full animate-entrance">
              <p className="text-[10px] tracking-[0.8em] uppercase text-gold/60 mb-12 font-light">Premiere Invitation</p>
              
              <h2 className="text-white font-serif italic text-xl mb-24 tracking-[0.3em] leading-relaxed">
                每一个伟大的故事<br/>都有一个开始
              </h2>

              <button 
                onClick={startPremiere}
                className="group relative w-full py-6 border border-gold/40 flex items-center justify-center gap-4 bg-black/50 overflow-hidden"
              >
                <span className="relative z-10 text-white tracking-[0.8em] text-xs font-semibold ml-2">
                  开启放映
                </span>
                <div className="absolute inset-0 bg-gold/5 group-active:bg-gold/20 transition-colors"></div>
              </button>

              <p className="mt-16 text-[9px] text-white/20 tracking-[0.4em] uppercase font-light">Directed by Destiny</p>
            </div>
          ) : (
            <div className="relative flex items-center justify-center w-full h-full">
               {/* 模拟胶片对焦环 */}
               <div className="absolute w-72 h-72 border border-white/10 rounded-full"></div>
               <div className="absolute w-64 h-64 border border-white/20 rounded-full animate-pulse"></div>
               <key className={`countdown-num`} key={countdown}>{countdown}</key>
            </div>
          )}
        </div>
      )}

      {/* --- 章节 0: 电影标题 --- */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-10">
        <div className={hasStarted ? "animate-entrance" : "opacity-0"}>
          <p className="text-[10px] tracking-[1em] uppercase gold-text mb-10 opacity-60">A Private Screening Of</p>
          <h1 className="text-5xl md:text-7xl font-serif italic mb-8 tracking-wider leading-tight text-white">
            {WEDDING_DETAILS.groom} <br/> 
            <span className="text-2xl opacity-30 my-4 inline-block">&</span> <br/>
            {WEDDING_DETAILS.bride}
          </h1>
          <div className="w-12 h-[1px] bg-gold/40 mx-auto mt-12 mb-10"></div>
          <p className="text-xs font-light tracking-[0.6em] text-white/60">OUR UNIVERSE · OUR STORY</p>
        </div>
      </section>

      {/* --- 故事章节：每一章都是一个电影片段 --- */}
      {STORY_DATA.map((chapter) => (
        <section key={chapter.id} className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={chapter.image} 
              alt={chapter.title}
              className="w-full h-full object-cover ken-burns opacity-60 grayscale-[30%] brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70"></div>
          </div>
          
          <div className="relative h-full flex flex-col justify-end p-12 pb-40">
            <div className="animate-entrance" style={{ animationDelay: '0.5s' }}>
                <p className="text-[9px] tracking-[0.5em] gold-text mb-4 italic font-bold uppercase">{chapter.title}</p>
                <h2 className="text-3xl font-serif mb-8 leading-tight tracking-widest text-white">{chapter.subtitle}</h2>
                {chapter.quote && (
                <p className="text-xs font-light text-white/70 italic max-w-[260px] border-l border-gold/40 pl-6 leading-relaxed">
                    {chapter.quote}
                </p>
                )}
            </div>
          </div>
        </section>
      ))}

      {/* --- 详情章节：正式公告 --- */}
      <section className="min-h-screen flex items-center justify-center bg-black py-32 px-10">
        <div className="w-full max-w-md text-center">
          <div className="space-y-24">
            <div className="space-y-8">
              <p className="text-[10px] tracking-[0.8em] uppercase gold-text opacity-70">Mark The Premiere</p>
              <h3 className="text-6xl font-serif tracking-tighter text-white">{WEDDING_DETAILS.date}</h3>
              <p className="text-lg font-light tracking-[0.4em] italic text-gold/80">{WEDDING_DETAILS.time}</p>
            </div>

            <div className="w-[1px] h-32 bg-gradient-to-b from-gold/60 to-transparent mx-auto"></div>

            <div className="space-y-12">
              <p className="text-2xl font-serif tracking-[0.3em] text-white/90">{WEDDING_DETAILS.location}</p>
              <p className="text-[11px] opacity-50 uppercase tracking-[0.3em] max-w-[240px] mx-auto leading-relaxed font-light">
                {WEDDING_DETAILS.address}
              </p>
              <button 
                className="inline-block mt-8 text-[10px] tracking-[0.6em] uppercase py-5 px-10 border border-gold/30 hover:bg-gold/10 transition-all duration-700 text-gold"
                onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(WEDDING_DETAILS.address)}`)}
              >
                获取导航路线
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 片尾职员表：鸣谢 --- */}
      <section className="min-h-screen flex flex-col items-center justify-center bg-black py-40">
        <div className="text-center space-y-20 w-full max-w-xs">
          {CREDITS.map((item, idx) => (
            <div key={idx} className="space-y-3 opacity-80">
              <p className="text-[9px] tracking-[0.6em] uppercase text-gold/60">{item.role}</p>
              <p className="text-xl font-serif italic tracking-[0.2em] text-white/90">{item.names}</p>
            </div>
          ))}
        </div>

        <div className="mt-40">
          <button 
            onClick={() => setShowRSVP(true)}
            className="group relative px-12 py-5 border border-gold/50 overflow-hidden bg-transparent"
          >
            <span className="relative z-10 text-[11px] tracking-[1em] gold-text uppercase font-bold">领票入场 RSVP</span>
            <div className="absolute inset-0 bg-gold/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-left"></div>
          </button>
        </div>
      </section>

      {/* --- 最终定格 --- */}
      <section className="h-screen flex flex-col items-center justify-center bg-black text-center px-10">
        <h2 className="text-6xl font-serif italic opacity-30 mb-16 tracking-[0.5em] text-white">Fin.</h2>
        <p className="text-[11px] tracking-[1.2em] opacity-40 uppercase gold-text font-bold">敬请光临 · 共证良缘</p>
        <div className="mt-48">
           <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="text-[9px] tracking-[0.8em] opacity-30 hover:opacity-100 transition-all uppercase border-b border-gold/10 pb-3 text-white"
           >
             重新观影
           </button>
        </div>
      </section>

      {/* RSVP Modal - 电影票设计 */}
      {showRSVP && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setShowRSVP(false)}></div>
          <div className="relative w-full max-w-sm bg-zinc-950 border border-gold/30 p-10 text-center animate-entrance overflow-hidden">
            {/* 票根锯齿效果装饰 */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-6 bg-black rounded-b-full border-b border-gold/20"></div>
            
            <h3 className="text-2xl font-serif mb-12 tracking-[0.4em] italic text-gold mt-4">首映礼回执</h3>
            
            <div className="space-y-8 mb-12">
                <div className="relative">
                    <input 
                    type="text" 
                    placeholder="请输入宾客姓名"
                    className="w-full bg-white/5 border-b border-white/20 px-4 py-4 text-sm text-white focus:outline-none focus:border-gold/60 transition-colors text-center tracking-[0.3em] font-light placeholder:text-white/20"
                    value={rsvpName}
                    onChange={(e) => setRsvpName(e.target.value)}
                    />
                </div>
            </div>

            <button 
              className="w-full py-5 bg-gold text-black text-[11px] tracking-[0.8em] uppercase font-bold hover:bg-white transition-all duration-700"
              onClick={() => {
                if(!rsvpName.trim()) return;
                alert(`确认成功！期待 ${rsvpName} 的光临。`);
                setShowRSVP(false);
              }}
            >
              提交确认
            </button>

            <div className="mt-8 border-t border-dashed border-white/10 pt-6">
                <p className="text-[9px] tracking-[0.2em] text-white/30 uppercase">Admit One · Premiere Guest</p>
            </div>
          </div>
        </div>
      )}

      {/* 底部交互指引 */}
      <div className="fixed bottom-24 left-0 w-full text-center z-[1100] pointer-events-none transition-opacity duration-1000" style={{ opacity: isPaused ? 1 : 0.3 }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold/40 to-transparent"></div>
          <p className="text-[8px] tracking-[1.5em] uppercase font-bold text-gold/60">长按暂停观影</p>
        </div>
      </div>
    </div>
  );
};

export default App;