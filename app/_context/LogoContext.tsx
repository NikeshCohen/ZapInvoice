"use client";

import React, { createContext, useContext, useState } from "react";

interface LogoContextType {
  logoData: string;
  setLogoData: (data: string) => void;
  clearLogo: () => void;
}

const LogoContext = createContext<LogoContextType | undefined>(undefined);

export function LogoProvider({ children }: { children: React.ReactNode }) {
  const [logoData, setLogoData] = useState("");

  const clearLogo = () => {
    setLogoData("");
  };

  return (
    <LogoContext.Provider
      value={{
        logoData,
        setLogoData,
        clearLogo,
      }}
    >
      {children}
    </LogoContext.Provider>
  );
}

export function useLogo() {
  const context = useContext(LogoContext);
  if (context === undefined) {
    throw new Error("useLogo must be used within a LogoProvider");
  }
  return context;
}
