// Code đang chạy trên production — không sửa
class Voucher {
  code: string;
  percent: number;

  constructor(code: string, percent: number) {
    this.code = code;
    this.percent = percent;
  }

  apply(amount: number): number {
    return amount * (1 - this.percent / 100);
  }

  isValid(): boolean {
    return true;
  }
}

function checkout(amount: number, voucher: Voucher): number {
  return voucher.isValid() ? voucher.apply(amount) : amount;
}

// Phần thêm mới trong pull request
class CappedVoucher extends Voucher {
  maxDiscount: number;

  constructor(code: string, percent: number, maxDiscount: number) {
    super(code, percent);
    this.maxDiscount = maxDiscount;
    
  }

  apply(amount: number): number {
    const discount = Math.min((amount * this.percent) / 100, this.maxDiscount);
    return amount - discount;
  }
}

class ExpiringVoucher extends Voucher {
  expiresAt: Date;

  constructor(code: string, percent: number, expiresAt: Date) {
    super(code, percent);
    this.expiresAt = expiresAt;
  }

  isValid(): boolean {
    return (new Date()) < this.expiresAt;
  }
}

class FreeShipVoucher extends Voucher {
  constructor(code: string) {
    super(code, 100)
  }
}

console.log(checkout(500000, new CappedVoucher("GIAM20", 20, 50000)));                       // 450000
console.log(checkout(500000, new ExpiringVoucher("TET", 10, new Date("2020-01-01"))));       // 500000
console.log(checkout(30000, new FreeShipVoucher("SHIP")));                                   // 0
