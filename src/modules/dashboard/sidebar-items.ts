import {
    Home,
    Video,
    Bot,
    Calendar,
    Settings,
    User,
    type LucideIcon
} from "lucide-react";

export interface SidebarItem {
    label: string;
    href: string;
    icon: LucideIcon;
}

export const sidebarItems: SidebarItem[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Meetings", href: "/meetings", icon: Video },
    { label: "Agents", href: "/agents", icon: Bot },
    { label: "Schedule", href: "/schedule", icon: Calendar },
];

export const bottomItems: SidebarItem[] = [
    { label: "Profile", href: "/profile", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
];
