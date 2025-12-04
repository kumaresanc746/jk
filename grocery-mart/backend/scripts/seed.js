require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocerymart';

const products = [
  // Fruits
  {
    name: 'Fresh Apples',
    description: 'Crispy and sweet red apples, perfect for snacking',
    category: 'Fruits',
    price: 120,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
    unit: 'kg',
    rating: 4.5
  },
  {
    name: 'Bananas',
    description: 'Fresh yellow bananas, rich in potassium',
    category: 'Fruits',
    price: 60,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    unit: 'dozen',
    rating: 4.3
  },
  {
    name: 'Oranges',
    description: 'Juicy oranges packed with Vitamin C',
    category: 'Fruits',
    price: 80,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400',
    unit: 'kg',
    rating: 4.4
  },
  {
    name: 'Grapes',
    description: 'Sweet green grapes, perfect for desserts',
    category: 'Fruits',
    price: 150,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1604977043462-20ab65e82ff1?w=400',
    unit: 'kg',
    rating: 4.6
  },
  {
    name: 'Strawberries',
    description: 'Fresh red strawberries, great for salads and desserts',
    category: 'Fruits',
    price: 200,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400',
    unit: 'pack',
    rating: 4.7
  },
  
  // Vegetables
  {
    name: 'Tomatoes',
    description: 'Fresh red tomatoes, essential for cooking',
    category: 'Vegetables',
    price: 40,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400',
    unit: 'kg',
    rating: 4.2
  },
  {
    name: 'Onions',
    description: 'Brown onions, perfect for all dishes',
    category: 'Vegetables',
    price: 30,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1618512496249-e5f00ab4ae7f?w=400',
    unit: 'kg',
    rating: 4.1
  },
  {
    name: 'Potatoes',
    description: 'Fresh potatoes, versatile for cooking',
    category: 'Vegetables',
    price: 35,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400',
    unit: 'kg',
    rating: 4.3
  },
  {
    name: 'Carrots',
    description: 'Fresh orange carrots, rich in beta-carotene',
    category: 'Vegetables',
    price: 45,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
    unit: 'kg',
    rating: 4.4
  },
  {
    name: 'Spinach',
    description: 'Fresh green spinach leaves, packed with iron',
    category: 'Vegetables',
    price: 25,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400',
    unit: 'bunch',
    rating: 4.5
  },
  
  // Dairy
  {
    name: 'Milk',
    description: 'Fresh whole milk, 1 liter',
    category: 'Dairy',
    price: 60,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    unit: 'liter',
    rating: 4.6
  },
  {
    name: 'Eggs',
    description: 'Farm fresh eggs, 12 pieces',
    category: 'Dairy',
    price: 80,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400',
    unit: 'dozen',
    rating: 4.7
  },
  {
    name: 'Butter',
    description: 'Premium butter, 200g',
    category: 'Dairy',
    price: 120,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7fe135a9c4?w=400',
    unit: 'pack',
    rating: 4.5
  },
  {
    name: 'Cheese',
    description: 'Cheddar cheese slices, 200g',
    category: 'Dairy',
    price: 180,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
    unit: 'pack',
    rating: 4.4
  },
  {
    name: 'Yogurt',
    description: 'Fresh plain yogurt, 500g',
    category: 'Dairy',
    price: 50,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    unit: 'pack',
    rating: 4.3
  },
  
  // Snacks
  {
    name: 'Potato Chips',
    description: 'Crispy potato chips, 150g',
    category: 'Snacks',
    price: 35,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    unit: 'pack',
    rating: 4.2
  },
  {
    name: 'Biscuits',
    description: 'Sweet cream biscuits, 200g',
    category: 'Snacks',
    price: 45,
    stock: 180,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    unit: 'pack',
    rating: 4.4
  },
  
  // Beverages
  {
    name: 'Mineral Water',
    description: 'Pure mineral water, 1 liter',
    category: 'Beverages',
    price: 20,
    stock: 300,
    image: 'https://images.unsplash.com/photo-1548839140-5a7f38ad6a82?w=400',
    unit: 'bottle',
    rating: 4.1
  },
  {
    name: 'Orange Juice',
    description: 'Fresh orange juice, 1 liter',
    category: 'Beverages',
    price: 80,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    unit: 'pack',
    rating: 4.3
  },
  
  // Household
  {
    name: 'Dish Soap',
    description: 'Lemon dishwashing liquid, 500ml',
    category: 'Household',
    price: 60,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400',
    unit: 'bottle',
    rating: 4.5
  },
  {
    name: 'Laundry Detergent',
    description: 'Powerful laundry detergent, 1kg',
    category: 'Household',
    price: 250,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
    unit: 'pack',
    rating: 4.4
  },
  
  // Staples
  {
    name: 'Rice',
    description: 'Premium basmati rice, 1kg',
    category: 'Staples',
    price: 80,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    unit: 'kg',
    rating: 4.6
  },
  {
    name: 'Wheat Flour',
    description: 'Fine wheat flour, 1kg',
    category: 'Staples',
    price: 45,
    stock: 180,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
    unit: 'kg',
    rating: 4.5
  },
  {
    name: 'Sugar',
    description: 'Pure white sugar, 1kg',
    category: 'Staples',
    price: 50,
    stock: 160,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
    unit: 'kg',
    rating: 4.4
  },
  
  // Personal Care
  {
    name: 'Toothpaste',
    description: 'Mint toothpaste, 150g',
    category: 'Personal Care',
    price: 90,
    stock: 120,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    unit: 'tube',
    rating: 4.5
  },
  {
    name: 'Shampoo',
    description: 'Anti-dandruff shampoo, 400ml',
    category: 'Personal Care',
    price: 180,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1556228578-6191e7bc5b73?w=400',
    unit: 'bottle',
    rating: 4.3
  },
  
  // Health
  {
    name: 'Honey',
    description: 'Pure organic honey, 500g',
    category: 'Health',
    price: 350,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
    unit: 'bottle',
    rating: 4.7
  },
  {
    name: 'Green Tea',
    description: 'Premium green tea bags, 50 count',
    category: 'Health',
    price: 250,
    stock: 70,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
    unit: 'pack',
    rating: 4.6
  }
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@grocerymart.com',
  password: 'admin123',
  role: 'admin'
};

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products
    await Product.insertMany(products);
    console.log(`Inserted ${products.length} products`);

    // Create admin user if not exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    if (!existingAdmin) {
      await User.create(adminUser);
      console.log('Admin user created: admin@grocerymart.com / admin123');
    } else {
      console.log('Admin user already exists');
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

