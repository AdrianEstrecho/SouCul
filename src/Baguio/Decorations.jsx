import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Decorations(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Baguio"
      locationSlug="baguio"
      categoryName="Decorations"
      categorySlug="decorations"
    />
  );
}

