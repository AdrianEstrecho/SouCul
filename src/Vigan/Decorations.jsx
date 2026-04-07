import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Decorations(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Vigan"
      locationSlug="vigan"
      categoryName="Decorations"
      categorySlug="decorations"
    />
  );
}

