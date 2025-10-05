#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Deploying Next.js SaaS Starter...\n');

// 1. Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

// 2. Install Vercel CLI if not present
function installVercelCLI() {
  if (!checkVercelCLI()) {
    console.log('📦 Installing Vercel CLI...');
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
      console.log('✅ Vercel CLI installed');
    } catch (error) {
      console.log('❌ Failed to install Vercel CLI. Please install manually:');
      console.log('   npm install -g vercel');
      process.exit(1);
    }
  }
}

// 3. Create Vercel configuration
function createVercelConfig() {
  const vercelConfig = {
    "buildCommand": "npm run build",
    "outputDirectory": ".next",
    "framework": "nextjs",
    "installCommand": "npm install",
    "devCommand": "npm run dev"
  };

  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  console.log('✅ Created vercel.json configuration');
}

// 4. Deploy to Vercel
function deployToVercel() {
  try {
    console.log('🚀 Deploying to Vercel...');
    execSync('vercel --prod', { stdio: 'inherit' });
    console.log('✅ Deployment successful!');
  } catch (error) {
    console.log('❌ Deployment failed. Please check your Vercel configuration.');
    console.log('   Make sure you have:');
    console.log('   1. Vercel account: https://vercel.com');
    console.log('   2. Environment variables set in Vercel dashboard');
    console.log('   3. Database configured (Supabase recommended)');
  }
}

// 5. Show deployment checklist
function showChecklist() {
  console.log('\n📋 Pre-deployment checklist:');
  console.log('□ Set up Supabase database');
  console.log('□ Configure Stripe keys');
  console.log('□ Set environment variables in Vercel dashboard:');
  console.log('  - DATABASE_URL');
  console.log('  - JWT_SECRET');
  console.log('  - STRIPE_SECRET_KEY');
  console.log('  - STRIPE_WEBHOOK_SECRET');
  console.log('  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
  console.log('  - STRIPE_PRICE_STARTER');
  console.log('  - STRIPE_PRICE_PRO');
  console.log('  - NEXT_PUBLIC_APP_URL');
  console.log('\n🔗 Useful links:');
  console.log('- Supabase: https://supabase.com/dashboard');
  console.log('- Stripe: https://dashboard.stripe.com/apikeys');
  console.log('- Vercel: https://vercel.com/dashboard');
}

// Main deploy function
async function deploy() {
  try {
    showChecklist();
    
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('\nHave you completed the checklist? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        installVercelCLI();
        createVercelConfig();
        deployToVercel();
      } else {
        console.log('Please complete the checklist first, then run: npm run deploy');
      }
      rl.close();
    });
    
  } catch (error) {
    console.error('❌ Deploy failed:', error.message);
    process.exit(1);
  }
}

deploy();
