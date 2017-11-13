// https://github.com/Microsoft/TypeScript/wiki/FAQ#why-doesnt-extending-built-ins-like-error-array-and-map-work

// tslint:disable:max-classes-per-file
export class UserNotFound extends Error {
    public name = 'UserNotFoundException';
    public message = 'User not found!';

    constructor(...args: any[]) {
        super(...args);
        Object.setPrototypeOf(this, UserNotFound.prototype);
    }
}

export class UserIncorrectPassword extends Error {
    public name = 'UserIncorrectPassword';
    public message = 'Incorrect password!';

    constructor(...args: any[]) {
        super(...args);
        Object.setPrototypeOf(this, UserIncorrectPassword.prototype);
    }
}

export class QuestionNotFound extends Error {
    public name = 'QuestionNotFoundException';
    public message = 'Question not found!';

    constructor(...args: any[]) {
        super(...args);
        Object.setPrototypeOf(this, QuestionNotFound.prototype);
    }
}
