"use client"

import { useEffect, useState } from "react"
import { generateQrDataUrl } from "@/lib/qr"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export function QrDisplay({
  value,
  size = 220,
  className,
  onReady,
}: {
  value: string
  size?: number
  className?: string
  onReady?: (dataUrl: string) => void
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    generateQrDataUrl(value)
      .then((url) => {
        if (!active) return
        setDataUrl(url)
        onReady?.(url)
      })
      .catch(() => {})
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-2xl bg-white p-3 ring-1 ring-border",
        className,
      )}
      style={{ width: size + 24, height: size + 24 }}
    >
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl || "/placeholder.svg"}
          alt={`QR code for pass ${value}`}
          width={size}
          height={size}
          className="rounded-lg"
        />
      ) : (
        <Skeleton style={{ width: size, height: size }} className="rounded-lg" />
      )}
    </div>
  )
}
