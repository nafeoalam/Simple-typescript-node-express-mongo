import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
const salt: string = '12';

const customerSchema: Schema<ICustomer> = new Schema({
    id: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
});

// * Hash the password befor it is beeing saved to the database
customerSchema.pre('save', function (this: ICustomer, next: (err?: Error | undefined) => void) {
    // * Make sure you don't hash the hash
    if (!this.isModified('password')) {
        return next();
    }
    bcrypt.hash(this.password, salt, (err: Error, hash: string) => {
        if (err) return next(err);
        this.password = hash;
    });
});

customerSchema.methods.comparePasswords = function (candidatePassword: string, next: (err: Error | null, same: boolean | null) => void) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return next(err, null);
        }
        next(null, isMatch);
    });
};

interface ICustomer extends Document {
    email: string;
    name: string;
    password: string;
    comparePasswords(candidatePassword: string, next: (err: Error | null, same: boolean | null) => void): void;
}

export default mongoose.model('Customer', customerSchema);
