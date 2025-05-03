"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Block } from './incuttingcolumns';
import { useRouter, useSearchParams } from 'next/navigation';

interface Props {
    inCutting:any,
    readyForPolish:any,
    inPolishing:any,
    Polished:any
    slabsData:any
    incuttingcolumns:any
    Readyforpolishcolumns:any
    inPolishingolumns:any
    Polishedcolumns:any
    CuttingInchesWithAllowanceColumns:any
    CuttingInchesWithOutAllowanceColumns:any
    polishingInchesWithOutAllowanceColumns:any
    polishingInchesWithAllowanceColumns:any
}

function TabsDataTable( {
    inCutting,
    readyForPolish,
    inPolishing,
    Polished,
    slabsData,
    incuttingcolumns,
    Readyforpolishcolumns,
    inPolishingolumns,
    Polishedcolumns,
    CuttingInchesWithAllowanceColumns,
    CuttingInchesWithOutAllowanceColumns,
    polishingInchesWithOutAllowanceColumns,
    polishingInchesWithAllowanceColumns
}:Props) {
    const router = useRouter()
    const searchParams = useSearchParams();
    const selectedTab = searchParams.get("tab");

    const updateTabInUrl = (tab: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", tab);
        router.push(`?${params.toString()}`, { scroll: false });
      };
   
  return (
    <Tabs defaultValue={selectedTab || "inCutting"}
    onValueChange={(tab)=>updateTabInUrl(tab)}
    className="w-full">
    <TabsList className="gap-3">
      <TabsTrigger className="gap-2" value="inCutting">
        In Cutting
        <Badge className="text-bg-primary-foreground" variant="outline">
          {inCutting?.length}
        </Badge>
      </TabsTrigger>
      <TabsTrigger className="gap-2" value="readyforpolish">
        Ready For Polish
        <Badge className="text-bg-primary-foreground" variant="outline">
          {readyForPolish?.length}
        </Badge>
      </TabsTrigger>
      <TabsTrigger className="gap-2" value="inPolishing">
        In Polishing
        <Badge className="text-bg-primary-foreground" variant="outline">
          {inPolishing?.length}
        </Badge>
      </TabsTrigger>
      <TabsTrigger className="gap-2" value="Polished">
        Polished
        <Badge className="text-bg-primary-foreground" variant="outline">
          {Polished?.length}
        </Badge>
      </TabsTrigger>
      <TabsList className="gap-6">
        <TabsTrigger className="gap-2" value="CuttingData">
          Cutting Data
          <Badge className="text-bg-primary-foreground" variant="outline">
            {slabsData?.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger className="gap-2" value="PolishingData">
          Polishing Data
          <Badge className="text-bg-primary-foreground" variant="outline">
            {slabsData?.length}
          </Badge>
        </TabsTrigger>
      </TabsList>
    </TabsList>
    <TabsContent value="inCutting">
      <DataTable
        bulkDeleteIdName="_id"
        bulkDeleteTitle="Are you sure you want to delete the selected blocks?"
        bulkDeleteDescription="This will delete the selected blocks, and they will not be recoverable."
        bulkDeleteToastMessage="Selected blocks deleted successfully"
        deleteRoute="/factory-management/inventory/deletemultipleblocks"
        searchKey="blockNumber"
        columns={incuttingcolumns}
        data={inCutting as any}
      />
    </TabsContent>
    <TabsContent value="readyforpolish">
      <DataTable
        bulkDeleteIdName="_id"
        bulkDeleteTitle="Are you sure you want to delete the selected blocks?"
        bulkDeleteDescription="This will delete the selected blocks, and they will not be recoverable."
        bulkDeleteToastMessage="Selected blocks deleted successfully"
        deleteRoute="/factory-management/inventory/deletemultipleblocks"
        searchKey="blockNumber"
        columns={Readyforpolishcolumns}
        data={readyForPolish.map((block: Block) => ({
          ...block,
          readyForPolishCount: block.SlabsId.filter(
            (slab: any) => slab.status === "readyForPolish"
          ).length,
        }))}
      />
    </TabsContent>

    <TabsContent value="inPolishing">
      <DataTable
        bulkDeleteIdName="_id"
        bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
        bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
        bulkDeleteToastMessage="Selected slabs deleted successfully"
        deleteRoute="/factory-management/inventory/deletemultipleslabs"
        searchKey="slabNumber"
        columns={inPolishingolumns}
        data={inPolishing}
        tab="inPolishing"
        bulkPolishTitle="Are you sure you want to mark these slabs as polished?"
        bulkPOlishDescription="This will mark the selected slabs as polished, and they will not be recoverable."
        bulkPolishIdName="_id"
        updateRoute="/factory-management/inventory/addtrim-multipleslabs"
        bulkPolisToastMessage=" selected slabs marked as polished"
      />
    </TabsContent>
    <TabsContent value="Polished">
      <DataTable
        bulkDeleteIdName="_id"
        bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
        bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
        bulkDeleteToastMessage="Selected slabs deleted successfully"
        deleteRoute="/factory-management/inventory/deletemultipleslabs"
        searchKey="slabNumber"
        columns={Polishedcolumns}
        data={Polished}
      />
    </TabsContent>
    <TabsContent value="CuttingData">
      <Tabs defaultValue="CuttingInchesWithAllowance" className="w-full">
        <div className="text-center mt-4">
          <TabsList className="gap-6">
            <TabsTrigger
              className="gap-2"
              value="CuttingInchesWithAllowance"
            >
              Cutting Inches With Allowance
            </TabsTrigger>
            <TabsTrigger
              className="gap-2"
              value="CuttinginchesWithOutAllowance"
            >
              Cutting Inches WithOut Allowance
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="CuttingInchesWithAllowance">
          <DataTable
            bulkDeleteIdName="_id"
            bulkDeleteTitle="Are you sure you want to delete the selected Slabs?"
            bulkDeleteDescription="This will delete all the selected Slabs, and they will not be recoverable."
            bulkDeleteToastMessage="Selected Slabs deleted successfully"
            deleteRoute="/factory-management/inventory/deletemultipleslabs"
            searchKey="slabNumber"
            columns={CuttingInchesWithAllowanceColumns}
            data={slabsData}
          tab="cuttingInchesWithAllowance"

          />
        </TabsContent>

        <TabsContent value="CuttinginchesWithOutAllowance">
          <DataTable
            bulkDeleteIdName="_id"
            bulkDeleteTitle="Are you sure you want to delete the selected Slabs?"
            bulkDeleteDescription="This will delete all the selected Slabs, and they will not be recoverable."
            bulkDeleteToastMessage="Selected Slabs deleted successfully"
            deleteRoute="/factory-management/inventory/deletemultipleslabs"
            searchKey="slabNumber"
            columns={CuttingInchesWithOutAllowanceColumns}
            data={slabsData}
          />
        </TabsContent>
      </Tabs>
    </TabsContent>
    <TabsContent value="PolishingData">
      <Tabs
        defaultValue="PolishingInchesWithAllowance"
        className="w-full"
      >
        <div className="text-center mt-4">
          <TabsList className="gap-6">
            <TabsTrigger
              className="gap-2"
              value="PolishingInchesWithAllowance"
            >
              Polishing Inches With Allowance
            </TabsTrigger>
            <TabsTrigger
              className="gap-2"
              value="PolishingInchesWithOutAllowance"
            >
              Polishing Inches WithOut Allowance
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="PolishingInchesWithAllowance">
          <DataTable
            bulkDeleteIdName="_id"
            bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
            bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
            bulkDeleteToastMessage="Selected slabs deleted successfully"
            deleteRoute="/factory-management/inventory/deletemultipleslabs"
            searchKey="slabNumber"
            columns={polishingInchesWithAllowanceColumns}
            data={slabsData}
          />
        </TabsContent>
        <TabsContent value="PolishingInchesWithOutAllowance">
          <DataTable
            bulkDeleteIdName="_id"
            bulkDeleteTitle="Are you sure you want to delete the selected slabs?"
            bulkDeleteDescription="This will delete the selected slabs, and they will not be recoverable."
            bulkDeleteToastMessage="Selected slabs deleted successfully"
            deleteRoute="/factory-management/inventory/deletemultipleslabs"
            searchKey="slabNumber"
            columns={polishingInchesWithOutAllowanceColumns}
            data={slabsData}
          />
        </TabsContent>
      </Tabs>
    </TabsContent>
  </Tabs>
  )
}

export default TabsDataTable