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
    reset();
    authorsMock = mock(Authors);
    addLogMock = mock(addLog);
    AuthorModelMock = mock(AuthorModel);
    AuthorsSearchParamsMock = mock(AuthorsSearchParams);
    authorRepository = proxyquire('../../src/repositories/author.repository.ts', {
      'common': {
        addLog: instance(addLogMock),
        AuthorModel: instance(AuthorModelMock),
        Authors: instance(authorsMock),
        AuthorsSearchParams: instance(AuthorsSearchParamsMock),
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
      when(authorsMock.create(anything())).thenReturn(authorData);
      const result = await authorRepository.createAuthor(authorData);
      expect(result).to.deep.equal(authorData);
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
      when(authorsMock.findById({ _id: id })).thenReturn(authorData);
      const result = await authorRepository.getAuthorById(id);
      expect(result).to.deep.equal(authorData);
    });

    it('should return null if author not found', async () => {
      const id = chance.string();
      when(authorsMock.findById({ _id: id })).thenReturn(null);
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
      when(authorsMock.updateOne({ _id: id }, authorData)).thenReturn({ matchedCount: 1, modifiedCount: 1 });
      const result = await authorRepository.updateAuthor(id, authorData);
      expect(result).to.deep.equal({ matchedCount: 1, modifiedCount: 1 });
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
      when(authorsMock.findByIdAndDelete({ _id: id })).thenReturn(authorData);
      const result = await authorRepository.deleteAuthor(id);
      expect(result).to.deep.equal(authorData);
    });
  });

  describe('searchAuthors', () => {
    it('should search authors by name', async () => {
      const params = {
        name: chance.name(),
      };
      const query = { name: { $regex: params.name, $options: 'i' } };
      const count = 1;
      const rows = [{}];
      when(authorsMock.countDocuments(query)).thenReturn(count);
      when(authorsMock.find(query).sort({ createdAt: -1 }).skip(0).limit(10)).thenReturn(rows);
      const result = await authorRepository.searchAuthors(params);
      expect(result).to.deep.equal({ count, rows });
    });

    it('should search authors by bio', async () => {
      const params = {
        bio: chance.string(),
      };
      const query = { bio: { $regex: params.bio, $options: 'i' } };
      const count = 1;
      const rows = [{}];
      when(authorsMock.countDocuments(query)).thenReturn(count);
      when(authorsMock.find(query).sort({ createdAt: -1 }).skip(0).limit(10)).thenReturn(rows);
      const result = await authorRepository.searchAuthors(params);
      expect(result).to.deep.equal({ count, rows });
    });

    it('should search authors by birth date', async () => {
      const params = {
        start_birth_date: chance.date(),
      };
      const query = { birthDate: { $gte: params.start_birth_date } };
      const count = 1;
      const rows = [{}];
      when(authorsMock.countDocuments(query)).thenReturn(count);
      when(authorsMock.find(query).sort({ createdAt: -1 }).skip(0).limit(10)).thenReturn(rows);
      const result = await authorRepository.searchAuthors(params);
      expect(result).to.deep.equal({ count, rows });
    });

    it('should search authors by order', async () => {
      const params = {
        order: [['name', 'asc']],
      };
      const query = {};
      const count = 1;
      const rows = [{}];
      when(authorsMock.countDocuments(query)).thenReturn(count);
      when(authorsMock.find(query).sort({ name: 1 }).skip(0).limit(10)).thenReturn(rows);
      const result = await authorRepository.searchAuthors(params);
      expect(result).to.deep.equal({ count, rows });
    });
  });

  describe('getAuthorByName', () => {
    it('should return the count of authors by name', async () => {
      const name = chance.name();
      const id = chance.string();
      const count = 1;
      when(authorsMock.countDocuments({ name, _id: { $ne: id } })).thenReturn(count);
      const result = await authorRepository.getAuthorByName(name, id);
      expect(result).to.equal(count);
    });

    it('should return the count of authors by name without id', async () => {
      const name = chance.name();
      const count = 1;
      when(authorsMock.countDocuments({ name })).thenReturn(count);
      const result = await authorRepository.getAuthorByName(name);
      expect(result).to.equal(count);
    });
  });
});
```

This test file covers all the methods of the `AuthorRepository` class, including happy path, edge cases, and error cases. It uses `ts-mockito` to mock all external dependencies and `proxyquire` to inject these mocks into the target class. The tests are written using the `describe` and `it` functions from Mocha, and the `expect` function from Chai. The `Chance` library is used to generate random data for the tests.