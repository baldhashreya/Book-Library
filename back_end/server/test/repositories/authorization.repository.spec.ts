import { mock, instance, when, verify, reset } from 'ts-mockito';
import { AuthorizationRepository } from '../../src/repositories/authorization.repository';
import { UsersModel, Users } from 'common';
import { expect } from 'chai';
import { mock as mockquire } from 'proxyquire';

describe('AuthorizationRepository', () => {
  let authorizationRepository: AuthorizationRepository;
  let usersModel: any;

  beforeEach(() => {
    usersModel = mock<any>();
    const mockUsers = mockquire('common', { UsersModel: usersModel });
    authorizationRepository = new AuthorizationRepository();
  });

  afterEach(() => {
    reset(usersModel);
  });

  it('should return a user by email', async () => {
    const email = 'test@example.com';
    const user = { email } as UsersModel;

    when(usersModel.findOne(anything())).thenReturn(user);

    const result = await authorizationRepository.getUserByEmail(email);

    expect(result).to.deep.equal(user);
    verify(usersModel.findOne({ email: email })).once();
  });

  it('should return null if no user is found', async () => {
    const email = 'test@example.com';

    when(usersModel.findOne(anything())).thenReturn(null);

    const result = await authorizationRepository.getUserByEmail(email);

    expect(result).to.be.null;
    verify(usersModel.findOne({ email: email })).once();
  });
});