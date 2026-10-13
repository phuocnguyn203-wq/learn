class OtpSession {
  phone: string;
  code?: string;
  attempt = 0;
  readonly maxAttempts = 3;
  readonly createdAt: number;
  verifiedAt?: Date;

  constructor(phone: string) {
    this.phone = phone;
    this.createdAt = Date.now();
    this.generate();
  }

  generate() {
    this.code = String(Math.floor(100000 + Math.random() * 900000));
  }

  verify(input: string): boolean {
    if (this.attempt >= this.maxAttempts) {
      return false;
    }
    this.attempt += 1;
    if (input === this.code) {
      this.verifiedAt = new Date();
      return true;
    }
    return false;
  }

  verifiedYear(): number | undefined {
    return this.verifiedAt?.getFullYear();
  }
}

console.log(new OtpSession("0901234567").verify("123456"));