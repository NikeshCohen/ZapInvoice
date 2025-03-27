"use client";

import React, {
  MutableRefObject,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

import SignatureCanvas from "react-signature-canvas";

interface SignatureContextType {
  signatureData: string;
  signatureRef: MutableRefObject<SignatureCanvas | null>;
  clearSignature: () => void;
  handleCanvasEnd: () => void;
}

const SignatureContext = createContext<SignatureContextType | undefined>(
  undefined,
);

export function SignatureProvider({ children }: { children: React.ReactNode }) {
  const [signatureData, setSignatureData] = useState("");
  const signatureRef = useRef<SignatureCanvas | null>(null);

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureData("");
    }
  };

  const handleCanvasEnd = () => {
    if (signatureRef.current) {
      const dataUrl = signatureRef.current.toDataURL("image/png");
      setSignatureData(dataUrl);
    }
  };

  return (
    <SignatureContext.Provider
      value={{
        signatureData,
        signatureRef,
        clearSignature,
        handleCanvasEnd,
      }}
    >
      {children}
    </SignatureContext.Provider>
  );
}

export function useSignature() {
  const context = useContext(SignatureContext);
  if (context === undefined) {
    throw new Error("useSignature must be used within a SignatureProvider");
  }
  return context;
}
