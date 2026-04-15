/*
Estrecho, Adrian M.
Mansilla, Rhangel R.
Romualdo, Jervin Paul C.
Sostea, Joana Marie A.
Torres, Ceazarion Sean Nicholas M.
Tupaen, Arianne Kaye E.

BSIT/IT22S1
*/

import { useNavigate } from "react-router-dom";

const categories = ["Clothes", "Handicrafts", "Delicacies", "Decorations", "Homeware"];

export default function Categories({ activeCategory, onSelect, location = "Vigan" }) {
  const navigate = useNavigate();

  const handleClick = (cat) => {
    onSelect(cat);
    navigate(`/${location}/${cat}`);
  };

  return (
    <div className="category-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-btn ${activeCategory === cat ? "active" : ""}`}
          onClick={() => handleClick(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}