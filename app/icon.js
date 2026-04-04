import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff"
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            background: "linear-gradient(145deg, #1e2f86 0%, #24459f 100%)",
            border: "2px solid #183372",
            boxShadow: "0 10px 22px rgba(17,39,87,0.16)",
            position: "relative"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: "-0.08em",
              transform: "translateY(-1px)"
            }}
          >
            L
          </div>
          <div
            style={{
              position: "absolute",
              right: 7,
              bottom: 7,
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#7CCDC7",
              border: "2px solid #ffffff",
              boxShadow: "0 0 0 1px rgba(30,47,134,0.18)"
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
