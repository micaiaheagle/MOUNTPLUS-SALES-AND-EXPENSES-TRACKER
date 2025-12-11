
import {
    LayoutDashboard,
    ShoppingCart,
    Wallet,
    FileText,
    Settings,
    Users,
    Receipt,
    Landmark,
    Package,
    Truck,
    Briefcase,
    Megaphone,
    HardHat,
    FolderOpen,
    TrendingUp
} from 'lucide-react';

export type NavigationItem = {
    name: string;
    href: string;
    icon: any;
    current?: boolean;
};

export const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Finance', href: '/finance', icon: Landmark },
    { name: 'Inventory', href: '/inventory', icon: Package },
    { name: 'Sales & PoS', href: '/sales', icon: ShoppingCart },
    { name: 'CRM', href: '/crm', icon: Users },
    { name: 'Supply Chain', href: '/supply-chain', icon: Truck },
    { name: 'HR & Capital', href: '/hr', icon: Briefcase },
    { name: 'Projects', href: '/projects', icon: HardHat },
    { name: 'Documents', href: '/documents', icon: FolderOpen },
    { name: 'Marketing', href: '/marketing', icon: Megaphone },
    { name: 'Investment', href: '/investment', icon: TrendingUp },
    { name: 'Settings', href: '/settings', icon: Settings },
];
