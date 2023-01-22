class Product {
    #id;
    #title;
    #manufacture;
    #price;
    static #idCounter = 0;
    constructor(title, manufacture, price) {
        this.#id = ++Product.#idCounter;
        this.#title = title;
        this.#manufacture = manufacture;
        this.#price = price;
    }

    get title() {
        return this.#title;
    }

    get manufacture() {
        return this.#manufacture;
    }

    get price() {
        return this.#price;
    }
}

class Milk extends Product {
    #fat;
    constructor(title, manufacture, price, fat) {
        super(title, manufacture, price);
        this.#fat = fat;
    }

    get extra() {
        return this.#fat;
    }
}

class Chocolate extends Product {
    #kind;
    constructor(title, manufacture, price, kind) {
        super(title, manufacture, price);
        this.#kind = kind;
    }

    get extra() {
        return this.#kind;
    }
}

class Wine extends Product {
    #alcohol;
    constructor(title, manufacture, price, alcohol) {
        super(title, manufacture, price);
        this.#alcohol = alcohol;
    }

    get extra() {
        return this.#alcohol;
    }
}


class Store {
    #products = [];
    add(product) {
        this.#products.push(product);
    }

    getAll() {
        return this.#products;
    }

    getByType(type) {
        return this.#products.filter(product => {
            if (product.constructor.name.toLowerCase() === type.toLowerCase()) {
                return product;
            }
        });
    }
}