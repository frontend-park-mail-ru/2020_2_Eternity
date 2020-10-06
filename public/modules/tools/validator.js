class Validator {
    constructor() {
        this.NameSurnameRegExp = RegExp(/^[\w]+$/) //
        this.UsernameRegExp = RegExp(/^[\w]/)
        this.PasswordRegExp = RegExp(/^(?=.*[\w]).{8,}$/)

        this.validators = {}
        this.validators['name'] = this.checkNameSurname
        this.validators['surname'] = this.checkNameSurname
        this.validators['username'] = this.checkUsername
        this.validators['password'] = this.checkPassword
    }

    isValid(fieldName, fieldValue) {
        if (!this.validators[fieldName]) {
            console.log(`There is no validation for ${fieldName}`)
            return
        }

        if (!fieldValue) {
            return {res: false, error: 'Поле не может быть пустым'}
        }

        return this.validators[fieldName](fieldValue)
    }

    checkNameSurname = (value) => {
        const check = this.NameSurnameRegExp.test(value)
        return check ? {res: check} : {res: check, error: 'Имя и фамилия могут содержать только буквы'}
    }

    checkUsername = (value) => {
        const check = this.UsernameRegExp.test(value)
        return check ? {res: check} : {res: check, error: 'Имя пользователя содержит недопустимые символы'}
    }

    checkPassword = (value) => {
        const check = this.PasswordRegExp.test(value)
        return check ? {res: check} : {res: check, error: 'Пароль должен содержать не менее 8 буквенных символов и цифр'}
    }
}


export default new Validator();