export interface AmortizationMonth {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  remainingBalance: number;
  extraPayment: number;
  totalInterestPaid: number;
  investmentValue: number;
  investmentGain: number;
  investmentValueReal: number;
  remainingBalanceReal: number;
  cumulativeInterestSaved: number;
  baselineBalance: number;
  baselineInterest: number;
  baselineCumulativeInterest: number;
  paydownSavings: number;
  netWorthA: number;
  netWorthB: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
  payoffMonths: number;
  schedule: AmortizationMonth[];
  investmentComparison: {
    totalInvested: number;
    investmentValue: number;
    interestSaved: number;
    paydownSavings: number;
    paydownSavingsGrowth: number;
    netWorthA: number;
    netWorthB: number;
    netWorthAReal: number;
    netWorthBReal: number;
    paydownSavingsGrowthReal: number;
    totalInterestReal: number;
    baselineCumulativeInterestReal: number;
    investmentYieldReal: number;
  };
}

export const calculateMortgage = (
  principal: number,
  annualRate: number,
  years: number,
  monthlyExtraPayment: number = 0,
  investmentReturnRate: number = 0,
  inflationRate: number = 0,
  oneTimePaymentAmount: number = 0,
  oneTimePaymentMonth: number = 0,
  continueInvestingAfterPayoff: boolean = false,
  postPayoffAmount: number = 0
): MortgageResult => {
  if (years <= 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalPaid: 0,
      payoffMonths: 0,
      schedule: [],
      investmentComparison: {
        totalInvested: 0,
        investmentValue: 0,
        interestSaved: 0,
        paydownSavings: 0,
        paydownSavingsGrowth: 0,
        netWorthA: 0,
        netWorthB: 0,
        netWorthAReal: 0,
        netWorthBReal: 0,
        paydownSavingsGrowthReal: 0,
        totalInterestReal: 0,
        baselineCumulativeInterestReal: 0,
        investmentYieldReal: 0
      }
    };
  }

  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  const monthlyPayment = monthlyRate > 0
    ? (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : principal / totalMonths;

  let balance = principal;
  let totalInterest = 0;
  let totalInterestReal = 0;
  let totalPaid = 0;
  let investmentValue = 0;
  let totalInvested = 0;
  let paydownSavings = 0;
  let paydownSavingsGrowth = 0;
  const investmentMonthlyRate = investmentReturnRate / 100 / 12;
  const inflationMonthlyRate = inflationRate / 100 / 12;

  const schedule: AmortizationMonth[] = [];

  // First, calculate baseline scenario (no extra payments)
  let baselineBalance = principal;
  let baselineCumulativeInterest = 0;
  let baselineCumulativeInterestReal = 0;
  const baselineValues: Array<{ balance: number; interest: number; totalInterest: number; totalInterestReal: number }> = [];

  for (let i = 1; i <= totalMonths; i++) {
    let monthlyBaselineInterest = 0;
    const inflationFactor = Math.pow(1 + inflationMonthlyRate, i);

    if (baselineBalance > 0) {
      const baselineInterest = baselineBalance * monthlyRate;
      const baselinePrincipal = monthlyPayment - baselineInterest;

      if (monthlyPayment >= baselineBalance + baselineInterest) {
        monthlyBaselineInterest = baselineBalance * monthlyRate;
        baselineCumulativeInterest += monthlyBaselineInterest;
        baselineCumulativeInterestReal += monthlyBaselineInterest / inflationFactor;
        baselineBalance = 0;
      } else {
        monthlyBaselineInterest = baselineInterest;
        baselineCumulativeInterest += baselineInterest;
        baselineCumulativeInterestReal += baselineInterest / inflationFactor;
        baselineBalance -= baselinePrincipal;
      }
    }

    baselineValues.push({
      balance: baselineBalance,
      interest: monthlyBaselineInterest,
      totalInterest: baselineCumulativeInterest,
      totalInterestReal: baselineCumulativeInterestReal
    });
  }

  for (let i = 1; i <= totalMonths; i++) {
    // Mortgage Calculation
    let interestPayment = 0;
    let principalPayment = 0;
    let actualPayment = 0;
    let actualExtra = 0;
    const inflationFactor = Math.pow(1 + inflationMonthlyRate, i);

    if (balance > 0) {
      interestPayment = balance * monthlyRate;
      let totalToPay = monthlyPayment + monthlyExtraPayment;

      // Add one-time payment if this is the specified month
      if (i === oneTimePaymentMonth && oneTimePaymentAmount > 0) {
        totalToPay += oneTimePaymentAmount;
        actualExtra = monthlyExtraPayment + oneTimePaymentAmount;
      } else {
        actualExtra = monthlyExtraPayment;
      }

      if (totalToPay >= balance + interestPayment) {
        actualPayment = balance + interestPayment;
        principalPayment = balance;
        balance = 0;

        // If we have overflow and continueInvestingAfterPayoff is true, add to paydownSavings
        if (continueInvestingAfterPayoff) {
          const overflow = totalToPay - actualPayment;
          if (overflow > 0) {
            paydownSavings += overflow;
          }
        }
      } else {
        actualPayment = totalToPay;
        principalPayment = actualPayment - interestPayment;
        balance -= principalPayment;
      }

      totalInterest += interestPayment;
      totalInterestReal += interestPayment / inflationFactor;
      totalPaid += actualPayment;
    } else if (continueInvestingAfterPayoff) {
      // Mortgage is paid off, continue investing
      // Calculate growth on existing savings
      if (paydownSavings > 0) {
        const growth = paydownSavings * investmentMonthlyRate;
        paydownSavings += growth;
        paydownSavingsGrowth += growth;
      }

      // Add contribution (Base + Extra)
      // Note: postPayoffAmount passed in is either monthlyPayment or custom amount
      // We also add monthlyExtraPayment to keep the snowball going
      let contribution = postPayoffAmount + monthlyExtraPayment;

      // Add one-time payment if this is the specified month (and it's after payoff)
      if (i === oneTimePaymentMonth && oneTimePaymentAmount > 0) {
        contribution += oneTimePaymentAmount;
      }

      paydownSavings += contribution;
    }

    // Investment Calculation (Scenario B: Invest Extra)
    // First, calculate gains on existing investment balance
    let monthlyInvestmentGain = 0;
    if (investmentValue > 0) {
      monthlyInvestmentGain = investmentValue * investmentMonthlyRate;
      investmentValue += monthlyInvestmentGain;
    }

    // Then add new contributions (monthly + one-time if applicable)
    let investmentContribution = monthlyExtraPayment;
    if (i === oneTimePaymentMonth && oneTimePaymentAmount > 0) {
      investmentContribution += oneTimePaymentAmount;
    }

    if (investmentContribution > 0) {
      investmentValue += investmentContribution;
      totalInvested += investmentContribution;
    }

    const cumulativeInvestmentGain = investmentValue - totalInvested;

    // Get baseline values for this month
    const baselineData = baselineValues[i - 1];
    const cumulativeInterestSaved = Math.max(0, baselineData.totalInterest - totalInterest);

    // Calculate inflation adjustment
    const investmentValueReal = investmentValue / inflationFactor;
    const remainingBalanceReal = balance / inflationFactor;

    // Calculate Net Worth for both scenarios
    // Scenario A: Paydown Savings (Assets) - Remaining Balance (Liabilities)
    const netWorthA = paydownSavings - balance;

    // Scenario B: Investment Value (Assets) - Baseline Balance (Liabilities)
    const netWorthB = investmentValue - baselineData.balance;

    schedule.push({
      month: i,
      payment: actualPayment,
      interest: interestPayment,
      principal: principalPayment,
      remainingBalance: balance,
      extraPayment: actualExtra,
      totalInterestPaid: totalInterest,
      investmentValue: investmentValue,
      investmentGain: cumulativeInvestmentGain,
      investmentValueReal: investmentValueReal,
      remainingBalanceReal: remainingBalanceReal,
      cumulativeInterestSaved: cumulativeInterestSaved,
      baselineBalance: baselineData.balance,
      baselineInterest: baselineData.interest,
      baselineCumulativeInterest: baselineData.totalInterest,
      paydownSavings: paydownSavings,
      netWorthA: netWorthA,
      netWorthB: netWorthB
    });
  }

  const interestSaved = Math.max(0, baselineCumulativeInterest - totalInterest);
  const lastPaymentMonth = schedule.findIndex(m => m.remainingBalance === 0);
  const payoffMonths = lastPaymentMonth !== -1 ? lastPaymentMonth + 1 : totalMonths;

  // Final Net Worth values
  const finalNetWorthA = schedule[schedule.length - 1].netWorthA;
  const finalNetWorthB = schedule[schedule.length - 1].netWorthB;

  // Calculate Real values for final summary
  const finalInflationFactor = Math.pow(1 + inflationMonthlyRate, totalMonths);
  const netWorthAReal = finalNetWorthA / finalInflationFactor;
  const netWorthBReal = finalNetWorthB / finalInflationFactor;
  const paydownSavingsGrowthReal = paydownSavingsGrowth / finalInflationFactor;
  const investmentYieldReal = (investmentValue - totalInvested) / finalInflationFactor;

  return {
    monthlyPayment,
    totalInterest,
    totalPaid,
    payoffMonths,
    schedule,
    investmentComparison: {
      totalInvested,
      investmentValue,
      interestSaved,
      paydownSavings,
      paydownSavingsGrowth,
      netWorthA: finalNetWorthA,
      netWorthB: finalNetWorthB,
      netWorthAReal,
      netWorthBReal,
      paydownSavingsGrowthReal,
      totalInterestReal,
      baselineCumulativeInterestReal: baselineCumulativeInterestReal,
      investmentYieldReal
    }
  };
};
