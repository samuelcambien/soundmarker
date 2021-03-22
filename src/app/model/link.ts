class Service<T extends Model> {

}

export abstract class Model {

  // abstract getService(): Service;
}

export abstract class Link<T extends Model> {

  abstract get(): T;
}
