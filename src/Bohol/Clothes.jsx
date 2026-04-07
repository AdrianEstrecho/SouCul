import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Clothes(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Bohol"
      locationSlug="bohol"
      categoryName="Clothes"
      categorySlug="clothes"
    />
  );
}

