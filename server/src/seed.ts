import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model';

// Load env vars if needed
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/product_management';

const adjectives = ['Premium', 'Wireless', 'Smart', 'Ergonomic', 'Portable', 'Compact', 'Heavy Duty', 'Eco-friendly', 'Mechanical', 'Bluetooth'];
const nouns = ['Keyboard', 'Mouse', 'Headphones', 'Monitor', 'Laptop Stand', 'Webcam', 'Microphone', 'Desk Pad', 'Charger', 'Speaker'];

const generateProducts = (count: number) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
        const idSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

        // Create random price between 10.00 and 999.99
        const price = Number((Math.random() * 989.99 + 10).toFixed(2));

        // Create random stock between 0 and 500, with higher chance of being in stock
        const stock = Math.random() > 0.1 ? Math.floor(Math.random() * 200) + 1 : 0;

        products.push({
            name: `${randomAdjective} ${randomNoun} X${idSuffix}`,
            price,
            stock,
        });
    }
    return products;
};

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`✅ Connected to MongoDB at ${MONGODB_URI}`);

        console.log('Clearing existing products...');
        await Product.deleteMany({});
        console.log('✅ Collection cleared.');

        console.log('Generating 50 products...');
        const dummyProducts = generateProducts(50);

        await Product.insertMany(dummyProducts);
        console.log('✅ Successfully inserted 50 products!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
