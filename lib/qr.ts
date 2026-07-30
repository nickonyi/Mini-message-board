import QRCode from "qrcode"

export async function generateQrDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: "M",
    margin: 2,
    scale: 8,
    color: {
      dark: "#1e2a4a",
      light: "#ffffff",
    },
  })
}
