import React from "react";

interface InteractionMessageProps {
  show: boolean;
}

const InteractionMessage: React.FC<InteractionMessageProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
      }}
    >
      Appuyez sur [Entrée] pour ouvrir/fermer la porte
    </div>
  );
};

export default InteractionMessage;
