$(function () {
    const store = new Store();
    const nodes = {
        navDiv: $('.nav'),
        productsLinkLi: $('#productsLink'),
        addLinkLi: $('#addLink'),
        addForm: $('#section form'),
        contentDiv: $('#section .content'),
        typeSelect: $('#type'),
        extraInput: $('#extra'),
        randomValues: $('#random-values'),
        notifications: $('#notifications'),
        sideNavDiv: $('#section .side-nav'),
    };

    const render = () => {
        let products;
        let type;
        $('.side-nav li').each((index, li) => {
            if (li.classList.contains('active')) {
                type = li.dataset.name;
            }
        });

        products = (type === 'All') ? store.getAll() : store.getByType(type);

        const cards = products.map(product => {
            let extraField = '';
            if (product.constructor.name === 'Milk') {
                extraField = `<h4>Fat: ${product.extra}%</h4>`;
            } else if (product.constructor.name === 'Chocolate') {
                extraField = `<h4>Kind: ${product.extra}</h4>`;
            } else if (product.constructor.name === 'Wine') {
                extraField = `<h4>Alcohol: ${product.extra}%</h4>`;
            }

            return `
            <div class="card">
                <h2>${product.constructor.name}</h2>
                <h3>${product.title}</h3>
                <h3>${product.manufacture}</h3>
                ${extraField}
                <h4>Price: ${product.price} NIS</h4>
            </div>
            `;
        }).join('');

        nodes.contentDiv.html(cards);
    }

    const clearNotifications = () => {
        nodes.notifications.html('');
    }

    const showNotification = () => {
        nodes.notifications.html(`<div class="alert-success">The product has been added successfully</div>`);
        setTimeout(clearNotifications, 3000);
    }

    const showErrors = errCodes => {
        const errors = {
            title: 'Invalid value for title',
            manufc: 'Invalid value for manufacture',
            type: 'Invalid value for product type',
            price: 'Invalid value for price',
            extra: 'Invalid value for additional field',
        }
        let errorsHTML = errCodes.map(errCode => {
            return `<div class="alert-danger">${errors[errCode]}</div>`;
        }).join('');
        clearNotifications();
        nodes.notifications.html(errorsHTML);
    }

    const checkCorrectValues = (title, manufc, price, type, extra) => {
        const isCorrectNumber = x => {
            const numX = +x;
            return (x !== '' && !isNaN(numX) && numX > 0);
        }

        let res = true;
        let errCodes = [];

        if (title === '') {
            res = false;
            errCodes.push('title');
        }

        if (manufc === '') {
            res = false;
            errCodes.push('manufc');
        }

        if (type !== 'milk' && type !== 'chocolate' && type !== 'wine') {
            res = false;
            errCodes.push('type');
        }

        if (!isCorrectNumber(price)) {
            res = false;
            errCodes.push('price');
        }

        if ((type === 'chocolate' && extra === '') || (type !== 'chocolate' && !isCorrectNumber(extra))) {
            res = false;
            errCodes.push('extra');
        }
        clearNotifications();
        (res)?showNotification():showErrors(errCodes);

        return res;
    }

    nodes.addForm.on('submit', e => {
        e.preventDefault();
        const title = e.target.title.value.trim();
        const manufc = e.target.manufc.value.trim();
        const price = e.target.price.value.trim();
        const type = e.target.type.value.trim();
        const extra = e.target.extra.value.trim();

        if (checkCorrectValues(title, manufc, price, type, extra)) {
            switch (type) {
                case 'milk': {
                    store.add(new Milk(title, manufc, price, extra));
                    break;
                }
                case 'chocolate': {
                    store.add(new Chocolate(title, manufc, price, extra));
                    break;
                }
                case 'wine': {
                    store.add(new Wine(title, manufc, price, extra));
                    break;
                }
            }
            nodes.addForm.trigger('reset');
            render();
        }
    });

    nodes.typeSelect.on('change', e => {
        switch (e.target.value) {
            case 'milk': {
                nodes.extraInput.attr('type', 'number');
                nodes.extraInput.attr('placeholder', 'Type fat');
                break;
            }
            case 'chocolate': {
                nodes.extraInput.attr('type', 'text');
                nodes.extraInput.attr('placeholder', 'Type kind');
                break;
            }
            case 'wine': {
                nodes.extraInput.attr('type', 'number');
                nodes.extraInput.attr('placeholder', 'Type alcohol');
                break;
            }
        }
    });

    nodes.navDiv.on('click', e => {
        const navID = e.target.getAttribute('id');
        nodes.productsLinkLi.toggleClass('active');
        nodes.addLinkLi.toggleClass('active');
        nodes.addForm.toggleClass('hide');
        nodes.contentDiv.toggleClass('hide');
        nodes.sideNavDiv.toggleClass('hide');
    });

    nodes.sideNavDiv.on('click', e => {
        if (e.target.dataset.name) {
            document.querySelectorAll('.side-nav li').forEach(li => {
                li.classList.remove('active');
            });
            e.target.classList.add('active');
            render();
        }
    });

    nodes.randomValues.on('click', () => {
        const randomizer = (min, max, symbolsAfterComma = 0) => Math.floor(Math.random() * (max - min) + min);
        const types = [
            {
                type: 'milk',
                title: ['Borden Dairy', 'Fairlife', 'Alta Dena', 'Darigold', 'Shamrock Farms', 'Organic Valley', 'Stonyfield Organic', 'Wegmans'],
                manufacture: ['Nestle', 'Lactalis', 'Danone', 'Fonterra', 'Frieslandcampina', 'Dairy Farmers of America', 'Arla Foods', 'Yili Group', 'Saputo', 'Mengniu Dairy'],
                price: randomizer(3, 20),
                extra: ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9']
            },
            {
                type: 'chocolate',
                title: ['Lindt', 'Nestle', 'Hershey???s', 'Milka', 'Mars', 'Cadbury', 'Godiva', 'Dove', 'Ghirardelli', 'Guylian', 'Kinder', 'Toblerone', 'Ferrero Rocher', 'Ritter Sport'],
                manufacture: ['Mars Wrigley Confectionery', 'Ferrero Group', 'Mondelez International', 'Meiji Co. Ltd.', 'Hershey Company', 'Nestle', 'Chocoladefabriken Lindt Sprungli AG', 'Haribo GmbH Co. K.G.', 'Orion Corp.'],
                price: randomizer(3, 20),
                extra: ['Milk Chocolate', 'White Chocolate', 'Dark Chocolate', 'Semisweeet Chocolate', 'Bittersweet Chocolate', 'Unsweetened Chocolate', 'Sweet German Chocolate', 'Couverture Chocolate', 'Ruby Chocolate']
            },
            {
                type: 'wine',
                title: ['Beringer Founders Estate California Cabernet Sauvignon', 'Bogle Old Vine California Zinfandel', 'Chateau Ste. Michelle Columbia Valley Merlot', 'Columbia Crest H3 Cabernet Sauvignon', 'Foxglove Central Coast Chardonnay', 'Hess Select North Coast Cabernet Sauvignon', 'J. Lohr Estates Seven Oaks Cabernet Sauvignon', 'Kendall Jackson Vintner\'s Reserve California Chardonnay', 'Pine Ridge Chenin Blanc', 'Rancho Zabaco Heritage Vines Sonoma County Zinfandel', 'Robert Mondavi Winery Napa Valley Fume Blanc', 'La Crema Sonoma Coast Chardonnay'],
                manufacture: ['E & J Gallo', 'The Wine Group', 'Treasury Wine Estate', 'Vina Concha Y Toro', 'Castel Freres', 'Accolade Wines', 'Pernod Ricard', 'Grupo Penaflor', 'Fecovita Co-Op'],
                price: randomizer(29, 500),
                extra: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            }
        ];

        const index = randomizer(0, types.length);
        if (types[index].type === 'chocolate') {
            nodes.extraInput.attr('type', 'text');
            nodes.extraInput.attr('placeholder', 'Type kind');
        } else if (types[index].type === 'milk') {
            nodes.extraInput.attr('type', 'number');
            nodes.extraInput.attr('placeholder', 'Type fat');
        } else if (types[index].type === 'wine') {
            nodes.extraInput.attr('type', 'number');
            nodes.extraInput.attr('placeholder', 'Type alcohol');
        }

        nodes.addForm[0].type.value = types[index].type;
        nodes.addForm[0].title.value = types[index].title[randomizer(0, types[index].title.length)];
        nodes.addForm[0].manufc.value = types[index].manufacture[randomizer(0, types[index].manufacture.length)];
        nodes.addForm[0].price.value = types[index].price;
        nodes.addForm[0].extra.value = types[index].extra[randomizer(0, types[index].extra.length)];
    });

    render();
});