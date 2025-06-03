import Navbar from '../../components/Navbar';
import FeaturedProducts from '../../components/FeaturedProducts';
import BKSlider from '../../components/Slider';



export default function CartPage() {
  return (
    <div className='bg-white min-h-screen'>
      <Navbar /> {/* Navbar bileşenini ekliyoruz */}
      <BKSlider /> {/* Slider bileşenini ekliyoruz */}
      <FeaturedProducts/> {/* Öne Çıkan Ürünler bileşenini ekliyoruz */}
    </div>
  );
}

