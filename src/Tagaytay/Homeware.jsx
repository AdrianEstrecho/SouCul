import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Homeware(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Tagaytay"
      locationSlug="tagaytay"
      categoryName="Homeware"
      categorySlug="homeware"
    />
  );
}

