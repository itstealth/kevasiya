"use client";
import React from "react";

export default function AutoplayVideo({ src }: { src: string }) {
  return (
    <div>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="object-cover absolute inset-0 z-0 w-full h-full"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
