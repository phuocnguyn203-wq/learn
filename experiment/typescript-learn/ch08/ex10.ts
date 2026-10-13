abstract class Entry{
  static #lastestId = 0;
  readonly id: string;
  readonly amount: number;
  note?: string;
  constructor(amount: number) {
    if (amount <= 0) {
      throw new Error(`amount muse be positive, given ${amount} instead`);
    }
    Entry.#lastestId++;
    this.id = `E-${Entry.#lastestId}`;
    this.amount = amount;
  }

  abstract signedAmount(): number;
  abstract label(): string;
  toCsvRow() {
    const noteCsv = this.note ? `${this.note}` : "";
    return `${this.id}, ${this.label()}, ${this.signedAmount()}, ${noteCsv}`;
  }
}

class Income extends Entry {
  static labelText = "income";
  constructor(amount: number) {
    super(amount);
  }

  signedAmount(): number {
    return this.amount;
  }

  label() {
    return Income.labelText;
  }
}

class Expense extends Entry {
  static labelText = "expense";
  category: string;
  constructor(amount: number, category: string) {
    super(amount);
    this.category = category;
  }

  signedAmount(): number {
    return -this.amount;
  }

  label(): string {
    return `${Expense.labelText}: ${this.category}`;
  }
}

class Ledger {
  readonly owner: string;
  #entries: Entry[] = [];
  #balance = 0;
  constructor(owner: string) {
    this.owner = owner;
  }

  add(entry: Entry) {
    const newBalance = this.#balance + entry.signedAmount();
    if (newBalance < 0) {
      throw new Error("Insufficient balance");
    }
    this.#balance = newBalance;
    this.#entries.push(entry);
  }

  balance(): number {
    return this.#balance;
  }

  count(): number {
    return this.#entries.length;
  }

  toCsvRow(): string {
    return `${this.owner}, ${this.count()}, ${this.#balance}`;
  }

  exportCsv() {
    let csvLedger = "[";
    for (const entry of this.#entries) {
      csvLedger += entry.toCsvRow() + ",\n"
    }
    csvLedger += "]";
    return csvLedger;
  }
}

interface Csvable {
  toCsvRow(): string;
}

function toCsv(...csvables: Csvable[]) {
  const csvs = [];
  for (const csvable of csvables) {
    csvs.push(csvable.toCsvRow());
  }
  return csvs;
}

const ledger = new Ledger("Thu Hà");

const salary = new Income(15000000);
salary.note = "lương tháng 10";
ledger.add(salary);
ledger.add(new Expense(4500000, "nhà"));

const coffee = new Expense(45000, "ăn uống");
coffee.note = "cà phê";
ledger.add(coffee);

console.log(ledger.balance());   // 10455000
console.log(ledger.count());     // 3

//ledger.add(new Expense(20000000, "xe"));   // ném Error: Không đủ số dư
console.log(ledger.count());     // 3

console.log(ledger.exportCsv());
// [
//   'id,loại,số tiền,ghi chú',
//   'E-1,thu,15000000,lương tháng 10',
//   'E-2,chi:nhà,-4500000,',
//   'E-3,chi:ăn uống,-45000,cà phê'
// ]

console.log(toCsv(ledger, salary, new Income(200000)));
// [ 'Thu Hà,3,10455000', 'E-1,thu,15000000,lương tháng 10', 'E-5,thu,200000,' ]

//new Income(-5);   // ném Error: Số tiền phải lớn hơn 0

