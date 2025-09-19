"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import CellAction from "./cell-actions";
import moment from "moment";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ViewAllComponent from "./ViewAllComnponent";

export type Blocks = {
  dimensions: {
    weight: {
      value: number;
      units: string;
    };
    length: {
      value: number;
      units: string;
    };
    breadth: {
      value: number;
      units: string;
    };
    height: {
      value: number;
      units: string;
    };
  };

  // Net dimensions (after dressing/cutting adjustments)
  netDimensions: {
    weight: {
      value: number;
      units: string;
    };
    length: {
      value: number;
      units: string;
    };
    breadth: {
      value: number;
      units: string;
    };
    height: {
      value: number;
      units: string;
    };
  };

  // Dimensions after dressing
  dressDimensions: {
    weight: {
      value: number;
      units: string;
    };
    length: {
      value: number;
      units: string;
    };
    breadth: {
      value: number;
      units: string;
    };
    height: {
      value: number;
      units: string;
    };
  };

  // Dimensions after splitting
  splitDimensions: {
    weight: {
      value: number;
      units: string;
    };
    length: {
      value: number;
      units: string;
    };
    breadth: {
      value: number;
      units: string;
    };
    height: {
      value: number;
      units: string;
    };
  };

  _id: string;
  lotId: string;
  blockId: string;
  blockNumber: number;
  blockphoto: string;
  materialType: string;
  SlabsId: { _id: string; slabNumber: number }[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const columns: ColumnDef<Blocks>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "blockId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Block Id
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.blockId}</div>,
    filterFn: "includesString", // Use the built-in filtering logic for partial matches
  },
  {
    accessorKey: "blockNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Block Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.blockNumber}</div>,
    filterFn: "includesString", // Use the built-in filtering logic for partial matches
  },
  {
  accessorKey: "dimensions",
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Dimensions
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => {
    const block = row.original;

    // ✅ Helper: format {value, units} or plain number
    const formatValue = (dim: any, fallbackUnit = "cm") => {
      if (!dim && dim !== 0) return "N/A";
      if (typeof dim === "object" && "value" in dim) {
        return `${dim.value} ${dim.units || fallbackUnit}`;
      }
      return `${dim} ${fallbackUnit}`;
    };

    const jsxData = (
      <div className="space-y-4">
        {/* ✅ End-to-End Dimensions (always shown) */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">
            End-to-End Dimensions
          </h4>
          <ul className="list-disc list-inside text-gray-700">
            <li> Length: {formatValue(block.dimensions?.length)}</li>
            <li> Breadth: {formatValue(block.dimensions?.breadth)}</li>
            <li> Height: {formatValue(block.dimensions?.height)}</li>
            <li> Weight: {formatValue(block.dimensions?.weight, "t")}</li>
          </ul>
        </div>

        {/* ✅ Net Dimensions (always shown) */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-1">
            Net Dimensions
          </h4>
          <ul className="list-disc list-inside text-gray-700">
            <li> Length: {formatValue(block.netDimensions?.length)}</li>
            <li> Breadth: {formatValue(block.netDimensions?.breadth)}</li>
            <li> Height: {formatValue(block.netDimensions?.height)}</li>
            <li> Weight: {formatValue(block.netDimensions?.weight, "t")}</li>
          </ul>
        </div>

        {/* ✅ Dress Dimensions (only if available) */}
        { block.status === "dressed" && block.dressDimensions && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-1">
              Dress Dimensions
            </h4>
            <ul className="list-disc list-inside text-gray-700">
              <li> Length: {formatValue(block.dressDimensions.length)}</li>
              <li> Breadth: {formatValue(block.dressDimensions.breadth)}</li>
              <li> Height: {formatValue(block.dressDimensions.height)}</li>
              <li> Weight: {formatValue(block.dressDimensions.weight, "t")}</li>
              {/* {block.dressDimensions.volume && (
                <li> Volume: {block.dressDimensions.volume} m³</li>
              )} */}
            </ul>
          </div>
        )}
      </div>
    );

    return (
      <ViewAllComponent
        title="Block Dimensions"
        data={jsxData}
        setIsFetching={() => {}}
        setIsLoading={() => {}}
        containerCount={1}
        params={{ organizationId: "" }}
      />
    );
  },
},
  {
    accessorKey: "SlabsId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total Slabs
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="capitalize">{row.original?.SlabsId?.length}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Block Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const currentStatus = row.original?.status || "N/A";
      return (
        <Badge
          className={cn(
            currentStatus === "inStock" &&
              "bg-blue-100 text-blue-800 hover:bg-blue-200/80",
            currentStatus === "inDressing" &&
              "bg-purple-100 text-purple-900 hover:bg-purple-200/80",
            currentStatus === "dressed" &&
              "bg-indigo-100 text-indigo-800 hover:bg-indigo-200/80",
            currentStatus === "inSplitting" &&
              "bg-red-100 text-red-800 hover:bg-red-200/80",
            currentStatus === "split" &&
              "bg-pink-100 text-pink-800 hover:bg-pink-200/80",
            currentStatus === "inCutting" &&
              "bg-orange-100 text-orange-800 hover:bg-orange-200/80",
               currentStatus === "readyForCutting" &&
              "bg-amber-100 text-amber-800 hover:bg-amber-200/80",
            currentStatus === "cut" &&
              "bg-green-100 text-green-800 hover:bg-green-200/80",
            currentStatus === "cracked" &&
              "bg-yellow-100 text-yellow-700 hover:bg-gray-200/60"
          )}
        >
          {currentStatus === "cut"
            ? " Cut"
            : currentStatus === "split"
            ? " Split"
            : currentStatus === "dressed"
            ? " Dressed"
            : currentStatus}
        </Badge>
      );
    },
  },
  {
    accessorKey: "blockphoto", // ✅ Correct key
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Block Photo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const photo = row.original.blockphoto;
      return (
        <div className="capitalize flex items-center justify-center gap-2">
          {photo ? (
            <Button
              size="icon"
              variant="outline"
              onClick={() => window.open(photo, "_blank")}
            >
              <Eye className="h-4 w-4" />
            </Button>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>{moment(row.original.createdAt).format("DD MMM YYYY")}</div>
    ),
  },

  {
    header: ({ column }) => <Button variant="ghost">Action</Button>,

    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
