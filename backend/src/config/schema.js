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
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_offerings JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY['English']::TEXT[];
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS accessibility_features TEXT[] DEFAULT '{}'::TEXT[];
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS co_hosts JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS travel_preference VARCHAR(100) DEFAULT 'You travel to guests';
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS service_radius_desc TEXT;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS street TEXT;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS state VARCHAR(100);
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'India';
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS min_age INT DEFAULT 18;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS allow_infants BOOLEAN DEFAULT true;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS experience_description TEXT;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS degree TEXT;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS career_highlight TEXT;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS simultaneous_bookings VARCHAR(100) DEFAULT '1 at a time';
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS social_link TEXT;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS cancellation_policy VARCHAR(100) DEFAULT '1 day';
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS custom_link VARCHAR(255);
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS photo_captions JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS review_requirements_agreed BOOLEAN DEFAULT true;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS bedrooms INT DEFAULT 2;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS beds INT DEFAULT 3;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS bathrooms INT DEFAULT 2;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS categorized_photos JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE listings ADD COLUMN IF NOT EXISTS time VARCHAR(100);
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
        ('experience', 'Experience', 'experience', 'Lead activities guests can only find locally.', 2),
        ('service', 'Service', 'service', 'Offer tailored in-person or on-demand services.', 1);
      `);
    } else {
      await pool.query(`
        UPDATE hosting_types SET icon = 'experience' WHERE key = 'experience' OR icon LIKE '%🎈%';
        UPDATE hosting_types SET icon = 'service' WHERE key = 'service' OR icon LIKE '%🛎%';
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
        ('service', 'Catering', 'catering', ARRAY['Event catering', 'Corporate catering', 'Private party', 'Wedding catering']),
        ('service', 'Chef', 'chef', ARRAY['Private dinners', 'Menu planning', 'Cooking classes', 'Dietary specialty']),
        ('service', 'Hairstyling', 'hair', ARRAY['Haircut', 'Coloring', 'Bridal styling', 'Hair treatments']),
        ('service', 'Make-up', 'makeup', ARRAY['Bridal makeup', 'Special effects', 'Everyday glam', 'Makeup lessons']),
        ('service', 'Massage', 'massage', ARRAY['Swedish massage', 'Deep tissue', 'Sports massage', 'Reflexology']),
        ('service', 'Personal training', 'fitness', ARRAY['Strength training', 'Cardio fitness', 'Yoga instruction', 'Pilates']),
        ('service', 'Photography', 'photo', ARRAY['Portrait session', 'Event coverage', 'Commercial shoot', 'Wedding photography']),
        ('service', 'Prepared meals', 'meals', ARRAY['Weekly meal prep', 'Dietary specific', 'Family style', 'Gourmet boxes']),
        ('service', 'Spa treatments', 'spa', ARRAY['Facials', 'Body scrubs', 'Aromatherapy', 'Manicure/Pedicure']),
        
        -- Experiences (serviceStep === 2)
        ('experience', 'Art and design', 'art', ARRAY['Architecture tour', 'Art workshop', 'Gallery tour', 'Shopping & fashion experience']),
        ('experience', 'Fitness and wellness', 'wellness', ARRAY['Yoga class', 'Meditation session', 'Fitness boot camp', 'Wellness retreat']),
        ('experience', 'Food and drink', 'food', ARRAY['Cooking class', 'Wine tasting', 'Food tour', 'Bar crawl']),
        ('experience', 'History and culture', 'history', ARRAY['Historical tour', 'Cultural walk', 'Museum visit', 'Local traditions']),
        ('experience', 'Nature and outdoors', 'nature', ARRAY['Hiking', 'Camping', 'Wildlife watching', 'Boat ride']);
      `);
    } else {
      // Migrate existing emoji records in database to clean React-icon identifiers
      await pool.query(`
        UPDATE host_categories SET icon = 'catering' WHERE icon LIKE '%🍲%' OR name ILIKE '%Catering%';
        UPDATE host_categories SET icon = 'chef' WHERE icon LIKE '%🔪%' OR name ILIKE '%Chef%';
        UPDATE host_categories SET icon = 'hair' WHERE icon LIKE '%💇%' OR name ILIKE '%Hairstyling%';
        UPDATE host_categories SET icon = 'makeup' WHERE icon LIKE '%💄%' OR name ILIKE '%Make-up%';
        UPDATE host_categories SET icon = 'massage' WHERE icon LIKE '%💆%' OR name ILIKE '%Massage%';
        UPDATE host_categories SET icon = 'fitness' WHERE icon LIKE '%🏋%' OR name ILIKE '%Personal training%';
        UPDATE host_categories SET icon = 'photo' WHERE icon LIKE '%📷%' OR name ILIKE '%Photography%';
        UPDATE host_categories SET icon = 'meals' WHERE icon LIKE '%🍱%' OR name ILIKE '%Prepared meals%';
        UPDATE host_categories SET icon = 'spa' WHERE icon LIKE '%🧖%' OR name ILIKE '%Spa treatments%';
        UPDATE host_categories SET icon = 'art' WHERE icon LIKE '%🎨%' OR name ILIKE '%Art and design%';
        UPDATE host_categories SET icon = 'wellness' WHERE icon LIKE '%🧘%' OR name ILIKE '%Fitness and wellness%';
        UPDATE host_categories SET icon = 'food' WHERE icon LIKE '%🍷%' OR name ILIKE '%Food and drink%';
        UPDATE host_categories SET icon = 'history' WHERE icon LIKE '%🏛%' OR name ILIKE '%History and culture%';
        UPDATE host_categories SET icon = 'nature' WHERE icon LIKE '%🌲%' OR name ILIKE '%Nature and outdoors%';
      `);
    }


    // 6. Property Types Table (HostStep1 dynamic selection & Admin MasterData management)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS property_types (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50) DEFAULT 'home',
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const checkPropCount = await pool.query('SELECT COUNT(*) FROM property_types');
    if (parseInt(checkPropCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial property types for Host Step 1...');
      await pool.query(`
        INSERT INTO property_types (slug, name, icon, description, display_order) VALUES
        ('house', 'House', 'home', 'Standalone house with private spaces', 1),
        ('apartment', 'Flat/apartment', 'apartment', 'Residential flat or modern apartment', 2),
        ('barn', 'Barn', 'barn', 'Converted or rustic country barn', 3),
        ('bnb', 'Bed & breakfast', 'bnb', 'Traditional hosted bed and breakfast', 4),
        ('boat', 'Boat', 'boat', 'Floating home, boat, yacht or houseboat', 5),
        ('cabin', 'Cabin', 'cabin', 'Cozy cabin in nature or mountains', 6),
        ('campervan', 'Campervan/motorhome', 'campervan', 'Driveable camper or RV', 7),
        ('casa', 'Casa particular', 'casa', 'Private homestay or local residence', 8),
        ('castle', 'Castle', 'castle', 'Historic castle or grand estate', 9),
        ('cave', 'Cave', 'cave', 'Natural cave dwelling or rock-cut home', 10),
        ('container', 'Container', 'container', 'Architectural shipping container home', 11),
        ('cycladic', 'Cycladic home', 'cycladic', 'Traditional white-washed island style home', 12),
        ('dammuso', 'Dammuso', 'dammuso', 'Stone home with domed roof', 13),
        ('dome', 'Dome', 'dome', 'Geodesic dome or glamping dome', 14),
        ('earth_home', 'Earth home', 'earth_home', 'Eco home built into the earth', 15),
        ('farm', 'Farm', 'farm', 'Ranch or working countryside farm', 16),
        ('guesthouse', 'Guest house', 'guesthouse', 'Carriage house or separate guest unit', 17),
        ('hotel', 'Hotel', 'hotel', 'Boutique hotel, lodge or resort stay', 18),
        ('houseboat', 'Houseboat', 'houseboat', 'Houseboat or floating barge on lakes or backwaters', 19),
        ('minsu', 'Minsu', 'minsu', 'Traditional boutique bed and breakfast homestay', 20),
        ('riad', 'Riad', 'riad', 'Traditional Moroccan home with an interior courtyard', 21),
        ('ryokan', 'Ryokan', 'ryokan', 'Traditional Japanese inn with tatami mats & onsen', 22),
        ('shepherds-hut', 'Shepherd''s hut', 'shepherds-hut', 'Rustic countryside wagon or shepherd hut', 23),
        ('tent', 'Tent', 'tent', 'Glamping safari tent or outdoor luxury canvas shelter', 24),
        ('tiny-home', 'Tiny home', 'tiny-home', 'Compact standalone eco-friendly architectural home', 25),
        ('tower', 'Tower', 'tower', 'Historic stone tower or scenic lookout dwelling', 26),
        ('tree-house', 'Tree house', 'tree-house', 'Elevated home built among living tree branches', 27),
        ('trullo', 'Trullo', 'trullo', 'Traditional conical-roof stone building', 28),
        ('windmill', 'Windmill', 'windmill', 'Historic converted architectural windmill', 29),
        ('yurt', 'Yurt', 'yurt', 'Traditional round Mongolian canvas yurt', 30)
        ON CONFLICT (slug) DO NOTHING;
      `);
    } else {
      // Upsert any missing new property types
      await pool.query(`
        INSERT INTO property_types (slug, name, icon, description, display_order) VALUES
        ('houseboat', 'Houseboat', 'houseboat', 'Houseboat or floating barge on lakes or backwaters', 19),
        ('minsu', 'Minsu', 'minsu', 'Traditional boutique bed and breakfast homestay', 20),
        ('riad', 'Riad', 'riad', 'Traditional Moroccan home with an interior courtyard', 21),
        ('ryokan', 'Ryokan', 'ryokan', 'Traditional Japanese inn with tatami mats & onsen', 22),
        ('shepherds-hut', 'Shepherd''s hut', 'shepherds-hut', 'Rustic countryside wagon or shepherd hut', 23),
        ('tent', 'Tent', 'tent', 'Glamping safari tent or outdoor luxury canvas shelter', 24),
        ('tiny-home', 'Tiny home', 'tiny-home', 'Compact standalone eco-friendly architectural home', 25),
        ('tower', 'Tower', 'tower', 'Historic stone tower or scenic lookout dwelling', 26),
        ('tree-house', 'Tree house', 'tree-house', 'Elevated home built among living tree branches', 27),
        ('trullo', 'Trullo', 'trullo', 'Traditional conical-roof stone building', 28),
        ('windmill', 'Windmill', 'windmill', 'Historic converted architectural windmill', 29),
        ('yurt', 'Yurt', 'yurt', 'Traditional round Mongolian canvas yurt', 30)
        ON CONFLICT (slug) DO NOTHING;
      `);
    }

    // 7. Place Types Table (HostStep1 Step 3 - Entire place, Room, Shared room)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS place_types (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(150) NOT NULL,
        subtitle TEXT,
        icon VARCHAR(50) DEFAULT 'home',
        is_active BOOLEAN DEFAULT true,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const checkPlaceCount = await pool.query('SELECT COUNT(*) FROM place_types');
    if (parseInt(checkPlaceCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial place types for Host Step 1 (Step 3)...');
      await pool.query(`
        INSERT INTO place_types (key, title, subtitle, icon, display_order) VALUES
        ('entire', 'An entire place', 'Guests have the whole place to themselves.', 'home', 1),
        ('room', 'A room', 'Guests have their own room in a home, plus access to shared spaces.', 'door', 2),
        ('shared', 'A shared room in a hostel', 'Guests sleep in a shared room in a professionally managed hostel with staff on-site 24/7.', 'bunkbeds', 3);
      `);
    }

    // 8. Coupons Table (Marketing & Guest Checkout)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS coupons (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        discount_type VARCHAR(20) DEFAULT 'Percentage', -- 'Percentage' or 'Flat'
        discount_value NUMERIC(10, 2) NOT NULL,
        max_discount NUMERIC(10, 2) DEFAULT 3000,
        min_booking NUMERIC(10, 2) DEFAULT 0,
        used_count INT DEFAULT 0,
        max_uses INT DEFAULT 1000,
        valid_till DATE DEFAULT '2026-12-31',
        target_audience VARCHAR(100) DEFAULT 'All Guests',
        status VARCHAR(20) DEFAULT 'Active', -- 'Active', 'Expired', 'Disabled'
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default coupons if none exist
    const couponCountRes = await pool.query('SELECT COUNT(*) FROM coupons');
    if (parseInt(couponCountRes.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial promotional coupons...');
      await pool.query(`
        INSERT INTO coupons (code, discount_type, discount_value, max_discount, min_booking, used_count, max_uses, valid_till, target_audience, status, description) VALUES
        ('AIRBNB2026', 'Percentage', 20, 3000, 6000, 482, 1000, '2026-12-31', 'All Guests', 'Active', 'Welcome promotion for new & returning guests across India'),
        ('FIRSTSTAY', 'Flat', 1500, 1500, 4500, 890, 1500, '2026-11-30', 'First Time Guests', 'Active', 'Flat Rs 1,500 off on first verified booking'),
        ('MONSOONMAGIC', 'Percentage', 15, 2500, 5000, 320, 500, '2026-10-31', 'Hill Station & Beach Stays', 'Active', 'Seasonal promotion for villas in Goa, Coorg, and Lonavala'),
        ('DIWALIRETREAT', 'Percentage', 25, 5000, 10000, 0, 2000, '2026-11-15', 'Festive Bookings', 'Active', 'Special Diwali festive discount for extended stays')
        ON CONFLICT (code) DO NOTHING;
      `);
    }

    // 8. Admins Table
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

    // 9. Step Settings Table (Dynamic configuration for Host Onboarding Steps like Step 5)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS step_settings (
        id SERIAL PRIMARY KEY,
        step_key VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        toggle_label VARCHAR(150),
        toggle_subtitle TEXT,
        default_state BOOLEAN DEFAULT true,
        learn_more_link VARCHAR(255) DEFAULT '/privacy-policy',
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default configuration for Step 5 if not exists
    const checkStep5 = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step5_location'");
    if (parseInt(checkStep5.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial step 5 location display settings...');
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label, toggle_subtitle, default_state, learn_more_link)
        VALUES (
          'step5_location',
          'Choose how guests see your location on a map',
          'We only share your address after guests book. Until then, they''ll see an approximate location.',
          'Show precise location',
          'Let guests see your home''s exact location on the map before they book.',
          true,
          '/privacy-policy'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    // 10. Step Basics Table (HostStep1 Step 6 - Dynamic basics like Guests, Bedrooms, Beds, Bathrooms)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS step_basics (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        label VARCHAR(100) NOT NULL,
        default_val INT DEFAULT 1,
        min_val INT DEFAULT 1,
        max_val INT DEFAULT 50,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Step 6 settings if not exist
    const checkStep6 = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step6_basics'");
    if (parseInt(checkStep6.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle)
        VALUES (
          'step6_basics',
          'Share some basics about your place',
          'You''ll add more details later, such as bed types.'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    const checkBasicsCount = await pool.query('SELECT COUNT(*) FROM step_basics');
    if (parseInt(checkBasicsCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial step 6 room basics counters...');
      await pool.query(`
        INSERT INTO step_basics (key, label, default_val, min_val, max_val, display_order)
        VALUES
        ('guests', 'Guests', 4, 1, 30, 1),
        ('bedrooms', 'Bedrooms', 1, 1, 20, 2),
        ('beds', 'Beds', 1, 1, 30, 3),
        ('bathrooms', 'Bathrooms', 1, 1, 15, 4)
        ON CONFLICT (key) DO NOTHING;
      `);
    }

    // 11. Master Amenities Table (HostStep2 Step 2 - Dynamic Amenities & Admin MasterData)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS master_amenities (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(120) NOT NULL,
        sublabel VARCHAR(255),
        category VARCHAR(60) NOT NULL DEFAULT 'Basics',
        icon VARCHAR(50) DEFAULT 'wifi',
        is_highlight BOOLEAN DEFAULT false,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Step 2 settings if not exist
    const checkStep2 = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step2_amenities'");
    if (parseInt(checkStep2.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle)
        VALUES (
          'step2_amenities',
          'Tell guests which amenities they''ll find at your place',
          'You can add more amenities after you publish your listing.'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    // Seed Step 3 photos settings (HostStep2 Step 3)
    const checkStep3 = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step3_photos'");
    if (parseInt(checkStep3.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label, toggle_subtitle)
        VALUES (
          'step3_photos',
          'Add some photos of your house',
          'You''ll need 5 photos to get started. You can add more or make changes later.',
          'Ta-da! How does this look?',
          'Drag to reorder'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    // Seed Step 3 photo modals settings (Upload, Delete, Edit modals)
    const checkStep3Modals = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step3_modals'");
    if (parseInt(checkStep3Modals.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label, toggle_subtitle)
        VALUES (
          'step3_modals',
          'Upload photos',
          'Drag and drop or browse for photos',
          'Delete this photo?',
          'Once you delete it, you can''t get it back.'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    // Seed Step 4 title settings (HostStep2 Step 4)
    const checkStep4 = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step4_title'");
    if (parseInt(checkStep4.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label)
        VALUES (
          'step4_title',
          'Now, let''s give your house a title',
          'Short titles work best. Have fun with it — you can always change it later.',
          '50'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    const checkAmenitiesCount = await pool.query('SELECT COUNT(*) FROM master_amenities');
    if (parseInt(checkAmenitiesCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial HostStep2 master amenities...');
      await pool.query(`
        INSERT INTO master_amenities (key, name, sublabel, category, icon, is_highlight, display_order)
        VALUES
        -- Basics
        ('ac', 'Air conditioning', '', 'Basics', 'snowflake', true, 1),
        ('essentials', 'Essentials', 'Towels, bed sheets, soap and toilet paper', 'Basics', 'cleaning', true, 2),
        ('fridge', 'Fridge', '', 'Basics', 'fridge', false, 3),
        ('heating', 'Heating', '', 'Basics', 'heating', false, 4),
        ('hot_water', 'Hot water', '', 'Basics', 'hot_water', false, 5),
        ('kitchen', 'Kitchen', '', 'Basics', 'kitchen', true, 6),
        ('tv', 'TV', '', 'Basics', 'tv', false, 7),
        ('dryer', 'Tumble dryer', '', 'Basics', 'dryer', false, 8),
        ('washing_machine', 'Washing machine', '', 'Basics', 'washing_machine', false, 9),
        ('wifi', 'Wifi', '', 'Basics', 'wifi', true, 10),

        -- Standout amenities (Features/Popular)
        ('pool', 'Pool', '', 'Standout amenities (Features/Popular)', 'pool', true, 11),
        ('hottub', 'Hot tub', '', 'Standout amenities (Features/Popular)', 'hottub', true, 12),
        ('patio', 'Patio', '', 'Standout amenities (Features/Popular)', 'patio', false, 13),
        ('bbq', 'BBQ grill', '', 'Standout amenities (Features/Popular)', 'bbq', false, 14),
        ('outdoor_dining', 'Outdoor dining area', '', 'Standout amenities (Features/Popular)', 'outdoor_dining', false, 15),
        ('firepit', 'Fire pit', '', 'Standout amenities (Features/Popular)', 'firepit', false, 16),
        ('parking', 'Free parking on premises', '', 'Standout amenities (Features/Popular)', 'parking', true, 17),

        -- Location
        ('beachfront', 'Beachfront', '', 'Location', 'beachfront', true, 18),
        ('waterfront', 'Waterfront', '', 'Location', 'waterfront', false, 19),
        ('ski_in', 'Ski-in/ski-out', '', 'Location', 'ski_in', false, 20),

        -- Safety
        ('smoke_alarm', 'Smoke alarm', '', 'Safety', 'smoke_alarm', false, 21),
        ('first_aid', 'First aid kit', '', 'Safety', 'first_aid', false, 22),
        ('fire_extinguisher', 'Fire extinguisher', '', 'Safety', 'fire_extinguisher', false, 23),
        ('carbon_monoxide', 'Carbon monoxide alarm', '', 'Safety', 'carbon_monoxide', false, 24)
        ON CONFLICT (key) DO NOTHING;
      `);
    }
    // 12. Master Highlights Table (HostStep2 Step 5 - Listing Highlights & Admin MasterData)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS master_highlights (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        label VARCHAR(100) NOT NULL,
        icon VARCHAR(50) DEFAULT 'star',
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Step 5 highlights settings (HostStep2 Step 5)
    const checkStep5Highlights = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step5_highlights'");
    if (parseInt(checkStep5Highlights.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label)
        VALUES (
          'step5_highlights',
          'Next, let''s describe your house',
          'Choose up to 2 highlights. We''ll use these to get your description started.',
          '2'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    const checkHighlightsCount = await pool.query('SELECT COUNT(*) FROM master_highlights');
    if (parseInt(checkHighlightsCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial HostStep2 master highlights...');
      await pool.query(`
        INSERT INTO master_highlights (key, label, icon, display_order)
        VALUES
        ('peaceful', 'Peaceful', 'spa', 1),
        ('unique', 'Unique', 'star', 2),
        ('family-friendly', 'Family-friendly', 'users', 3),
        ('stylish', 'Stylish', 'paint', 4),
        ('central', 'Central', 'map', 5),
        ('spacious', 'Spacious', 'expand', 6)
        ON CONFLICT (key) DO NOTHING;
      `);
    }

    // 13. Master Booking Options Table (HostStep3 Step 2 - Pick your booking settings & Admin MasterData)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS master_booking_options (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(150) NOT NULL,
        badge VARCHAR(50) DEFAULT '',
        description TEXT,
        icon VARCHAR(50) DEFAULT 'calendar',
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Step3 Step 2 Booking settings
    const checkStep3Step2Booking = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step3_step2_booking'");
    if (parseInt(checkStep3Step2Booking.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, learn_more_link)
        VALUES (
          'step3_step2_booking',
          'Pick your booking settings',
          'You can change this at any time.',
          '#'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    const checkBookingOptionsCount = await pool.query('SELECT COUNT(*) FROM master_booking_options');
    if (parseInt(checkBookingOptionsCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial HostStep3 Step 2 booking options...');
      await pool.query(`
        INSERT INTO master_booking_options (key, title, badge, description, icon, display_order)
        VALUES
        ('approve', 'Approve your first 5 bookings', 'Recommended', 'Start by reviewing reservation requests, then switch to Instant Book so guests can book automatically.', 'calendar', 1),
        ('instant', 'Use Instant Book', '', 'Let guests book automatically.', 'bolt', 2)
        ON CONFLICT (key) DO NOTHING;
      `);
    }

    // Seed Step3 Step 3 Pricing settings
    const checkStep3Step3Pricing = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step3_step3_pricing'");
    if (parseInt(checkStep3Step3Pricing.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label, toggle_subtitle, learn_more_link)
        VALUES (
          'step3_step3_pricing',
          'Now, set your prices',
          'These suggestions are based on guest demand for similar listings.',
          '2028',
          '6',
          '#'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    // Seed Step3 Step 3 Pricing Modals (Price Modal, Weekend Modal, Similar Listings Map Modal)
    const checkStep3ModalsPricing = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step3_modals_pricing'");
    if (parseInt(checkStep3ModalsPricing.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label, toggle_subtitle, learn_more_link)
        VALUES (
          'step3_modals_pricing',
          'Compare similar listings',
          'Most listings with reservations during these dates were an average of ₹962 - ₹3,864 per night.',
          'Entire home/flat · 1 bedroom',
          '1 Oct 2025 - 1 Oct 2026',
          '#'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    // 14. Master Discounts Table (HostStep3 Step 4 - Add discounts & Admin MasterData)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS master_discounts (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        title VARCHAR(150) NOT NULL,
        description TEXT,
        discount_percentage INT DEFAULT 0,
        is_customizable BOOLEAN DEFAULT true,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Step3 Step 4 Discounts settings
    const checkStep3Step4Discounts = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step3_step4_discounts'");
    if (parseInt(checkStep3Step4Discounts.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label, learn_more_link)
        VALUES (
          'step3_step4_discounts',
          'Add discounts',
          'Help your place stand out to get booked faster and earn your first reviews.',
          'Only one discount will be applied per stay.',
          '#'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    const checkDiscountsCount = await pool.query('SELECT COUNT(*) FROM master_discounts');
    if (parseInt(checkDiscountsCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial HostStep3 Step 4 master discounts...');
      await pool.query(`
        INSERT INTO master_discounts (key, title, description, discount_percentage, is_customizable, display_order)
        VALUES
        ('newListing', 'New listing promotion', 'Offer 20% off your first 3 bookings', 20, false, 1),
        ('lastMinute', 'Last-minute discount', 'For stays booked 14 days or less before arrival', 0, true, 2),
        ('weekly', 'Weekly discount', 'For stays of 7 nights or more', 0, true, 3),
        ('monthly', 'Monthly discount', 'For stays of 28 nights or more', 0, true, 4)
        ON CONFLICT (key) DO NOTHING;
      `);
    }

    // 15. Master Safety Items Table (HostStep3 Step 5 - Share safety details & Admin MasterData)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS master_safety_items (
        id SERIAL PRIMARY KEY,
        key VARCHAR(50) UNIQUE NOT NULL,
        label VARCHAR(200) NOT NULL,
        requires_details BOOLEAN DEFAULT false,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed Step3 Step 5 Safety settings
    const checkStep3Step5Safety = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step3_step5_safety'");
    if (parseInt(checkStep3Step5Safety.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label, toggle_subtitle, learn_more_link)
        VALUES (
          'step3_step5_safety',
          'Share safety details',
          'Does your place have any of these?',
          'Important things to know',
          'Security cameras that monitor indoor spaces are not allowed even if they''re turned off. All exterior security cameras must be disclosed.',
          '#'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    // Seed Step3 Step 5 Camera Modal settings
    const checkStep3CameraModal = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step3_camera_modal'");
    if (parseInt(checkStep3CameraModal.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label, learn_more_link)
        VALUES (
          'step3_camera_modal',
          'Tell guests about your exterior security cameras',
          'Describe the area that each camera monitors, such as the back garden or pool.',
          '300',
          '#'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    // Seed Step3 Step 6 Legal & Address Final Details Settings
    const checkStep3Step6 = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step3_step6_legal'");
    if (parseInt(checkStep3Step6.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label, toggle_subtitle, learn_more_link)
        VALUES (
          'step3_step6_legal',
          'Provide a few final details',
          'This is required to comply with financial regulations and helps us prevent fraud.',
          'What''s your residential address?',
          'Guests won''t see this information.',
          '#'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    // Seed Step3 Step 6 Business Modal Settings
    const checkStep3BusinessModal = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key = 'step3_business_modal'");
    if (parseInt(checkStep3BusinessModal.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label, toggle_subtitle, learn_more_link)
        VALUES (
          'step3_business_modal',
          'Hosting as a business',
          'Select "yes" if you''re registered as a business with your government and have a business registration number or tax ID.',
          'Are you hosting as a business?',
          'This means your business is most likely registered with your government.',
          '#'
        )
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    const checkSafetyCount = await pool.query('SELECT COUNT(*) FROM master_safety_items');
    if (parseInt(checkSafetyCount.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial HostStep3 Step 5 safety items...');
      await pool.query(`
        INSERT INTO master_safety_items (key, label, requires_details, display_order)
        VALUES
        ('camera', 'Exterior security camera present', true, 1),
        ('noise', 'Noise decibel monitor present', false, 2),
        ('weapons', 'Weapon(s) on the property', false, 3)
        ON CONFLICT (key) DO NOTHING;
      `);
    }

    // 17. Home Destinations Table (Dynamic Homepage Destinations Slider)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS home_destinations (
        id SERIAL PRIMARY KEY,
        country VARCHAR(100) NOT NULL,
        title VARCHAR(150) NOT NULL,
        image TEXT NOT NULL,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const checkDestinations = await pool.query('SELECT COUNT(*) FROM home_destinations');
    if (parseInt(checkDestinations.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding initial home destinations...');
      await pool.query(`
        INSERT INTO home_destinations (country, title, image, display_order)
        VALUES
        ('Maldives', 'Prime beach spot', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=720&q=80', 1),
        ('Switzerland', 'Mountain retreat', 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=720&q=80', 2),
        ('Japan', 'Cultural hub', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=720&q=80', 3),
        ('Italy', 'Historic getaway', 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=720&q=80', 4),
        ('Thailand', 'Tropical paradise', 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=720&q=80', 5),
        ('France', 'Romantic escape', 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=720&q=80', 6),
        ('Greece', 'Island adventure', 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=720&q=80', 7),
        ('Australia', 'Coastal charm', 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=720&q=80', 8),
        ('Bali', 'Lush greenery', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=720&q=80', 9),
        ('Dubai', 'Urban luxury', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=720&q=80', 10),
        ('Spain', 'Vibrant nightlife', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=720&q=80', 11),
        ('New Zealand', 'Nature''s best', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=720&q=80', 12);
      `);
    }

    // 18. Reviews Table (Guest & Host Reviews with Moderation)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        listing_id INT REFERENCES listings(id) ON DELETE CASCADE,
        reviewer_name VARCHAR(150) NOT NULL,
        reviewer_avatar TEXT,
        reviewer_location VARCHAR(150) DEFAULT 'India',
        rating NUMERIC(2, 1) DEFAULT 5.0,
        review_text TEXT NOT NULL,
        author_type VARCHAR(20) DEFAULT 'Guest', -- 'Guest' or 'Host'
        recipient_name VARCHAR(150),
        recipient_role VARCHAR(20) DEFAULT 'Host',
        status VARCHAR(20) DEFAULT 'Published', -- 'Published', 'Flagged', 'Removed'
        flag_reason TEXT DEFAULT '',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS author_type VARCHAR(20) DEFAULT 'Guest';
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS recipient_name VARCHAR(150);
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS recipient_role VARCHAR(20) DEFAULT 'Host';
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Published';
      ALTER TABLE reviews ADD COLUMN IF NOT EXISTS flag_reason TEXT DEFAULT '';
    `);

    // 19. Seed Experience Workflow Steps & Modals Configurations
    const checkExpSettings = await pool.query("SELECT COUNT(*) FROM step_settings WHERE step_key LIKE 'exp_%'");
    if (parseInt(checkExpSettings.rows[0].count, 10) === 0) {
      console.log('🌱 Seeding Experience Steps & Modals settings for dynamic admin control...');
      await pool.query(`
        INSERT INTO step_settings (step_key, title, subtitle, toggle_label, toggle_subtitle, learn_more_link)
        VALUES
        ('exp_type_modal', 'What would you like to host?', 'Choose between leading local activities or personalized on-demand services.', 'Select Hosting Type', 'Experience vs Service selection dialog', '/host'),
        ('exp_step2_category', 'Which of these best describes your experience?', 'Guests can search by theme and activity style.', 'Category selection', 'Choose from art, food, wellness, nature, history', '/host'),
        ('exp_step3_describe', 'How would you describe your experience?', 'Pick a sub-activity that best matches what you will lead.', 'Sub-category', 'Specific activity focus', '/host'),
        ('exp_step4_city', 'Where will you offer your experience?', 'Enter the primary city or region where you will meet guests.', 'City selector', 'Auto-location or manual search modal', '/host'),
        ('exp_step5_welcome', 'Let''s build your experience', 'In 7 simple milestones, you''ll set up your host profile, photos, itinerary and pricing.', 'Milestones Overview', '7 steps onboarding roadmap', '/host'),
        ('exp_step_about', 'About you', 'Share your background, phone verification, and qualifications to build trust with guests.', 'Step 1 of 7', 'Phone, bio, credentials, social profiles', '/host'),
        ('exp_step_location', 'Location & Meetup', 'Tell guests where you will meet them and provide clear arrival instructions.', 'Step 2 of 7', 'Meeting address & landmark directions', '/host'),
        ('exp_step_photos', 'Photos & Gallery', 'Add at least 5 high-quality photos that capture your experience in action.', 'Step 3 of 7', 'Minimum 5 photos required', '/host'),
        ('exp_step_itinerary', 'Itinerary & Timeline', 'Create step-by-step activities with duration, photos and descriptions.', 'Step 4 of 7', 'Activity title, duration, photo', '/host'),
        ('exp_step_pricing', 'Pricing & Group Size', 'Set maximum guest limits, individual guest price, and private group rates.', 'Step 5 of 7', 'Price per guest & private buyout price', '/host'),
        ('exp_step_details', 'Details & What to Bring', 'Provide an inviting title, description, guest requirements and what''s included.', 'Step 6 of 7', 'Title, description, inclusions, minimum age', '/host'),
        ('exp_step_publish', 'Publish your Experience', 'Review your listing details and agree to Airbnb hosting policies to go live.', 'Step 7 of 7', 'Final review & terms acceptance', '/host'),
        ('exp_modal_activity', 'Add an activity to your itinerary', 'Break down what guests will do, see or taste during this time.', 'Itinerary Modal', 'Duration slider, description, photo', '/host'),
        ('exp_modal_discount_limited', 'Limited-time discount', 'Applies to all bookings made in the first 90 days.', '20', 'First 90 days promotional rate', '/host'),
        ('exp_modal_discount_early', 'Early bird discount', 'Offer a discount for guests who book at least 30 days in advance.', '20', 'Advanced booking incentive', '/host'),
        ('exp_modal_discount_large', 'Large group discount', 'Reward groups of 4 or more with a percentage off.', '4', '15', '/host')
        ON CONFLICT (step_key) DO NOTHING;
      `);
    }

    // 20. Finance System: Settings, Host Payouts, and Refunds
    await pool.query(`
      CREATE TABLE IF NOT EXISTS finance_settings (
        id SERIAL PRIMARY KEY,
        commission_rate NUMERIC(5, 2) DEFAULT 20.00,
        guest_service_fee NUMERIC(5, 2) DEFAULT 3.00,
        gst_tax_rate NUMERIC(5, 2) DEFAULT 18.00,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS host_payouts (
        id SERIAL PRIMARY KEY,
        payout_code VARCHAR(50) UNIQUE,
        host_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        host_name VARCHAR(150),
        bank_account VARCHAR(100),
        amount NUMERIC(10, 2) NOT NULL,
        status VARCHAR(30) DEFAULT 'Pending', -- 'Pending', 'Processed', 'On Hold'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS refund_requests (
        id SERIAL PRIMARY KEY,
        refund_code VARCHAR(50) UNIQUE,
        booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
        guest_name VARCHAR(150),
        amount NUMERIC(10, 2) NOT NULL,
        reason TEXT,
        status VARCHAR(30) DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected', 'Processed'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 21. Security Center: Audit Logs, Login History, and 2FA Security Policies
    await pool.query(`
      CREATE TABLE IF NOT EXISTS security_audit_logs (
        id SERIAL PRIMARY KEY,
        admin_name VARCHAR(150) NOT NULL,
        admin_role VARCHAR(100) NOT NULL,
        action_type VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'SECURITY'
        module VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        ip_address VARCHAR(50) NOT NULL,
        device VARCHAR(150) NOT NULL,
        field_changed VARCHAR(150),
        old_value TEXT,
        new_value TEXT,
        status VARCHAR(50) DEFAULT 'Success',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS admin_login_history (
        id SERIAL PRIMARY KEY,
        admin_name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        ip_address VARCHAR(50) NOT NULL,
        location VARCHAR(150) NOT NULL,
        device VARCHAR(150) NOT NULL,
        two_factor_method VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'Success', -- 'Success', 'Blocked', 'Failed'
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS security_policies (
        id SERIAL PRIMARY KEY,
        enforce_for_all_staff BOOLEAN DEFAULT true,
        enforce_for_super_admin BOOLEAN DEFAULT true,
        allow_authenticator_app BOOLEAN DEFAULT true,
        allow_sms_otp BOOLEAN DEFAULT true,
        allow_security_key_fido BOOLEAN DEFAULT false,
        session_timeout_hours INTEGER DEFAULT 8,
        ip_whitelisting_enabled BOOLEAN DEFAULT false,
        max_failed_attempts INTEGER DEFAULT 5,
        notify_on_new_device BOOLEAN DEFAULT true,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default policy if empty
    const checkPolicies = await pool.query('SELECT COUNT(*) FROM security_policies');
    if (parseInt(checkPolicies.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO security_policies (
          enforce_for_all_staff, enforce_for_super_admin, allow_authenticator_app, 
          allow_sms_otp, allow_security_key_fido, session_timeout_hours, 
          ip_whitelisting_enabled, max_failed_attempts, notify_on_new_device
        ) VALUES (true, true, true, true, false, 8, false, 5, true);
      `);
    }

    // 14. Support Tickets & Live Chat Messages
    await pool.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id VARCHAR(50) PRIMARY KEY,
        subject TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'General Inquiry',
        user_type VARCHAR(50) DEFAULT 'Guest',
        user_name VARCHAR(150) NOT NULL,
        user_email VARCHAR(150),
        user_phone VARCHAR(50),
        priority VARCHAR(30) DEFAULT 'Medium',
        status VARCHAR(30) DEFAULT 'Open',
        assigned_to VARCHAR(150) DEFAULT 'Support Team',
        listing_name VARCHAR(255),
        booking_id VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS support_messages (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(50) REFERENCES support_tickets(id) ON DELETE CASCADE,
        sender VARCHAR(50) NOT NULL, -- 'Guest', 'Host', 'Support', 'Admin'
        text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default support tickets if empty
    const checkTickets = await pool.query('SELECT COUNT(*) FROM support_tickets');
    if (parseInt(checkTickets.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO support_tickets (id, subject, category, user_type, user_name, user_email, user_phone, priority, status, assigned_to, listing_name, booking_id)
        VALUES 
        ('TCK-9401', 'Host did not provide key / passcode at midnight check-in', 'Check-in & Access', 'Guest', 'Kunal Singhania', 'kunal.s@gmail.com', '+91 98201 12345', 'Critical', 'Open', 'Ananya Verma', 'Luxury Sea-Facing Villa, Goa', 'BK-8902'),
        ('TCK-9402', 'Request for full refund: AC broken in 42°C Jaipur weather', 'Refund & Billing', 'Guest', 'Meera Deshmukh', 'meera.d@outlook.com', '+91 98112 54321', 'High', 'In Progress', 'Rohan Kapoor', 'Royal Heritage Haveli, Jaipur', 'BK-8750'),
        ('TCK-9403', 'Guest brought 8 people for a 2-guest booking, damaged sofa', 'Property Damage & Host Safety', 'Host', 'Vikramaditya Rathore', 'rathore.stays@heritage.in', '+91 94140 98765', 'High', 'Open', 'Pooja Nair', 'Rathore Heritage Villa, Udaipur', 'BK-8611');

        INSERT INTO support_messages (ticket_id, sender, text)
        VALUES
        ('TCK-9401', 'Guest', 'I have arrived at the property but the host is not answering calls. The keypad lock shows error code 404. I am stranded outside with my family.'),
        ('TCK-9402', 'Guest', 'The AC unit in master bedroom leaked water all over our luggage and stopped cooling completely. Host is unresponsive.'),
        ('TCK-9403', 'Host', 'Check-out inspection revealed extensive burn marks on living room Italian leather sofa and 6 unregistered extra guests.');
      `);
    }

    // 15. User Notifications Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        user_email VARCHAR(150),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'account', -- 'booking', 'payment', 'security', 'account', 'promotion'
        is_read BOOLEAN DEFAULT false,
        link VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- 16. Intro to Hosting: Webinars & FAQs Table
      CREATE TABLE IF NOT EXISTS intro_webinars (
        id SERIAL PRIMARY KEY,
        country VARCHAR(150) NOT NULL,
        language VARCHAR(100) NOT NULL,
        button_text VARCHAR(100) DEFAULT 'View webinars',
        zoom_link VARCHAR(255) DEFAULT 'https://zoom.us',
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS intro_faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        is_active BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed intro webinars if empty
    const checkWebinars = await pool.query('SELECT COUNT(*) FROM intro_webinars');
    if (parseInt(checkWebinars.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO intro_webinars (country, language, button_text, zoom_link, display_order)
        VALUES
        ('Australia & New Zealand', 'English', 'View webinars', 'https://zoom.us', 1),
        ('Brasil', 'Português', 'Ver webinarios', 'https://zoom.us', 2),
        ('Canada', 'English and French', 'View webinars', 'https://zoom.us', 3),
        ('España', 'Español', 'Ver webinarios', 'https://zoom.us', 4),
        ('France', 'Français', 'Voir les webinaires', 'https://zoom.us', 5),
        ('Germany, Austria & Switzerland', 'Deutsch', 'Webinare ansehen', 'https://zoom.us', 6),
        ('Greece', 'Ελληνικά', 'Προβολή webinars', 'https://zoom.us', 7),
        ('Italia', 'Italiano', 'Visualizza i webinar', 'https://zoom.us', 8),
        ('Japan', '日本語', 'ウェビナーを見る', 'https://zoom.us', 9),
        ('Mexico', 'Español', 'Ver webinarios', 'https://zoom.us', 10),
        ('Nordics', 'English', 'View webinars', 'https://zoom.us', 11),
        ('United Kingdom & Ireland', 'English', 'View webinars', 'https://zoom.us', 12),
        ('United States', 'English', 'View webinars', 'https://zoom.us', 13),
        ('United States', 'Español', 'Ver webinarios', 'https://zoom.us', 14);
      `);
    }

    // Seed intro faqs if empty
    const checkFaqs = await pool.query('SELECT COUNT(*) FROM intro_faqs');
    if (parseInt(checkFaqs.rows[0].count, 10) === 0) {
      await pool.query(`
        INSERT INTO intro_faqs (question, answer, display_order)
        VALUES
        ('What is a Superhost Ambassador?', 'Superhost Ambassadors are experienced hosts who help new hosts get started. They can offer one-on-one guidance, tips, and support during your first hosting journey.', 1),
        ('How do I join a webinar?', 'Simply click the ''View webinars'' button for your region above. You''ll be directed to a Zoom link where you can register and attend the session.', 2),
        ('Is there any cost to attend?', 'No, all introductory webinars presented by Superhost Ambassadors are completely free of charge.', 3),
        ('What if I can''t find a webinar in my language?', 'We are constantly expanding our resources. In the meantime, you can access the Airbnb Resource Centre for articles and videos in multiple languages.', 4);
      `);
    }

    // 17. Host Calendar Dynamic Dates (Availability, Custom Price, Notes)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS host_calendar_dates (
        id SERIAL PRIMARY KEY,
        host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        listing_id INTEGER REFERENCES listings(id) ON DELETE CASCADE,
        calendar_date DATE NOT NULL,
        is_available BOOLEAN DEFAULT true,
        price NUMERIC(10, 2),
        note TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(host_id, listing_id, calendar_date)
      );
    `);

    console.log('✅ PostgreSQL Shared Database Schema is ready!');
  } catch (err) {
    console.error('❌ Error initializing database tables:', err.message);
  }
}
