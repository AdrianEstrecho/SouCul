import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Homeware(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Vigan"
      locationSlug="vigan"
      categoryName="Homeware"
      categorySlug="homeware"
    />
  );
}

