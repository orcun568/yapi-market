import Navbar from '../../../components/Navbar';
import Basket from '../../../components/Basket';
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import FeaturedProducts from '../../../components/FeaturedProducts';

export default async function Login() {
  const session = await getServerSession(authOptions);

  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className='bg-white min-h-screen'>
      <Navbar />
      <Basket />
      <FeaturedProducts />
    </div>
  );
}

