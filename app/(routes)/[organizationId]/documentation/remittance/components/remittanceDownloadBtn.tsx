"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";

type DownloadInvRemittance = {
    _id: string;
    organizationId: { _id: string; name: string };
    consigneeId?: { _id: string; name: string; email: string; address: string };
    invoiceNumber: string;
    invoiceValue: number;
    invoiceDate: string;
    inwardRemittanceNumber: string;
    inwardRemittanceValue: number;
    inwardRemittanceDate: string;
    differenceAmount: number;
    status: string;
    method: string;
};

interface Props {
    remittanceData: DownloadInvRemittance[];
}

// Helper to convert image URL → base64 for jsPDF
const getBase64FromUrl = async (url: string): Promise<string> => {
    const response = await fetch(url);
    const blob = await response.blob();

    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const DownloadInvRemittance: React.FC<Props> = ({ remittanceData }) => {
    const [open, setOpen] = useState(false);
    const [consigneeNames, setConsigneeNames] = useState(
        remittanceData.map((r) => r.consigneeId?.name || "").filter((v, i, a) => v && a.indexOf(v) === i)
    );

    const [consigneeName, setConsigneeName] = useState("");
    const [selectedConsigneeName, setSelectedConsigneeName] = useState("");

    // Dummy design config (later you can load from settings/DB)
    const designConfig = {
        logo: "https://s3.ap-south-1.amazonaws.com/refrens.images/64c283cf8cbb5000110dea72/64c283d147aefc0011f8c1ca/ref1690469352849.png", // placeholder logo
        companyName: "Jabal Exim Pvt. Ltd.",
        statementTitle: "Remittance Statement",
        brandColors: {
            primary: [22, 82, 240], // Blue header
            secondary: [230, 240, 255], // Light background
            text: [40, 40, 40], // Dark text
            tableHeader: [22, 82, 240], // Blue table headers
            balanceColor: [255, 250, 235]
        },
        footerText:
            "This is a computer-generated statement. For any queries, contact support@jabalexim.com",
    };

    const generatePDF = async () => {
        const filteredData = remittanceData.filter(
            (r) =>
                r.consigneeId?.name?.toLowerCase() === consigneeName.toLowerCase()
        );

        if (filteredData.length === 0) {
            alert("No data found for this consignee");
            return;
        }

        const doc = new jsPDF("p", "mm", "a4") as any;
        const pageWidth = doc.internal.pageSize.getWidth();

        // --- Header ---
        try {
            if (designConfig.logo) {
                const logoBase64 = await getBase64FromUrl(designConfig.logo);
                doc.addImage(logoBase64, "PNG", 14, 10, 20, 20);
            }
        } catch (err) {
            console.log("Logo load failed", err);
        }


        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor(...designConfig.brandColors.primary);
        doc.text(designConfig.companyName, pageWidth / 2, 20, {
            align: "center",
            fontStyle: "bold"
        });

        doc.setFont(undefined, "normal");

        doc.setFontSize(11);
        doc.setTextColor(...designConfig.brandColors.text);
        doc.text(designConfig.statementTitle, pageWidth / 2, 28, {
            align: "center",
        });

        //add a line
        // --- Horizontal line ---
        const lineY = 35; // vertical position of the line
        doc.setDrawColor(128, 128, 128); // line color (optional)
        doc.setLineWidth(0.25); // line thickness
        doc.line(14, lineY, pageWidth - 14, lineY); // from left margin to right margin

        doc.setFontSize(10);
        doc.text(
            `Consignee: ${consigneeName}`,
            14,
            40
        );
        doc.text(
            `Generated on: ${new Date().toLocaleDateString()}`,
            pageWidth - 14,
            40,
            { align: "right" }
        );

        // --- Table ---
        const tableData = filteredData.map((item) => [
            item.invoiceNumber,
            new Date(item.invoiceDate).toLocaleDateString(),
            item.inwardRemittanceNumber,
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,

            }).format(item.invoiceValue as any)
            ,
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,

            }).format(item.inwardRemittanceValue as any)
            ,
            new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,

            }).format(item.invoiceValue - item.inwardRemittanceValue as any)
            ,
            new Date(item.inwardRemittanceDate).toLocaleDateString(),
            item.invoiceValue - item.inwardRemittanceValue > 0 ? "Balance Pending" : "Recieved",
            item.method.replace("_", " "),
        ]);

        autoTable(doc, {
            startY: 50,
            head: [
                [
                    "Invoice No",
                    "Invoice Date",
                    "Remittance No",
                    "Invoice Value",
                    "Remittance Value",
                    "Difference Amount",
                    "Remittance Date",
                    "Status",
                    "Method",
                ],
            ],
            body: tableData,
            theme: "striped",
            styles: {
                fontSize: 9,
                textColor: designConfig.brandColors.text as any,

            },
            headStyles: {
                fillColor: designConfig.brandColors.tableHeader as any,
                textColor: [255, 255, 255],
                fontStyle: "bold",
            },
            alternateRowStyles: {
                fillColor: designConfig.brandColors.secondary as any,
            },
            didParseCell: (data: any) => {
                // Only apply background to body rows
                if (data.section === "body") {
                    const differenceAmount = Number(data.row.raw[5]?.toString().replace(/[^0-9.-]+/g, "" as any));
                    if (differenceAmount > 0) {
                        data.cell.styles.fillColor = designConfig.brandColors.balanceColor; // light orange highlight
                    }
                }
            },


        });

        // --- Totals ---
        const totalInvoice = filteredData.reduce(
            (sum, r) => sum + r.invoiceValue,
            0
        );
        const totalRemittance = filteredData.reduce(
            (sum, r) => sum + r.inwardRemittanceValue,
            0
        );

        doc.setFontSize(11);
        doc.text(
            `Total Invoice Value: ${new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,

            }).format(totalInvoice as any)}`,
            14,
            doc.lastAutoTable.finalY + 10
        );
        doc.text(
            `Total Remittance Value: ${new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,

            }).format(totalRemittance as any)}`,
            14,
            doc.lastAutoTable.finalY + 18
        );
        doc.text(
            `Total Difference Amount: ${new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,

            }).format(totalInvoice - totalRemittance as any)}`,
            14,
            doc.lastAutoTable.finalY + 26
        )

        // --- Footer ---
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(
            designConfig.footerText,
            pageWidth / 2,
            290,
            { align: "center", maxWidth: pageWidth - 20 }
        );

        doc.save(`${consigneeName}-remittance-statement.pdf`);
        setOpen(false);
    };
    return (
        <div className="flex items-center gap-4">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">Download Remittances
                        <Download className="w-6 h-6" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Download Remittance Statement</DialogTitle>
                        <DialogDescription>
                            Enter consignee name to generate statement
                        </DialogDescription>
                    </DialogHeader>

                    <Select
                        value={selectedConsigneeName}
                        onValueChange={(value) => {
                            setSelectedConsigneeName(value);
                            setConsigneeName(value);
                        }}

                        disabled={consigneeNames.length === 0}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Consignee Name" />
                        </SelectTrigger>
                        <SelectContent>
                            {consigneeNames.map((name) => (
                                <SelectItem key={name} value={name}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>



                    <DialogFooter>
                        <Button onClick={generatePDF}>Download</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DownloadInvRemittance;
