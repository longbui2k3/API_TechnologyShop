import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import bcrypt from 'bcryptjs';
export type UserDocument = HydratedDocument<User>;
const COLLECTION_NAME = 'users';
const DEFAULT_AVATAR =
  'https://firebasestorage.googleapis.com/v0/b/dd-project-ed538.appspot.com/o/users%2Fimage%2Fdefault.png?alt=media&token=33ea2706-65cd-41ba-934b-a260ce4dd071';
@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class User {
  @Prop({
    type: String,
    required: [true, 'Please provide your name!'],
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    enum: ['unverified', 'active', 'inactive'],
    default: 'unverified',
  })
  status: string;

  @Prop({
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  })
  role: string;

  @Prop({ type: String, default: DEFAULT_AVATAR })
  avatar: string;

  @Prop({
    type: String,
    enum: ['Nam', 'Nữ', 'Không xác định'],
  })
  gender: string;

  @Prop({ type: Date, default: null })
  dateOfBirth: Date;

  @Prop({ type: String, default: '' })
  address: string;

  @Prop({ type: String, default: '' })
  mobile: string;

  @Prop({
    type: String,
    required: [true, 'Please provide your password!'],
    select: false,
  })
  password: string;

  @Prop({
    type: String,
    required: [true, 'Please provide your password confirm!'],
    validate: {
      validator: function (val: string) {
        return val === this.password;
      },
      message: 'Passwords are not the same!',
    },
  })
  passwordConfirm: string;

  @Prop({ type: Date })
  passwordChangedAt: Date;

  @Prop({ type: String })
  passwordResetToken: string;

  @Prop({ type: Date })
  passwordResetExpires: Date;

  @Prop({ type: String })
  OTP: string;

  @Prop({ type: Date })
  OTPExpires: Date;

  @Prop({ type: String, default: null })
  tokenFirebase: string;

  matchPassword: Function;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};
