// components/EmbeddedVideo.js
export function EmbeddedVideo({ src, width = 560, height = 315 }) {
  return (
    <iframe 
      width={width} 
      height={height} 
      src={src} 
      frameBorder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen
    ></iframe>
  );
}
