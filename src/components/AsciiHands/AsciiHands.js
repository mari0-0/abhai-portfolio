"use client";

import { useEffect, useRef } from "react";
import "./AsciiHands.css";

const LEFT_HAND = `                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                       ·.,·.                                                    
                     .;=:;>+++;:~-,                                             
                   ?/«[[)\\|=;;:?:?<><\`                                          
                 :[/)(\\ |»]|;>!+?;+!>>!+:~·                                      
               .>\\[[/»(}\\{»[);>;< ::!?:[<<(\`..                                   
           .·~>>»/)(()\\){»|[«[/>+:>=?<<)(?+<;+--~:\`·                             
      ,?[[)()))((/})|([\\ «»»}\\[\\ «};<!!\`;/{»»/)|?+?+:<+<!>^.                       
   .^[[|}/]](()\\}>!?=]{/}\\|[}»[|{)[<>:«»]|}\\]|[]«<;;>>^==>?.                     
 .?]/}}»)|)»»)(;:<<;=;!;!:+>=<\\)}{\\)}][}}\\\\{\\)\\]/])/?>>;;==<~                     
?|})//)|\\ {\\=!:=:?-~^;~;--+>>??\\{([[({}«))(/)}»«][|»]\\}(>++<^,                    
}([]{\\ }{\\/:< :;^;-,,,.···~~?}\\]}|)(«]\\ (»})[/|\\ «}(||\\\\]»)>::                    
\\«]\\|[?>+;;~~-···,·,,-,·,·,·^|»«}}»\\)//[«}/\\«\\)}(\\ [/(»[\\ ]}?~;                   
«])}>;<!=~;^\`:.,.,;^;-~\`~-:.,~+]\\{[[{»\\/{})([}}»\\]«/)((()\\{/:=>~,                 
{/|<;;;==>;;~\`-:·,,^\`-\`~·.,.·.,:[«{[«})\\]}|\\ ]}){};««)}({/|{)»<!:?^,.·             
[?!>=+;:!+:;~:,,.-~..·,,.,,·,.;|/[}»{(»]|/||»\\::==;;?\\)}]}»/><<= :·.·,           
}?<=!<+;>\`;-···-;...···.:^...,?<)«)/«{][/{|}?<;;-:~:</ [[([/\\[[ [:,+;\`:\`.          
<!>::!><-^:,·\`^-·,.,.·:;,,·...<== [{([»\\»\\\\»|:;:,,.·<]+;< {{«)}«|«/\\==:^,        
?++=<==^;^,··.·..,·:.··.···.. .|+=+/}(»{)({)+::·-^=<: :+|«\\=;\\{|{[/\\=+!:·       
:?!;>>-:\`..·.,.,··.,,,··.·     \`)<!= /{|)([)»|)!;,~·.,,·,·=!~·,>«][]]];;\.·       
;=?<=^;-··.··,·····..·,        ·=<:;?}\\[\\ }])«{{^.·.,.·,.  .,·   .=+<:/(»=~.      
=?+=^^:.·.,··.·..,.,·,          ~?<=>+=+(())|\\ {:·  .·  ·,,     .···~^^;};=^      
+<:;;~.,...··,,.,                \`?+:>=?[{(»(}{:-·       ,       ·..,·>:({>,     
=^-^-,,..,·.·.·.                  ·==~<?=}\\\\»]:=<-,    ·,·    ,·,,.,··>+\\]<.    
~:-;,,··.·,·.,,                     ~;:;~//[//»<+?-·    ,,·       ···  ,+!><;    
\`;.\`...··.,.··.                          .<}}«}}{|>::·  ,,,   ....,,. ,  -!=<.   
.,..·,··.,     ,                           ,!««]«(/>< ·,  ·     ,, ·.. ·   -\`;-   
·..·,.·,                                      \`;\\[\\ (>=~.,·.   .·  ...,    :=:,  
,·,,,··,                                       ·!>«=;;:?^         ·...    ·<+~  
.,,.,·· .                                        ,;:;:;;:.·       .·.·     ;>^, 
·,,·.                                             ·?!>::+==,     ,  ,,·       ;-~ 
,,·.                                               ·;>::~\`;,     ·  ,,           
.,·     ·                                           .<! -,:\`:       ..,          
··,   ,                                              :·.;+=~,       ·.          
,.                                                   ·^..=<;~     ,  ·.          
                                                     :;,.;;^,     ,  ,,. ,       
                                                     ·:·  ,,      .  ., ·       
                                                     .:               ·,        `;

const RIGHT_HAND = `                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                                
                                                                               .
                                                                  ·\`;^--;=:;>\\\\
                                                              ,?«}|[/«[[)\\|»»}]
                                                     ,-\`\`;-<|[/)(\\ |»]|»){\\[»\\{)
                                                   ~+}}/|/{)\\[[/»(}\\{»[)»[»(}«}]
                                          ·\`;\`--:>[|{))»/)(()\\){»|[«[/)/})|](\\)(]
                                    ·,;-?}/(\\(/»{][[)()))((/})|([\\ «»»}\\[\\ «}»(]{«
                                  ~;»/)|[/[/}\\\\(})»]){»[[|}/]](()\\}[!?=]{/}\\|[}»[
                               .>[))««»]|}\\]|[]«(«»)[«||>?>?!?]/::;>=>;»)(»})(|»
           ,,,·.··      ·.,..~:\\\\{\\)\\]/])/[))»|/\\{«[|}>++>=<~;=!:=:??:;(}([{\\)]]
         ,<>[(!:«>><:\`;«][|»]\\}()//(»}{}([]{\\ }{\\/<(«;;<<<-~~^\`:+<!:?:\\]}|)(«]\\(
     ~>>/|\\ «}(||\\\\]»))}|»\\«]\\|[[[/««}}[(\\|»\\»«]:+!\\;;^=;;:~^;\`:;>::=+;\\)}(\\[/(»[
 ·.:[{(])«]):\`;\\{|}\\«(|)}»(«<?})}?={«}\\]\\{[[{»\\=~~\`..~!;+?^\`:\`\`;\`;!=:=>\\{«/)|{/|(\\
,||)(}>!++;^^\`->!+>!?(){|[«{?^!>+-:|\\]}){}»««)<~··,.^<!^-^~-=^\`-!>=+;:{/|\\}|{{[
.{)?=:^.,,·,.,··-~^~;;]|/||»+~,··<»]\\)}]}»/[((=::.·,·,-\`:~;+;>><??=+=!<>])((/)/«)
 .\`~.·.,        ·,..·<]|!=(/>.·-/\\[[[«\\«(|)[}»<-.,,,.·.^::<<;?+!?:<+=<!;+{[{(/|[
                     ·:»=~:[=\`.+«({{«>!«|«/\\|=~^.,..···\`::^;^^:;-:-\`^::>=<>+++>?
                      ·\`:··;:~<»{)({)+:+|]«|<=:···,····,:~\`:;:;-:;:-~^\`\`-:>>?;<! 
                        ,··-,^}\\(]|\\::\`\`\`!|=!=\`..,·..·,,·.,,·,··~~:~>;?????;;\`:>
                        ·-.::\\[|()+^··;++\`-:,·..··.,,.,·.·,..,,,,.·\`^-+;?+>:;::
                       .\`:+(«/(»=:\`.·.··^^·-·.,··.·..,.,·,·,.,.··.;:;;\`\`\`:;-^::\`
                      ·»[/»«[»+\`:···,,,,,,·,·,··,··,.,...··,,.,.-^^\`\`-;~\`:-\`~;^
                    ·~!«](\\]]?~,·.·,.,·..,·.,·,.,.·,.,.        ,·.;\`:\`\`-^\`;:··~\`
                  .·:\\+»]}=<-,·.·^:\`,,.,·,,.,··.··...,            ,··-:^:-,,.,.~
                 <»{\\|<:/+-:·,.;?[|<.,,·.·,,·..···.,,                 ·,..·.....
                 +>»(||[;\`~,··,^](}}:,~-·.··.,,,,.,.                         ,,.
                 <;[;!{|<\`,.~?.·^|\\];^-:+~^,,·,.,,                              
                 ,<=><+^;··!+=,,,+)[<=;~??>;;-,·..                               
                   .:,,  -[(=;··  ·\`+<>:,!;;-^,                                 
                   +!:..-:<:~··  ^;,·^~~··~\`,                                   
                   >::··:!\`^·,   »;;.                                           
                  .!|^·.+!;.,   \`»<;,                                           
                  ·:=:,·>:;^,  ,;:-·.                                           
                  :;\`.·./=!·   ,^,·,                                            
                  :?\`,,~=?:.   .-.,·                                            
                  ·|:.,«>,,    ·;^·                                             
                  .:|^,|!:,    ,!=;·                                            
                   =»\`,}}\`·    ,=|<.                                            
                   :/-.{»:,    ,;»\\.·                                            
                   :>\`·{?^      :+>                                             
                   \`?\`,\`;·       ,                                              `;

// Escape a character for safe innerHTML insertion
function escChar(ch) {
  if (ch === '<') return '&lt;';
  if (ch === '>') return '&gt;';
  if (ch === '&') return '&amp;';
  return ch;
}

export default function AsciiHands() {
  const sectionRef = useRef(null);
  const leftPreRef = useRef(null);
  const rightPreRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const rafRef = useRef(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const leftPre = leftPreRef.current;
    const rightPre = rightPreRef.current;
    const section = sectionRef.current;
    if (!leftPre || !rightPre || !section) return;

    // Parse lines once
    const leftLines = LEFT_HAND.split('\n');
    const rightLines = RIGHT_HAND.split('\n');

    // Set plain text initially
    leftPre.textContent = LEFT_HAND;
    rightPre.textContent = RIGHT_HAND;

    // Noise state: Map<"row,col", expiryTimestamp>
    const leftNoise = new Map();
    const rightNoise = new Map();

    // Track whether innerHTML is dirty (has spans)
    let leftDirty = false;
    let rightDirty = false;

    // Calculate which character the mouse is over
    function getCharAt(pre, lines, clientX, clientY) {
      const rect = pre.getBoundingClientRect();
      const numRows = lines.length;
      const numCols = 80;
      const charW = rect.width / numCols;
      const charH = rect.height / numRows;
      const col = Math.floor((clientX - rect.left) / charW);
      const row = Math.floor((clientY - rect.top) / charH);
      return { row, col };
    }

    // Add noise around a character position
    function addNoise(lines, noiseMap, row, col) {
      const now = Date.now();
      const radius = 3;
      for (let r = row - radius; r <= row + radius; r++) {
        if (r < 0 || r >= lines.length) continue;
        for (let c = col - radius; c <= col + radius; c++) {
          if (c < 0 || c >= lines[r].length) continue;
          if (lines[r][c] === ' ') continue;
          if (Math.random() > 0.25) continue; // ~25% chance
          noiseMap.set(`${r},${c}`, now + 200 + Math.random() * 400);
        }
      }
    }

    // Build innerHTML with noise spans, or restore plain text
    function rebuildPre(pre, lines, noiseMap, text) {
      const now = Date.now();

      // Purge expired entries
      for (const [key, expiry] of noiseMap) {
        if (now >= expiry) noiseMap.delete(key);
      }

      if (noiseMap.size === 0) {
        return false; // signal: no noise active
      }

      // Build HTML — only wrap noised chars in spans
      let html = '';
      for (let r = 0; r < lines.length; r++) {
        const line = lines[r];
        for (let c = 0; c < line.length; c++) {
          const esc = escChar(line[c]);
          if (noiseMap.has(`${r},${c}`)) {
            html += `<span class="ascii-noise">${esc}</span>`;
          } else {
            html += esc;
          }
        }
        if (r < lines.length - 1) html += '\n';
      }
      pre.innerHTML = html;
      return true; // signal: noise is active
    }

    // Throttled mousemove handler
    let lastMove = 0;
    const onMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMove < 60) return;
      lastMove = now;

      // Check left pre
      const lRect = leftPre.getBoundingClientRect();
      if (e.clientX >= lRect.left && e.clientX <= lRect.right &&
        e.clientY >= lRect.top && e.clientY <= lRect.bottom) {
        const { row, col } = getCharAt(leftPre, leftLines, e.clientX, e.clientY);
        addNoise(leftLines, leftNoise, row, col);
      }

      // Check right pre
      const rRect = rightPre.getBoundingClientRect();
      if (e.clientX >= rRect.left && e.clientX <= rRect.right &&
        e.clientY >= rRect.top && e.clientY <= rRect.bottom) {
        const { row, col } = getCharAt(rightPre, rightLines, e.clientX, e.clientY);
        addNoise(rightLines, rightNoise, row, col);
      }
    };
    section.addEventListener('mousemove', onMouseMove);

    // Global mouse tracking for parallax
    const onGlobalMouseMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onGlobalMouseMove);

    // IntersectionObserver — only animate when visible
    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.05 }
    );
    observer.observe(section);

    // Animation loop
    let curX = 0.5, curY = 0.5;

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      if (!isVisibleRef.current) return;

      // --- Parallax ---
      const { x, y } = mouseRef.current;
      curX += (x - curX) * 0.04;
      curY += (y - curY) * 0.025;

      const offsetY = (curY - 0.5) * 12;
      const spreadX = (curX - 0.5) * 20;

      leftPre.style.transform = `translate(${-spreadX}px, ${offsetY}px)`;
      rightPre.style.transform = `translate(${spreadX}px, ${offsetY}px)`;

      // --- Noise rebuild ---
      const lActive = rebuildPre(leftPre, leftLines, leftNoise, LEFT_HAND);
      if (!lActive && leftDirty) {
        leftPre.textContent = LEFT_HAND;
        leftDirty = false;
      } else if (lActive) {
        leftDirty = true;
      }

      const rActive = rebuildPre(rightPre, rightLines, rightNoise, RIGHT_HAND);
      if (!rActive && rightDirty) {
        rightPre.textContent = RIGHT_HAND;
        rightDirty = false;
      } else if (rActive) {
        rightDirty = true;
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      section.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousemove', onGlobalMouseMove);
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="ascii-hands-section" ref={sectionRef}>
      <div className="ascii-hands-wrap">
        <div className="ascii-hand left">
          <pre ref={leftPreRef}></pre>
        </div>
        <div className="ascii-hand right">
          <pre ref={rightPreRef}></pre>
        </div>
      </div>
    </section>
  );
}
