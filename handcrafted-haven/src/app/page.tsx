import HeroImg from "./ui/landing-page/hero-img";
import ProductTypesWrapper from "./ui/landing-page/product-type";
import FeaturedProductsWrapper from "./ui/landing-page/FeaturedProductsWrapper";
import SiteInfoWrapper from "./ui/landing-page/site-info";

export default function Home() {
  return (
    <div>
      {/* landing page */}
      <HeroImg />
      <ProductTypesWrapper />
      <FeaturedProductsWrapper/>
      <SiteInfoWrapper />
    </div>
  );
}
