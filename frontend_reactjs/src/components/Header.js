import React from "react";
import "./styles.css";

// PUBLIC_INTERFACE
export default function Header() {
  /** Application header with brand and subtle gradient. */
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-logo" aria-hidden="true">📝</span>
          <span className="brand-text">Ocean Notes</span>
        </div>
      </div>
    </header>
  );
}
