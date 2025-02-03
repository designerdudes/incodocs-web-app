import {
  BlocksIcon,
  HelpCircle,
  HomeIcon,
  ScissorsLineDashed,
  Settings,
  Sheet,
  SparkleIcon,
  User,
} from "lucide-react";
import { FiDollarSign, FiGrid } from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";
import { SiCodeblocks } from "react-icons/si";
import { FcProcess } from "react-icons/fc";



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

const rawInventoryCards = [
  {
    title: "Total Lots",
    icon: <BlocksIcon className="w-6 h-6 text-green-500 self-end" />,
    value: 50,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory/raw/lots",
  },

  {
    title: "Slabs in Processing",
    icon: <FcProcess className="w-6 h-6 text-indigo-500 self-end" />,
    value: 30,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory/raw/processing",
  },
];

const InventoryCards = [
  {
    title: "Raw Invetory",
    icon: <SiCodeblocks className="w-6 h-6  text-green-500 self-end" />,
    value: 50,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory/raw",
  },
  {
    title: "Finished Material",
    icon: <FiGrid className="w-6 h-6 text-indigo-500 self-end" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory/finished",
  },
];
const FactoryCards = [
  {
    title: "Inventory",
    icon: <FiGrid className="w-6 h-6 text-4xl text-indigo-500 self-end" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/inventory",
  },
  {
    title: "Accounting",
    icon: <MdAccountBalance className="w-6 h-6 text-4xl text-green-500 self-end" />,
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

const AccountingCard = [
  {
    title: "Purchases",
    icon: <ScissorsLineDashed className="w-6 h-6" />,
    value: 50,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/accounting/purchases",
  },
  {
    title: "Sales",
    icon: <ScissorsLineDashed className="w-6 h-6" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/accounting/sales",
  },
  {
    title: "Expenses",
    icon: <ScissorsLineDashed className="w-6 h-6" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/accounting/Expenses",
  },
  {
    title: "GST Ledger",
    icon: <ScissorsLineDashed className="w-6 h-6" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/accounting/GSTLedger",
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
export { BrandName, AccountingCard };
