import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { expect } from 'chai';
import 'mocha';
import sinon from 'sinon';
import { UsersControllers } from './users.controller';
import { UsersServices } from '../services/users.service';
import { Request, Response } from 'express';
import { baseController } from 'common';
import { LogLevel } from 'common';

chai.use(chaiHttp);

describe('UsersController Unit Tests', () => {
  let sandbox: sinon.SinonSandbox;
  let usersController: UsersControllers;
  let usersServices: UsersServices;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    usersServices = sandbox.createStubInstance(UsersServices) as any;
    usersController = new UsersControllers(usersServices);

    (usersServices.createUser as sinon.SinonStub).resolves({ message: 'User created' } as any);
    (usersServices.createUsers as sinon.SinonStub).resolves({ message: 'Users created' } as any);
    (usersServices.updateUser as sinon.SinonStub).resolves({ message: 'User updated' } as any);
    (usersServices.deleteUser as sinon.SinonStub).resolves({ message: 'User deleted' } as any);
    (usersServices.searchUsers as sinon.SinonStub).resolves({ message: 'Users found' } as any);
    (usersServices.getUserById as sinon.SinonStub).resolves({ message: 'User found' } as any);
    (usersServices.updateUserStatus as sinon.SinonStub).resolves({ message: 'User status updated' } as any);

    sandbox.stub(baseController, 'getResult').callsFake(((res: any, status: any, data: any, operation: any) => {
      return Promise.resolve({ status, data: data || { message: status === 500 ? 'Internal Server Error' : 'Success' } } as any);
    }) as any);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createUser function', () => {
    it('should create a new user', async () => {
      const req = { body: { name: 'John Doe', email: 'john@example.com' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.createUser(req, res);
      expect(result).to.have.property('status', 200);
      expect(result.data).to.deep.equal({ message: 'User created' });
    });

    it('should throw an error if user creation fails', async () => {
      (usersServices.createUser as any).rejects(new Error('User creation failed'));
      const req = { body: { name: 'John Doe', email: 'john@example.com' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.createUser(req, res);
      expect(result).to.have.property('status', 500);
      expect(result.data).to.deep.equal({ message: 'Internal Server Error' });
    });
  });

  describe('createUsers function', () => {
    it('should create multiple users', async () => {
      const req = {} as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.createUsers(req, res);
      expect(result).to.have.property('status', 200);
      expect(result.data).to.deep.equal({ message: 'Users created' });
    });

    it('should throw an error if user creation fails', async () => {
      (usersServices.createUsers as any).rejects(new Error('User creation failed'));
      const req = {} as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.createUsers(req, res);
      expect(result).to.have.property('status', 500);
      expect(result.data).to.deep.equal({ message: 'Internal Server Error' });
    });
  });

  describe('updateUsers function', () => {
    it('should update a user', async () => {
      const req = { body: { name: 'John Doe', email: 'john@example.com' }, params: { id: '1' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.updateUsers(req, res);
      expect(result).to.have.property('status', 200);
      expect(result.data).to.deep.equal({ message: 'User updated' });
    });

    it('should throw an error if user update fails', async () => {
      (usersServices.updateUser as any).rejects(new Error('User update failed'));
      const req = { body: { name: 'John Doe', email: 'john@example.com' }, params: { id: '1' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.updateUsers(req, res);
      expect(result).to.have.property('status', 500);
      expect(result.data).to.deep.equal({ message: 'Internal Server Error' });
    });
  });

  describe('deleteUser function', () => {
    it('should delete a user', async () => {
      const req = { params: { id: '1' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.deleteUser(req, res);
      expect(result).to.have.property('status', 200);
      expect(result.data).to.deep.equal({ message: 'User deleted' });
    });

    it('should throw an error if user deletion fails', async () => {
      (usersServices.deleteUser as any).rejects(new Error('User deletion failed'));
      const req = { params: { id: '1' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.deleteUser(req, res);
      expect(result).to.have.property('status', 500);
      expect(result.data).to.deep.equal({ message: 'Internal Server Error' });
    });
  });

  describe('searchUsers function', () => {
    it('should search for users', async () => {
      const req = { body: { name: 'John Doe', email: 'john@example.com' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.searchUsers(req, res);
      expect(result).to.have.property('status', 200);
      expect(result.data).to.deep.equal({ message: 'Users found' });
    });

    it('should throw an error if user search fails', async () => {
      (usersServices.searchUsers as any).rejects(new Error('User search failed'));
      const req = { body: { name: 'John Doe', email: 'john@example.com' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.searchUsers(req, res);
      expect(result).to.have.property('status', 500);
      expect(result.data).to.deep.equal({ message: 'Internal Server Error' });
    });
  });

  describe('getUserById function', () => {
    it('should get a user by ID', async () => {
      const req = { params: { id: '1' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.getUserById(req, res);
      expect(result).to.have.property('status', 200);
      expect(result.data).to.deep.equal({ message: 'User found' });
    });

    it('should throw an error if user retrieval fails', async () => {
      (usersServices.getUserById as any).rejects(new Error('User retrieval failed'));
      const req = { params: { id: '1' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.getUserById(req, res);
      expect(result).to.have.property('status', 500);
      expect(result.data).to.deep.equal({ message: 'Internal Server Error' });
    });
  });

  describe('updateUserStatus function', () => {
    it('should update a user status', async () => {
      const req = { params: { id: '1' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.updateUserStatus(req, res);
      expect(result).to.have.property('status', 200);
      expect(result.data).to.deep.equal({ message: 'User status updated' });
    });

    it('should throw an error if user status update fails', async () => {
      (usersServices.updateUserStatus as any).rejects(new Error('User status update failed'));
      const req = { params: { id: '1' } } as any;
      const res = { status: sinon.stub().returns({ send: sinon.stub() }) } as any;
      const result: any = await usersController.updateUserStatus(req, res);
      expect(result).to.have.property('status', 500);
      expect(result.data).to.deep.equal({ message: 'Internal Server Error' });
    });
  });
});