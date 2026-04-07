import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Clothes(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Vigan"
      locationSlug="vigan"
      categoryName="Clothes"
      categorySlug="clothes"
    />
  );
}

