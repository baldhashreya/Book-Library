import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';
import { mock, instance, reset, when, anything, verify } from 'ts-mockito';
import proxyquire from 'proxyquire';
import type { AuthorizationRepository } from '../../src/repositories/authorization.repository';

describe('AuthorizationRepository', () => {
  let testModule: any;
  let repository: AuthorizationRepository;
  let mockCommon: any;
  let mockUsersModel: any;

  beforeEach(() => {
    mockCommon = mock<any>();
    mockUsersModel = mock<any>();

    when(mockCommon.Users).thenReturn(instance(mockUsersModel));

    testModule = proxyquire('../../src/repositories/authorization.repository', { 'common': mockCommon });

    repository = new testModule.AuthorizationRepository();
  });

  afterEach(() => {
    reset(mockCommon);
    reset(mockUsersModel);
  });

  it('should find user by email', async () => {
    // arrange
    const email = 'test@example.com';
    const mockUser = { email, _id: '1234567890' };
    when(mockUsersModel.findOne(anything())).thenResolve(mockUser);

    // act
    const result = await repository.getUserByEmail(email);

    // assert
    expect(result).to.deep.equal(mockUser);
    verify(mockUsersModel.findOne({ email })).once();
  });

  it('should return null if user not found', async () => {
    // arrange
    const email = 'test@example.com';
    when(mockUsersModel.findOne(anything())).thenResolve(null);

    // act
    const result = await repository.getUserByEmail(email);

    // assert
    expect(result).to.be.null;
    verify(mockUsersModel.findOne({ email })).once();
  });
});