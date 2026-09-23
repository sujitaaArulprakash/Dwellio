const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Property = require('./models/Property');
const RentalRequest = require('./models/RentalRequest');
const RentPayment = require('./models/RentPayment');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const Review = require('./models/Review');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dwellio';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Property.deleteMany({});
    await RentalRequest.deleteMany({});
    await RentPayment.deleteMany({});
    await MaintenanceRequest.deleteMany({});
    await Review.deleteMany({});

    console.log('Cleared existing data.');

    // 1. Create Users
    const admin = await User.create({
      name: 'Eleanor Sterling',
      email: 'admin@dwellio.com',
      phone: '+1 (555) 019-2831',
      password: 'admin123',
      role: 'admin',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    });

    const owner1 = await User.create({
      name: 'Marcus Vance',
      email: 'owner1@dwellio.com',
      phone: '+1 (555) 234-8901',
      password: 'owner123',
      role: 'owner',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    });

    const owner2 = await User.create({
      name: 'Elena Rostova',
      email: 'owner2@dwellio.com',
      phone: '+1 (555) 456-7812',
      password: 'owner123',
      role: 'owner',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    });

    const tenant1 = await User.create({
      name: 'Alex Rivera',
      email: 'tenant1@dwellio.com',
      phone: '+1 (555) 789-0123',
      password: 'tenant123',
      role: 'tenant',
      profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    });

    const tenant2 = await User.create({
      name: 'Sophia Chen',
      email: 'tenant2@dwellio.com',
      phone: '+1 (555) 321-6549',
      password: 'tenant123',
      role: 'tenant',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      status: 'active',
    });

    console.log('Users created: Admin, 2 Owners, 2 Tenants');

    // 2. Create Properties
    const propertiesData = [
      {
        ownerId: owner1._id,
        title: 'The Grand View Residences - Luxury Penthouse',
        description:
          'Stunning high-floor residence with panoramic skyline views, bespoke Italian marble finishes, chef-grade kitchen with Sub-Zero appliances, private terrace, and 24/7 concierge service.',
        propertyType: 'Apartment',
        address: '742 Montgomery St, Apt 28B',
        city: 'San Francisco',
        state: 'CA',
        rent: 4200,
        securityDeposit: 5000,
        bedrooms: 3,
        bathrooms: 2,
        area: 1850,
        amenities: ['Wi-Fi', 'Parking', 'Security', 'Water Supply', 'Electricity Backup', 'Air Conditioning', 'Furnished', 'CCTV', 'Balcony', 'Gym'],
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
        ],
        status: 'rented',
        currentTenantId: tenant1._id,
      },
      {
        ownerId: owner1._id,
        title: 'Modern Sunset Loft in South Congress',
        description:
          'Open-concept industrial loft boasting exposed brick, vaulted ceilings, polished concrete floors, and abundant natural light. Steps from artisanal coffee shops, live music venues, and walking trails.',
        propertyType: 'Studio',
        address: '1104 S Congress Ave, Unit 4',
        city: 'Austin',
        state: 'TX',
        rent: 1950,
        securityDeposit: 2000,
        bedrooms: 1,
        bathrooms: 1,
        area: 820,
        amenities: ['Wi-Fi', 'Parking', 'Air Conditioning', 'Furnished', 'Balcony', 'Water Supply'],
        images: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80',
        ],
        status: 'approved',
        currentTenantId: null,
      },
      {
        ownerId: owner1._id,
        title: 'Waterfront Modern Villa with Private Garden',
        description:
          'Breathtaking coastal sanctuary featuring floor-to-ceiling glass, an infinity pool, private manicured courtyard, smart home automation, and heated driveway. Perfect for peaceful executive living.',
        propertyType: 'Villa',
        address: '450 Magnolia Bay Dr',
        city: 'Miami',
        state: 'FL',
        rent: 6500,
        securityDeposit: 8000,
        bedrooms: 4,
        bathrooms: 3,
        area: 3400,
        amenities: ['Wi-Fi', 'Parking', 'Security', 'Water Supply', 'Electricity Backup', 'Air Conditioning', 'Furnished', 'CCTV', 'Balcony', 'Gym'],
        images: [
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80',
        ],
        status: 'approved',
        currentTenantId: null,
      },
      {
        ownerId: owner2._id,
        title: 'Emerald City Urban Townhouse',
        description:
          'Contemporary 3-story townhouse with rooftop deck overlooking Mt. Rainier. Built green with radiant floor heating, solar assist, ultra-fast fiber internet, and tandem two-car garage.',
        propertyType: 'Townhouse',
        address: '2215 E Pine St',
        city: 'Seattle',
        state: 'WA',
        rent: 3100,
        securityDeposit: 3500,
        bedrooms: 3,
        bathrooms: 2,
        area: 1650,
        amenities: ['Wi-Fi', 'Parking', 'Security', 'Water Supply', 'Air Conditioning', 'Balcony'],
        images: [
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&auto=format&fit=crop&q=80',
        ],
        status: 'approved',
        currentTenantId: null,
      },
      {
        ownerId: owner2._id,
        title: 'Chic Lincoln Park Flat with Fireplace',
        description:
          'Charming vintage details paired with high-end modern renovations. Hardwood floors, granite countertops, decorative brick fireplace, in-unit laundry, and private enclosed back porch.',
        propertyType: 'Apartment',
        address: '834 W Armitage Ave, Apt 2F',
        city: 'Chicago',
        state: 'IL',
        rent: 2400,
        securityDeposit: 2500,
        bedrooms: 2,
        bathrooms: 1,
        area: 1100,
        amenities: ['Wi-Fi', 'Water Supply', 'Electricity Backup', 'Air Conditioning', 'Balcony'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1502005229762-ae1b464006c9?w=1200&auto=format&fit=crop&q=80',
        ],
        status: 'rented',
        currentTenantId: tenant2._id,
      },
      {
        ownerId: owner2._id,
        title: 'Mile-High Designer Condo with Mountain Views',
        description:
          'Sleek downtown high-rise unit. Highlights include floor-to-ceiling windows, private balcony facing the Rocky Mountains, stainless appliances, rooftop swimming pool, and underground garage space.',
        propertyType: 'Condo',
        address: '1700 Wynkoop St, #1408',
        city: 'Denver',
        state: 'CO',
        rent: 2750,
        securityDeposit: 3000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1250,
        amenities: ['Wi-Fi', 'Parking', 'Security', 'Air Conditioning', 'Gym', 'Balcony', 'CCTV'],
        images: [
          'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&auto=format&fit=crop&q=80',
        ],
        status: 'approved',
        currentTenantId: null,
      },
      {
        ownerId: owner1._id,
        title: 'TriBeCa Cobblestone Classic Loft',
        description:
          'Original cast-iron architecture loft with soaring 14-ft timber ceilings, massive Corinthian columns, and keyed elevator entrance directly into the living gallery.',
        propertyType: 'Apartment',
        address: '68 Franklin St, 3rd Fl',
        city: 'New York',
        state: 'NY',
        rent: 5800,
        securityDeposit: 6000,
        bedrooms: 2,
        bathrooms: 2,
        area: 1900,
        amenities: ['Wi-Fi', 'Security', 'Air Conditioning', 'Furnished', 'CCTV'],
        images: [
          'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1200&auto=format&fit=crop&q=80',
        ],
        status: 'pending', // Pending approval for admin moderation testing
        currentTenantId: null,
      },
      {
        ownerId: owner2._id,
        title: 'Sun-Drenched Craftsman Cottage',
        description:
          'Peaceful single-family home with wraparound porch, mature fruit trees in backyard, cedar hot tub, custom built-ins, and solar energy generation.',
        propertyType: 'House',
        address: '3812 Cedar Ridge Rd',
        city: 'Austin',
        state: 'TX',
        rent: 3300,
        securityDeposit: 3500,
        bedrooms: 3,
        bathrooms: 2,
        area: 1780,
        amenities: ['Wi-Fi', 'Parking', 'Water Supply', 'Air Conditioning', 'Balcony'],
        images: [
          'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&auto=format&fit=crop&q=80',
        ],
        status: 'approved',
        currentTenantId: null,
      },
    ];

    const createdProperties = await Property.insertMany(propertiesData);
    console.log(`${createdProperties.length} Properties created.`);

    const grandViewProp = createdProperties[0];
    const sunsetLoftProp = createdProperties[1];
    const waterfrontVillaProp = createdProperties[2];
    const lincolnParkProp = createdProperties[4];

    // 3. Create Rental Requests
    await RentalRequest.create({
      propertyId: grandViewProp._id,
      tenantId: tenant1._id,
      ownerId: owner1._id,
      message: 'Hello Marcus, we love the SF skyline view and would love to sign a 12-month lease!',
      status: 'approved',
      requestedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    });

    await RentalRequest.create({
      propertyId: lincolnParkProp._id,
      tenantId: tenant2._id,
      ownerId: owner2._id,
      message: 'Hi Elena! Relocating to Chicago for work. Excellent credit and references ready.',
      status: 'approved',
      requestedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    });

    await RentalRequest.create({
      propertyId: sunsetLoftProp._id,
      tenantId: tenant1._id,
      ownerId: owner1._id,
      message: 'Hi Marcus, inquiring if this Austin studio will be available for a move-in next month?',
      status: 'pending',
      requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    await RentalRequest.create({
      propertyId: waterfrontVillaProp._id,
      tenantId: tenant2._id,
      ownerId: owner1._id,
      message: 'Interested in the Miami waterfront home for our family relocation.',
      status: 'pending',
      requestedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });

    console.log('Rental Requests created.');

    // 4. Create Payments
    // Historical paid payment 1 (SF Penthouse)
    await RentPayment.create({
      propertyId: grandViewProp._id,
      tenantId: tenant1._id,
      ownerId: owner1._id,
      amount: 4200,
      dueDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
      paymentDate: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000),
      paymentMethod: 'Simulated Credit Card',
      transactionId: 'TXN-DEMO-94B2C8-918231',
      status: 'paid',
    });

    // Current month paid payment (SF Penthouse)
    await RentPayment.create({
      propertyId: grandViewProp._id,
      tenantId: tenant1._id,
      ownerId: owner1._id,
      amount: 4200,
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      paymentDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      paymentMethod: 'UPI / Bank Transfer',
      transactionId: 'TXN-DEMO-1A7F04-459201',
      status: 'paid',
    });

    // Upcoming pending payment (SF Penthouse)
    const nextMonthDue = new Date();
    nextMonthDue.setDate(nextMonthDue.getDate() + 25);
    await RentPayment.create({
      propertyId: grandViewProp._id,
      tenantId: tenant1._id,
      ownerId: owner1._id,
      amount: 4200,
      dueDate: nextMonthDue,
      paymentMethod: 'Credit Card',
      transactionId: '',
      status: 'pending',
    });

    // Chicago flat payments
    await RentPayment.create({
      propertyId: lincolnParkProp._id,
      tenantId: tenant2._id,
      ownerId: owner2._id,
      amount: 2400,
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      paymentDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      paymentMethod: 'Net Banking',
      transactionId: 'TXN-DEMO-E8219B-310948',
      status: 'paid',
    });

    const chicagoNextDue = new Date();
    chicagoNextDue.setDate(chicagoNextDue.getDate() + 20);
    await RentPayment.create({
      propertyId: lincolnParkProp._id,
      tenantId: tenant2._id,
      ownerId: owner2._id,
      amount: 2400,
      dueDate: chicagoNextDue,
      paymentMethod: 'Credit Card',
      transactionId: '',
      status: 'pending',
    });

    console.log('Rent Payments created.');

    // 5. Create Maintenance Requests
    await MaintenanceRequest.create({
      propertyId: grandViewProp._id,
      tenantId: tenant1._id,
      ownerId: owner1._id,
      title: 'Kitchen Sink Aerator Loose',
      description: 'The kitchen faucet aerator vibrates when cold water is turned on full pressure.',
      category: 'Plumbing',
      priority: 'Medium',
      image: '',
      status: 'Resolved',
      resolutionNotes: 'Technician tightened connector and replaced rubber gasket on Sep 12th.',
      resolvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    });

    await MaintenanceRequest.create({
      propertyId: grandViewProp._id,
      tenantId: tenant1._id,
      ownerId: owner1._id,
      title: 'HVAC Air Filter Replacement',
      description: 'Seasonal air filter change requested for the central air conditioning unit.',
      category: 'Appliance',
      priority: 'Low',
      image: '',
      status: 'In Progress',
      resolutionNotes: 'Filters scheduled for delivery and install this Thursday.',
    });

    await MaintenanceRequest.create({
      propertyId: lincolnParkProp._id,
      tenantId: tenant2._id,
      ownerId: owner2._id,
      title: 'Balcony Door Latch Adjustment',
      description: 'The sliding glass door latch requires extra force to lock properly.',
      category: 'Other',
      priority: 'High',
      image: '',
      status: 'Pending',
      resolutionNotes: '',
    });

    console.log('Maintenance Requests created.');

    // 6. Create Reviews
    await Review.create({
      propertyId: grandViewProp._id,
      tenantId: tenant1._id,
      rating: 5,
      comment:
        'Living at The Grand View has exceeded our expectations. The management is ultra-responsive, the views are stunning, and the building amenities are top-notch!',
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    });

    await Review.create({
      propertyId: lincolnParkProp._id,
      tenantId: tenant2._id,
      rating: 5,
      comment:
        'Elena is an incredible landlord. The apartment was spotless upon move-in, and the neighborhood charm is unbeatable. Highly recommended!',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    });

    console.log('Reviews created.');
    console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
