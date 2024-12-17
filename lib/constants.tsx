import {
  BadgeIndianRupee,
  BlocksIcon,
  BoxIcon,
  CogIcon,
  FrameIcon,
  GroupIcon,
  HelpCircle,
  HomeIcon,
  IndianRupeeIcon,
  LayoutDashboardIcon,
  ScissorsLineDashed,
  ServerIcon,
  Settings,
  Sheet,
  ShoppingBagIcon,
  SparkleIcon,
  TagIcon,
  User,
  UserCog,
  Users,
} from "lucide-react";

const BrandName = "IncoDocs";

const sidebarTabs = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <HomeIcon className="w-4 mr-2" />,
    showButton: false,
  },
  {
    title: "Shipments",
    path: "/documentation/shipments/dashboard",
    icon: <Sheet className="w-4 mr-2" />,
    showButton: true,
    buttonUrl: "/shipments/new",
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Settings className="w-4 mr-2" />,
    showButton: false,
  },
  {
    title: "Help Center",
    path: "/hel[-center",
    icon: <HelpCircle className="w-4 mr-2" />,
    showButton: false,
  },
];

const factoryManagementSidebarTabs = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <HomeIcon className="w-4 mr-2" />,
    showButton: false,
  },
  {
    title: "Inventory",
    path: "/factorymanagement/inventory/dashboard",
    icon: <Sheet className="w-4 mr-2" />,
    showButton: true,
    buttonUrl: "/shipments/new",
  },
  {
    title: "Team Management",
    path: "/factorymanagement/team/dashboard",
    icon: <User className="w-4 mr-2" />,
    showButton: true,
    buttonUrl: "/shipments/new",
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Settings className="w-4 mr-2" />,
    showButton: false,
  },
  {
    title: "Help Center",
    path: "/hel[-center",
    icon: <HelpCircle className="w-4 mr-2" />,
    showButton: false,
  },
];

const documentationSidebarTabs = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <HomeIcon className="w-4 mr-2" />,
    showButton: false,
  },
  {
    title: "Shipments",
    path: "/documentation/shipments/dashboard",
    icon: <Sheet className="w-4 mr-2" />,
    showButton: true,
    buttonUrl: "/shipments/new",
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Settings className="w-4 mr-2" />,
    showButton: false,
  },
  {
    title: "Help Center",
    path: "/hel[-center",
    icon: <HelpCircle className="w-4 mr-2" />,
    showButton: false,
  },
];

const accountingSidebarTabs = [
  {
    title: "Home",
    path: "/dashboard",
    icon: <HomeIcon className="w-4 mr-2" />,
    showButton: false,
  },
  {
    title: "Invoices",
    path: "/documentation/shipments/dashboard",
    icon: <Sheet className="w-4 mr-2" />,
    showButton: true,
    buttonUrl: "/shipments/new",
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Settings className="w-4 mr-2" />,
    showButton: false,
  },
  {
    title: "Help Center",
    path: "/hel[-center",
    icon: <HelpCircle className="w-4 mr-2" />,
    showButton: false,
  },
];

//dashboard cards

//raw inventory cards
const rawInventoryCards = [
  {
    title: "Total Lots",
    icon: <BlocksIcon className="w-6 h-6" />,
    value: 50,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory/raw/lots",
  },
  // {
  //   title: "Slabs in Cutting",
  //   icon: <ScissorsLineDashed className="w-6 h-6" />,
  //   value: 40,
  //   color: "bg-primary",
  //   showButton: false,
  //   buttonUrl: "/factorymanagement/inventory/raw/cutting",
  // },
  // {
  //   title: "Slabs in Polishing",
  //   icon: <SparkleIcon className="w-6 h-6" />,
  //   value: 20,
  //   color: "bg-primary",
  //   showButton: false,
  //   buttonUrl: "/factorymanagement/inventory/raw/polishing",
  // },
  {
    title: "Slabs in Processing",
    icon: <SparkleIcon className="w-6 h-6" />,
    value: 30,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory/raw/processing",
  },
];

const InventoryCards = [
  {
    title: "Raw Invetory",
    icon: <BlocksIcon className="w-6 h-6" />,
    value: 50,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory/raw",
  },
  {
    title: "Finished Material",
    icon: <ScissorsLineDashed className="w-6 h-6" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory/finished",
  },
];
const FactoryCards = [
  {
    title: "Inventory",
    icon: <BlocksIcon className="w-6 h-6" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory",
  },
  {
    title: "Accounting",
    icon: <BlocksIcon className="w-6 h-6" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/accounting",
  },
];

const FinishedPageCards = [
  {
    title: "Cutting Data",
    icon: <ScissorsLineDashed className="w-6 h-6" />,
    value: 50,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory/finished/cuttingdata",
  },
  {
    title: "Polish Data",
    icon: <ScissorsLineDashed className="w-6 h-6" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory/finished/polishdata",
  },
];

export {
  sidebarTabs,
  accountingSidebarTabs,
  rawInventoryCards,
  documentationSidebarTabs,
  factoryManagementSidebarTabs,
  InventoryCards,
  FinishedPageCards,
  FactoryCards,
};
export { BrandName };
