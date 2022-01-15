import "reflect-metadata";

interface Type<T> {
  new (...args: any[]): T;
}

type GenericClassDecorator<T> = (target: T) => void;

const Service = (): GenericClassDecorator<Type<object>> => {
  return (target: Type<object>) => {};
};

const Injector = new (class {
  resolve<T>(target: Type<any>): T {
    let tokens = Reflect.getMetadata("design:paramtypes", target) || [];

    let tokenRetrievalMessage =
      tokens.length === 0
        ? `${target.name} doesn't need an injection!`
        : `Here are the metadata tokens (class constructor names) needing injection into ${
            target.name
          }: ${tokens.map((token) => token.name).join(" ")}!`;
    console.log(tokenRetrievalMessage);

    let injections = tokens.map((token) => Injector.resolve<any>(token));

    return new target(...injections);
  }
})();

@Service()
class Wheel {
  private id: string;

  constructor() {
    console.log(
      `Getting called by the injector! This means wheel is being constructed!`
    );
    this.id = Math.floor(Math.random() * 5).toString();
  }

  do() {
    console.log(`Vroom! ${this.id}`);
  }
}

@Service()
class HandleBars {
  private id: string;

  constructor() {
    console.log(
      `Getting called by the injector! This means handlebars are being constructed!`
    );
    this.id = Math.floor(Math.random() * 10).toString();
  }

  do() {
    console.log(`Turning! ${this.id}`);
  }
}

@Service()
class Motorcycle {
  constructor(
    public wheel1: Wheel,
    public wheel2: Wheel,
    public bars: HandleBars
  ) {}

  do() {
    this.wheel1.do();
    this.wheel2.do();
    this.bars.do();
  }
}

const moto = Injector.resolve<Motorcycle>(Motorcycle);

moto.do();
