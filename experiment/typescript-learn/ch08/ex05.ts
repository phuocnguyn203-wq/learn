class Transaction {
  readonly id: string;
  readonly amount: number;
  readonly feePercent: number = 0;

  constructor(id: string, amount: number) {
    if (amount <= 0) {
      throw new Error(`amount must be positive, given ${amount}`);
    }

    this.id = id;
    this.amount = amount;
  }

  fee() {
    return this.feePercent * this.amount;
  }

  total() {
    return this.amount + this.fee();
  }

  describe() {
    return `${this.id}: ${this.amount}`;
  }
}

class TopUp extends Transaction {
  source: string;

  constructor(id: string, amount: number, source: string) {
    super(id, amount);
    this.source = source;
  }

  describe() {
    return `${this.id}: deposit from ${this.source}`;
  }
}

class Transfer extends Transaction {
  toWallerId: string;
  readonly feePercent = 0.005;
  constructor(id: string, amount: number, toWalletId: string) {
    super(id, amount);
    this.toWallerId = toWalletId;
  }

  fee() {
    return Math.min(Math.max(Math.round(super.fee()), 1000), 10000) //clamp
  }

  describe() {
    return `${this.id}: transfer ${this.amount}đ to ${this.toWallerId}, fee ${this.fee()}`
  }
}

class Withdrawal extends Transaction {
  constructor(id: string, amount: number ){
    super(id, amount);
  }

  fee() {
    return 3300;
  }

  describe() {
    let desc = super.describe();
    desc += " withdraw to bank, fee 3300đ";
    return desc;
  }
}

function totalFees(transactions: Transaction[]) {
  let total = 0;
  for (const trans of transactions) {
    total += trans.fee();
  }
  return total;
}

const list: Transaction[] = [
  new TopUp("TX-1", 500000, "Vietcombank"),
  new Transfer("TX-2", 100000, "W-9"),
  new Transfer("TX-3", 800000, "W-9"),
  new Transfer("TX-4", 5000000, "W-4"),
  new Withdrawal("TX-5", 200000),
];

for (const transaction of list) {
  console.log(transaction.describe(), "|", transaction.total());
}
// TX-1: nạp 500000đ từ Vietcombank | 500000
// TX-2: chuyển 100000đ tới W-9, phí 1000đ | 101000
// TX-3: chuyển 800000đ tới W-9, phí 4000đ | 804000
// TX-4: chuyển 5000000đ tới W-4, phí 10000đ | 5010000
// TX-5: 200000đ (rút về ngân hàng, phí 3300đ) | 203300

console.log(totalFees(list));   // 18300
