import { expect } from 'chai';
import { mock, instance, when, verify, anything } from 'ts-mockito';
import { AuthorizationRepository } from '../../src/repositories/authorization.repository';
import { UsersModel, Users } from 'common';

describe('AuthorizationRepository', () => {
  let authorizationRepository: AuthorizationRepository;
  let usersModelMock: UsersModel;

  beforeEach(() => {
    usersModelMock = mock<UsersModel>();
    authorizationRepository = new AuthorizationRepository(instance(usersModelMock));
  });

  afterEach(() => {
    verifyNoOutstandingExpectation();
  });

  it('should find a user by email', async () => {
    const email = 'test@example.com';
    const birthDate = new Date('1990-01-01');
    const dummyUser: Users = { email, birthDate };
    const mockQuery = mock<UsersModel>();
    when(usersModelMock.findOne(anything())).thenReturn(mockQuery);
    when(mockQuery.exec()).thenReturn(dummyUser);

    const result = await authorizationRepository.getUserByEmail(email);
    expect(result).to.deep.equal(dummyUser);
    verify(usersModelMock.findOne({ email: email })).once();
    verify(mockQuery.exec()).once();
  });

  it('should return null when no user is found', async () => {
    const email = 'test@example.com';
    const mockQuery = mock<UsersModel>();
    when(usersModelMock.findOne(anything())).thenReturn(mockQuery);
    when(mockQuery.exec()).thenReturn(null);

    const result = await authorizationRepository.getUserByEmail(email);
    expect(result).to.be.null;
    verify(usersModelMock.findOne({ email: email })).once();
    verify(mockQuery.exec()).once();
  });
});