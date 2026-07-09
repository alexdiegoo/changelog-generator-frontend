"use client";

import Image from "next/image";
import { LogOutIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useLogout } from "@/hooks/queries/use-auth";

export function UserMenu() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "··";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex shrink-0 items-center justify-center rounded-lg hover:bg-accent hover:text-accent-foreground size-8" aria-label="Account menu">
        <Avatar className="relative size-8">
          {user?.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.username}
              width={32}
              height={32}
              className="absolute inset-0 size-full object-cover"
            />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {user?.username ?? "Signed in"}
              </span>
              <span className="text-xs text-muted-foreground">
                Connected with GitHub
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          variant="destructive"
          disabled={logout.isPending}
          onClick={() => logout.mutate()}
        >
          <LogOutIcon />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}