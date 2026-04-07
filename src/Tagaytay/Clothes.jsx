import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Clothes(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Tagaytay"
      locationSlug="tagaytay"
      categoryName="Clothes"
      categorySlug="clothes"
    />
  );
}

