import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { User } from 'src/models/user.model';
import { generateOTP } from 'src/utils/generateOTP';
import crypto from 'crypto';
import { Email } from 'src/utils/email';
import { KeyTokenService } from './keytoken.service';
import { createTokenPair } from 'src/auth/authUtils/createTokenPair';
import { getInfoData } from 'src/utils';

const EXPIRES_TIME = 10 * 60 * 1000;
@Injectable()
export class AuthenService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private keyTokenService: KeyTokenService,
  ) {}
  async signUp({ name, email, password, passwordConfirm, role }) {
    if (!name || !email || !password || !passwordConfirm) {
      throw new BadRequestException('Error: Please fill all the fields!');
    }
    const existingUser = await this.userModel
      .findOne({ email, status: 'active' })
      .lean();
    if (existingUser) {
      throw new BadRequestException('Error: User already registered!');
    }

    const existingUnverifiedUser = await this.userModel.findOne({
      email,
      status: 'unverified',
    });
    const newUser =
      existingUnverifiedUser ||
      (await this.userModel.create({
        name,
        email,
        password,
        passwordConfirm,
        role,
        status: 'unverified',
      }));
    const OTP = generateOTP(4);
    const hashOTP = crypto.createHash('sha256').update(OTP).digest('hex');
    newUser.OTP = hashOTP;
    newUser.OTPExpires = new Date(Date.now() + EXPIRES_TIME);
    await newUser.save({ validateBeforeSave: false });
    try {
      await new Email({ email, OTP }).sendEmail();
    } catch (err) {
      throw new InternalServerErrorException(
        'There was an error sending the email. Try again later!',
      );
    }
    return {
      status: 201,
      message: 'OTP sent to email!',
    };
  }

  async verifyOTP({ type, email, OTP }) {
    if (!['forgotPwd', 'signUp'].includes(type)) {
      throw new BadRequestException('Type is invalid!');
    }
    const user = await this.userModel.findOne({
      email,
      OTPExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new BadRequestException(
        'There is no user with email address or OTP has expired!',
      );
    }
    const hashOTP = crypto.createHash('sha256').update(OTP).digest('hex');
    if (user.OTP !== hashOTP) {
      throw new UnauthorizedException(
        'Your entered OTP is invalid! Please try again!',
      );
    }

    user.OTP = undefined;
    user.OTPExpires = undefined;
    await user.save({ validateBeforeSave: false });

    if (type === 'forgotPwd') {
      const resetToken = crypto.randomBytes(32).toString('hex');

      const passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      const passwordResetExpires = Date.now() + EXPIRES_TIME; // 10p hiệu lực

      await this.userModel.findOneAndUpdate(
        { _id: new Types.ObjectId(user._id) },
        { passwordResetToken, passwordResetExpires },
        { new: true },
      );
      return {
        message: 'Verify OTP successfully!',
        metadata: {
          resetURL: `http://localhost:${process.env.PORT}/api/v1/resetPassword/${resetToken}`,
        },
      };
    } else if (type === 'signUp') {
      await this.userModel.findByIdAndUpdate(user._id, { status: 'active' });

      if (user) {
        // tạo private key và public key
        const privateKey = crypto.randomBytes(64).toString('hex');
        const publicKey = crypto.randomBytes(64).toString('hex');

        // tạo keytoken model mới
        const newkeytoken = await this.keyTokenService.createKeyToken({
          userId: user._id,
          publicKey,
          privateKey,
        });

        if (!newkeytoken) {
          throw new BadRequestException('Keytoken Error');
        }

        const tokens = await createTokenPair(
          { userId: user._id, email, role: user.role },
          publicKey,
          privateKey,
        );
        console.log('Create Token Successfully!', tokens);
        return {
          statusCode: 201,
          message: 'Sign up successfully!',
          metadata: {
            user: getInfoData({
              object: user,
              fields: ['_id', 'name', 'email'],
            }),
            tokens,
          },
        };
      }
      return {
        statusCode: 200,
        metadata: null,
      };
    }
  }

  async logIn(body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Error: Please enter email or password!');
    }

    const user = await this.userModel
      .findOne({ email: body.email })
      .select('+password');
    if (!user) {
      throw new UnauthorizedException('Error: Incorrect email or password!');
    }
    if (!(await user?.matchPassword(body.password))) {
      throw new UnauthorizedException('Error: Incorrect email or password!');
    }
    if (user.status === 'unverified') {
      throw new UnauthorizedException(
        'Error: This account is unverified! Please sign up again!',
      );
    }

    // tạo private key và public key
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    const tokens = await createTokenPair(
      { userId: user._id, email: body.email, role: user.role },
      publicKey,
      privateKey,
    );

    await this.keyTokenService.createKeyToken({
      userId: user._id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      statusCode: 200,
      message: 'Log in successfully!',
      metadata: {
        user: getInfoData({
          object: user,
          fields: ['_id', 'name', 'email', 'tokenFirebase'],
        }),
        tokens,
      },
    };
  }

  async logOut(keyStore) {
    const delKey = await this.keyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return {
      statusCode: 200,
      message: 'Log out successfully!',
    };
  }

  async forgotPassword({ email }) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('There is no user with email address!');
    }

    const OTP = generateOTP(4);
    const hashOTP = crypto.createHash('sha256').update(OTP).digest('hex');
    user.OTP = hashOTP;
    user.OTPExpires = new Date(Date.now() + EXPIRES_TIME);
    await user.save({ validateBeforeSave: false });
    try {
      await new Email({ email, OTP }).sendEmail();
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.save({ validateBeforeSave: false });

      throw new InternalServerErrorException(
        'There was an error sending the email. Try again later!',
      );
    }

    return {
      status: 200,
      message: 'OTP sent to email!',
    };
  }

  async resetPassword(
    body: { password: string; passwordConfirm: string },
    token: string,
  ) {
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
    const user = await this.userModel.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      throw new BadRequestException('Your token is invalid or has expired.');
    }

    if (body.password !== body.passwordConfirm) {
      throw new UnauthorizedException(
        'Passwords do not match! Please try again!',
      );
    }

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    user.password = body.password;
    await user.save({ validateBeforeSave: false });

    const publicKey = crypto.randomBytes(64).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');

    const keytoken = await this.keyTokenService.createKeyToken({
      userId: new Types.ObjectId(user._id),
      privateKey,
      publicKey,
    });

    if (!keytoken) {
      throw new BadRequestException('Keytoken Error');
    }

    const tokens = await createTokenPair(
      { userId: user._id, email: user.email, role: user.role },
      publicKey,
      privateKey,
    );
    return {
      statusCode: 200,
      message: 'Reset Password Successfully!',
      metadata: {
        user: getInfoData({ object: user, fields: ['_id', 'name', 'email'] }),
        tokens,
      },
    };
  }
}
