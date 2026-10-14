import { pool } from './db.js';

export async function initFullDatabase() {
  try {
    console.log('🔄 Initializing Shared Database Schema for Airbnb & Admin...');

    // 1. Users / Guests Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        phone VARCHAR(30),
        avatar TEXT,
        role VARCHAR(20) DEFAULT 'guest',
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE users ADD COLUMN IF NOT EXISTS dob DATE;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS otp VARCHAR(10);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_first_name VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS use_first_name_only BOOLEAN DEFAULT true;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS host_display_name VARCHAR(150);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS identity_verification_status VARCHAR(50) DEFAULT 'Not started';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS residential_address TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS postal_address TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_relationship VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_language VARCHAR(50) DEFAULT 'English';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_email VARCHAR(150);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(50);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS passkey_enabled BOOLEAN DEFAULT false;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS passkey_type VARCHAR(100) DEFAULT 'Fingerprint, face or PIN';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS passkey_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_device VARCHAR(150) DEFAULT 'Windows 10.0 • Chrome';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_active_location VARCHAR(150) DEFAULT 'Jaipur, Rajasthan';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"readMessages":true,"searchEngines":false,"homeCity":false,"tripType":false,"lengthOfStay":false,"bookedServices":false,"aiFeatures":true}'::jsonb;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_settings JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS tax_info JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS vat_info JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(50) DEFAULT 'English';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'UTC';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS known_languages JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS referral_code VARCHAR(100);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS custom_referral_links JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS about_me TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_answers JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS interests JSONB;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS stamps_enabled BOOLEAN DEFAULT true;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS automatic_translation BOOLEAN DEFAULT true;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_currency VARCHAR(10) DEFAULT 'INR';
    `);

    // Blocked Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blocked_users (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        blocked_name VARCHAR(150) NOT NULL,
        blocked_email VARCHAR(150),
        reason VARCHAR(255) DEFAULT 'Inappropriate messages',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Listings / Properties Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        category VARCHAR(100) DEFAULT 'Trending',
        host_name VARCHAR(100) NOT NULL,
        host_phone VARCHAR(30),
        city VARCHAR(100) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        rating NUMERIC(3, 2) DEFAULT 4.90,
        reviews_count INT DEFAULT 12,
        status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Pending', 'Suspended'
        is_featured BOOLEAN DEFAULT false,
        is_guest_favourite BOOLEAN DEFAULT false,
        cover_img TEXT,
        amenities TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE listings ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS photos TEXT[];
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS itinerary JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS discounts JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS host_id INT;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS max_guests INT DEFAULT 1;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS years_experience INT DEFAULT 0;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS host_intro TEXT;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS host_qualifications TEXT;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS host_recognition TEXT;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS online_profiles TEXT[];
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS residential_address JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS hosting_as_business VARCHAR(10) DEFAULT 'no';
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS meetup_address JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_area JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_provision_type TEXT[] DEFAULT '{}';
    `);

    // 3. Bookings Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        booking_code VARCHAR(30) UNIQUE NOT NULL,
        guest_name VARCHAR(100) NOT NULL,
        guest_email VARCHAR(150),
        listing_title VARCHAR(255) NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'CONFIRMED', -- 'CONFIRMED', 'PENDING', 'CANCELLED'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Initial Listings if empty
    const checkListings = await pool.query('SELECT COUNT(*) FROM listings');
    if (parseInt(checkListings.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial properties to database...');
      await pool.query(`
        INSERT INTO listings (title, type, category, host_name, host_phone, city, price, rating, reviews_count, status, is_featured, is_guest_favourite, cover_img, amenities)
        VALUES 
        ('Sunset Hilltop Heritage Homestay', 'Entire Villa • 3 Beds • 3 Baths', 'Trending', 'Vikram Rajput', '+91 94140 88776', 'Udaipur, Rajasthan', 2400, 4.96, 48, 'Active', true, true, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=400&q=80', ARRAY['Private Pool', 'High-Speed WiFi', 'Free Parking', 'Kitchen']),
        ('Goan Beachfront Eco Cottage', 'Private Cottage • 2 Beds • 2 Baths', 'Beachfront', 'Ananya Roy', '+91 99123 45678', 'North Goa', 3200, 4.88, 32, 'Active', true, false, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=400&q=80', ARRAY['Beach Access', 'WiFi', 'Air Conditioning', 'Power Backup']),
        ('Luxury Highrise Studio DLF CyberCity', 'Entire Apartment • 1 Bed • 1 Bath', 'Iconic Cities', 'Rohan Mehra', '+91 98765 11223', 'Gurugram, NCR', 1850, 4.75, 19, 'Active', false, false, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80', ARRAY['Fast WiFi', 'Workspace', 'Gym Access', 'Elevator']),
        ('Pine Forest Cedar Wooden Chalet', 'Wooden Cabin • 4 Beds • 3 Baths', 'Cabins', 'Kavita Thakur', '+91 98160 55443', 'Manali, Himachal Pradesh', 3900, 4.98, 76, 'Active', true, true, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80', ARRAY['Mountain View', 'Fireplace', 'Heated Rooms', 'Free Parking']);
      `);
    }

    // Seed Initial Guests if empty
    const checkUsers = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(checkUsers.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial users to database...');
      await pool.query(`
        INSERT INTO users (first_name, last_name, email, phone, role, status)
        VALUES 
        ('Aarav', 'Sharma', 'aarav.sharma@example.com', '+91 9876543210', 'guest', 'ACTIVE'),
        ('Pooja', 'Verma', 'pooja.verma@example.com', '+91 9811223344', 'guest', 'ACTIVE'),
        ('Vikram', 'Rajput', 'vikram.rajput@example.com', '+91 9414088776', 'host', 'ACTIVE');
      `);
    }

    // Seed Sample Blocked Users if empty
    const checkBlocked = await pool.query('SELECT COUNT(*) FROM blocked_users');
    if (parseInt(checkBlocked.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial blocked users...');
      await pool.query(`
        INSERT INTO blocked_users (user_id, blocked_name, blocked_email, reason, created_at)
        VALUES 
        (4, 'Alex Johnson', 'alex.j@example.com', 'Unsolicited messages', CURRENT_TIMESTAMP - INTERVAL '9 days'),
        (4, 'Sarah Miller', 'sarah.m@example.com', 'Inappropriate communication', CURRENT_TIMESTAMP - INTERVAL '25 days');
      `);
    }

    // 4. Hosting Types Table (Dynamic Experience/Service Modal)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hosting_types (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        description TEXT,
        target_step INT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const checkTypes = await pool.query('SELECT COUNT(*) FROM hosting_types');
    if (parseInt(checkTypes.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial hosting types...');
      await pool.query(`
        INSERT INTO hosting_types (key, name, icon, description, target_step)
        VALUES 
        ('experience', 'Experience', '🎈', 'Lead activities guests can only find locally.', 2),
        ('service', 'Service', '🛎️', 'Offer tailored in-person or on-demand services.', 1);
      `);
    }

    // 5. Host Categories Table (Dynamic serviceStep 1 & 2 categories)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS host_categories (
        id SERIAL PRIMARY KEY,
        hosting_type VARCHAR(50) NOT NULL, -- 'service' or 'experience'
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        sub_options TEXT[],
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const checkCategories = await pool.query('SELECT COUNT(*) FROM host_categories');
    if (parseInt(checkCategories.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding host categories for services and experiences...');
      await pool.query(`
        INSERT INTO host_categories (hosting_type, name, icon, sub_options)
        VALUES 
        -- Services (serviceStep === 1)
        ('service', 'Catering', '🍲', ARRAY['Event catering', 'Corporate catering', 'Private party', 'Wedding catering']),
        ('service', 'Chef', '🔪', ARRAY['Private dinners', 'Menu planning', 'Cooking classes', 'Dietary specialty']),
        ('service', 'Hairstyling', '💇‍♀️', ARRAY['Haircut', 'Coloring', 'Bridal styling', 'Hair treatments']),
        ('service', 'Make-up', '💄', ARRAY['Bridal makeup', 'Special effects', 'Everyday glam', 'Makeup lessons']),
        ('service', 'Massage', '💆', ARRAY['Swedish massage', 'Deep tissue', 'Sports massage', 'Reflexology']),
        ('service', 'Personal training', '🏋️', ARRAY['Strength training', 'Cardio fitness', 'Yoga instruction', 'Pilates']),
        ('service', 'Photography', '📷', ARRAY['Portrait session', 'Event coverage', 'Commercial shoot', 'Wedding photography']),
        ('service', 'Prepared meals', '🍱', ARRAY['Weekly meal prep', 'Dietary specific', 'Family style', 'Gourmet boxes']),
        ('service', 'Spa treatments', '🧖', ARRAY['Facials', 'Body scrubs', 'Aromatherapy', 'Manicure/Pedicure']),
        
        -- Experiences (serviceStep === 2)
        ('experience', 'Art and design', '🎨', ARRAY['Architecture tour', 'Art workshop', 'Gallery tour', 'Shopping & fashion experience']),
        ('experience', 'Fitness and wellness', '🧘', ARRAY['Yoga class', 'Meditation session', 'Fitness boot camp', 'Wellness retreat']),
        ('experience', 'Food and drink', '🍷', ARRAY['Cooking class', 'Wine tasting', 'Food tour', 'Bar crawl']),
        ('experience', 'History and culture', '🏛️', ARRAY['Historical tour', 'Cultural walk', 'Museum visit', 'Local traditions']),
        ('experience', 'Nature and outdoors', '🌲', ARRAY['Hiking', 'Camping', 'Wildlife watching', 'Boat ride']);
      `);
    }

    // 7. Admins Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Super Admin',
        avatar VARCHAR(10) DEFAULT 'SA',
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP WITH TIME ZONE
      );
    `);

    // Seed default admin accounts if not already seeded
    const adminCountRes = await pool.query('SELECT COUNT(*) FROM admins');
    if (parseInt(adminCountRes.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial admin users...');
      await pool.query(`
        INSERT INTO admins (name, email, password, role, avatar, status) VALUES
        ('Super Admin', 'admin@airbnb.internal', '$2a$10$vN0u02/9n2B6nI.W9.Zqeu.G9rL7/06PZq/QG1Q9Zqeu.G9rL7/06', 'Super Admin', 'SA', 'ACTIVE'),
        ('Finance Manager', 'finance.lead@airbnb.internal', '$2a$10$vN0u02/9n2B6nI.W9.Zqeu.G9rL7/06PZq/QG1Q9Zqeu.G9rL7/06', 'Finance Manager', 'FM', 'ACTIVE'),
        ('Senior Moderator', 'support.lead@airbnb.internal', '$2a$10$vN0u02/9n2B6nI.W9.Zqeu.G9rL7/06PZq/QG1Q9Zqeu.G9rL7/06', 'Senior Moderator', 'SM', 'ACTIVE')
        ON CONFLICT (email) DO NOTHING;
      `);
    }

    console.log('✅ PostgreSQL Shared Database Schema is ready!');
  } catch (err) {
    console.error('❌ Error initializing database tables:', err.message);
  }
}
