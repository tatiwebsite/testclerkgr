window.addEventListener('DOMContentLoaded', () => {
    
    animate();
    select();
    rangeSlider();
    filesUpload();
    toggleMenu();
    sendForm();
})

window.addEventListener('load', () => {
    
    ScrollTrigger.refresh()
})

const rangeValue = document.querySelector('.range__num'),
    inputRange = document.getElementById('range-input'),
    selectElem = document.getElementById('type-select'),
    burgerMenu = document.querySelector('.burger'),
    navMenu = document.querySelector('.header__nav'),
    parallaxImg = document.querySelector('.parallax');

function select(){
    let selectItem
    const selectEl = document.querySelectorAll('.select');
    
    selectEl.forEach((el, i) => {
        selectItem = new Choices(el, {
            searchEnabled: false,
            searchChoices: false,
            itemSelectText: "",
            allowHTML: true
        });
        if(el.hasAttribute('required')){
            el.closest('.select-row').setAttribute('data-required', 'true')
        }
        let selInner = el.closest('.select-row').querySelector('.choices__inner');
        selectItem.passedElement.element.addEventListener('change', function(){    
            selectEl[i].closest('.select-row').classList.add("selected");
            if(selectEl[i].closest('.select-row').classList.contains('error')){
                selectEl[i].closest('.select-row').classList.remove('error')
            }
        });
        selectItem.passedElement.element.addEventListener('showDropdown', function() {
            
            selInner.closest('.select-row').classList.add('is-open')
        });
        selectItem.passedElement.element.addEventListener('hideDropdown', function() {
            selInner.closest('.select-row').classList.remove('is-open')
        });
    });
}

function rangeSlider(){
    inputRange.addEventListener('input', () => {
        let value = inputRange.value;
        rangeValue.textContent = value + '%';
    })
}

function sendForm(){
    document.querySelector('.send').addEventListener('click', (e) => {
        e.preventDefault();
        if(checkValidation()){
            console.log('Валидация пройдена')
        } else {
            console.log('Ошибка')
        }
    })
}

function checkValidation () {
    const form = document.querySelector('form');
    const inputs = form.querySelectorAll('input');
    const selects = form.querySelectorAll('.select');

    let res = true;

    inputs.forEach((val) => {
        if(val.hasAttribute('required') && val.value === ""){
            val.classList.add('error')
            res = false;
        } else if (val.hasAttribute('required') && val.value !== "") {
            if(val.getAttribute('type') === "email") {
                if(!validateEmail(val.value)){
                    val.classList.add('error')
                    res = false;
                }else {
                    val.classList.remove('error')
                }
            } else {
                val.classList.remove('error')
            }
        }
    });

    selects.forEach((val) => {

        if(!val.closest('.select-row').classList.contains('selected')){
            val.closest('.select-row').classList.add('error')

            res = false;
        } else if (val.closest('.select-row').classList.contains('selected') && val.closest('.select-row').classList.contains('error')) {
            val.closest('.select-row').classList.remove('error')
        }
    });

    return res;
}

const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function filesUpload(){
    Dropzone.autoDiscover = false; 

    var myDropzone = new Dropzone("#file-input", {
        url: "/file/post", 
        autoProcessQueue: false, 
        addRemoveLinks: true, 
        dictRemoveFile: "Удалить", 
        previewsContainer: null, 

    addedfile: function(file) {
        let fileRow = document.createElement("div");
        fileRow.classList.add('upload-row');
        fileRow.innerHTML = `<span class="upload-row__name">${file.name}</span><button class='upload-row__del' data-dz-remove></button>`;
        document.querySelector(".form__picture").appendChild(fileRow);
        document.querySelector('#file-input').closest('.order-form').classList.remove('empty');

        let removeButton = fileRow.querySelector(".upload-row__del");
        removeButton.addEventListener("click", function(e) {
            e.preventDefault();
            e.stopPropagation();

            myDropzone.removeFile(file); 
            fileRow.remove(); 
            if(!document.querySelector('.upload-row')){
                document.querySelector('#file-input').closest('.order-form').classList.add('empty')
            }
        });
    }
    });

    // document.querySelector(".send").addEventListener("click", function() {
    //     myDropzone.processQueue();
    // });

    myDropzone.on("success", function(file, response) {
        console.log("Файл успешно отправлен", file, response);
    });

    myDropzone.on("removedfile", function(file) {
        console.log("Файл удален", file);
    });
    
}

function toggleMenu(){
    burgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    })
}

function animate(){
    gsap.registerPlugin(ScrollTrigger)
    const tlPromo = gsap.timeline({})
        tlPromo.from('.anim-promo', {
            duration: 0.5,
            autoAlpha: 0,
            yPercent: 50,
            stagger: 0.3  
        })
    gsap.to('.promo__bg img', {
        yPercent: 20,
        scrollTrigger: {
            trigger: '.promo',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    })
    const tlSteps = gsap.timeline({
        scrollTrigger: {
            trigger: '.order__wrap',
            start: 'top 80%',
            end: '+=250px',
            scrub: 1,
            once: true
        }
    })
    tlSteps.from('.order__item', {
        autoAlpha: 0,
        stagger: 0.3
    })
    gsap.from('.order-form', {
        autoAlpha: 0,
        scrollTrigger: {
            trigger: '.order__form',
            start: 'top 60%',
        }
    })
}
