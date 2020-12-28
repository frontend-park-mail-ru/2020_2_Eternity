class Validator {
    //todo: вынести в consts
    errors = {
        empty: 'Поле не может быть пустым',
        email: 'Некорректный e-mail',
        alpha: 'Поле может содержать только буквенные символы и цифры',
        name: 'Поле может содержать только буквенные символы',
        password: 'Пароль должен содержать не менее 8 буквенных символов и цифр',
    }

    constructor() {
        this.AlphaNumRegExp = RegExp(/^[A-Za-z0-9]+$/);
        this.PasswordRegExp = RegExp(/^(?=.*[\w]).{8,50}$/);
        this.EmailRegExp = RegExp(/^[.\w]+@([\w-]+\.)+[\w-]{2,4}$/);
        this.NameRegExp = RegExp(/^[\wА-Яа-я]+$/);
    }

    checkEmpty = (value) => {
        if (!value) {
            return this.errors.empty;
        } else {
            return null;
        }
    }
    checkAlphabetNum = (value) => {
        if (value) {
            const ok = this.AlphaNumRegExp.test(value);
            return ok ? null : this.errors.alpha;
        }
    }
    checkPassword = (value) => {
        if (value) {
            const ok = this.PasswordRegExp.test(value);
            return ok ? null : this.errors.password;
        }
    }
    checkEmail = (value) => {
        if (value) {
            const ok = this.EmailRegExp.test(value);
            return ok ? null : this.errors.email;
        }
    }
    checkName = (value) => {
        if (value) {
            const ok = this.NameRegExp.test(value);
            return ok ? null : this.errors.name;
        }
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
    validateAlphaField = this.compose(this.checkEmpty, this.checkAlphabetNum);
    validateEmptyField = this.compose(this.checkEmpty);
    validateNameField = this.compose(this.checkName);
}


export default new Validator();