import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CardWithForm() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Add New Lot</CardTitle>
        <CardDescription>A form to input raw material data including lot details, blocks, and dimensions</CardDescription>
      </CardHeader>
      <CardContent>
      <form>
          <div className="grid gap-4">
            {/* Lot Name */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="lot-name">Lot Name</Label>
              <Input id="lot-name" placeholder="Enter lot name" />
            </div>

            {/* Material Type */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="material-type">Material Type</Label>
              <Select>
                <SelectTrigger id="material-type">
                  <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wood">Black Galaxy</SelectItem>
                  <SelectItem value="metal">Granite</SelectItem>
                  <SelectItem value="plastic">Marble</SelectItem>
                  <SelectItem value="concrete">white Galaxy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="height">Height (inch)</Label>
                <Input id="height" type="number" placeholder="Enter height" />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="breadth">Breadth (inch)</Label>
                <Input id="breadth" type="number" placeholder="Enter breadth" />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="weight">Breadth ()</Label>
              <Input id="weight" type="number" placeholder="Enter weight" />
            </div>

            {/* Number of Blocks */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="blocks">Number of Blocks</Label>
              <Input id="blocks" type="number" placeholder="Enter total blocks" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
export default CardWithForm;