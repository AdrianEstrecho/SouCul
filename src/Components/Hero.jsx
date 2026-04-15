/*
Estrecho, Adrian M.
Mansilla, Rhangel R.
Romualdo, Jervin Paul C.
Sostea, Joana Marie A.
Torres, Ceazarion Sean Nicholas M.
Tupaen, Arianne Kaye E.

BSIT/IT22S1
*/

import viganImg from "../assets/vigan.png";

export default function Hero({ hero }) {
  return (
    <div className="hero" style={{ backgroundImage: `url(${viganImg})` }}>
      {hero.map((hero) => (
      <div className="hero-content">
        <h1 className="hero-title">
          Explore different{" "}
          <span className="hero-title-highlight">{hero.title}</span>
          {" "}in {hero.place}
        </h1>
        <p className="hero-subtitle">
          The Philippines is rich in diverse cultures, traditions, and languages.
        </p>
        <button className="btn-explore">Explore</button> 
      </div>
      ))}
    </div>
  );
}
