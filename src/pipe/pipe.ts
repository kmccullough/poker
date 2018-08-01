export interface Pipe {
  transform(value: any, ...params: any[]): any;
}
