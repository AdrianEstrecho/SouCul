import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Homeware(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Baguio"
      locationSlug="baguio"
      categoryName="Homeware"
      categorySlug="homeware"
    />
  );
}

