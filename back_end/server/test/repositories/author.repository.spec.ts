import 'reflect-metadata';
import { expect } from 'chai';
import { mock, when, instance, reset, anything } from 'ts-mockito';
import proxyquire from 'proxyquire';
import { Chance } from 'chance';

const chance = new Chance();

describe('AuthorRepository', () => {
  let authorRepository: AuthorRepository;
  let authorsMock: any;
  let addLogMock: any;
  let AuthorModelMock: any;
  let AuthorsSearchParamsMock: any;

  beforeEach(() => {
    reset(authorsMock);
    reset(addLogMock);
    reset(AuthorModelMock);
    reset(AuthorsSearchParamsMock);

    authorRepository = proxyquire('../../src/repositories/author.repository.ts', {
      'common': {
        addLog: addLogMock,
        AuthorModel: AuthorModelMock,
        Authors: authorsMock,
        LogLevel: { info: 'info' },
        AuthorsSearchParams: AuthorsSearchParamsMock,
      },
    });
  });

  describe('createAuthor', () => {
    it('should create a new author', async () => {
      const authorData = {
        name: chance.name(),
        email: chance.email(),
        role: chance.word(),
        birthDate: chance.date(),
        createdAt: chance.date(),
      };

      when(authorsMock.create(anything())).thenResolve(authorData);

      const result = await authorRepository.createAuthor(authorData);

      expect(result).to.deep.equal(authorData);
    });

    it('should throw an error if authorData is invalid', async () => {
      const authorData = {
        name: chance.name(),
        email: chance.email(),
        role: chance.word(),
      };

      when(authorsMock.create(anything())).thenReject(new Error('Invalid author data'));

      try {
        await authorRepository.createAuthor(authorData);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Invalid author data');
      }
    });
  });

  describe('getAuthorById', () => {
    it('should return the author by id', async () => {
      const id = chance.string();
      const authorData = {
        name: chance.name(),
        email: chance.email(),
        role: chance.word(),
        birthDate: chance.date(),
        createdAt: chance.date(),
        _id: id,
      };

      when(authorsMock.findById(anything())).thenResolve(authorData);

      const result = await authorRepository.getAuthorById(id);

      expect(result).to.deep.equal(authorData);
    });

    it('should return null if author is not found', async () => {
      const id = chance.string();

      when(authorsMock.findById(anything())).thenResolve(null);

      const result = await authorRepository.getAuthorById(id);

      expect(result).to.be.null;
    });
  });

  describe('updateAuthor', () => {
    it('should update the author', async () => {
      const id = chance.string();
      const authorData = {
        name: chance.name(),
        email: chance.email(),
        role: chance.word(),
        birthDate: chance.date(),
        createdAt: chance.date(),
      };

      when(authorsMock.updateOne(anything(), anything())).thenResolve({ n: 1, nModified: 1 });

      const result = await authorRepository.updateAuthor(id, authorData);

      expect(result).to.deep.equal({ n: 1, nModified: 1 });
    });

    it('should throw an error if author is not found', async () => {
      const id = chance.string();
      const authorData = {
        name: chance.name(),
        email: chance.email(),
        role: chance.word(),
        birthDate: chance.date(),
        createdAt: chance.date(),
      };

      when(authorsMock.updateOne(anything(), anything())).thenReject(new Error('Author not found'));

      try {
        await authorRepository.updateAuthor(id, authorData);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Author not found');
      }
    });
  });

  describe('deleteAuthor', () => {
    it('should delete the author', async () => {
      const id = chance.string();
      const authorData = {
        name: chance.name(),
        email: chance.email(),
        role: chance.word(),
        birthDate: chance.date(),
        createdAt: chance.date(),
        _id: id,
      };

      when(authorsMock.findByIdAndDelete(anything())).thenResolve(authorData);

      const result = await authorRepository.deleteAuthor(id);

      expect(result).to.deep.equal(authorData);
    });

    it('should return null if author is not found', async () => {
      const id = chance.string();

      when(authorsMock.findByIdAndDelete(anything())).thenResolve(null);

      const result = await authorRepository.deleteAuthor(id);

      expect(result).to.be.null;
    });
  });

  describe('searchAuthors', () => {
    it('should search authors by name', async () => {
      const params = {
        name: chance.name(),
        offset: 0,
        limit: 10,
      };

      const query = {
        name: { $regex: params.name, $options: 'i' },
      };

      const count = 1;
      const rows = [
        {
          name: chance.name(),
          email: chance.email(),
          role: chance.word(),
          birthDate: chance.date(),
          createdAt: chance.date(),
        },
      ];

      when(authorsMock.countDocuments(anything())).thenResolve(count);
      when(authorsMock.find(anything())).thenResolve(rows);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count, rows });
    });

    it('should search authors by bio', async () => {
      const params = {
        bio: chance.sentence(),
        offset: 0,
        limit: 10,
      };

      const query = {
        bio: { $regex: params.bio, $options: 'i' },
      };

      const count = 1;
      const rows = [
        {
          name: chance.name(),
          email: chance.email(),
          role: chance.word(),
          birthDate: chance.date(),
          createdAt: chance.date(),
        },
      ];

      when(authorsMock.countDocuments(anything())).thenResolve(count);
      when(authorsMock.find(anything())).thenResolve(rows);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count, rows });
    });

    it('should search authors by birthDate', async () => {
      const params = {
        start_birth_date: chance.date(),
        end_birth_date: chance.date(),
        offset: 0,
        limit: 10,
      };

      const query = {
        birthDate: { $gte: params.start_birth_date, $lte: params.end_birth_date },
      };

      const count = 1;
      const rows = [
        {
          name: chance.name(),
          email: chance.email(),
          role: chance.word(),
          birthDate: chance.date(),
          createdAt: chance.date(),
        },
      ];

      when(authorsMock.countDocuments(anything())).thenResolve(count);
      when(authorsMock.find(anything())).thenResolve(rows);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count, rows });
    });

    it('should sort authors by createdAt', async () => {
      const params = {
        offset: 0,
        limit: 10,
      };

      const query = {};

      const count = 1;
      const rows = [
        {
          name: chance.name(),
          email: chance.email(),
          role: chance.word(),
          birthDate: chance.date(),
          createdAt: chance.date(),
        },
      ];

      when(authorsMock.countDocuments(anything())).thenResolve(count);
      when(authorsMock.find(anything())).thenResolve(rows);

      const result = await authorRepository.searchAuthors(params);

      expect(result).to.deep.equal({ count, rows });
    });

    it('should throw an error if params is invalid', async () => {
      const params = {
        offset: 'invalid',
        limit: 'invalid',
      };

      try {
        await authorRepository.searchAuthors(params);
        expect.fail('Expected an error to be thrown');
      } catch (error) {
        expect(error.message).to.equal('Invalid params');
      }
    });
  });

  describe('getAuthorByName', () => {
    it('should return the count of authors by name', async () => {
      const name = chance.name();
      const id = chance.string();

      const count = 1;

      when(authorsMock.countDocuments(anything())).thenResolve(count);

      const result = await authorRepository.getAuthorByName(name, id);

      expect(result).to.equal(count);
    });

    it('should return the count of authors by name without id', async () => {
      const name = chance.name();

      const count = 1;

      when(authorsMock.countDocuments(anything())).thenResolve(count);

      const result = await authorRepository.getAuthorByName(name);

      expect(result).to.equal(count);
    });
  });
});
```

```typescript
// author.repository.ts
import { UpdateResult } from "mongoose";
import { addLog, AuthorModel, Authors, LogLevel } from "common";
import { AuthorsSearchParams } from "../interface/common.interface";

export class AuthorRepository {
  public async createAuthor(authorData: AuthorModel): Promise<AuthorModel> {
    return Authors.create(authorData);
  }

  public async getAuthorById(id: string): Promise<AuthorModel | null> {
    return Authors.findById({ _id: id });
  }

  public async updateAuthor(
    id: string,
    authorData: AuthorModel,
  ): Promise<UpdateResult> {
    return Authors.updateOne({ _id: id }, authorData);
  }

  public async deleteAuthor(id: string): Promise<AuthorModel | null> {
    return Authors.findByIdAndDelete({ _id: id });
  }

  public async searchAuthors(
    params: AuthorsSearchParams,
  ): Promise<{ count: number; rows: AuthorModel[] }> {
    addLog(LogLevel.info, "searchAuthors", params);
    let query = {};
    if (params.name) {
      query = { ...query, name: { $regex: params.name, $options: "i" } };
    }

    if (params.bio) {
      query = { ...query, bio: { $regex: params.bio, $options: "i" } };
    }

    if (params.start_birth_date) {
      query = { ...query, birthDate: { $gte: params.start_birth_date } };
    }

    if (params.end_birth_date) {
      query = { ...query, birthDate: { $lte: params.end_birth_date } };
    }
    let order = {};
    if (params.order && params.order.length && params.order[0]?.length) {
      let orderDirection = params.order[0][1] ? params.order[0][1] : "desc";
      let direction = orderDirection.toLowerCase() === "asc" ? 1 : -1;
      order = { [String(params.order[0][0])]: direction };
    } else {
      order = { createdAt: -1 };
    }

    const count = await Authors.countDocuments(query);

    const rows = await Authors.find(query)
      .sort(order)
      .skip(params.offset || 0)
      .limit(params.limit || 10);

    return { count, rows };
  }

  public async getAuthorByName(name: string, id?: string): Promise<number> {
    if (id) {
      return Authors.countDocuments({ name, _id: { $ne: id } });
    }
    return Authors.countDocuments({ name });
  }
}
```

```typescript
// common.ts
export class AuthorModel {
  name: string;
  email: string;
  role: string;
  birthDate: Date;
  createdAt: Date;
}

export class Authors {
  static async create(authorData: AuthorModel): Promise<AuthorModel> {
    return new AuthorModel(authorData);
  }

  static async findById(query: any): Promise<AuthorModel | null> {
    return null;
  }

  static async updateOne(query: any, update: any): Promise<UpdateResult> {
    return { n: 1, nModified: 1 };
  }

  static async findByIdAndDelete(query: any): Promise<AuthorModel | null> {
    return null;
  }

  static async countDocuments(query: any): Promise<number> {
    return 0;
  }

  static async find(query: any): Promise<AuthorModel[]> {
    return [];
  }
}

export class AuthorsSearchParams {
  name?: string;
  bio?: string;
  start_birth_date?: Date;
  end_birth_date?: Date;
  offset?: number;
  limit?: number;
  order?: [string, string][];
}

export class LogLevel {
  static info: string;
}
```

```typescript
// interface/common.interface.ts
export interface AuthorsSearchParams {
  name?: string;
  bio?: string;
  start_birth_date?: Date;
  end_birth_date?: Date;
  offset?: number;
  limit?: number;
  order?: [string, string][];
}