import AsyncStorage from "@react-native-async-storage/async-storage";

export class MessagesQueue {
  private queue: any[] = new Array();

  public push(item: any) {
    AsyncStorage.setItem("", "")
    this.queue.push(item);
  };

  public pop(): any {
    const item = this.queue.at(0);
    this.queue = this.queue.slice(1, this.queue.length - 1);
    return item;
  };

  public clear() {
    this.queue = new Array();
  };

  public flush(): any[] {
    const items: any[] = this.queue;
    this.queue.length = 0;
    return items;
  };
};