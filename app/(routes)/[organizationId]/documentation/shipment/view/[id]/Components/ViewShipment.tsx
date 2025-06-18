"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// const dataArray = [.data[0]?
//   {
//     Message: "Success",
//     Status: "Loaded",
//     StatusId: 35,
//     ReferenceNo: null,
//     BLReferenceNo: "ONEYMAAF18394900",
//     ShippingLine: "ONE LINE",
//     ContainerNumber: "SEGU1346656",
//     ContainerTEU: "20",
//     ContainerType: "DC",
//     FromCountry: "INDIA",
//     Pol: "KATTUPALLI",
//     LoadingDate: {
//       Date: "2025-06-17",
//       IsActual: true,
//     },
//     DepartureDate: {
//       Date: "2025-06-17",
//       IsActual: false,
//     },
//     TSPorts: [
//       {
//         Port: "SINGAPORE",
//         ArrivalDate: {
//           Date: "2025-06-23",
//           IsActual: false,
//         },
//         DepartureDate: {
//           Date: "2025-07-01",
//           IsActual: false,
//         },
//         Vessel: "DAPHNE",
//         VesselIMO: "9298648",
//         VesselLatitude: "Not Supported",
//         VesselLongitude: "Not Supported",
//         VesselVoyage: "0876W",
//       },
//     ],
//     ToCountry: "SAUDI ARABIA",
//     Pod: "DAMMAM",
//     ArrivalDate: {
//       Date: "2025-07-10",
//       IsActual: false,
//     },
//     DischargeDate: {
//       Date: "2025-07-10",
//       IsActual: false,
//     },
//     Vessel: "XIN YANG PU",
//     VesselIMO: "9320477",
//     VesselLatitude: "Not Supported",
//     VesselLongitude: "Not Supported",
//     VesselVoyage: "188E",
//     EmptyToShipperDate: "2025-06-12",
//     GateInDate: "2025-06-16",
//     GateOutDate: null,
//     EmptyReturnDate: null,
//     FormatedTransitTime: "23 days",
//     ETA: null,
//     FirstETA: "2025-07-10",
//     BLContainerCount: 3,
//     BLContainers: [
//       {
//         ContainerCode: "NYKU9758454",
//         ContainerTEU: "20",
//         ContainerType: "DC",
//         LiveMapUrl:
//           "https://shipsgo.com/live-map-container-tracking?query=NYKU9758454",
//         BLEmptyToShipperDate: null,
//         BLGateInDate: null,
//         BLGateOutDate: null,
//         BLEmptyReturnDate: null,
//       },
//       {
//         ContainerCode: "TEMU0677701",
//         ContainerTEU: "20",
//         ContainerType: "DC",
//         LiveMapUrl:
//           "https://shipsgo.com/live-map-container-tracking?query=TEMU0677701",
//         BLEmptyToShipperDate: null,
//         BLGateInDate: null,
//         BLGateOutDate: null,
//         BLEmptyReturnDate: null,
//       },
//     ],
//     LiveMapUrl:
//       "https://shipsgo.com/live-map-container-tracking?query=SEGU1346656",
//     Tags: [],
//     Co2Emission: "1.60",
//   },
// ];

function ViewShipment({ shipmentData }: { shipmentData: any }) {
  const [dataArray, setDataArray] = useState<any[]>([]);
  const [containerNumbers, setContainerNumbers] = useState<string[]>([]);

  useEffect(() => {
    const containers =
      shipmentData?.bookingDetails?.containers?.flatMap(
        (e: any) => e.containerNumber
      ) || [];
    setContainerNumbers(containers);

    const fetchVoyageData = async () => {
      const responses: any[] = [];

      for (const container of containers) {
        try {
          const res = await fetch(
            `https://shipsgo.com/api/v1.2/ContainerService/GetContainerInfo/?authCode=${process.env.NEXT_PUBLIC_SHIPSGO_AUTHCODE}&requestId=${container}`,
            {
              method: "GET",
              redirect: "follow",
            }
          );
          const data = await res.json();
          responses.push({ container, data });
        } catch (error) {
          console.error(`Fetch error for ${container}:`, error);
          responses.push({ container, error });
        }
      }

      setDataArray(responses);
      // console.log("All voyagessssssssssssssssssssssss data:", responses);
    };
    if (containers.length > 0) {
      // fetchVoyageData();
    }
  }, []);

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl rounded-2xl shadow-md border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Shipment #{shipmentData?.shipmentId}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-sm grid grid-cols-2 gap-x-6 justify-between">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 text-sm">
            <div className="font-medium text-right">Reference:</div>
            <div>-</div>
            <div className="font-medium text-right">Carrier:</div>
            <div>
              {shipmentData?.blDetails?.shippingLineName?.shippingLineName ||
                "-"}
            </div>
            <div className="font-medium text-right">Booking / MBL:</div>
            <div>{dataArray[0]?.data[0]?.BLReferenceNo || "-"}</div>
            <div className="font-medium text-right">Creator:</div>
            <div>
              {shipmentData?.createdBy?.fullName || "-"}
              <br />
              &lt;{shipmentData?.createdBy?.email || "-"}&gt;
              <br />
              <span className="text-xs text-muted-foreground">
                {new Date(shipmentData?.createdAt).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-[auto_1fr] gap-y-2 gap-x-4 text-sm">
            <div className="font-semibold text-right">Status:</div>
            <div>{shipmentData?.status || "-"}</div>
            <div className="font-medium text-right">Containers:</div>
            <div>{containerNumbers?.join(", ") || "-"}</div>
          </div>
        </CardContent>
      </Card>
      <div className="text-right w-full max-w-4xl">
        <Button onClick={() => window.open(dataArray[0]?.LiveMapUrl, "_blank")}>
          View Live Position
        </Button>
      </div>
      <div className="flex w-full max-w-4xl flex-col gap-6">
        <Tabs defaultValue="movements" className="w-full">
          <TabsList>
            <TabsTrigger value="movements">Movements</TabsTrigger>
            <TabsTrigger value="containers">Containers</TabsTrigger>
          </TabsList>
          <TabsContent value="movements" className="w-full min-h-[250px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Moves</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Vessel</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {dataArray[0]?.data[0]?.Pol}
                  </TableCell>
                  <TableCell>Loaded on Board</TableCell>
                  <TableCell>
                    {dataArray[0]?.data[0]?.LoadingDate?.Date}
                  </TableCell>
                  <TableCell className="text-right">
                    {dataArray[0]?.data[0]?.Vessel}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {dataArray[0]?.data[0]?.Pol}
                  </TableCell>
                  <TableCell>Departure</TableCell>
                  <TableCell>
                    {dataArray[0]?.data[0]?.DepartureDate?.Date}
                  </TableCell>
                  <TableCell className="text-right">
                    {dataArray[0]?.data[0]?.Vessel}
                  </TableCell>
                </TableRow>
                {dataArray[0]?.data[0]?.TSPorts &&
                  dataArray[0]?.data[0]?.TSPorts?.map(
                    (port: any, index: number) => (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell className="font-medium">
                            {port?.Port}
                          </TableCell>
                          <TableCell>Discharge in Transshipment</TableCell>
                          <TableCell>{port?.ArrivalDate?.Date}</TableCell>
                          <TableCell className="text-right">
                            {index === 0
                              ? dataArray[0]?.data[0]?.Vessel
                              : port.Vessel ?? dataArray[0]?.data[0]?.Vessel}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">
                            {port?.Port}
                          </TableCell>
                          <TableCell>Load on Transshipment</TableCell>
                          <TableCell>
                            {
                              dataArray[0]?.data[0]?.TSPorts[0]?.DepartureDate
                                ?.Date
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            {port?.Vessel ?? dataArray[0]?.data[0]?.Vessel}
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    )
                  )}
                <TableRow>
                  <TableCell className="font-medium">
                    {dataArray[0]?.data[0]?.Pod}
                  </TableCell>
                  <TableCell>Vessel Arrival</TableCell>
                  <TableCell>
                    {dataArray[0]?.data[0]?.ArrivalDate?.Date}
                  </TableCell>
                  <TableCell className="text-right">
                    {dataArray[0]?.data[0]?.TSPorts[0]?.Vessel}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    {dataArray[0]?.data[0]?.Pod}
                  </TableCell>
                  <TableCell>Discharge</TableCell>
                  <TableCell>
                    {dataArray[0]?.data[0]?.ArrivalDate?.Date}
                  </TableCell>
                  <TableCell className="text-right">
                    {dataArray[0]?.data[0]?.TSPorts[0]?.Vessel}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="containers" className="min-h-[250px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Container</TableHead>
                  <TableHead>Empty to Shipper</TableHead>
                  <TableHead>Gate In</TableHead>
                  <TableHead>Gate Out</TableHead>
                  <TableHead>Empty Return</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataArray[0]?.data[0]?.BLContainers?.map(
                  (container: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {container?.ContainerCode}
                      </TableCell>
                      <TableCell>
                        {dataArray[0]?.data[0]?.EmptyToShipperDate || "-"}
                      </TableCell>
                      <TableCell>
                        {dataArray[0]?.data[0]?.GateInDate || "-"}
                      </TableCell>
                      <TableCell>
                        {dataArray[0]?.data[0]?.GateOutDate || "-"}
                      </TableCell>
                      <TableCell>
                        {dataArray[0]?.data[0]?.EmptyReturnDate || "-"}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default ViewShipment;
