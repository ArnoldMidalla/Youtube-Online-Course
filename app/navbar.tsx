import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import * as React from "react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

export default async function NavigationMenuDemo() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  // if (error || !data?.user) {
  //   redirect("/login");
  // }

  return (
    <header className="w-full h-16 sticky top-0 bg-white flex items-center justify-between px-12 z-60">
      <div className="font-bold">Skillery</div>
      {data.user ? (
        <Link href="/profile">
          <div className="flex gap-4 items-center text-sm font-bold">
            {data.user.user_metadata.name}
            {/* <Button>Sign In</Button>
          <Button>Sign Up</Button> */}
            <Avatar>
              <AvatarImage src={data.user.user_metadata.avatar_url} />
              {/* <AvatarFallback>{data.user.user_metadata.name}</AvatarFallback> */}
              <AvatarFallback className="overflow-hidden">
                <img
                  src="/Default@1080x-100.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </AvatarFallback>
            </Avatar>
          </div>
        </Link>
      ) : null}
      <nav>
        <NavigationMenu viewport={false} className="sticky top-0 bg-white z-60">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Courses</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="/courses">View All</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Software Development</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Design</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Personal Development</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Graphic Design</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Photography</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Community</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-4">
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href="#">Components</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Documentation</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="#">Blocks</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/pricing">Pricing</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/about">About Us</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {data.user ? null : (
              <NavigationMenuItem className="">
                <NavigationMenuLink
                  asChild
                  className={"text-white bg-purple-800 px-4"}
                >
                  <Link href="/login">login</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {/* <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/contact">Contact Us</Link>
              </NavigationMenuLink>
            </NavigationMenuItem> */}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>
    </header>
  );
}

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
