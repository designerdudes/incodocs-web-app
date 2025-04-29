// Define container types interface
export interface ContainerType {
    value: string;
    label: string;
    category: string;
  }
  
  // Define container types data
  export const containerTypes: ContainerType[] = [
    // Dry Containers
    { value: "20-foot", label: "20-foot Dry Container (1 TEU)", category: "Dry Containers" },
    { value: "40-foot", label: "40-foot Dry Container (1 FFE)", category: "Dry Containers" },
    { value: "40HC", label: "40-foot High Cube Container (40HC)", category: "Dry Containers" },
  
    // Refrigerated Containers
    { value: "20-foot-reefer", label: "20-foot Refrigerated Container", category: "Refrigerated Containers" },
    { value: "40-foot-reefer", label: "40-foot Refrigerated Container", category: "Refrigerated Containers" },
    { value: "40HC-reefer", label: "40-foot High Cube Refrigerated Container", category: "Refrigerated Containers" },
    { value: "45HC-reefer", label: "45-foot High Cube Refrigerated Container", category: "Refrigerated Containers" },
    { value: "ca-container", label: "Controlled Atmosphere (CA) Container", category: "Refrigerated Containers" },
  
    // Special Dimensioned Containers
    { value: "open-top", label: "Open Top Container", category: "Special Dimensioned Containers" },
    { value: "flat-rack", label: "Flat Rack Container", category: "Special Dimensioned Containers" },
    { value: "platform", label: "Platform Container", category: "Special Dimensioned Containers" },
    { value: "transportable-tank", label: "Transportable Tank", category: "Special Dimensioned Containers" },
  ];
  
  // Extract string values for z.enum()
  const containerTypeValues = containerTypes.map((type) => type.value) as [string, ...string[]];