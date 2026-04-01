import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class User extends Document {
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  email: string;

  @Prop({ required: true, type: String })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (_doc, ret: Omit<User, 'password'> & { password?: string }) => {
    const { _id, ...rest } = ret as Record<string, unknown> & {
      _id?: { toString(): string } | string;
    };
    delete rest.password;
    const id = _id ? _id.toString() : '';
    return {
      ...rest,
      id,
    };
  },
});
