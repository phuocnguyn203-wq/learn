abstract class Notifier {
  abstract readonly limit: number;
  protected sentCount = 0;
  channelName: string;

  constructor(channelName: string) {
    this.channelName = channelName;
    this.sentCount = this.sentCount;
  }

  send(to: string, message: string) {
    let cleanMessage = message.trim();
    if (cleanMessage.length === 0) {
      return false;
    }
    let notification = `[${this.channelName}] → ${to}: ${cleanMessage}`;
    if (notification.length > this.limit) {
      notification = notification.slice(0, this.limit-1) + "...";
    }
    this.sentCount += 1;

    console.log(notification);
  }

  getSentCount() {
    return this.sentCount;
  }
}

class SmsNotifier extends Notifier {
  limit = 160;
  constructor(channelName="SMS") {
    super(channelName);
  }
}

class PushNotifier extends Notifier {
  limit = 40;
  constructor(channelName="Push") {
    super(channelName);
  }
}

class EmailNotifier extends Notifier {
  limit = 10_000
  constructor(channelName="Email") {
    super(channelName);
  }
}

function notifyAll(channels: Notifier[], to: string, message: string) {
  let successCount = 0;
  for (const channel of channels) {
    try {
      channel.send(to, message);
      successCount ++;
    } catch {
      continue;
    }
  }
  return successCount
}

const sms = new SmsNotifier();
const push = new PushNotifier();
const email = new EmailNotifier("no-reply@vixu.test");

const message = "  Bạn vừa nhận 500.000đ từ Trần Thu Hà. Số dư hiện tại: 1.250.000đ.  ";
console.log(notifyAll([sms, push, email], "ha", message));
// [SMS → ha] Bạn vừa nhận 500.000đ từ Trần Thu Hà. Số dư hiện tại: 1.250.000đ.
// [Push → ha] Bạn vừa nhận 500.000đ từ Trần Thu Hà. S…
// [Email no-reply@vixu.test → ha] Bạn vừa nhận 500.000đ từ Trần Thu Hà. Số dư hiện tại: 1.250.000đ.
// 3

console.log(sms.send("0901234567", "   "));   // false
console.log(sms.getSentCount(), push.getSentCount(), email.getSentCount());   // 1 1 1
