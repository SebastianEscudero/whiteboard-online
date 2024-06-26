import { ResetForm } from "@/components/auth/reset-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | Sketchlie | Pizarra Online para colaborar",
  description: "La plataforma de colaboración donde puedes convertir tus ideas en realidad. Hecha para que equipos puedan colaborar, diseñar y innovar. Construye el futuro con nosotros",
  keywords: ["sketchlie register", "sketchlie sign up", "sketchlie", "sketchlie new password", "sketchlie reset password", "sketchlie contrasena",],
  alternates: {
    canonical: "https://www.sketchlie.com/auth/reset/",
  }
}

const ResetPage = () => {
  return ( 
    <ResetForm />
  );
}
 
export default ResetPage;