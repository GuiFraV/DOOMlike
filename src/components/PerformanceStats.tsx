import React, { useEffect, useRef } from "react";
import Stats from "stats.js";

const PerformanceStats: React.FC = () => {
  const fpsRef = useRef<Stats | null>(null);
  const msRef = useRef<Stats | null>(null);
  const mbRef = useRef<Stats | null>(null);

  useEffect(() => {
    // FPS
    fpsRef.current = new Stats();
    fpsRef.current.showPanel(0);
    fpsRef.current.dom.style.cssText = "position:absolute;top:0px;right:0px;";
    document.body.appendChild(fpsRef.current.dom);

    // MS
    msRef.current = new Stats();
    msRef.current.showPanel(1);
    msRef.current.dom.style.cssText = "position:absolute;top:48px;right:0px;";
    document.body.appendChild(msRef.current.dom);

    // MB
    mbRef.current = new Stats();
    mbRef.current.showPanel(2);
    mbRef.current.dom.style.cssText = "position:absolute;top:96px;right:0px;";
    document.body.appendChild(mbRef.current.dom);

    const animate = () => {
      fpsRef.current?.begin();
      msRef.current?.begin();
      mbRef.current?.begin();

      // Ici, vous pouvez ajouter votre logique de rendu ou d'animation

      fpsRef.current?.end();
      msRef.current?.end();
      mbRef.current?.end();

      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    return () => {
      console.log("Démontage du composant PerformanceStats");

      if (
        fpsRef.current &&
        fpsRef.current.dom &&
        fpsRef.current.dom.parentNode === document.body
      ) {
        document.body.removeChild(fpsRef.current.dom);
      }
      if (
        msRef.current &&
        msRef.current.dom &&
        msRef.current.dom.parentNode === document.body
      ) {
        document.body.removeChild(msRef.current.dom);
      }
      if (
        mbRef.current &&
        mbRef.current.dom &&
        mbRef.current.dom.parentNode === document.body
      ) {
        document.body.removeChild(mbRef.current.dom);
      }
    };
  }, []);

  return null;
};

export default PerformanceStats;
