declare module 'better-sqlite3' {
  interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  interface Statement {
    run(...params: unknown[]): RunResult;
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
  }

  interface DatabaseInstance {
    pragma(source: string): unknown;
    exec(source: string): this;
    prepare(source: string): Statement;
    transaction<T extends (...args: unknown[]) => unknown>(fn: T): T;
    close(): this;
  }

  interface DatabaseConstructor {
    new (filename: string, options?: Record<string, unknown>): DatabaseInstance;
    prototype: DatabaseInstance;
  }

  namespace Database {
    type Database = DatabaseInstance;
  }

  const Database: DatabaseConstructor;
  export default Database;
}
