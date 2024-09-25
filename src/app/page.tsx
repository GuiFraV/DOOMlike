import Game from "../components/Game";

export default function Home() {
  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          color: "white",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          zIndex: 100,
        }}
      >
        Utilisez les flèches pour vous déplacer :<br />
        Z : Avancer
        <br />
        S : Reculer
        <br />
        Q : Tourner à gauche
        <br />D : Tourner à droite
      </div>
      <Game />
    </div>
  );
}
