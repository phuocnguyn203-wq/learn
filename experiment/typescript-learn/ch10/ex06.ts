interface Product {
  sku: string;
  name: string;
  stock: number;
}

class Inventory<Item> {
  items: Item[]

  constructor(items: Item[]) {
    this.items = items;
  }

  add(item: Item) {
    this.items.push(item);
  }

  map<Result>(fn: (p: Item) => Result) {
    return this.items.map(fn);
  }

  static of<StaticItem>(...items: StaticItem[]) {
    return new Inventory(items);
  }
}

class ProductInventory extends Inventory<Product> {
  lowStock(threshold: number) {
    return this.items.filter((val) => val.stock < threshold);
  }
}

const inv = new ProductInventory([{ sku: "A1", name: "Áo", stock: 3 }]);
const skus: string[] = inv.map((p) => p.sku);
const stocks: number[] = inv.map((p) => p.stock);
const tags: Inventory<string> = Inventory.of("sale", "new");
// @ts-expect-error
inv.add({ sku: "B2", name: "Quần" });
