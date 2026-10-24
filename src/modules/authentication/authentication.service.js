import { NotFoundException } from "../../common/exceptions/error.exception.js";
import { findOne,create } from "../../common/repository/index.js";
import { decryption, encryption } from "../../common/security/encryption.security.js";
import { compare, hash } from "../../common/security/hash.security.js";
import { createLoginCredintials } from "../../common/security/token.security.js";
import { UserModel } from "../../DB/model/user.model.js";


export const signup = async (payload = {}) => {
    const { name, email, password, phone } = payload;

    if (!name || !email || !password || !phone) {
        throw new Error("Missing required signup fields", { cause: { status: 400 } });
    }

    const duplicatedAccount = await findOne({
        filter: { email },
        options: { select: 'email' },
        model: UserModel
    });

    if (duplicatedAccount) throw new Error(`Email exists`, { cause: { status: 409 } });

    const user = await create({
        data: {
            name,
            email,
            password: await hash(password),
            phone: await encryption(phone)
        },
        model: UserModel
    });

    return user;
};

export const login = async (payload = {},issuer) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw new Error("Missing login credentials", { cause: { status: 400 } });
    }

    const account = await findOne({
        filter: { email },
        model: UserModel
    });

    if (!account) throw NotFoundException(`not exist`, { cause: { status: 404 } });

    const match = await compare(password, account.password);

    if (!match) throw NotFoundException(`not exist`, { cause: { status: 404 } });
    if (account.phone) {
        try {
            account.phone = await decryption(account.phone);
        } catch (err) {
            console.error("Failed to decrypt phone:", err.message);
        }
    }

    return await createLoginCredintials({user:account,issuer});
};