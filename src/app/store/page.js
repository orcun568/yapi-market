import Navbar from '../../../components/Navbar';
import Store from "../../../components/StorePage"; // Login formunu ayrı komponent olarak çağırıyoruz



export default function store() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Store />
    </div>
  );
}