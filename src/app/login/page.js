import Navbar from '../../../components/Navbar';

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LoginPage from "../../../components/LoginForm"; // Login formunu ayrı komponent olarak çağırıyoruz

export default async function Login() {
  const session = await getServerSession(authOptions);

  // Giriş yapılmışsa yönlendir
  if (session) {
    redirect("/profile");
  }

  return (
    <>
      <Navbar />
      <LoginPage />
      
    </>
  );
}

