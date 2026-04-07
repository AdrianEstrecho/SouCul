import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Homeware(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Boracay"
      locationSlug="boracay"
      categoryName="Homeware"
      categorySlug="homeware"
    />
  );
}

