class Wallet {
    readonly id: string;
    ownerName: string;
    nickname?: string;
    #balance = 0;
    constructor(id: string, ownerName: string, nickname?: string) {
        this.id = id;
        this.ownerName = ownerName;
        if (nickname !== undefined) {
            this.nickname = nickname;
        }
    }

    getBalance(): number {
        return this.#balance;
    }

    deposit(amount: number): void {
        if (amount <= 0) {
            throw new Error(`amount must be positive, given ${amount} instead`);
        }
        this.#balance += amount;
        console.log(`Deposit ${amount} dollar successfully`);
    }

    withdraw(amount: number): void {
        if (amount <= 0) {
            throw new Error(`amount must be positive, given ${amount} instead`);
        }
        if (amount > this.#balance) {
            throw new Error("Not sufficient balance");
        }
        this.#balance -= amount;
        console.log(`Withdraw ${amount} dollar successfully`);
    }

    label(): string {
        return this.nickname ? this.nickname : `Wallet of ${this.ownerName}`;
    }
}

const wallet = new Wallet("W-1", "Thu Hà");
console.log(wallet.label());            // Ví của Thu Hà
console.log(wallet.deposit(200000));    // 200000
console.log(wallet.withdraw(50000));    // 150000
wallet.nickname = "Ví đi chợ";
console.log(wallet.label());            // Ví đi chợ
console.log(wallet.getBalance());       // 150000

wallet.withdraw(1000000);               // ném Error: Số dư không đủ
wallet.deposit(0);                      // ném Error: Số tiền phải lớn hơn 0
