import {
  CalendarCheck,
  Inbox,
  LayoutDashboard,
  LogOut,
  Presentation,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <section className="h-full fixed w-40 bg-white flex justify-center py-8">
      <div className="flex flex-col gap-12">
        <nav className="">
          <p className="text-center text-gray-700 text-sm font-semibold">
            Overview
          </p>
          <div className="flex flex-col gap-2">
            <Link href="" className="flex items-center gap-1">
              <LayoutDashboard size={22} />
              <p className="font-semibold text-sm">Dashboard</p>
            </Link>
            <Link href="" className="flex items-center gap-1">
              <Inbox size={22} />
              <p className="font-semibold text-sm">Inbox</p>
            </Link>
            <Link href="" className="flex items-center gap-1">
              <Presentation size={22} />
              <p className="font-semibold text-sm">Lesson</p>
            </Link>
            <Link href="" className="flex items-center gap-1">
              <CalendarCheck size={22} />
              <p className="font-semibold text-sm">Task</p>
            </Link>
            <Link href="" className="flex items-center gap-1">
              <Users size={22} />
              <p className="font-semibold text-sm">Group</p>
            </Link>
          </div>
        </nav>
        <div>
          <p className="text-center text-gray-700 text-sm font-semibold">
            Friends
          </p>
          <p className="font-semibold text-sm">None Yet</p>
        </div>
        <div>
          <Link href="" className="flex items-center gap-1">
            <Settings size={22} />
            <p className="font-semibold text-sm">Settings</p>
          </Link>
          <Link href="" className="flex items-center gap-1">
            <LogOut size={22} />
            <p className="font-semibold text-sm">LogOut</p>
          </Link>
        </div>
      </div>
    </section>
  );
}
