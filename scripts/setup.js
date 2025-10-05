#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Next.js SaaS Starter...\n');

// 1. Generate JWT secret
function generateJWTSecret() {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('base64');
}

// 2. Create .env file with sensible defaults
function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists, skipping...');
    return;
  }

  const jwtSecret = generateJWTSecret();
  const envContent = `# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database (Local PostgreSQL - update with your Supabase URL for production)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nextjs_saas_starter

# Auth
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d

# Stripe (Add your keys from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_PRICE_STARTER=price_your_starter_price_id
STRIPE_PRICE_PRO=price_your_pro_price_id

# ISR / Revalidation
REVALIDATE_SECRET=${generateJWTSecret()}

# Supabase (Optional - for auth/storage)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with default values');
}

// 3. Setup database
function setupDatabase() {
  try {
    console.log('📊 Setting up database...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    console.log('✅ Database setup complete');
  } catch (error) {
    console.log('⚠️  Database setup failed. Make sure PostgreSQL is running or update DATABASE_URL in .env');
    console.log('   For local development, you can use:');
    console.log('   - Docker: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres');
    console.log('   - Or use Supabase: https://supabase.com/dashboard');
  }
}

// 4. Install dependencies
function installDependencies() {
  try {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.log('❌ Failed to install dependencies');
    process.exit(1);
  }
}

// 5. Run tests
function runTests() {
  try {
    console.log('🧪 Running tests...');
    execSync('npm run test', { stdio: 'inherit' });
    console.log('✅ Tests passed');
  } catch (error) {
    console.log('⚠️  Some tests failed, but setup continues...');
  }
}

// Main setup function
async function setup() {
  try {
    console.log('🎯 Starting setup process...\n');
    
    installDependencies();
    createEnvFile();
    setupDatabase();
    runTests();
    
    console.log('\n🎉 Setup complete! Next steps:');
    console.log('1. Update .env with your actual values:');
    console.log('   - DATABASE_URL (Supabase or local PostgreSQL)');
    console.log('   - Stripe keys from https://dashboard.stripe.com/apikeys');
    console.log('   - Supabase keys (optional)');
    console.log('\n2. Start development server:');
    console.log('   npm run dev');
    console.log('\n3. Open http://localhost:3000');
    console.log('\n📚 For detailed setup instructions, see README.md');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
