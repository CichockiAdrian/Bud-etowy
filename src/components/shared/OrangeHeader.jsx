import React from "react";

export default function OrangeHeader({ children, className = "" }) {
  return (
    <div
      className={`bg-gradient-to-br from-orange-400 to-orange-500 text-white px-5 pb-8 rounded-b-3xl ${className}`}
      style={{ paddingTop: "calc(2.5rem + env(safe-area-inset-top))" }}
    >
      {children}
    </div>
  );
}
