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
    status: string;
    method: string;
};

interface Props {
    remittanceData: DownloadInvRemittance[];
}

const DownloadInvRemittance: React.FC<Props> = ({ remittanceData }) => {
    const [open, setOpen] = useState(false);
    const [consigneeNames, setConsigneeNames] = useState(
        remittanceData.map((r) => r.consigneeId?.name || "").filter((v, i, a) => v && a.indexOf(v) === i)
    );

    const [consigneeName, setConsigneeName] = useState("");
    const [selectedConsigneeName, setSelectedConsigneeName] = useState("");

    // Dummy design config (later you can load from settings/DB)
    const designConfig = {
        logo: "https://automotivedudes.in/cdn/shop/files/AD_Primary.png?v=1738094160&width=2000", // placeholder logo
        companyName: "Jabal Exim Pvt. Ltd.",
        statementTitle: "Remittance Statement",
        brandColors: {
            primary: [22, 82, 240], // Blue header
            secondary: [230, 240, 255], // Light background
            text: [40, 40, 40], // Dark text
            tableHeader: [22, 82, 240], // Blue table headers
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
        if (designConfig.logo) {
            try {
                const img = await fetch(designConfig.logo);
                const blob = await img.blob();
                const reader = new FileReader();
                reader.onload = function (e) {
                    if (e.target?.result) {
                        doc.addImage(
                            e.target.result as string,
                            "PNG",
                            14,
                            10,
                            30,
                            15
                        );
                    }
                };
                reader.readAsDataURL(blob);
            } catch (err) {
                console.log("Logo load failed");
            }
        }

        doc.setFontSize(14);
        doc.setTextColor(...designConfig.brandColors.primary);
        doc.text(designConfig.companyName, pageWidth / 2, 20, {
            align: "center",
        });

        doc.setFontSize(11);
        doc.setTextColor(...designConfig.brandColors.text);
        doc.text(designConfig.statementTitle, pageWidth / 2, 28, {
            align: "center",
        });

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
            item.invoiceValue.toFixed(2),
            new Date(item.invoiceDate).toLocaleDateString(),
            item.inwardRemittanceNumber,
            item.inwardRemittanceValue.toFixed(2),
            new Date(item.inwardRemittanceDate).toLocaleDateString(),
            item.status.replace("_", " "),
            item.method.replace("_", " "),
        ]);

        autoTable(doc, {
            startY: 50,
            head: [
                [
                    "Invoice No",
                    "Invoice Value",
                    "Invoice Date",
                    "Remittance No",
                    "Remittance Value",
                    "Remittance Date",
                    "Status",
                    "Method",
                ],
            ],
            body: tableData,
            theme: "grid",
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
            `Total Invoice Value: ${totalInvoice.toFixed(2)}`,
            14,
            doc.lastAutoTable.finalY + 10
        );
        doc.text(
            `Total Remittance Value: ${totalRemittance.toFixed(2)}`,
            14,
            doc.lastAutoTable.finalY + 18
        );

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
