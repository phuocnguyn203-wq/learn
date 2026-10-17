interface Customer {
  id: string;
  name: string;
  tier: "standard" | "vip";
  points?: number;
}

function isLoyalCustomer(customer: Customer | undefined): customer is Customer {
  return customer !== undefined;
}

function bannerFor(customer: Customer | undefined): string {
  if (isLoyalCustomer(customer)) {
    if (customer.points && customer.points >= 100)
      return `${customer.name} ơi, bạn có ${customer.points} điểm để đổi vé!`;
    if (customer.tier === "vip")
      return `Chào khách VIP ${customer.name}`;
  }

  return "Đăng nhập để tích điểm";
}

console.log(bannerFor({ id: "1", name: "An", tier: "standard", points: 250 }));  // An ơi, bạn có 250 điểm để đổi vé!
console.log(bannerFor({ id: "2", name: "Bình", tier: "vip", points: 40 }));      // Chào khách VIP Bình
console.log(bannerFor({ id: "3", name: "Chi", tier: "vip" }));                   // Chào khách VIP Chi
console.log(bannerFor({ id: "4", name: "Dũng", tier: "standard", points: 10 })); // Đăng nhập để tích điểm
console.log(bannerFor(undefined));                                               // Đăng nhập để tích điểm

