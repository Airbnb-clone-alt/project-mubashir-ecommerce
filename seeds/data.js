// seeds.js
const mongoose = require('mongoose');
const Product = require('../models/product');

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce-app');
    console.log("✅ DB Connected");

const seedProducts = [
  {
    title: 'Samsung Galaxy S21',
    price: 69999,
    description: 'Samsung Galaxy S21 brings a premium smartphone experience with its stunning 6.2-inch Dynamic AMOLED 2X display that delivers vibrant colors and a smooth 120Hz refresh rate. Powered by the Exynos 2100 processor, this phone offers exceptional speed for multitasking and gaming. Its triple rear camera system, featuring a 64MP telephoto lens, captures detailed photos even in low light. With 8K video recording, enhanced night mode, and a sleek, water-resistant design, the S21 is built for those who demand innovation and style.',
    image: 'https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s21-5g-1.jpg'
  },
  {
    title: 'Apple iPhone 14',
    price: 79999,
    description: 'The Apple iPhone 14 delivers cutting-edge performance and an elegant design with its Super Retina XDR display, offering incredible color accuracy and brightness. Powered by the A15 Bionic chip, it handles demanding apps, games, and multitasking with ease. The advanced dual-camera system captures stunning photos and videos with improved low-light performance and cinematic mode. With Crash Detection, Emergency SOS via satellite, and Ceramic Shield front, the iPhone 14 sets a new standard for safety and durability in smartphones.',
    image: 'https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-14-1.jpg'
  },
  {
    title: 'MacBook Air M1',
    price: 99999,
    description: 'The MacBook Air M1 redefines portability and power with its revolutionary Apple M1 chip. It features an 8-core CPU, 7-core GPU, and 16-core Neural Engine for incredible performance and efficiency. The 13.3-inch Retina display delivers sharp, vibrant visuals with P3 wide color gamut. With up to 18 hours of battery life, a silent fanless design, and a lightweight aluminum body, the MacBook Air is ideal for professionals and creatives on the go.',
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-m1-202011-gallery1?wid=400&hei=400&fmt=jpeg&qlt=95&.v=1633027804000'
  },
  {
    title: 'Levi’s 511 Slim Fit Jeans',
    price: 2999,
    description: 'Levi’s 511 Slim Fit Jeans are designed for men who want style and comfort without compromise. Crafted from high-quality stretch denim, these jeans provide flexibility and ease of movement throughout the day. The mid-rise fit, classic five-pocket styling, and slightly tapered leg give a modern yet timeless look. Perfect for casual outings or smart-casual settings, these jeans are durable, easy to maintain, and available in a variety of washes to suit every mood.',
    image: 'https://assets.ajio.com/medias/sys_master/root/20230616/E9sp/648cbbd1d55b7d0c638e7eaf/-1117Wx1400H-462357848-indigo-MODEL.jpg'
  },
  {
    title: 'Puma Men’s Essential Hoodie',
    price: 2499,
    description: 'The Puma Men’s Essential Hoodie is a must-have for those chilly days. Made from a soft blend of cotton and polyester, this hoodie offers warmth without adding bulk. The adjustable drawstring hood, kangaroo pocket, and ribbed cuffs provide both style and practicality. With a subtle Puma logo on the chest, this hoodie seamlessly fits into any casual or sporty outfit. Wear it for workouts, travel, or just lounging at home.',
    image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_500,h_500/global/586690/51/mod01/fnd/IND/fmt/png/Essentials-Men\'s-Hoodie'
  },
  {
    title: 'Sony WH-1000XM4 Headphones',
    price: 24999,
    description: 'Sony WH-1000XM4 wireless noise-canceling headphones deliver premium sound quality, industry-leading noise cancellation, and up to 30 hours of battery life. With features like Adaptive Sound Control, Speak-to-Chat, and touch sensor controls, these headphones are designed for immersive audio experiences on the go or at home. Soft ear cushions and lightweight design ensure long-term comfort.',
    image: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._SX679_.jpg'
  },
  {
    title: 'HP Pavilion 15',
    price: 55999,
    description: 'HP Pavilion 15 laptop combines power and style in a slim package. Featuring an Intel Core i5 12th Gen processor, 8GB RAM, and 512GB SSD, it delivers seamless multitasking and fast boot-up times. The 15.6-inch FHD display, B&O tuned speakers, and long battery life make it ideal for work and entertainment.',
    image: 'https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c06558975.png'
  },
  {
    title: 'Nike Air Force 1',
    price: 7499,
    description: 'The Nike Air Force 1 is an iconic sneaker that blends classic style with modern comfort. Featuring a durable leather upper, perforated toe box for ventilation, and Nike Air cushioning for all-day support, it’s perfect for casual wear or street style.',
    image: 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,q_auto:eco/010dc853-1d6d-40b5-bbfb-83ed29d7dc06/air-force-1-07-shoes-Dz225f.png'
  },
  {
    title: 'ASUS ROG Strix Gaming Laptop',
    price: 129999,
    description: 'The ASUS ROG Strix is a beast for gamers, powered by AMD Ryzen 9 and NVIDIA RTX 3070 graphics. A 300Hz FHD display ensures ultra-smooth visuals, while advanced cooling technology keeps it performing at its peak during intense gaming sessions.',
    image: 'https://dlcdnwebimgs.asus.com/gain/62d1dc5ef8e24ef39fe2f25dc98e65ce'
  },
  {
    title: 'Canon EOS 1500D DSLR',
    price: 34999,
    description: 'Canon EOS 1500D is perfect for photography enthusiasts. It features a 24.1MP APS-C sensor, DIGIC 4+ processor, and built-in WiFi for easy sharing. Whether capturing landscapes or portraits, this camera delivers sharp and vibrant images.',
    image: 'https://m.media-amazon.com/images/I/914hFeTU2-L._SX679_.jpg'
  },
  {
    title: 'Ikea Markus Office Chair',
    price: 15999,
    description: 'The Ikea Markus Office Chair offers ergonomic comfort for long hours of work. Featuring adjustable height, tilt, and lumbar support, its mesh back keeps you cool while working. The sleek design fits modern workspaces perfectly.',
    image: 'https://www.ikea.com/in/en/images/products/markus-office-chair-vissle-dark-grey__0724713_pe734037_s5.jpg'
  },
  {
    title: 'Realme Narzo 50',
    price: 14999,
    description: 'Realme Narzo 50 is a budget-friendly smartphone packed with features: MediaTek Helio G96 processor, 6.6-inch 120Hz display, 50MP AI triple camera, and a 5000mAh battery with 33W Dart charge. Perfect for gamers and everyday users alike.',
    image: 'https://m.media-amazon.com/images/I/81MZfLhHB-L._SX679_.jpg'
  },
  {
    title: 'Samsung Galaxy Watch 5',
    price: 27999,
    description: 'The Samsung Galaxy Watch 5 helps you stay connected and fit. It features an AMOLED display, advanced health tracking (heart rate, SpO2, sleep), and long battery life in a stylish, durable design.',
    image: 'https://images.samsung.com/is/image/samsung/p6pim/in/2208/gallery/in-galaxy-watch5-44mm-sm-r910nzsainu-533682468?$650_519_PNG$'
  },
  {
    title: 'LG 55-inch OLED TV',
    price: 119999,
    description: 'LG’s 55-inch OLED TV delivers unmatched picture quality with perfect blacks, infinite contrast, and AI-powered 4K upscaling. Dolby Vision IQ and Dolby Atmos create a cinematic experience right in your living room.',
    image: 'https://www.lg.com/in/images/tvs/md07500341/gallery/55c1ptz-d-02.jpg'
  },
  {
    title: 'Ray-Ban Aviator Sunglasses',
    price: 8499,
    description: 'The iconic Ray-Ban Aviator sunglasses feature metal frames and crystal lenses that provide superior UV protection and timeless style. A must-have accessory for any wardrobe.',
    image: 'https://cdn.ray-ban.com/-/media/2021/11/22/17/33/rb_3025_aviator_classic_gunmetal_green.jpg'
  },
  {
    title: 'JBL Flip 5 Bluetooth Speaker',
    price: 8999,
    description: 'The JBL Flip 5 offers powerful bass and crisp sound in a waterproof, durable body. With 12 hours of playtime and PartyBoost support, it’s perfect for outdoor adventures.',
    image: 'https://in.jbl.com/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw0bd012a6/JBL_Flip5_Hero_Black.png'
  },
  {
    title: 'Dell XPS 13',
    price: 129999,
    description: 'Dell XPS 13 is a compact powerhouse with an InfinityEdge display, Intel 12th Gen processors, and premium build quality. Ideal for professionals seeking portability without compromise.',
    image: 'https://i.dell.com/sites/csimages/Master_Imagery/all/xps-13-9300-laptop.jpg'
  },
  {
    title: 'Adidas Ultraboost 22',
    price: 11999,
    description: 'Adidas Ultraboost 22 offers unmatched comfort for runners with its responsive Boost midsole, Primeknit upper, and Continental rubber outsole for superior grip. A great blend of performance and style.',
    image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/6cb5ec9d9a3d4e00b6c9ae6400e7f417_9366/Ultraboost_22_Shoes_Black_GX5462_01_standard.jpg'
  },
  {
    title: 'Boat Airdopes 441',
    price: 1999,
    description: 'Boat Airdopes 441 true wireless earbuds feature immersive sound, IPX7 water resistance, touch controls, and up to 30 hours of playback with the case. Compact and stylish for everyday use.',
    image: 'https://m.media-amazon.com/images/I/61FKQJNMJPL._SX679_.jpg'
  },
  {
    title: 'Wooden Study Table',
    price: 8999,
    description: 'A premium wooden study table made from high-grade engineered wood. Spacious, sturdy, and finished in a rich walnut color, it provides a perfect setup for work or study at home.',
    image: 'https://www.ulcdn.net/images/products/290252/product/Robinson_Study_Table_1.jpg'
  }
];





    await Product.deleteMany({});
    console.log("🗑️ Old products deleted");

    await Product.insertMany(seedProducts);
    console.log("🌱 DB Seeded successfully!");

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    mongoose.connection.close();
    console.log("🔌 DB connection closed");
  }
}

main();

