import template from "./ReportForm.hbs"

import BaseComponent from "../BaseComponent.js";
import List from "../List/List";
import Button from "../Button/Button";
import Textarea from "../Textarea/Textarea";
import Checkbox from "../Checkbox/Checkbox";

export default class ReportForm extends BaseComponent {
    checks
    checksElems
    description
    btnReport

    constructor(context = {}) {
        super(template, context);
    }

    render() {
        const problems = [
            'Нарушение авторских прав', 'Призывы к насилию, агрессивное поведение',
            'Ложная информация, спам'
        ]

        this.checks = [];
        this.checksElems = [];
        for (let i = 0; i < 3; i++) {
            const p = new Checkbox({
                id: i,
                text: problems[i],
                custom: 'report-form__checkbox'
            })
            this.checksElems.push(p);
            this.checks.push(p.render());
        }

        this.description = new Textarea({
            label: 'Описание проблемы',
            rows: 5,
            id: 'descriptionReport',
            customInput: 'input-group__field_noresize'
        })

        this.btnReport = new Button({
            id: 'sendReportBtn',
            text: 'Отправить жалобу'
        })

        this.context = {
            ...this.context,
            checks: this.checks.join(' '),
            description: this.description.render(),
            btnReport: this.btnReport.render()
        }
        return super.render();
    }

    getCheckedProblems() {
        let res = [];
        this.checksElems.forEach((el) => {
            el.isChecked() ? res.push(el.element.getAttribute('id')) : ''
        })
        return res;
    }

}