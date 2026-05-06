import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import { mock, instance, reset, when, anything, verify } from 'ts-mockito';
import proxyquire from 'proxyquire';
import type { CommonRepository } from '../../src/repositories/common.repository';

describe('CommonRepository', () => {
  let testModule: any;
  let mockCommon: any;
  let mockRoles: any;
  let mockUsers: any;
  let mockUsersModel: any;
  let mockRoleModel: any;
  let mockUsersModelFind: any;
  let mockUsersModelFindById: any;
  let mockUsersModelUpdateOne: any;
  let mockUsersModelCreate: any;
  let mockUsersModelFindByIdPopulate: any;
  let repository: CommonRepository;

  beforeEach(() => {
    mockCommon = mock<any>();
    mockRoles = mock<any>();
    mockUsers = mock<any>();
    mockUsersModelFind = mock<any>();
    mockUsersModelFindById = mock<any>();
    mockUsersModelUpdateOne = mock<any>();
    mockUsersModelCreate = mock<any>();
    mockUsersModelFindByIdPopulate = mock<any>();

    when(mockCommon.Roles).thenReturn(instance(mockRoles));
    when(mockCommon.Users).thenReturn(instance(mockUsers));
    when(mockUsers.find(anything())).thenReturn(instance(mockUsersModelFind));
    when(mockUsers.findById(anything())).thenReturn(instance(mockUsersModelFindById));
    when(mockUsers.updateOne(anything())).thenReturn(instance(mockUsersModelUpdateOne));
    when(mockUsers.create(anything())).thenReturn(instance(mockUsersModelCreate));
    when(mockUsers.findById(anything()).populate(anything())).thenReturn(instance(mockUsersModelFindByIdPopulate));

    testModule = proxyquire('../../src/repositories/common.repository', { 'common': mockCommon });
    repository = new testModule.CommonRepository();
  });

  afterEach(() => {
    reset(mockCommon);
    reset(mockRoles);
    reset(mockUsers);
    reset(mockUsersModelFind);
    reset(mockUsersModelFindById);
    reset(mockUsersModelUpdateOne);
    reset(mockUsersModelCreate);
    reset(mockUsersModelFindByIdPopulate);
  });

  it('should get roles', async () => {
    // arrange
    const mockRolesFind = mock<any>();
    when(mockRoles.find(anything())).thenReturn(instance(mockRolesFind));
    when(mockRolesFind.exec()).thenResolve([{}]);

    // act
    const result = await repository.getRoles();

    // assert
    expect(result).to.deep.equal([{}]);
    verify(mockRoles.find(anything())).once();
  });

  it('should get role by id', async () => {
    // arrange
    const mockRolesFindById = mock<any>();
    when(mockRoles.findById(anything())).thenReturn(instance(mockRolesFindById));
    when(mockRolesFindById.exec()).thenResolve({});

    // act
    const result = await repository.getRoleById('id');

    // assert
    expect(result).to.deep.equal({});
    verify(mockRoles.findById(anything())).once();
  });

  it('should update user', async () => {
    // arrange
    const mockUsersUpdateOne = mock<any>();
    when(mockUsers.updateOne(anything())).thenReturn(instance(mockUsersUpdateOne));
    when(mockUsersUpdateOne.exec()).thenResolve({});

    // act
    const result = await repository.updateUser({} as any, 'id');

    // assert
    expect(result).to.deep.equal({});
    verify(mockUsers.updateOne(anything())).once();
  });

  it('should get user by id', async () => {
    // arrange
    const mockUsersFindByIdPopulate = mock<any>();
    when(mockUsers.findById(anything()).populate(anything())).thenReturn(instance(mockUsersFindByIdPopulate));
    when(mockUsersFindByIdPopulate.exec()).thenResolve({});

    // act
    const result = await repository.getUserById('id');

    // assert
    expect(result).to.deep.equal({});
    verify(mockUsers.findById(anything()).populate(anything())).once();
  });

  it('should create user', async () => {
    // arrange
    const mockUsersCreate = mock<any>();
    when(mockUsers.create(anything())).thenReturn(instance(mockUsersCreate));
    when(mockUsersCreate.exec()).thenResolve({});

    // act
    const result = await repository.createUser({} as any);

    // assert
    expect(result).to.deep.equal({});
    verify(mockUsers.create(anything())).once();
  });
});