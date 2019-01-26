var list = "";
var cartList = [];
window.addEventListener('load', () => {
    const el = $('#app');
    const modalTemplat = Handlebars.compile($('#modal-template').html());
    const ratesTemplate = Handlebars.compile($('#rates-template').html());
    const cartTemplate = Handlebars.compile($('#cart-template').html());
    const aboutTemplat = Handlebars.compile($('#about-template').html());


    // Instantiate api handler
    const api = axios.create({
        baseURL: 'http://localhost:5000/api',
        timeout: 5000,
    });

    // Router Declaration
    const router = new Router({
        mode: 'history',
        page404: (path) => {
            const html = errorTemplate({
                color: 'yellow',
                title: 'Error 404 - Page NOT Found!',
                message: `The path '/${path}' does not exist on this site`,
            });
            el.html(html);
        },
    });

    //default route
    router.add('/', async () => {
        // Display loader first
        let html = ratesTemplate();
        el.html(html);
        try {
            const response = await api.get('/list');
            const {
                data
            } = response;
            list = response.data.groups;
            // Display Rates Table
            html = ratesTemplate({
                data
            });
            el.html(html);
        } catch (error) {
            console.log(error);
        } finally {
            // Remove loader status
            $('.loading').removeClass('loading');
        }
    });

    //cart route
    router.add('/cart', () => {
        let html = cartTemplate(cartList);
        el.html(html);
    });

    //about us route
    router.add('/about', () => {
        let html = aboutTemplat();
        el.html(html);
    });

    // Navigate app to current url
    router.navigateTo(window.location.pathname);

    // Highlight Active Menu on Refresh/Page Reload
    const link = $(`a[href$='${window.location.pathname}']`);
    link.addClass('active');



    //on add click
    $(document).on('click', '#addCart', function (event) {
        var item = event.target.name;
        cartList.push({"name": item});
        document.getElementsByClassName("modal")[0].style.display = "none";
    });

    //cancel modal
    $(document).on('click', '#cancel', function () {
        document.getElementsByClassName("modal")[0].style.display = "none";
    });

    $(document).on('click', 'img', function (event) {
        var obj = event.target.id;
        // Block browser page load
        event.preventDefault();
        // Highlight Active Menu on Click
        const {
            images
        } = list[obj];
        const {
            messages
        } = list[obj];
        const {
            name
        } = list[obj];
        const html = modalTemplat({
            images,
            messages,
            name
        });
        el.append(html);
        document.getElementsByClassName("modal")[0].style.display = "block";
        $('.carousel-inner > .item:eq(0)').attr("class", "item active");
        setInterval(function () {
            $('.carousel').carousel('next');
        }, 3000);
    });

});

//helper 
Handlebars.registerHelper('editString', function (str) {
    var newstr = str.replace(new RegExp("\\b" + "&#8482" + "\\b"), "");
    var str = newstr.replace(/\;/g, '');
    return str;
});