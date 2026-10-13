class RequestCounter {
  count = 0;

  record() {
    this.count += 1;
  }
}

// Hàm của framework, không sửa được
function onEveryRequest(handler: () => void) {
  handler();
  handler();
}

const counter = new RequestCounter();
onEveryRequest(counter.record.bind(counter));
/*
counter.record only give reference to record,
counter must be binded to work
*/
console.log(counter.count);
