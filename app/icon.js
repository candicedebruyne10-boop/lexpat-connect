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
            width: 56,
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 18,
            background: "linear-gradient(145deg, #ffffff 0%, #f3f8fc 100%)",
            border: "2px solid #d9e9f1",
            boxShadow: "0 8px 18px rgba(17,39,87,0.10)",
            position: "relative"
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
              border: "3px solid #1E3A78",
              color: "#1E3A78",
              fontSize: 21,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              background: "#ffffff"
            }}
          >
            L
          </div>
          <div
            style={{
              position: "absolute",
              right: 8,
              bottom: 8,
              width: 10,
              height: 10,
              borderRadius: 999,
              background: "#7CCDC7",
              border: "2px solid #ffffff"
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
