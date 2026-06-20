import React from "react";
import { QrTemplateProps } from "../../types";

export function MonospaceTerminal({ brandName, headline, subtext, wifiPassword, logoUrl, qrImageUrl, id }: QrTemplateProps) {
  return (
    <div id={id} className="w-[450px] h-[675px] bg-[#0D1117] text-[#58A6FF] flex flex-col relative overflow-hidden box-border p-6 font-mono text-[14px]">
      <div className="w-full h-full border border-[#30363D] bg-[#161B22] p-6 flex flex-col">
        
        {/* Terminal Header */}
        <div className="flex items-center gap-2 border-b border-[#30363D] pb-4 mb-6">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="ml-2 text-[#8B949E] text-[12px]">bash - {brandName.toLowerCase().replace(/\s+/g, '-')}</span>
        </div>

        <div className="flex-grow flex flex-col">
          <div className="text-[#3FB950] mb-2">$ ./start_menu.sh</div>
          
          <div className="flex items-start gap-4 mb-8">
            {logoUrl && (
              <img src={logoUrl} crossOrigin="anonymous" alt="Logo" className="w-[32px] h-[32px] object-contain filter brightness-0 invert opacity-80" />
            )}
            <div className="flex flex-col">
              <h1 className="text-[20px] font-bold text-[#C9D1D9] uppercase">{brandName}</h1>
              <h2 className="text-[#8B949E]">{headline}</h2>
            </div>
          </div>

          <div className="text-[#3FB950] mb-2">$ generate_qr --target=digital_menu</div>
          
          <div className="bg-[#0D1117] border border-[#30363D] p-4 self-start mb-8 inline-block">
            <div className="bg-white p-2">
              <img src={qrImageUrl} crossOrigin="anonymous" alt="QR" className="w-[160px] h-[160px] object-contain mix-blend-multiply" />
            </div>
          </div>

          <div className="text-[#3FB950] mb-2">$ cat info.txt</div>
          <div className="text-[#C9D1D9] mb-4">&gt;&gt; {subtext}</div>

          {wifiPassword && (
            <>
              <div className="text-[#3FB950] mb-2">$ get_network_credentials</div>
              <div className="text-[#C9D1D9] border-l-2 border-[#58A6FF] pl-4">
                SSID: GUEST_NETWORK<br/>
                PASS: <span className="font-bold text-white">{wifiPassword}</span>
              </div>
            </>
          )}

          <div className="mt-auto flex items-center text-[#3FB950] animate-pulse">_</div>
        </div>

      </div>
    </div>
  );
}
