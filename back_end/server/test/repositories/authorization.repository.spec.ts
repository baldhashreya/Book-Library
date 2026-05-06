import { expect } from 'chai';
import sinon from 'sinon';
import 'sinon-mongoose';
import { Users } from 'common';
import { AuthorizationRepository } from './authorization.repository';
import { UsersModel } from 'common/mongoose';

describe('AuthorizationRepository', () => {
  let authorizationRepository: AuthorizationRepository;
  let usersModelStub: sinon.SinonStubbedInstance<UsersModel>;
  let usersStub: sinon.SinonStubbedInstance<Users>;

  beforeEach(() => {
    usersModelStub = sinon.stub(Users, 'model').returns(sinon.createStubInstance(UsersModel));
    authorizationRepository = new AuthorizationRepository();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getUserByEmail', () => {
    it('should return user when email is found', async () => {
      const email = 'test@example.com';
      const expectedUser = { email, password: 'password' };

      usersModelStub.findOne.resolves({ email, password: 'password' } as any);
      const result = await authorizationRepository.getUserByEmail(email);

      expect(result).to.deep.equal(expectedUser);
    });

    it('should return null when email is not found', async () => {
      const email = 'test@example.com';
      const expectedUser = null;

      usersModelStub.findOne.resolves(null);
      const result = await authorizationRepository.getUserByEmail(email);

      expect(result).to.deep.equal(expectedUser);
    });

    it('should throw error when Users.findOne throws an error', async () => {
      const email = 'test@example.com';
      const error = new Error('Test error');

      usersModelStub.findOne.rejects(error);
      await expect(authorizationRepository.getUserByEmail(email)).to.be.rejectedWith(error);
    });
  });
});