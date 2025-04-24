import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { formatCurrency } from "@/lib/utils"
import Heading from "../ui/heading"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"

interface FactoriesCardProps {
    factoryId: string
    factoryName: string
    factoryGSTIN: string
    factoryAddress: string
    totalLots: number
    totalBlocks: number
    totalSlabs: number
    workerCuttingPay: number
    workerPolishingPay: number

}

export function FactoriesCard({ factoryName, factoryGSTIN, factoryAddress, totalLots, totalBlocks, totalSlabs, workerCuttingPay, workerPolishingPay }: FactoriesCardProps) {
    return (
        <Card className="bg-white">
            <CardHeader className="flex flex-col">
                <CardTitle className="text-lg font-semibold text-gray-800">{factoryName}</CardTitle>
                <p className="opacity-80 text-sm">{factoryGSTIN}</p>

            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                {/* <div className="text-2xl font-bold">{formatCurrency(amount)}</div> */}
                <div className="grid grid-cols-3 gap-2">
                    <Card className={`p-3 bg-white w-full `}>
                        <Heading title={totalLots} className="text-2xl font-extrabold text-gray-900" />
                        <p className="opacity-80 text-sm">Total Lots</p>
                    </Card>
                    <Card className={`p-3 bg-white w-full `}>
                        <Heading title={totalBlocks} className="text-2xl font-extrabold text-gray-900" />
                        <p className="opacity-80 text-sm">Total Blocks</p>
                    </Card>
                    <Card className={`p-3 bg-white w-full`}>
                        <Heading title={totalSlabs} className="text-2xl font-extrabold text-gray-900" />
                        <p className="opacity-80 text-sm">Total Slabs</p>
                    </Card>
                </div>
                <Button
                    // onClick={() => router.push(`/${factoryId}${href}`)}
                    variant="default"
                    className={`w-full flex justify-center items-center space-x-2 text-white`}
                >
                    <span>View All</span>
                    <ArrowRight className="w-4 ml-1" />
                </Button>
            </CardContent>
        </Card>
    )
}