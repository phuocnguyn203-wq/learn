function createEventHandler<Payload>(handler: (payload: Payload) => void) {
  return (payload: Payload) => {
    console.log(`[event]: ${payload}`);
    handler(payload);
  };
}

interface CartItem {
  sku: string; 
  quantity: number 
}

const onAddToCart = createEventHandler<CartItem>((item) => {
  console.log(item.sku, item.quantity);
})

// onAddToCart({ sku: "A1" });
