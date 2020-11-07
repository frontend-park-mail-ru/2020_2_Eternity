class Validator {
    //todo: вынести в consts (создать папку)
    errors = {
        empty: 'Строка не может быть пустой',
        email: 'Некорректный e-mail',
        alpha: 'Поле может содержать только буквенные символы и цифры',
        password: 'Пароль должен содержать не менее 8 буквенных символов и цифр',
    }

    constructor() {
        this.AlphaNumRegExp = RegExp(/^[\w]+$/);
        this.PasswordRegExp = RegExp(/^(?=.*[\w]).{8,50}$/);
        this.EmailRegExp = RegExp(/^[.\w]+@([\w-]+\.)+[\w-]{2,4}$/);
    }

    checkEmpty = (value) => {
        return (typeof value === 'undefined') ? this.errors.empty : null;
    }
    checkAlphabetNum = (value) => {
        const ok = this.AlphaNumRegExp.test(value);
        return ok ? null : this.errors.alpha;
    }
    checkPassword = (value) => {
        const ok = this.PasswordRegExp.test(value);
        return ok ? null : this.errors.password;
    }
    checkEmail = (value) => {
        const ok = this.EmailRegExp.test(value);
        return ok ? null : this.errors.email;
    }

    compose = (...validators) => {
        return (value) => {
            let ok;
            let errors = [];
            validators.forEach((validator) => {
                ok = validator(value);
                if (ok) {
                    errors.push(ok);
                }
            });
            return errors;
        }
    }

    validateEmailField = this.compose(this.checkEmpty, this.checkEmail);
    validatePasswordField = this.compose(this.checkEmpty, this.checkPassword);
    validateUsernameField = this.compose(this.checkEmpty, this.checkAlphabetNum);
}


export default new Validator();