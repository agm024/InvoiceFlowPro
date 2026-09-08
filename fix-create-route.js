const fs = require('fs');
let route = fs.readFileSync('app/api/subscriptions/create/route.ts', 'utf8');

route = route.replace(
  `// Create a Razorpay Customer first
    const rzpCustomer = await instance.customers.create({
      name: currentUser.name || currentUser.email.split('@')[0],
      email: currentUser.email,
    });
    
    // Create Razorpay Subscription
    const subscription = await instance.subscriptions.create({
      customer_id: rzpCustomer.id,`,
  `// Create a Razorpay Customer first
    const rzpCustomer: any = await instance.customers.create({
      name: currentUser.name || (currentUser.email || 'guest@example.com').split('@')[0],
      email: currentUser.email || 'guest@example.com',
      contact: '9999999999'
    });
    
    // Create Razorpay Subscription
    const subscription = await instance.subscriptions.create({`
);

fs.writeFileSync('app/api/subscriptions/create/route.ts', route, 'utf8');
