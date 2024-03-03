"use client"

import * as React from "react"
import Link from "next/link"

import { NAME, cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const Name = NAME;

const components: { title: string; href: string}[] = [
  {
    title: "Gestión de producto 🚧",
    href: "/gestion-producto",
  },
  {
    title: "Pizarra Online",
    href: "/pizarra-online",
  },
  {
    title: "Equipos de Ingeniería 🚧",
    href: "/equipos-de-ingenieria",
  },
  {
    title: "Mapa Conceptual ",
    href: "/mapa-conceptual",
  },
  {
    title: "Equipos de IT 🚧",
    href: "/equipos-de-it",
  },
  {
    title: "Wireframes 🚧",
    href: "/wireframes",
  },
  {
    title: "Marketing 🚧",
    href: "/marketing",
  },
  {
    title: "Mapas mentales 🚧",
    href: "/mapas-mentales",
  },
  {
    title: "Agencias y Consultorías 🚧",
    href: "/agencias-consultorías",
  },
  {
    title: "Diseño 🚧",
    href: "/diseno",
  },
  {
    title: "Ventas 🚧",
    href: "/ventas",
  },
  {
    title: "Lluvia de Ideas 🚧",
    href: "/lluvia-de-ideas",
  },
]

export function NavigationMenuLanding() {
  return (
    <NavigationMenu className="hidden xl:flex xl:flex-col">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>¿Qué es {Name}</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-8 md:w-[500px] lg:w-[300px]">
              <p className="px-3 text-[13px]">Producto</p>
              <ListItem href="/product-overview" title={`Descripción de ${Name} 🚧`}/>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Soluciones</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-10 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <p className="px-3 text-[13px]">Por equipo</p>
              <p className="px-3 text-[13px]">Por caso de uso</p>
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
        <Link href="/blog">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blog
            </NavigationMenuLink>
          </Link>
          <Link href="/pricing" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Precios
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:underline",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
