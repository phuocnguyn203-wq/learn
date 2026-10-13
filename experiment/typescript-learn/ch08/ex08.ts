abstract class TxId {
  private static latestId: number = 0;
  static readonly PREFIX = "TX";

  static next() {
    TxId.latestId ++;
    const paddedId = String(TxId.latestId).padStart(6, "0");
    return `${TxId.PREFIX}${paddedId}`;
  }

  static issued() {
    return TxId.latestId;
  }
}

console.log(TxId.next());     // TX-000001
console.log(TxId.next());     // TX-000002
console.log(TxId.next());     // TX-000003
console.log(TxId.issued());   // 3
console.log(TxId.PREFIX);     // TX

