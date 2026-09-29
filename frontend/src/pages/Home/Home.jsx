import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import Search from "../../components/Search/Search";
import Categories from "../../components/Categories/Categories";
import FeaturedEvents from "../../components/FeaturedEvents/FeaturedEvents";
import Testimonials from "../../components/Testimonials/Testimonials";
import Footer from "../../components/Footer/Footer";
import Events from "../Events/Events";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Search/>
      <Categories/>
      <FeaturedEvents/>
      <Testimonials/>
      <Footer/>
      {/* <Events/> */}
    </>
  );
}

export default Home;