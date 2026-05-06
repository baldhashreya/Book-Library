import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import { mock, instance, reset, when, anything, verify } from 'ts-mockito';
import proxyquire from 'proxyquire';
import type { CategoriesModel, Categories } from 'common';
import type { CategoriesSearchParams } from '../interface/common.interface';

describe('CategoriesRepository', () => {
  let testModule: any;
  let categoriesModelMock: any;
  let categoriesSearchParamsMock: any;

  beforeEach(() => {
    categoriesModelMock = mock<CategoriesModel>();
    categoriesSearchParamsMock = mock<CategoriesSearchParams>();

    testModule = proxyquire('../../src/repositories/categories.repository.ts', {
      'common': {
        CategoriesModel: instance(categoriesModelMock),
        CategoriesSearchParams: instance(categoriesSearchParamsMock),
      },
    });
  });

  afterEach(() => {
    reset(categoriesModelMock);
    reset(categoriesSearchParamsMock);
  });

  it('should create a new category', async () => {
    // arrange
    const params: CategoriesModel = { name: 'test', status: 'ACTIVE' };
    when(categoriesModelMock.create(anything())).thenResolve(params);

    // act
    const result = await testModule.CategoriesRepository.createCategory(params);

    // assert
    expect(result).to.deep.equal(params);
    verify(categoriesModelMock.create(anything())).once();
  });

  it('should get category by name', async () => {
    // arrange
    const name = 'test';
    const id = '1234567890';
    when(categoriesModelMock.countDocuments(anything())).thenResolve(1);

    // act
    const result = await testModule.CategoriesRepository.getCategoryByName(name, id);

    // assert
    expect(result).to.equal(1);
    verify(categoriesModelMock.countDocuments({ name, _id: { $ne: id } })).once();
  });

  it('should update a category', async () => {
    // arrange
    const id = '1234567890';
    const params: Partial<CategoriesModel> = { name: 'test' };
    when(categoriesModelMock.findByIdAndUpdate(anything(), anything(), anything())).thenResolve({ _id: id, ...params });

    // act
    const result = await testModule.CategoriesRepository.updateCategory(id, params);

    // assert
    expect(result).to.deep.equal({ _id: id, ...params });
    verify(categoriesModelMock.findByIdAndUpdate(anything(), anything(), anything())).once();
  });

  it('should delete a category', async () => {
    // arrange
    const id = '1234567890';
    when(categoriesModelMock.findByIdAndDelete(anything())).thenResolve({ _id: id });

    // act
    const result = await testModule.CategoriesRepository.deleteCategory(id);

    // assert
    expect(result).to.deep.equal({ _id: id });
    verify(categoriesModelMock.findByIdAndDelete(anything())).once();
  });

  it('should search categories', async () => {
    // arrange
    const params: CategoriesSearchParams = {
      name: 'test',
      status: 'ACTIVE',
      order: [['name', 'asc']],
      limit: 10,
      offset: 0,
    };
    const query = { name: { $regex: 'test', $options: 'i' }, status: 'ACTIVE' };
    const order = { name: 1 };
    const count = 1;
    const rows = [{ _id: '1234567890', name: 'test', status: 'ACTIVE' }];
    const mockQuery = mock<any>();
    when(categoriesModelMock.countDocuments(anything())).thenResolve(count);
    when(categoriesModelMock.aggregate(anything())).thenResolve(rows);
    when(categoriesModelMock.find(anything())).thenReturn(instance(mockQuery));
    when(mockQuery.sort(anything())).thenReturn(instance(mockQuery));
    when(mockQuery.limit(anything())).thenResolve(rows);

    // act
    const result = await testModule.CategoriesRepository.searchCategory(params);

    // assert
    expect(result).to.deep.equal({ count, rows });
    verify(categoriesModelMock.countDocuments(anything())).once();
    verify(categoriesModelMock.aggregate(anything())).once();
    verify(categoriesModelMock.find(anything())).once();
    verify(mockQuery.sort(anything())).once();
    verify(mockQuery.limit(anything())).once();
  });

  it('should get category by id', async () => {
    // arrange
    const id = '1234567890';
    when(categoriesModelMock.findById(anything())).thenResolve({ _id: id });

    // act
    const result = await testModule.CategoriesRepository.getCategoryById(id);

    // assert
    expect(result).to.deep.equal({ _id: id });
    verify(categoriesModelMock.findById(anything())).once();
  });

  it('should create multiple categories', async () => {
    // arrange
    const params: CategoriesModel[] = [{ name: 'test', status: 'ACTIVE' }, { name: 'test2', status: 'INACTIVE' }];
    when(categoriesModelMock.insertMany(anything())).thenResolve(params);

    // act
    const result = await testModule.CategoriesRepository.createMoreCategories(params);

    // assert
    expect(result).to.deep.equal(params);
    verify(categoriesModelMock.insertMany(anything())).once();
  });
});