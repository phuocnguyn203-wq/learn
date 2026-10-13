interface PaymentProvider {
  readonly name: string;
  readonly feePercent: number;
  canPay(amount: number): boolean;
  pay(amount: number): string;
}

class BankTransferProvider implements PaymentProvider{
  readonly name = "Bank transfer";
  readonly feePercent = 0;

  canPay(amount: number) {
    return amount > 0 && amount < 50_000_000;
  }

  pay(amount: number) {
    if (!this.canPay(amount)) {
      throw new Error("Bank transfer can't handle this amount");
    }
    return `BANK-${amount}`;
  }
}

class CardProvider implements PaymentProvider {
  readonly name = "Card";
  readonly feePercent = 0.02;
  private limit: number;
  constructor(limit: number) {
    this.limit = limit;
  }

  getAmountAfterFee(amount: number) {
    return amount * (1 + this.feePercent);
  }

  canPay(amount: number) {
    const total = this.getAmountAfterFee(amount);
    return 0 <= total && total <= this.limit;
  }

  pay(amount: number) {
    const total = this.getAmountAfterFee(amount);
    if (!this.canPay(amount)) {
      throw new Error("Card limit is not enough");
    }
    this.limit -= total;
    return `CARD-${amount}`;
  }

  getRemaining() {
    return this.limit;
  }
}

function payWithFirstAvailable(providers: PaymentProvider[], amount: number) {
  for (const provider of providers) {
    try {
      const refCode = provider.pay(amount);
      return refCode;
    } catch (err) {
      continue;
    }
  }
  throw new Error("No approprite payment method");
}

const card = new CardProvider(1000000);
const bank = new BankTransferProvider();

console.log(payWithFirstAvailable([card, bank], 400000));   // CARD-400000
console.log(card.getRemaining());                           // 592000
console.log(payWithFirstAvailable([card, bank], 600000));   // BANK-600000
console.log(payWithFirstAvailable([card, bank], 500000));   // CARD-500000
console.log(card.getRemaining());                           // 82000

//payWithFirstAvailable([card, bank], 90000000);   // ném Error: Không có phương thức thanh toán phù hợp
//card.pay(90000);                                 // ném Error: Thẻ không đủ hạn mức
