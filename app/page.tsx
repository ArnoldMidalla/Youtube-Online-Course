import { Button } from "@/components/ui/button";
import Link from "next/link";

import {
  Brain,
  Building,
  CircleDollarSign,
  Focus,
  GraduationCap,
  Signal,
  Trophy,
  Users,
  Youtube,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="h-[80vh] w-full px-30 flex items-center justify-between">
        <div className="flex flex-col gap-4 justify-center">
          <div className="flex flex-col gap-2">
            <h1 className="font-black text-5xl tracking-tight leading-12">
              Learn Anything
              <br />
              Anytime <br />
              <span className="text-purple-700">Free on YouTube.</span>
            </h1>
            <p className="max-w-120 tracking-tight leading-5">
              Stop wasting time searching for the right tutorials. We transform
              YouTube videos into structured courses with progress tracking,
              notes, and certificates.
            </p>
          </div>
          <div className="flex gap-4">
            <Button className="bg-purple-700">
              <Link href={`/`}>Start Learning Free</Link>
            </Button>
            <Button variant="outline" className="">
              <Link href={`/`}>Browse Courses</Link>
            </Button>
          </div>
          <div className="bg-gray-100 flex w-fit p-4 gap-8 rounded-lg">
            <div>
              <h3 className="text-purple-700 font-bold text-xl">2.5k+</h3>
              <p className="text-gray-700 text-xs font-semibold">
                Expert-Led Courses
              </p>
            </div>
            <div>
              <h3 className="text-purple-700 font-bold text-xl">500k+</h3>
              <p className="text-gray-700 text-xs font-semibold">
                Active Learners
              </p>
            </div>
            <div>
              <h3 className="text-purple-700 font-bold text-xl">2m+</h3>
              <p className="text-gray-700 text-xs font-semibold">
                Lessons Completed
              </p>
            </div>
          </div>
        </div>
        <img src="/usephone.jpg" alt="placeholder" className="h-70" />
      </section>
      <section className="px-30 flex flex-col gap-6 pb-12">
        <div>
          <h1 className="text-3xl font-bold text-center">Why Choose Us?</h1>
          <p className="text-center text-sm font-regular">
            We make learning effective, enjoyable, and personalized-so you stay
            motivated and actually finish what you start
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="border-1 p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 duration-300">
            <Focus
              className="text-orange-600 bg-orange-50 p-2 rounded-md scale-90"
              size={"40px"}
            />
            <h3 className="font-bold">Focused Learning</h3>
            <p className="text-xs font-medium text-gray-700">
              No random autoplay, just curated playlists that feel like real
              courses.
            </p>
          </div>
          <div className="border-1 p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 duration-300">
            <Brain
              className="text-purple-600 bg-purple-50 p-2 rounded-md scale-90"
              size={"40px"}
            />
            <h3 className="font-bold">Learn Smarter</h3>
            <p className="text-xs font-medium text-gray-700">
              Reduce manual errors and save hours every.
            </p>
          </div>
          <div className="border-1 p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 duration-300">
            <Trophy
              className="text-blue-600 bg-blue-50 p-2 rounded-md scale-90"
              size={"40px"}
            />
            <h3 className="font-bold">Earn Certificates</h3>
            <p className="text-xs font-medium text-gray-700">
              Show off your skills when you complete a course.
            </p>
          </div>
          <div className="border-1 p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 duration-300">
            <Youtube
              className="text-green-600 bg-green-50 p-2 rounded-md scale-90"
              size={"40px"}
            />
            <h3 className="font-bold">Built on YouTube</h3>
            <p className="text-xs font-medium text-gray-700">
              The world's biggest library of free knowledge, made structured.
            </p>
          </div>
        </div>
      </section>
      <section className="px-30 flex flex-col gap-6 pb-12">
        <div>
          <h1 className="text-3xl font-bold text-center">Popular Categories</h1>
          <p className="text-center text-sm font-regular">
            See whats trending with our learners
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="border-1 p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 duration-300">
            <h1 className="absolute text-9xl font-bold text-gray-200  translate-x-40 blur-md hover:blur-none duration-300">1</h1>
            <Focus
              className="text-orange-600 bg-orange-50 p-2 rounded-md scale-90"
              size={"40px"}
            />
            <h3 className="font-bold">Programming</h3>
            <p className="text-xs font-medium text-gray-700">
              <ul>
                <li>Python</li>
                <li>Javascript</li>
                <li>Web Development</li>
              </ul>
            </p>
          </div>
          <div className="border-1 p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 duration-300">
            <h1 className="absolute text-9xl font-bold text-gray-200  translate-x-40 blur-md hover:blur-none duration-300">2</h1>
            <Brain
              className="text-purple-600 bg-purple-50 p-2 rounded-md scale-90"
              size={"40px"}
            />
            <h3 className="font-bold">Design</h3>
            {/* <p className="text-xs font-medium text-gray-700">
              Reduce manual errors and save hours every.
            </p> */}
          </div>
          <div className="border-1 p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 duration-300">
            <h1 className="absolute text-9xl font-bold text-gray-200  translate-x-40 blur-md hover:blur-none duration-300">3</h1>
            <Trophy
              className="text-blue-600 bg-blue-50 p-2 rounded-md scale-90"
              size={"40px"}
            />
            <h3 className="font-bold">Business</h3>
            {/* <p className="text-xs font-medium text-gray-700">
              Show off your skills when you complete a course.
            </p> */}
          </div>
          <div className="border-1 p-4 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 duration-300">
            <h1 className="absolute text-9xl font-bold text-gray-200  translate-x-40 blur-md hover:blur-none duration-300">4</h1>
            <Youtube
              className="text-green-600 bg-green-50 p-2 rounded-md scale-90"
              size={"40px"}
            />
            <h3 className="font-bold">Lifestyle</h3>
            <p className="text-xs font-medium text-gray-700">
              The world's biggest library of free knowledge, made structured.
            </p>
          </div>
        </div>
      </section>
      <section className="py-12 px-30">
        <div className="bg-purple-700 text-white p-4 rounded-xl flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">Ready to grow with Skillery?</h1>
            <p className="text-sm font-regular">
              Join over 500,000 learners and start your journey today!
            </p>
          </div>
          <Button className="bg-white w-fit">
            <Link className="text-purple-700" href={`/signup`}>
              Get Started
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
