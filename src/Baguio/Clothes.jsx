import LocationCategoryPage from "../Components/LocationCategoryPage";

export default function Clothes(props) {
  return (
    <LocationCategoryPage
      {...props}
      locationName="Baguio"
      locationSlug="baguio"
      categoryName="Clothes"
      categorySlug="clothes"
    />
  );
}

