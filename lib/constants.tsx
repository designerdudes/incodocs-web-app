import {
  BlocksIcon,
  BookOpen,
  FactoryIcon,
  HelpCircle,
  HomeIcon,
  ScissorsLineDashed,
  Settings,
  Settings2,
  Sheet,
  SparkleIcon,
  User,
} from "lucide-react";
import { FiDollarSign, FiGrid } from "react-icons/fi";
import { MdAccountBalance } from "react-icons/md";
import { SiCodeblocks } from "react-icons/si";
import { FcProcess } from "react-icons/fc";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { GiExpense } from "react-icons/gi";
import { MdManageAccounts } from "react-icons/md";
import { FaBookReader } from "react-icons/fa";






const BrandName = "IncoDocs";

// const sidebarTabs = [
//   {
//     title: "Home",
//     path: "/dashboard",
//     icon: <HomeIcon className="w-4 mr-2" />,
//     showButton: false,
//   },
//   {
//     title: "Shipments",
//     path: "/documentation/shipments/dashboard",
//     icon: <Sheet className="w-4 mr-2" />,
//     showButton: true,
//     buttonUrl: "/shipments/new",
//   },
//   {
//     title: "Settings",
//     path: "/settings",
//     icon: <Settings className="w-4 mr-2" />,
//     showButton: false,
//   },
//   {
//     title: "Help Center",
//     path: "/hel[-center",
//     icon: <HelpCircle className="w-4 mr-2" />,
//     showButton: false,
//   },
// ];

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

const documentationCards = [
  {
    title: "Export Docs",
    icon: <FiGrid className="w-6 h-6 text-green-500 self-end" />,
    value: 50,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/exportDocs",
  },

  {
    title: "Shipments",
    value: 50,
    path: "/documentation/shipments/dashboard",
    icon: <Sheet className="w-4 mr-2" />,
    showButton: false,
    buttonUrl: "/documentation/shipments",
  },
  {
    title: "Invoices",
    path: "/settings",
    icon: <Settings className="w-4 mr-2" />,
    showButton: false,
    value: 50,
  },
  {
    title: "Purchase Orders",
    path: "/purchaseorders",
    icon: <HelpCircle className="w-4 mr-2" />,
    showButton: false,
    value: 50,
  },
  {
    title: "Quotations",
    path: "/quotations",
    icon: <HelpCircle className="w-4 mr-2" />,
    showButton: false,
    value: 50,
  }
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
    icon: <BiPurchaseTagAlt className="w-6 h-6" />,
    value: 50,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/accounting/purchases",
  },
  {
    title: "Sales",
    icon: <MdOutlineAttachMoney className="w-6 h-6" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/accounting/sales",
  },
  {
    title: "Expenses",
    icon: <GiExpense className="w-6 h-6" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/accounting/Expenses",
  },
  {
    title: "GST Ledger",
    icon: <FaBookReader className="w-6 h-6" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/accounting/GSTLedger",
  },
  {
    title: "Ledger",
    icon: <MdManageAccounts className="w-6 h-6" />,
    value: 40,
    color: "bg-primary",
    showButton: false,
    buttonUrl: "/factorymanagement/accounting/Parties",
  }
];

 const sidebarTabs = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: HomeIcon, // Component function
      isActive: true,
    },
    {
      title: "Factory Management",
      url: "/factorymanagement",
      icon: FactoryIcon,
      isActive: true,
      items: [
        {
          title: "Inventory",
          items: [
            {
              title: "Raw Inventory",
              url: "/factorymanagement/inventory/raw",
            },
            {
              title: "Finished Goods",
              url: "/factorymanagement/inventory/finished",
            },
          ],
          url: "/factorymanagement/inventory",
        },
        {
          title: "Accounting",
          url: "/factorymanagement/accounting",
          items: [
            {
              title: "Purchases",
              url: "/factorymanagement/accounting/purchases",
            },
            {
              title: "Sales",
              url: "/factorymanagement/accounting/sales",
            },
            {
              title: "Expenses",
              url: "/factorymanagement/accounting/Expenses",
            },
            {
              title: "GST Ledger",
              url: "/factorymanagement/accounting/GSTLedger",
            },
            {
              title: "Ledger",
              url: "/factorymanagement/accounting/Parties",
            },
          ],
        },
      ],
    },
    {
      title: "Documentation",
      url: "/documentation/dashboard",
      icon: BookOpen,
      items: [
        {
          title: "Shipments",
          url: "/documentation/shipment",
        },
        {
          title: "Parties",
          url: "/documentation/parties",
        },
      ],
    },
    {
      title: "Team Management",
      url: "/teamManagement/dashboard",
      icon: User,
      isActive: true,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings/general",
        },
        {
          title: "Factory",
          url: "/settings/factory",
        },
        {
          title: "Organisation",
          url: "/settings/organisation",
        },
      ],
    },
  ],
};

export {
  sidebarTabs,
  accountingSidebarTabs,
  rawInventoryCards,
  documentationCards,
  factoryManagementSidebarTabs,
  InventoryCards,
  FinishedPageCards,
  FactoryCards,
};
export { BrandName, AccountingCard };
