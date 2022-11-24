import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let userRepo: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const fakeUsersRepo = {
      create: jest.fn((arg) => Promise.resolve(arg)),
      save: jest.fn((arg) => Promise.resolve(arg)),
      findOne: jest.fn((arg) => Promise.resolve(arg)),
    };
    const fakeJwtService = {
      sign: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUsersRepo,
        },
        {
          provide: JwtService,
          useValue: fakeJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('authService should be defined', () => {
    expect(service).toBeDefined();
  });
  it('userRepo should be defined', () => {
    expect(userRepo).toBeDefined();
  });

  describe('signup', () => {
    it('should sign user up successfully', async () => {
      const signupDto = { username: 'username', password: 'password' };

      const bcryptGenSalt = jest.fn().mockResolvedValue(true);
      const bcryptHash = jest.fn().mockResolvedValue('password');
      (bcrypt.genSalt as jest.Mock) = bcryptGenSalt;
      (bcrypt.hash as jest.Mock) = bcryptHash;

      expect(await service.signUp(signupDto)).toEqual({
        username: 'username',
        password: 'password',
      });
      expect(bcryptGenSalt).toHaveBeenCalledTimes(1);
      expect(bcryptHash).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException error if username already exists', async () => {
      const signupDto = { username: 'username', password: 'password' };

      userRepo.save = jest.fn(() => {
        const e = new Error();
        // @ts-expect-error this field exists on typeorm exceptions
        e.errno = 19;
        throw e;
      });

      await expect(() => service.signUp(signupDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should rethrow Error in case something goes wrong', async () => {
      const signupDto = { username: 'username', password: 'password' };

      userRepo.save = jest.fn(() => {
        throw new InternalServerErrorException();
      });

      await expect(() => service.signUp(signupDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('signin', () => {
    it('should sign user in', async () => {
      const signinDto = { username: 'username', password: 'password' };

      const bcryptCompareMock = jest.fn().mockResolvedValue(true);
      const jwtSignMock = jest.fn().mockReturnValue('jwtToken');
      userRepo.findOne = jest.fn(() => Promise.resolve({} as User));
      (bcrypt.compare as jest.Mock) = bcryptCompareMock;
      jwtService.sign = jwtSignMock;

      expect(await service.signIn(signinDto)).toEqual({
        username: 'username',
        accessToken: 'jwtToken',
      });
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);
      expect(jwtSignMock).toHaveBeenCalledTimes(1);
    });

    it('should throw unauthorized error if passwords do not match', async () => {
      const signinDto = { username: 'username', password: 'password' };

      const bcryptCompareMock = jest.fn().mockResolvedValue(false);
      userRepo.findOne = jest.fn(() => Promise.resolve({} as User));
      (bcrypt.compare as jest.Mock) = bcryptCompareMock;

      await expect(() => service.signIn(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(bcryptCompareMock).toHaveBeenCalledTimes(1);
    });
    it('should throw unauthorized error if user does not exist', async () => {
      const signinDto = { username: 'username', password: 'password' };

      const bcryptCompareMock = jest.fn().mockResolvedValue(true);
      userRepo.findOne = jest.fn(() => Promise.resolve(null));
      (bcrypt.compare as jest.Mock) = bcryptCompareMock;

      await expect(() => service.signIn(signinDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
