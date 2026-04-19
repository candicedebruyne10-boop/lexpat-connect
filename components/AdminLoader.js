"use client";

import React from "react";
import dynamic from "next/dynamic";

const AdminDashboard = dynamic(
  () => import("./AdminDashboard"),
  {
    ssr: false,
    loading: () => (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", color: "#1E3A78", fontSize: 15, fontWeight: 600 }}>
        Chargement du tableau de bord…
      </div>
    ),
  }
);

// Error boundary — catches any render-time error in AdminDashboard and
// displays the actual error message so we can diagnose the root cause.
class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[AdminDashboard] Error caught by boundary:", error, info);
  }

  render() {
    if (this.state.error) {
      const err = this.state.error;
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "100vh", background: "#f0f4fb", fontFamily: "Arial, sans-serif",
          padding: "32px 24px", textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#1E3A78", marginBottom: 12 }}>
            Erreur — Admin Dashboard
          </div>
          <div style={{
            background: "#fff", border: "1px solid #e8eef8", borderRadius: 12,
            padding: "20px 24px", maxWidth: 640, width: "100%",
            textAlign: "left", boxShadow: "0 4px 20px rgba(30,58,120,0.07)",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#b91c1c", marginBottom: 8 }}>
              {err.name}: {err.message}
            </div>
            {err.stack && (
              <pre style={{
                fontSize: 11, color: "#4a5568", overflowX: "auto",
                whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0,
                lineHeight: 1.6,
              }}>
                {err.stack.slice(0, 1200)}
              </pre>
            )}
          </div>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              marginTop: 20, padding: "10px 24px", borderRadius: 10,
              background: "#1E3A78", color: "#fff", fontWeight: 700,
              fontSize: 14, border: "none", cursor: "pointer",
            }}
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdminLoader() {
  return (
    <AdminErrorBoundary>
      <AdminDashboard />
    </AdminErrorBoundary>
  );
}
