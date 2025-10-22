// 本地 d3-dispatch 类型定义，用于覆盖有问题的 node_modules 中的类型定义
declare module 'd3-dispatch' {
  export interface Dispatch<This, EventMap> {
    on(type: string, callback: Function | null): this;
    copy(): Dispatch<This, EventMap>;
    call(type: string, that?: This, ...args: any[]): void;
    apply(type: string, that?: This, args?: any[]): void;
  }

  export function dispatch<This = any, EventMap = any>(...types: string[]): Dispatch<This, EventMap>;
}