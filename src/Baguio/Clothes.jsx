/*
Estrecho, Adrian M.
Mansilla, Rhangel R.
Romualdo, Jervin Paul C.
Sostea, Joana Marie A.
Torres, Ceazarion Sean Nicholas M.
Tupaen, Arianne Kaye E.

BSIT/IT22S1
*/

import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Clothes(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Baguio"
      locationSlug="baguio"
      categoryName="Clothes"
      categorySlug="clothes"
    />
  );
}

