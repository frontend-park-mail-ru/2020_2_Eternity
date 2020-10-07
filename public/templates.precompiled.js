// ПРОФИЛЬ
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['profile.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
            var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return "            <a href=\"pin/"
                + alias2(alias1((depth0 != null ? lookupProperty(depth0,"id") : depth0), depth0))
                + "\" class=\"profile-desk__grid__card\">\r\n                <img src=\""
                + alias2(alias1((depth0 != null ? lookupProperty(depth0,"imgSrc") : depth0), depth0))
                + "\" alt=\"\">\r\n            </a>\r\n";
        },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return ((stack1 = ((helper = (helper = lookupProperty(helpers,"navbar") || (depth0 != null ? lookupProperty(depth0,"navbar") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"navbar","hash":{},"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":14}}}) : helper))) != null ? stack1 : "")
                + "\r\n\r\n<div class=\"profile-background\"></div>\r\n\r\n<div class=\"profile-card\">\r\n    <div class=\"profile-card__content\">\r\n\r\n        <div class=\"profile-card__user-avatar\">\r\n            <a href=\"/profile/edit\" class=\"profile__btn-edit\"><i class=\"fas fa-pen\"></i></a>\r\n            "
                + ((stack1 = ((helper = (helper = lookupProperty(helpers,"avatar") || (depth0 != null ? lookupProperty(depth0,"avatar") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"avatar","hash":{},"data":data,"loc":{"start":{"line":10,"column":12},"end":{"line":10,"column":26}}}) : helper))) != null ? stack1 : "")
                + "\r\n        </div>\r\n\r\n        <div class=\"profile-card__user-info\">\r\n            <ul>\r\n                <li>"
                + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":15,"column":20},"end":{"line":15,"column":30}}}) : helper)))
                + " "
                + alias4(((helper = (helper = lookupProperty(helpers,"surname") || (depth0 != null ? lookupProperty(depth0,"surname") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"surname","hash":{},"data":data,"loc":{"start":{"line":15,"column":31},"end":{"line":15,"column":44}}}) : helper)))
                + "</li>\r\n                <li>@"
                + alias4(((helper = (helper = lookupProperty(helpers,"username") || (depth0 != null ? lookupProperty(depth0,"username") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"username","hash":{},"data":data,"loc":{"start":{"line":16,"column":21},"end":{"line":16,"column":35}}}) : helper)))
                + "</li>\r\n                <li>"
                + alias4(((helper = (helper = lookupProperty(helpers,"description") || (depth0 != null ? lookupProperty(depth0,"description") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"description","hash":{},"data":data,"loc":{"start":{"line":17,"column":20},"end":{"line":17,"column":37}}}) : helper)))
                + "</li>\r\n                <li><a href=\"\">"
                + alias4(((helper = (helper = lookupProperty(helpers,"subsCount") || (depth0 != null ? lookupProperty(depth0,"subsCount") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"subsCount","hash":{},"data":data,"loc":{"start":{"line":18,"column":31},"end":{"line":18,"column":46}}}) : helper)))
                + " подписчиков</a> • <a href=\"\">"
                + alias4(((helper = (helper = lookupProperty(helpers,"subscriptionsCount") || (depth0 != null ? lookupProperty(depth0,"subscriptionsCount") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"subscriptionsCount","hash":{},"data":data,"loc":{"start":{"line":18,"column":76},"end":{"line":18,"column":100}}}) : helper)))
                + " подписок</a></li>\r\n                <li>\r\n                    "
                + ((stack1 = ((helper = (helper = lookupProperty(helpers,"btnMessage") || (depth0 != null ? lookupProperty(depth0,"btnMessage") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"btnMessage","hash":{},"data":data,"loc":{"start":{"line":20,"column":20},"end":{"line":20,"column":38}}}) : helper))) != null ? stack1 : "")
                + "\r\n                    "
                + ((stack1 = ((helper = (helper = lookupProperty(helpers,"btnSub") || (depth0 != null ? lookupProperty(depth0,"btnSub") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"btnSub","hash":{},"data":data,"loc":{"start":{"line":21,"column":20},"end":{"line":21,"column":34}}}) : helper))) != null ? stack1 : "")
                + "\r\n                </li>\r\n            </ul>\r\n        </div>\r\n\r\n    </div>\r\n</div>\r\n\r\n<div class=\"profile-desk\">\r\n    <a href=\"/create-pin\">Создать пин <i class=\"fas fa-plus\"></i></a>\r\n    <div class=\"profile-desk__grid\">\r\n"
                + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"pins") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":32,"column":8},"end":{"line":36,"column":17}}})) != null ? stack1 : "")
                + "    </div>\r\n</div>\r\n";
        },"useData":true});
})();


// АВАТАР БОКС
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['avatar.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
            return "box-round-mini";
        },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return "<div class=\"box-round "
                + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isMini") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":22},"end":{"line":1,"column":57}}})) != null ? stack1 : "")
                + "\">\r\n    <div class=\"box-round__wrapper\">\r\n        <img src=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"avatarPath") || (depth0 != null ? lookupProperty(depth0,"avatarPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"avatarPath","hash":{},"data":data,"loc":{"start":{"line":3,"column":18},"end":{"line":3,"column":34}}}) : helper)))
                + "\" class=\"box-round__img\" id=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":3,"column":63},"end":{"line":3,"column":71}}}) : helper)))
                + "\">\r\n    </div>\r\n</div>";
        },"useData":true});
})();


// КНОПКИ
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['button.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return "<button class=\"btn "
                + alias4(((helper = (helper = lookupProperty(helpers,"extraClasses") || (depth0 != null ? lookupProperty(depth0,"extraClasses") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"extraClasses","hash":{},"data":data,"loc":{"start":{"line":1,"column":19},"end":{"line":1,"column":37}}}) : helper)))
                + "\" id=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":1,"column":43},"end":{"line":1,"column":51}}}) : helper)))
                + "\" type=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"type") || (depth0 != null ? lookupProperty(depth0,"type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":1,"column":59},"end":{"line":1,"column":69}}}) : helper)))
                + "\" "
                + alias4(((helper = (helper = lookupProperty(helpers,"isDisabled") || (depth0 != null ? lookupProperty(depth0,"isDisabled") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"isDisabled","hash":{},"data":data,"loc":{"start":{"line":1,"column":71},"end":{"line":1,"column":87}}}) : helper)))
                + ">"
                + alias4(((helper = (helper = lookupProperty(helpers,"btnText") || (depth0 != null ? lookupProperty(depth0,"btnText") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"btnText","hash":{},"data":data,"loc":{"start":{"line":1,"column":88},"end":{"line":1,"column":101}}}) : helper)))
                + "</button>";
        },"useData":true});
})();


// КАРТОЧКИ
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['card.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return "<div class=\"card\">\r\n    <a href=\"pin/"
                + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":2,"column":17},"end":{"line":2,"column":25}}}) : helper)))
                + "\">\r\n        <img class=\"card__img\" src=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"imgSrc") || (depth0 != null ? lookupProperty(depth0,"imgSrc") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"imgSrc","hash":{},"data":data,"loc":{"start":{"line":3,"column":36},"end":{"line":3,"column":48}}}) : helper)))
                + "\" alt=\"\">\r\n\r\n        <div class=\"card__content\">\r\n            <button class=\"card__like\"><i class=\"far fa-heart\"></i></button>\r\n            <span class=\"card__time\">\r\n                <i class=\"far fa-calendar-alt\"></i> <span>"
                + alias4(((helper = (helper = lookupProperty(helpers,"pubDate") || (depth0 != null ? lookupProperty(depth0,"pubDate") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pubDate","hash":{},"data":data,"loc":{"start":{"line":8,"column":58},"end":{"line":8,"column":71}}}) : helper)))
                + "</span>\r\n            </span>\r\n        </div>\r\n    </a>\r\n</div>";
        },"useData":true});
})();


// НАВБАР
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['navbar.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            return "<div class=\"navbar\">\r\n\r\n    <ul class=\"navbar__links\">\r\n        <li><a href=\"/\">Главная</a></li>\r\n        <li><a href=\"/profile\">Профиль</a></li>\r\n        <li><a href=\"/signup\">Регистрация</a></li>\r\n        <li><a href=\"/login\">Вход</a></li>\r\n    </ul>\r\n</div>";
        },"useData":true});
})();


// ГЛАВНАЯ
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['main.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
            var stack1;

            return "        <div class=\"content-grid__item\">\r\n            "
                + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
                + "\r\n        </div>\r\n";
        },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return ((stack1 = ((helper = (helper = lookupProperty(helpers,"navbar") || (depth0 != null ? lookupProperty(depth0,"navbar") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"navbar","hash":{},"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":14}}}) : helper))) != null ? stack1 : "")
                + "\r\n\r\n<div class=\"content-grid\">\r\n"
                + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"pins") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":4,"column":4},"end":{"line":8,"column":13}}})) != null ? stack1 : "")
                + "</div>";
        },"useData":true});
})();


// ИНПУТ ФОРМЫ
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['input.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return "<label class=\"form__input-label\"> <span>"
                + alias4(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data,"loc":{"start":{"line":1,"column":40},"end":{"line":1,"column":51}}}) : helper)))
                + "</span>\r\n    <input type=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"type") || (depth0 != null ? lookupProperty(depth0,"type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":2,"column":17},"end":{"line":2,"column":27}}}) : helper)))
                + "\" class=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"customClasses") || (depth0 != null ? lookupProperty(depth0,"customClasses") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"customClasses","hash":{},"data":data,"loc":{"start":{"line":2,"column":36},"end":{"line":2,"column":55}}}) : helper)))
                + "\" placeholder=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"placeholder") || (depth0 != null ? lookupProperty(depth0,"placeholder") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"placeholder","hash":{},"data":data,"loc":{"start":{"line":2,"column":70},"end":{"line":2,"column":87}}}) : helper)))
                + "\"\r\n           value=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"value") || (depth0 != null ? lookupProperty(depth0,"value") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data,"loc":{"start":{"line":3,"column":18},"end":{"line":3,"column":29}}}) : helper)))
                + "\" id=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":3,"column":35},"end":{"line":3,"column":43}}}) : helper)))
                + "\">\r\n</label>";
        },"useData":true});
})();


// НАСТРОЙКИ
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['settings.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return ((stack1 = ((helper = (helper = lookupProperty(helpers,"navbar") || (depth0 != null ? lookupProperty(depth0,"navbar") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"navbar","hash":{},"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":14}}}) : helper))) != null ? stack1 : "")
                + "\r\n\r\n<div class=\"settings-layout\">\r\n    "
                + ((stack1 = ((helper = (helper = lookupProperty(helpers,"form") || (depth0 != null ? lookupProperty(depth0,"form") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"form","hash":{},"data":data,"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":16}}}) : helper))) != null ? stack1 : "")
                + "\r\n</div>";
        },"useData":true});
})();


// КАСТОМНАЯ ЗАГРУЗКА ФАЙЛА В АВАТАР
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['file-upload.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return "<div class=\"form__input-file-upload\">\r\n <span class=\"form__input-file-upload__label\">"
                + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"label") || (depth0 != null ? lookupProperty(depth0,"label") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"label","hash":{},"data":data,"loc":{"start":{"line":2,"column":49},"end":{"line":2,"column":60}}}) : helper)))
                + "</span>\r\n <input type=\"file\" id=\"file\">\r\n</div>";
        },"useData":true});
})();



// ФОРМА
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['form.hbs'] = template({"1":function(container,depth0,helpers,partials,data) {
            var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return "method=\""
                + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"method") || (depth0 != null ? lookupProperty(depth0,"method") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"method","hash":{},"data":data,"loc":{"start":{"line":1,"column":77},"end":{"line":1,"column":89}}}) : helper)))
                + "\"";
        },"3":function(container,depth0,helpers,partials,data) {
            var stack1;

            return "        "
                + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
                + "\r\n";
        },"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return "<form id=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":1,"column":10},"end":{"line":1,"column":18}}}) : helper)))
                + "\" class=\"form\" action=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"action") || (depth0 != null ? lookupProperty(depth0,"action") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"action","hash":{},"data":data,"loc":{"start":{"line":1,"column":41},"end":{"line":1,"column":53}}}) : helper)))
                + "\" "
                + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"method") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":1,"column":55},"end":{"line":1,"column":97}}})) != null ? stack1 : "")
                + " enctype=\""
                + alias4(((helper = (helper = lookupProperty(helpers,"enctype") || (depth0 != null ? lookupProperty(depth0,"enctype") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"enctype","hash":{},"data":data,"loc":{"start":{"line":1,"column":107},"end":{"line":1,"column":120}}}) : helper)))
                + "\">\r\n"
                + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"elements") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":4,"column":13}}})) != null ? stack1 : "")
                + "</form>";
        },"useData":true});
})();


// АВТОРИЗАЦИЯ
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['auth.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return "<div class=\"auth\">\r\n    "
                + ((stack1 = ((helper = (helper = lookupProperty(helpers,"form") || (depth0 != null ? lookupProperty(depth0,"form") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"form","hash":{},"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":16}}}) : helper))) != null ? stack1 : "")
                + "\r\n</div>";
        },"useData":true});
})();


// СОЗДАНИЕ ПИНА
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['pin-creating.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return ((stack1 = ((helper = (helper = lookupProperty(helpers,"navbar") || (depth0 != null ? lookupProperty(depth0,"navbar") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"navbar","hash":{},"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":14}}}) : helper))) != null ? stack1 : "")
                + "\r\n\r\n<div class=\"pin-creation-layout\">\r\n    <div class=\"pin-creation-layout__column\">\r\n        "
                + ((stack1 = ((helper = (helper = lookupProperty(helpers,"form") || (depth0 != null ? lookupProperty(depth0,"form") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"form","hash":{},"data":data,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":20}}}) : helper))) != null ? stack1 : "")
                + "\r\n    </div>\r\n</div>";
        },"useData":true});
})();

// ИНПУТ ПИНА
(function() {
    var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
    templates['pin-upload.hbs'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
            var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
                if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
                    return parent[propertyName];
                }
                return undefined
            };

            return ((stack1 = ((helper = (helper = lookupProperty(helpers,"navbar") || (depth0 != null ? lookupProperty(depth0,"navbar") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"navbar","hash":{},"data":data,"loc":{"start":{"line":1,"column":0},"end":{"line":1,"column":14}}}) : helper))) != null ? stack1 : "")
                + "\r\n\r\n<div class=\"pin-creation-layout__image-input\">\r\n    <img class=\"pin-creation__img\" src=\"\" id=\"preview\" alt=\"\">\r\n    <a href=\"\" id=\"reset-preview\"><i class=\"fas fa-times\"></i></a>\r\n    <p class=\"pin-creation__upload__icon\"><i class=\"fas fa-file-upload\"></i></p>\r\n    <span>Нажмите для загрузки</span>\r\n    <input type=\"file\" id=\"file\">\r\n</div>";
        },"useData":true});
})();