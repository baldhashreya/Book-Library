import 'reflect-metadata';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { Authors } from './author.repository';
import { addLog } from 'common';

chai.use(sinonChai);
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('AuthorRepository', () => {
  let authors: any;
  let addLogStub: sinon.SinonStub;

  beforeEach(async () => {
    authors = {
      create: sinon.stub().resolves({}),
      findById: sinon.stub().resolves({}),
      updateOne: sinon.stub().resolves({}),
      findByIdAndDelete: sinon.stub().resolves({}),
      countDocuments: sinon.stub().resolves(0),
      find: sinon.stub().resolves([]),
      sort: sinon.stub().returns({ skip: sinon.stub().returns({ limit: sinon.stub().resolves([]) }) }),
    };
    addLogStub = sinon.stub(addLog, 'default');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createAuthor', () => {
    it('should create a new author', async () => {
      const authorData = { name: 'John Doe', bio: 'Test bio' };
      authors.create = sinon.stub().resolves(authorData);
      const authorRepository = new AuthorRepository();
      const result = await authorRepository.createAuthor(authorData);
      expect(result).to.deep.equal(authorData);
    });

    it('should throw an error if create fails', async () => {
      const authorData = { name: 'John Doe', bio: 'Test bio' };
      authors.create = sinon.stub().rejects(new Error('Test error'));
      const authorRepository = new AuthorRepository();
      await expect(authorRepository.createAuthor(authorData)).to.be.rejectedWith(Error);
    });
  });

  describe('getAuthorById', () => {
    it('should get an author by id', async () => {
      const id = '1234567890';
      authors.findById = sinon.stub().resolves({ _id: id });
      const authorRepository = new AuthorRepository();
      const result = await authorRepository.getAuthorById(id);
      expect(result).to.deep.equal({ _id: id });
    });

    it('should return null if no author found', async () => {
      const id = '1234567890';
      authors.findById = sinon.stub().resolves(null);
      const authorRepository = new AuthorRepository();
      const result = await authorRepository.getAuthorById(id);
      expect(result).to.be.null;
    });
  });

  describe('updateAuthor', () => {
    it('should update an author', async () => {
      const id = '1234567890';
      const authorData = { name: 'John Doe', bio: 'Test bio' };
      authors.updateOne = sinon.stub().resolves({ modifiedCount: 1 });
      const authorRepository = new AuthorRepository();
      const result = await authorRepository.updateAuthor(id, authorData);
      expect(result).to.deep.equal({ modifiedCount: 1 });
    });

    it('should throw an error if update fails', async () => {
      const id = '1234567890';
      const authorData = { name: 'John Doe', bio: 'Test bio' };
      authors.updateOne = sinon.stub().rejects(new Error('Test error'));
      const authorRepository = new AuthorRepository();
      await expect(authorRepository.updateAuthor(id, authorData)).to.be.rejectedWith(Error);
    });
  });

  describe('deleteAuthor', () => {
    it('should delete an author', async () => {
      const id = '1234567890';
      authors.findByIdAndDelete = sinon.stub().resolves({ _id: id });
      const authorRepository = new AuthorRepository();
      const result = await authorRepository.deleteAuthor(id);
      expect(result).to.deep.equal({ _id: id });
    });

    it('should return null if no author found', async () => {
      const id = '1234567890';
      authors.findByIdAndDelete = sinon.stub().resolves(null);
      const authorRepository = new AuthorRepository();
      const result = await authorRepository.deleteAuthor(id);
      expect(result).to.be.null;
    });
  });

  describe('searchAuthors', () => {
    it('should search authors by name, bio, birth date, and order', async () => {
      const params = {
        name: 'John Doe',
        bio: 'Test bio',
        start_birth_date: '1990-01-01',
        end_birth_date: '1999-12-31',
        order: [['name', 'asc']],
      };
      const count = 10;
      const rows = [{ _id: '1234567890', name: 'John Doe', bio: 'Test bio' }];
      authors.countDocuments = sinon.stub().resolves(count);
      authors.find = sinon.stub().resolves(rows);
      authors.sort = sinon.stub().returns({ skip: sinon.stub().returns({ limit: sinon.stub().resolves(rows) }) });
      const authorRepository = new AuthorRepository();
      const result = await authorRepository.searchAuthors(params);
      expect(result).to.deep.equal({ count, rows });
    });

    it('should log searchAuthors function call', async () => {
      const params = {
        name: 'John Doe',
        bio: 'Test bio',
        start_birth_date: '1990-01-01',
        end_birth_date: '1999-12-31',
        order: [['name', 'asc']],
      };
      const authorRepository = new AuthorRepository();
      await authorRepository.searchAuthors(params);
      expect(addLogStub).to.have.been.calledWith('info', 'searchAuthors', params);
    });
  });

  describe('getAuthorByName', () => {
    it('should get author count by name', async () => {
      const name = 'John Doe';
      const id = '1234567890';
      const count = 10;
      authors.countDocuments = sinon.stub().resolves(count);
      const authorRepository = new AuthorRepository();
      const result = await authorRepository.getAuthorByName(name, id);
      expect(result).to.equal(count);
    });

    it('should get author count by name without id', async () => {
      const name = 'John Doe';
      const count = 10;
      authors.countDocuments = sinon.stub().resolves(count);
      const authorRepository = new AuthorRepository();
      const result = await authorRepository.getAuthorByName(name);
      expect(result).to.equal(count);
    });
  });
});