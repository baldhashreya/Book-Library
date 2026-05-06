import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import { mock, instance, reset, when, anything, verify } from 'ts-mockito';
import proxyquire from 'proxyquire';
import type { AuthorRepository } from '../../src/repositories/author.repository';

describe('AuthorRepository', () => {
  let testModule: any;
  let repository: AuthorRepository;
  let mockCommon: any;
  let mockAuthors: any;
  let mockModel: any;

  beforeEach(() => {
    mockCommon = mock<any>();
    mockAuthors = mock<any>();
    mockModel = mock<any>();

    when(mockAuthors.create(anything())).thenResolve({} as any);
    when(mockAuthors.findById(anything())).thenResolve({} as any);
    when(mockAuthors.updateOne(anything(), anything())).thenResolve({} as any);
    when(mockAuthors.findByIdAndDelete(anything())).thenResolve({} as any);
    when(mockAuthors.countDocuments(anything())).thenResolve(0 as any);
    when(mockAuthors.find(anything())).thenResolve({} as any);

    when(mockModel.find(anything())).thenReturn(instance(mockModel));
    when(mockModel.findById(anything())).thenReturn(instance(mockModel));
    when(mockModel.updateOne(anything(), anything())).thenReturn(instance(mockModel));
    when(mockModel.findByIdAndDelete(anything())).thenReturn(instance(mockModel));
    when(mockModel.countDocuments(anything())).thenReturn(instance(mockModel));
    when(mockModel.find(anything())).thenReturn(instance(mockModel));

    testModule = proxyquire('../../src/repositories/author.repository', {
      'common': mockCommon,
      'Authors': mockAuthors,
      'mongoose': mockModel,
    });

    repository = new testModule.AuthorRepository();
  });

  afterEach(() => {
    reset(mockCommon);
    reset(mockAuthors);
    reset(mockModel);
  });

  it('should create a new author', async () => {
    // arrange
    const authorData: any = {};

    // act
    const result = await repository.createAuthor(authorData);

    // assert
    expect(result).to.be.an('object');
    verify(mockAuthors.create(authorData)).once();
  });

  it('should get an author by id', async () => {
    // arrange
    const id: string = '1234567890';

    // act
    const result = await repository.getAuthorById(id);

    // assert
    expect(result).to.be.an('object');
    verify(mockAuthors.findById({ _id: id })).once();
  });

  it('should update an author', async () => {
    // arrange
    const id: string = '1234567890';
    const authorData: any = {};

    // act
    const result = await repository.updateAuthor(id, authorData);

    // assert
    expect(result).to.be.an('object');
    verify(mockAuthors.updateOne({ _id: id }, authorData)).once();
  });

  it('should delete an author', async () => {
    // arrange
    const id: string = '1234567890';

    // act
    const result = await repository.deleteAuthor(id);

    // assert
    expect(result).to.be.an('object');
    verify(mockAuthors.findByIdAndDelete({ _id: id })).once();
  });

  it('should search authors', async () => {
    // arrange
    const params: any = {};

    // act
    const result = await repository.searchAuthors(params);

    // assert
    expect(result).to.be.an('object');
    expect(result.count).to.be.a('number');
    expect(result.rows).to.be.an('array');
    verify(mockAuthors.countDocuments(anything())).once();
    verify(mockAuthors.find(anything())).once();
  });

  it('should get author count by name', async () => {
    // arrange
    const name: string = 'John Doe';
    const id: string = '1234567890';

    // act
    const result = await repository.getAuthorByName(name, id);

    // assert
    expect(result).to.be.a('number');
    verify(mockAuthors.countDocuments({ name, _id: { $ne: id } })).once();
  });
});