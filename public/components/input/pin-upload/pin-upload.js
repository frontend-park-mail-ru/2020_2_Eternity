import Input from "../input.js";

export default class PinUpload extends Input {
    constructor(context = {}) {
        super(context)
        this.template = Handlebars.templates['pin-upload.hbs'];
    }

    render() {
        return super.render()
    }

    bindPreview() {
        const input = document.getElementById('file');
        const img = document.getElementById('preview');
        const reset = document.getElementById('reset-preview')

        input.addEventListener('change', evt => {
            let reader = new FileReader();
            reader.onload = function (e) {
                img.setAttribute('src', e.target.result);
                img.setAttribute('style', 'opacity: 1')
                reset.setAttribute('style', 'opacity: 1')
            };
            reader.readAsDataURL(input.files[0]);
        });

        reset.addEventListener('click', (event) => {
            event.preventDefault();
            input.value = '';
            img.setAttribute('src', '');
            img.setAttribute('style', 'opacity: 0')
            reset.setAttribute('style', 'opacity: 0')
        })

    }
}