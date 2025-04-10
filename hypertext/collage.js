var loading_screen = document.querySelector(".loading");

window.addEventListener('load', function() {
    loading_screen.style.display = 'none';
})

const imgs = [
    'assets/images/spring vibes/444.jpeg',
    'assets/images/spring vibes/adora_bed.jpeg',
    'assets/images/spring vibes/adora_sun.jpeg',
    'assets/images/spring vibes/biking1.jpeg',
    'assets/images/spring vibes/biking2.jpeg',
    'assets/images/spring vibes/biking3.jpeg',
    'assets/images/spring vibes/in_bloom.jpeg',
    'assets/images/spring vibes/biking4.jpeg',
    'assets/images/spring vibes/bodega_cat.jpeg',
    'assets/images/spring vibes/budding_trees.jpeg',
    'assets/images/spring vibes/cherry_blossoms.jpeg',
    'assets/images/spring vibes/cherryblossoms.jpeg',
    'assets/images/spring vibes/coco_mango_cherry.jpeg',
    'assets/images/spring vibes/corgi.jpeg',
    'assets/images/spring vibes/couch_asami.jpeg',
    'assets/images/spring vibes/flower_stand.jpeg',
    'assets/images/spring vibes/flowers.jpeg',
    'assets/images/spring vibes/flowers1.jpeg',
    'assets/images/spring vibes/flowers2.jpeg',
    'assets/images/spring vibes/flowers3.jpeg',
    'assets/images/spring vibes/flowers4.jpeg',
    'assets/images/spring vibes/flowers5.jpeg',
    'assets/images/spring vibes/free_palestine.jpeg',
    'assets/images/spring vibes/frolic.jpeg',
    'assets/images/spring vibes/gowanusboat.jpeg',
    'assets/images/spring vibes/hearts.jpeg',
    'assets/images/spring vibes/helado.jpeg',
    'assets/images/spring vibes/ilikeyou.jpeg',
    'assets/images/spring vibes/it_is_what_it_is.jpeg',
    'assets/images/spring vibes/leila.jpeg',
    'assets/images/spring vibes/machete.jpeg',
    'assets/images/spring vibes/major_protection.jpeg',
    'assets/images/spring vibes/meme_feds.jpeg',
    'assets/images/spring vibes/meme.png',
    'assets/images/spring vibes/moon_lit.jpeg',
    'assets/images/spring vibes/moon.jpeg',
    'assets/images/spring vibes/more_buds.jpeg',
    'assets/images/spring vibes/mrkiwis.jpeg',
    'assets/images/spring vibes/pizza.jpeg',
    'assets/images/spring vibes/pr_frog.jpeg',
    'assets/images/spring vibes/protection.jpeg',
    'assets/images/spring vibes/purple_buds.jpeg',
    'assets/images/spring vibes/resistance.JPG',
    'assets/images/spring vibes/roofsmoke.jpeg',
    'assets/images/spring vibes/shrub.jpeg',
    'assets/images/spring vibes/skylight.jpeg',
    'assets/images/spring vibes/spring_in_bloom.jpeg',
    'assets/images/spring vibes/sunset.jpeg',
    'assets/images/spring vibes/w4_blossoming.jpeg',
    'assets/images/spring vibes/w4_reading.jpeg',
    'assets/images/spring vibes/w4_sunset.jpeg',
    'assets/images/spring vibes/weird_infra.jpeg',
    'assets/images/spring vibes/z_flowers.jpeg',
]

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

shuffle(imgs);

let main_container = document.querySelector('#overall-collage-container');

imgs.forEach(function(source) {
    // create image container div
    let image_div = document.createElement('div');
    image_div.classList.add('image_container');

    // create image with src
    let img = document.createElement('img');
    img.src = source;

    // calculate a random degree of rotation
    const max_rotation = 20;
    let rotation = Math.ceil(Math.random() * max_rotation);
    let pos_or_neg = Math.round(Math.random()) ? 1 : -1;
    final_rotation = rotation * pos_or_neg;

    // apply rotation to image styling
    image_div.style.transform = "rotate(" + final_rotation + "deg)";

    // append image to image container div
    image_div.appendChild(img);

    // append image container div to main container
    main_container.appendChild(image_div);
  })
