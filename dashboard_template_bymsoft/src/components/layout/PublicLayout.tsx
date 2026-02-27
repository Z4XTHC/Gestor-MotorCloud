import React from "react";
import ParticlesBg from "./ParticlesBg";
import ColorPalette from "../ColorPalette";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(to bottom, #13022C 20%, #1A3A69 50%, #1DCBF2 100%)",
      }}
    >
      <ParticlesBg />

      {/* Small logo in the corner (kept) - increased size */}
      <div className="absolute top-6 -left-60 sm:block hidden z-20">
        <img
          src="/images/img/LogoMangoSoft.png"
          alt="MangoSoft"
          className="w-[50rem] h-20 object-contain drop-shadow-md"
        />
      </div>

      <main role="main" className="relative z-10 w-full max-w-md">
        {children}
      </main>
    </div>
  );
}
