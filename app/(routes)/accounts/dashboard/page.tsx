"use client"
import { fetchData } from '@/axiosUtility/api'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import Heading from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import React, { useEffect, useState } from 'react'
// import { columns } from '../components/columns'
import Link from 'next/link'

export default function Page() {
    const [shipmentData, setShipmentData] = useState()


    // useEffect(() => {
    //     const getShipmentData = async () => {
    //         const data = await fetchData('/shipment/getAll')
    //         setShipmentData(data)
    //         console.log(shipmentData)
    //         console.log(data)
    //     }
    //     getShipmentData()
    // },);

    const data =
        [
            {
                "_id": "65f8fb0fc4417ea5a14fbd82",
                "bookingDetails": {
                    "containerNumber": "ABC123",
                    "portOfLoading": "Port A",
                    "destinationPort": "Port B",
                    "vesselSailingDate": "2024-03-25T00:00:00.000Z",
                    "vesselArrivingDate": "2024-04-05T00:00:00.000Z",
                    "truckNumber": "TRK456",
                    "truckDriverNumber": "DRV789",
                    "_id": "65f8fb0fc4417ea5a14fbd83"
                },
                "shippingDetails": {
                    "shippingLine": "Shipping Line X",
                    "forwarder": "Forwarder Y",
                    "forwarderInvoice": "FY123",
                    "valueOfForwarderInvoice": "1000",
                    "transporter": "Transporter Z",
                    "transporterInvoice": "TZ456",
                    "valueOfTransporterInvoice": "800",
                    "_id": "65f8fb0fc4417ea5a14fbd84"
                },
                "shippingBillDetails": {
                    "shippingBillNumber": "SB789",
                    "shippingBillDate": "2024-03-20T00:00:00.000Z",
                    "uploadShippingBill": "URL",
                    "_id": "65f8fb0fc4417ea5a14fbd85"
                },
                "supplierDetails": {
                    "supplierName": "Supplier ABC",
                    "actualSupplierName": "Supplier ABC",
                    "supplierGSTIN": "GSTIN123",
                    "supplierInvoiceNumber": "INV456",
                    "supplierInvoiceDate": "2024-03-15T00:00:00.000Z",
                    "supplierInvoiceValueWithOutGST": "500",
                    "supplierInvoiceValueWithGST": "600",
                    "uploadSupplierInvoice": "URL",
                    "actualSupplierInvoice": "ASI789",
                    "actualSupplierInvoiceValue": "700",
                    "_id": "65f8fb0fc4417ea5a14fbd86"
                },
                "saleInvoiceDetails": {
                    "commercialInvoiceNumber": "CINV789",
                    "commercialInvoiceDate": "2024-03-10T00:00:00.000Z",
                    "consigneeDetails": "Consignee XYZ",
                    "actualBuyer": "Buyer PQR",
                    "_id": "65f8fb0fc4417ea5a14fbd87"
                },
                "blDetails": {
                    "blNumber": "BL123",
                    "blDate": "2024-03-05T00:00:00.000Z",
                    "telexDate": "2024-03-03T00:00:00.000Z",
                    "uploadBL": "URL",
                    "_id": "65f8fb0fc4417ea5a14fbd88"
                },
                "organization": {
                    "_id": "65f8f7b3cd75ce9e73e4a891",
                    "name": "Jabal Exim",
                    "description": "This is a sample organization",
                    "owner": "65f8ccb0ac91212ea2d52880",
                    "members": [],
                    "address": {
                        "coordinates": {
                            "type": "Point",
                            "coordinates": [
                                40.7128,
                                -74.006
                            ]
                        },
                        "location": "123 Example Street",
                        "pincode": "12345",
                        "_id": "65f8f7b3cd75ce9e73e4a892"
                    },
                    "shipments": [
                        "65f8fb0fc4417ea5a14fbd82"
                    ],
                    "createdAt": "2024-03-19T02:25:55.977Z",
                    "updatedAt": "2024-03-19T02:40:18.218Z",
                    "__v": 0
                },
                "createdAt": "2024-03-19T02:40:15.954Z",
                "updatedAt": "2024-03-19T02:40:15.954Z",
                "__v": 0
            },
            {
                "_id": "65f8fd0ac4417ea5a14fbda1",
                "bookingDetails": {
                    "containerNumber": "XYZ789",
                    "portOfLoading": "Port C",
                    "destinationPort": "Port D",
                    "vesselSailingDate": "2024-04-10T00:00:00.000Z",
                    "vesselArrivingDate": "2024-04-25T00:00:00.000Z",
                    "truckNumber": "TRK789",
                    "truckDriverNumber": "DRV101",
                    "_id": "65f8fd0ac4417ea5a14fbda2"
                },
                "createdAt": "2024-03-19T02:48:42.837Z",
                "updatedAt": "2024-03-19T02:58:00.445Z",
                "__v": 0,
                "shippingDetails": {
                    "shippingLine": "Shipping Line Z",
                    "forwarder": "Forwarder A",
                    "forwarderInvoice": "FA456",
                    "valueOfForwarderInvoice": "1200",
                    "transporter": "Transporter B",
                    "transporterInvoice": "TB789",
                    "valueOfTransporterInvoice": "1000",
                    "_id": "65f8fdbcc4417ea5a14fbda5"
                },
                "shippingBillDetails": {
                    "shippingBillNumber": "SB101",
                    "shippingBillDate": "2024-04-01T00:00:00.000Z",
                    "uploadShippingBill": "URL",
                    "_id": "65f8fe08c4417ea5a14fbda7"
                },
                "blDetails": {
                    "blNumber": "BL456",
                    "blDate": "2024-03-15T00:00:00.000Z",
                    "telexDate": "2024-03-10T00:00:00.000Z",
                    "uploadBL": "URL",
                    "_id": "65f8fedbc4417ea5a14fbdb1"
                },
                "saleInvoiceDetails": {
                    "commercialInvoiceNumber": "CINV101",
                    "commercialInvoiceDate": "2024-03-20T00:00:00.000Z",
                    "consigneeDetails": "Consignee ABC",
                    "actualBuyer": "Buyer XYZ",
                    "_id": "65f8ff38c4417ea5a14fbdb3"
                }
            },
            {
                "_id": "65f8febec4417ea5a14fbdad",
                "blDetails": {
                    "blNumber": "BL456",
                    "blDate": "2024-03-15T00:00:00.000Z",
                    "telexDate": "2024-03-10T00:00:00.000Z",
                    "uploadBL": "URL",
                    "_id": "65f8febec4417ea5a14fbdae"
                },
                "createdAt": "2024-03-19T02:55:58.275Z",
                "updatedAt": "2024-03-19T02:55:58.275Z",
                "__v": 0
            }
        ]


    return (
        <div className="flex  flex-col p-6">
            <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col ">
                    <Heading className="text-3xl" title="Account Management" />
                    <p>This is the Account Management page</p>
                </div>
                <Link href={`/shipments/new`}>
                    <Button className="bg-primary text-white">New Button</Button>
                </Link>

            </div>
            <Separator className="my-2" />
            {/* <DataTable searchKey='' data={data as any} columns={columns} /> */}
        </div>

    )
}


