type DispatcherKey<M> = string & keyof M;
type DispatcherCallback<T> = (arg: T) => void;
type DispatcherEventObject<M> = {
  [K in keyof M]?: ((cb: M[K]) => void)[]
};

export class Dispatcher<M> {

  private Events: DispatcherEventObject<M>;
  
  constructor() {
    this.Events = {};
  }

  subscribe<K extends DispatcherKey<M>>(event: K, cb: DispatcherCallback<M[K]>) {

    this.Events[event] = (this.Events[event] || []).concat(cb);

    return () => {
      this.Events[event] = (this.Events[event] || []).filter(x => x !== cb);
    };
  }

  dispatch<K extends DispatcherKey<M>>(event: K, data: M[K]) {
    if (import.meta.env.VITE_DISPATCHER_LOGGING) console.log(`DISPATCHER: ${event} with data ${data}`);
    (this.Events[event] || []).forEach(cb => cb(data));
  }

}