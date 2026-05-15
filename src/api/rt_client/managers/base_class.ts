export abstract class EntinyManager<T>{
  abstract load(id: number): void;
  abstract add(id: number, item: T): void;
  abstract addMany(items: Map<number, T>): void;
  abstract addArray(id: number, items: T[]): void;
  abstract remove(id: number): void;
  abstract update(id: number, data: Partial<T>): void;
  abstract get(id: number): void;
};