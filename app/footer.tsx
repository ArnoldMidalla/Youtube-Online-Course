import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <section className="w-full h-50 bg-gray-100 flex justify-between items-center px-30">
      <div className="">
        <h1 className="font-bold">Skillery</h1>
        <p className="text-sm font-medium max-w-100">
          Skillery is a modern online learning platform that helps you gain
          in-demand skills through expert-led courses, personalized learning
          paths, and a vibrant community - all in one place
        </p>
        <Button className="bg-purple-700">
          <Link className="text-xs font-bold" href={`/contact`}>
            Contact Us
          </Link>
        </Button>
      </div>
      <div className="font-bold text-sm flex flex-col gap-2">
        <h3 className="text-purple-700">Quick Links</h3>
        <div className="flex flex-col text-xs">
          <Link href={`/`}>Home</Link>
          <Link href={`/courses`}>Courses</Link>
          <Link href={`/about`}>About Us</Link>
        </div>
      </div>
    </section>
  );
}
