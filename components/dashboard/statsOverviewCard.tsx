"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { ArrowRight, BadgeCheck, BadgeDollarSign, DollarSign, FileText, ShoppingCart, Timer } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MdPending } from 'react-icons/md';

interface StatsOverviewCardProps {
    type: 'invoices' | 'quotes' | 'purchase-orders';
    totalCount: number;
    totalValue: number;
    paidCount: number;
    paidValue: number;
    pendingCount: number;
    pendingValue: number;
    factoryId: string;
    className?: string;
}

const StatsOverviewCard: React.FC<StatsOverviewCardProps> = ({
    type,
    totalCount,
    totalValue,
    paidCount,
    paidValue,
    pendingCount,
    pendingValue,
    factoryId,
    className,
}) => {
    const router = useRouter();

    const getConfig = () => {
        switch (type) {
            case 'invoices':
                return {
                    title: 'Invoices',
                    icon: <FileText className="w-6 h-6 text-gray-500" />,
                    href: '/invoices',
                    color: 'blue',
                };
            case 'quotes':
                return {
                    title: 'Quotes',
                    icon: <FileText className="w-6 h-6  text-gray-500" />,
                    href: '/quotes',
                    color: 'green',
                };
            case 'purchase-orders':
                return {
                    title: 'Purchase Orders',
                    icon: <ShoppingCart className="w-6 h-6  text-gray-500" />,
                    href: '/purchase-orders',
                    color: 'purple',
                };
        }
    };

    const { title, icon, href, color } = getConfig();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(value);
    };

    return (
        <Card className={`relative p-1  rounded-2xl border shadow-sm ${className}`}>
            <div className="absolute top-5 right-5">{icon}</div>
            <CardHeader className="flex flex-col space-y-2">
                <CardTitle className="text-lg font-semibold text-gray-800">{title}</CardTitle>
                <div className={`flex w-full items-center space-x-2 border-b border-${color}-200 pb-2`}>

                <Card className={`p-3 bg-white w-1/3`}>
                    <Heading title={totalCount.toString()} className="text-3xl font-extrabold text-gray-900" />
                    <p className="opacity-80 text-sm">Total {title}</p>
                </Card>
                <Card className={`p-3 bg-white w-2/3 `}>
                    <Heading title={new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(totalValue)} className="text-3xl font-extrabold text-gray-900" />
                    <p className="opacity-80 text-sm">Total Value</p>
                </Card>
                </div>
              
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Card className="p-3 bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Paid</p>
                                <p className="text-lg font-bold">{paidCount}</p>
                                <p className="text-xs">{new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(paidValue)}</p>
                            </div>
                            <BadgeCheck className="w-6 h-6 text-green-500" />
                        </div>
                    </Card>
                    <Card className="p-3 bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">Pending</p>
                                <p className="text-lg font-bold">{pendingCount}</p>
                                <p className="text-xs">{new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    }).format(pendingValue)}</p>
                            </div>
                            <Timer className="w-6 h-6 text-yellow-500" />

                        </div>
                    </Card>
                </div>
                <Button
                    onClick={() => router.push(`/${factoryId}${href}`)}
                    variant="default"
                    className={`w-full flex justify-center items-center space-x-2 text-white`}
                >
                    <span>View All</span>
                    <ArrowRight className="w-4 ml-1" />
                </Button>
            </CardContent>
        </Card>
    );
};

export default StatsOverviewCard;