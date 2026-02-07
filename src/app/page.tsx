import { Header } from "@/app/components/Header";
import { Hero } from "@/app/components/Hero";
import { Problem } from "@/app/components/Problem";
import { Solution } from "@/app/components/Solution";
import { Features } from "@/app/components/Features";
import { Stats } from "@/app/components/Stats";
import { Testimonials } from "@/app/components/Testimonials";
import { Pricing } from "@/app/components/Pricing";
import { CTA } from "@/app/components/CTA";
import { Footer } from "@/app/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <Stats />
      <Testimonials />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
