import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Decorations(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Boracay"
      locationSlug="boracay"
      categoryName="Decorations"
      categorySlug="decorations"
    />
  );
}

