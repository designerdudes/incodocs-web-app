"use client";

import React, { useEffect, useState } from "react";
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
import { EyeIcon } from "lucide-react";
import moment from "moment";

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
      // for (const container of containers) {
      try {
        const res = await fetch(
          `https://shipsgo.com/api/v1.2/ContainerService/GetContainerInfo/?authCode=${process.env.NEXT_PUBLIC_SHIPSGO_AUTHCODE}&requestId=${containers[0]}`,
          {
            method: "GET",
            redirect: "follow",
          }
        );
        const data = await res.json();
        responses.push({ container: containers[0], data });
      } catch (error) {
        console.error(`Fetch error for ${containers[0]}:`, error);
        responses.push({ container: containers[0], error });
      }

      setDataArray(responses);
      // console.log("All voyagessssssssssssssssssssssss data:", responses);
    };
    // };
    if (containers.length > 0) {
      fetchVoyageData();
    }
  }, [shipmentData]);

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
                    {dataArray[0]?.data[0]?.Pol || "-"}
                  </TableCell>
                  <TableCell>Loaded on Board</TableCell>
                  <TableCell>
                    {dataArray[0]?.data[0]?.LoadingDate?.Date
                      ? moment(dataArray[0]?.data[0]?.LoadingDate?.Date).format(
                          "DD MMM YYYY"
                        )
                      : "-"}
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
                    {dataArray[0]?.data[0]?.DepartureDate?.Date
                      ? moment(
                          dataArray[0]?.data[0]?.DepartureDate?.Date
                        ).format("DD MMM YYYY")
                      : "-"}
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
                          <TableCell>
                            {port?.ArrivalDate?.Date
                              ? moment(port?.ArrivalDate?.Date).format(
                                  "DD MMM YYYY"
                                )
                              : "-"}
                          </TableCell>
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
                            {dataArray[0]?.data[0]?.TSPorts[0]?.DepartureDate
                              ?.Date
                              ? moment(
                                  dataArray[0]?.data[0]?.TSPorts[0]
                                    ?.DepartureDate?.Date
                                ).format("DD MMM YYYY")
                              : "-"}
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
                    {dataArray[0]?.data[0]?.ArrivalDate?.Date
                      ? moment(dataArray[0]?.data[0]?.ArrivalDate?.Date).format(
                          "DD MMM YYYY"
                        )
                      : "-"}
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
                    {dataArray[0]?.data[0]?.ArrivalDate?.Date
                      ? moment(dataArray[0]?.data[0]?.ArrivalDate?.Date).format(
                          "DD MMM YYYY"
                        )
                      : "-"}
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
                  <TableHead>Live Position</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {dataArray[0]?.data[0]?.ContainerNumber}
                  </TableCell>
                  <TableCell>
                    {dataArray[0]?.data[0]?.EmptyToShipperDate
                      ? moment(
                          dataArray[0]?.data[0]?.EmptyToShipperDate
                        ).format("DD MMM YYYY")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {dataArray[0]?.data[0]?.GateInDate
                      ? moment(dataArray[0]?.data[0]?.GateInDate).format(
                          "DD MMM YYYY"
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {dataArray[0]?.data[0]?.GateOutDate
                      ? moment(dataArray[0]?.data[0]?.GateOutDate).format(
                          "DD MMM YYYY"
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {dataArray[0]?.data[0]?.EmptyReturnDate
                      ? moment(dataArray[0]?.data[0]?.EmptyReturnDate).format(
                          "DD MMM YYYY"
                        )
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <EyeIcon
                      onClick={() =>
                        window.open(dataArray[0]?.data[0]?.LiveMapUrl, "_blank")
                      }
                      className="cursor-pointer"
                    />
                  </TableCell>
                </TableRow>
                {dataArray[0]?.data[0]?.BLContainers?.map(
                  (container: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {container?.ContainerCode}
                      </TableCell>
                      <TableCell>
                        {container?.BLEmptyToShipperDate
                          ? moment(container?.BLEmptyToShipperDate).format(
                              "DD MM YYYY"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {container?.BLGateInDate
                          ? moment(container?.BLGateInDate).format("DD MM YYYY")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {container?.BLGateOutDate
                          ? moment(container?.BLGateOutDate).format(
                              "DD MM YYYY"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {container?.BLEmptyReturnDate
                          ? moment(container?.BLEmptyReturnDate).format(
                              "DD MM YYYY"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <EyeIcon
                          onClick={() =>
                            window.open(container?.LiveMapUrl, "_blank")
                          }
                          className="cursor-pointer"
                        />
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
