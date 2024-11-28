import { GSTBalance } from "./gst-calculations";

export interface GSTSettlement {
  igst: {
    payable: number;
    settledWithIgst: number;
    settledWithCgst: number;
    settledWithSgst: number;
    finalPayable: number;
  };
  cgst: {
    payable: number;
    settledWithIgst: number;
    settledWithCgst: number;
    settledWithSgst: number;
    finalPayable: number;
  };
  sgst: {
    payable: number;
    settledWithIgst: number;
    settledWithCgst: number;
    settledWithSgst: number;
    finalPayable: number;
  };
}

export function calculateGSTSettlement(balance: GSTBalance): GSTSettlement {
  // Initialize settlement structure
  const settlement: GSTSettlement = {
    igst: {
      payable: Math.max(0, balance.output.igst),
      settledWithIgst: 0,
      settledWithCgst: 0,
      settledWithSgst: 0,
      finalPayable: 0
    },
    cgst: {
      payable: Math.max(0, balance.output.cgst),
      settledWithIgst: 0,
      settledWithCgst: 0,
      settledWithSgst: 0,
      finalPayable: 0
    },
    sgst: {
      payable: Math.max(0, balance.output.sgst),
      settledWithIgst: 0,
      settledWithCgst: 0,
      settledWithSgst: 0,
      finalPayable: 0
    }
  };

  // Available credits
  let igstCredit = Math.max(0, balance.input.igst) + 25000;
  let cgstCredit = Math.max(0, balance.input.cgst) +12680;
  let sgstCredit = Math.max(0, balance.input.sgst) +8650 ;

 
  // Step 1: Settle IGST first
  if (settlement.igst.payable > 0) {
    // First use IGST credit
    settlement.igst.settledWithIgst = Math.min(settlement.igst.payable, igstCredit);
    igstCredit -= settlement.igst.settledWithIgst;
    
    // Then use CGST credit if needed
    if (settlement.igst.payable > settlement.igst.settledWithIgst) {
      settlement.igst.settledWithCgst = Math.min(
        settlement.igst.payable - settlement.igst.settledWithIgst,
        cgstCredit
      );
      cgstCredit -= settlement.igst.settledWithCgst;
    }
    
    // Finally use SGST credit if still needed
    if (settlement.igst.payable > settlement.igst.settledWithIgst + settlement.igst.settledWithCgst) {
      settlement.igst.settledWithSgst = Math.min(
        settlement.igst.payable - settlement.igst.settledWithIgst - settlement.igst.settledWithCgst,
        sgstCredit
      );
      sgstCredit -= settlement.igst.settledWithSgst;
    }
  }

  // Calculate final IGST payable
  settlement.igst.finalPayable = Math.max(
    0,
    settlement.igst.payable -
      settlement.igst.settledWithIgst -
      settlement.igst.settledWithCgst -
      settlement.igst.settledWithSgst
  );

  // Step 2: Settle CGST only after IGST is fully settled
  if (settlement.cgst.payable > 0 && settlement.igst.finalPayable === 0) {
    // First try to use remaining IGST credit
    if (igstCredit > 0) {
      settlement.cgst.settledWithIgst = Math.min(settlement.cgst.payable, igstCredit);
      igstCredit -= settlement.cgst.settledWithIgst;
    }

    // Then use CGST credit only if IGST credit is exhausted
    if (igstCredit === 0) {
      settlement.cgst.settledWithCgst = Math.min(
        settlement.cgst.payable - settlement.cgst.settledWithIgst,
        cgstCredit
      );
      cgstCredit -= settlement.cgst.settledWithCgst;
    }
  }

  // Calculate final CGST payable
  settlement.cgst.finalPayable = Math.max(
    0,
    settlement.cgst.payable -
      settlement.cgst.settledWithIgst -
      settlement.cgst.settledWithCgst
  );

  // Step 3: Settle SGST only after both IGST and CGST are fully settled
  if (settlement.sgst.payable > 0 && 
      settlement.igst.finalPayable === 0) {
    // First try to use remaining IGST credit
    if (igstCredit > 0) {
      settlement.sgst.settledWithIgst = Math.min(settlement.sgst.payable, igstCredit);
      igstCredit -= settlement.sgst.settledWithIgst;
    }

    // Then use SGST credit only if IGST credit is exhausted
    if (igstCredit === 0) {
      settlement.sgst.settledWithSgst = Math.min(
        settlement.sgst.payable - settlement.sgst.settledWithIgst,
        sgstCredit
      );
      sgstCredit -= settlement.sgst.settledWithSgst;
    }
  }

  // Calculate final SGST payable
  settlement.sgst.finalPayable = Math.max(
    0,
    settlement.sgst.payable -
      settlement.sgst.settledWithIgst -
      settlement.sgst.settledWithSgst
  );


  return settlement;
}