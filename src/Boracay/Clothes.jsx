import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Clothes(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Boracay"
      locationSlug="boracay"
      categoryName="Clothes"
      categorySlug="clothes"
    />
  );
}

