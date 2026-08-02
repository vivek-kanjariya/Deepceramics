import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FFF7F3",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#FF6A2E",
          }}
        >
          Deep Ceramics.
        </div>

        <div
          style={{
            marginTop: 20,
            fontSize: 30,
            color: "#333",
          }}
        >
          Premium Tiles • Sanitaryware • Bathroom Fittings
        </div>

        <div
          style={{
            marginTop: 40,
            fontSize: 24,
            color: "#666",
          }}
        >
          Ahmedabad, Gujarat
        </div>
      </div>
    ),
    size
  );
}